# Nexora

Nexora is a real-time one-to-one chat application built on the MERN stack. It combines a JWT-authenticated Express/MongoDB backend with a Socket.IO messaging layer and a React (Vite) frontend, so messages are delivered instantly between connected users while conversation history is persisted for later retrieval.

## Features

- **User authentication** — signup and login with hashed passwords (bcrypt) and JWT sessions stored in an httpOnly cookie
- **Real-time messaging** — instant message delivery via Socket.IO, with send/receive acknowledgements and error handling
- **Online presence** — live tracking of which users are currently online
- **Conversations** — conversations are created automatically between two participants and store their full message history
- **Contacts** — browse existing contacts and search users by name or email to start a new chat
- **Protected routes** — API endpoints guarded by JWT-based middleware
- **Modern UI** — React 19 + Vite frontend styled with Tailwind CSS and Radix/shadcn-based components

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit (state management)
- React Router
- Tailwind CSS, Radix UI / shadcn components
- Socket.IO client, Axios

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- Socket.IO
- JSON Web Tokens (JWT) + bcrypt for authentication

## Project Structure

```
Nexora/
├── backend/
│   ├── config/          # Database connection setup
│   ├── controllers/     # Route handlers (auth, chat, messages, users)
│   ├── middleware/       # Auth middleware (protectRoute)
│   ├── models/          # Mongoose schemas (User, Conversation, Message, Contact)
│   ├── routes/           # Express route definitions
│   ├── utils/            # Helpers (JWT token generation)
│   ├── server.js         # App entry point + Socket.IO server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # UI components (chat window, sidebar, message input, etc.)
    │   ├── pages/         # Landing, login, signup, and chat pages
    │   ├── store/         # Redux store
    │   ├── socket/        # Socket.IO client setup
    │   ├── lib/ & context/
    │   └── assets/
    ├── vite.config.js
    └── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/MuhammadZain111/Nexora.git
cd Nexora
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Set up the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Method | Endpoint                              | Description                          |
|--------|----------------------------------------|---------------------------------------|
| POST   | `/api/auth/signup`                     | Register a new user                   |
| POST   | `/api/auth/login`                      | Log in and receive a session cookie   |
| POST   | `/api/auth/logout`                     | Log out the current user              |
| GET    | `/api/auth/check`                      | Verify the current auth session       |
| GET    | `/api/users/contacts`                  | Get the logged-in user's contacts     |
| POST   | `/api/users/search-contact`            | Search users by name or email         |
| GET    | `/api/chat/conversations`              | Get all conversations for the user    |
| GET    | `/api/chat/conversations/:id`          | Get a specific conversation           |
| POST   | `/api/chat/conversations`              | Create a new conversation             |
| DELETE | `/api/chat/conversations/:id`          | Delete a conversation                 |
| GET    | `/api/messages/:id`                    | Get messages for a conversation       |

Real-time events (Socket.IO):

| Event            | Direction        | Description                          |
|-------------------|------------------|----------------------------------------|
| `send_message`    | client → server  | Send a new message                     |
| `receive_message` | server → client  | Deliver an incoming message             |
| `message_ack`     | server → client  | Acknowledge a sent message              |
| `message_error`   | server → client  | Report a failed message                 |
| `online_users`    | server → client  | Broadcast currently online user IDs     |

## Contributing

Contributions are welcome. Please open an issue to discuss any significant changes before submitting a pull request.

## License

This project is currently unlicensed. Add a `LICENSE` file to specify usage terms.