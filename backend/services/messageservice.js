import { prisma } from "../lib/prisma";

const MAX_MESSAGE_LENGTH = 4000;

export class MessageServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "MessageServiceError";
    this.status = status;
  }
}

function toMessageDTO(m) {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    senderName: m.sender.name,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    editedAt: m.editedAt ? m.editedAt.toISOString() : null,
  };
}

/** Verifies the user belongs to a conversation; throws if not. */
export async function assertParticipant(conversationId, userId) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) {
    throw new MessageServiceError("Not a participant of this conversation", 403);
  }
  return participant;
}

/** Finds an existing 1:1 conversation between two users, or creates one. */
export async function getOrCreateDirectConversation(userIdA, userIdB) {
  if (userIdA === userIdB) {
    throw new MessageServiceError("Cannot start a conversation with yourself");
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: userIdA } } },
        { participants: { some: { userId: userIdB } } },
      ],
    },
    include: { participants: true },
  });
  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      isGroup: false,
      participants: {
        create: [{ userId: userIdA }, { userId: userIdB }],
      },
    },
    include: { participants: true },
  });
}

/** Creates a group conversation with the given member ids. */
export async function createGroupConversation(name, memberIds, creatorId) {
  const uniqueMembers = Array.from(new Set([...memberIds, creatorId]));
  if (uniqueMembers.length < 2) {
    throw new MessageServiceError("A group needs at least two participants");
  }
  return prisma.conversation.create({
    data: {
      isGroup: true,
      name,
      participants: { create: uniqueMembers.map((userId) => ({ userId })) },
    },
    include: { participants: true },
  });
}

/**
 * Persists a new message. Caller (socket handler or API route) is
 * responsible for broadcasting it to connected clients.
 */
export async function sendMessage(conversationId, senderId, content) {
  const trimmed = (content || "").trim();
  if (!trimmed) {
    throw new MessageServiceError("Message content cannot be empty");
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    throw new MessageServiceError(`Message exceeds ${MAX_MESSAGE_LENGTH} characters`);
  }

  await assertParticipant(conversationId, senderId);

  const message = await prisma.message.create({
    data: { conversationId, senderId, content: trimmed },
    include: { sender: { select: { name: true } } },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return toMessageDTO(message);
}

/** Paginated message history, newest-first cursor pagination. */
export async function getMessages(conversationId, userId, opts = {}) {
  await assertParticipant(conversationId, userId);
  const limit = Math.min(opts.limit ?? 50, 100);

  const rows = await prisma.message.findMany({
    where: { conversationId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    include: { sender: { select: { name: true } } },
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  return {
    messages: page.map(toMessageDTO).reverse(), // chronological order for the UI
    nextCursor: hasMore ? page[page.length - 1].id : null,
  };
}

/** Lists a user's conversations with last message + unread count, most recently active first. */
export async function listConversationsForUser(userId) {
  const participations = await prisma.conversationParticipant.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          messages: {
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { sender: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { conversation: { updatedAt: "desc" } },
  });

  return Promise.all(
    participations.map(async (p) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: p.conversationId,
          deletedAt: null,
          senderId: { not: userId },
          createdAt: { gt: p.lastReadAt ?? new Date(0) },
        },
      });
      const last = p.conversation.messages[0];
      return {
        id: p.conversation.id,
        isGroup: p.conversation.isGroup,
        name: p.conversation.name,
        lastMessage: last ? toMessageDTO(last) : null,
        unreadCount,
        updatedAt: p.conversation.updatedAt.toISOString(),
      };
    })
  );
}

/** Marks a conversation as read up to now for this user. */
export async function markConversationRead(conversationId, userId) {
  await assertParticipant(conversationId, userId);
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });
}