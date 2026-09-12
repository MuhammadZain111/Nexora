"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/axios";
import { socket } from "../lib/socket";
import { SelectedChat } from "../store/chatSlice";
import ProfileInfo from "./ProfileInfo";
import { ScrollArea } from "./ui/scroll-area";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";


const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
];


function getColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function SidebarChats() {
  
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();

  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await axiosInstance.get("/api/users/contacts");
        setContacts(response.data.users || []);
        console.log("Loaded contacts:", response.data.users);
      } catch (error) {
        console.error("Unable to load contacts:", error);
      }
    };

    loadContacts();
  }, []);

  useEffect(() => {
    const handleIncomingMessage = (message) => {
      const sender = message.sender;
      if (!sender) return;

      setContacts((currentContacts) => {
        const senderId = String(sender._id || sender.id);
        const withoutSender = currentContacts.filter(
          (contact) => String(contact._id || contact.id) !== senderId,
        );

        return [sender, ...withoutSender];
      });
    };

    socket.on("receive_message", handleIncomingMessage);
    return () => socket.off("receive_message", handleIncomingMessage);
  }, []);

  const resetModal = () => {
    setSearchedContacts([]);
    setSearchError("");
    setQuery("");
  };

  const searchContact = async () => {
    const searchTerm = query.trim();

    if (searchTerm.length < 2) {
      setSearchedContacts([]);
      setSearchError(searchTerm ? "Enter at least 2 characters" : "");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const response = await axiosInstance.post(
        "/api/users/search-contact",
        null,
        { params: { query: searchTerm } },
      );

      setSearchedContacts(response.data.data || []);
      setSearchError("");
    } catch (error) {
      console.error("Contact search failed:", error);
      setSearchError(
        error.response?.data?.message ||
          "Unable to search contacts. Check that the server is running.",
      );
      setSearchedContacts([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectContact = (contact) => {
    dispatch(SelectedChat(contact));

    // Close the search popup
    setOpenNewContactModal(false);

    // Clear search data
    setSearchedContacts([]);
    setQuery("");
    setSearchError("");
  };

  return (
    
      <aside className="w-full min-w-0 min-h-0 overflow-y-auto border-r border-gray-200 flex flex-col justify-between bg-[#0B0F1A]">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-6 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xl">
              C
            </div>
            <h3 className="text-xl font-bold   text-white  ">ChatSync</h3>
          </div>

          {/* Direct Messages */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="uppercase text-sm tracking-widest text-gray-500 font-semibold">
                Direct Messages
              </h2>
              <button
                className="text-2xl font-bold cursor-pointer text-white "
                onClick={() => setOpenNewContactModal(true)}
              >
                +
              </button>
            </div>

            {/* ── Modal ── */}
            <Dialog
              open={openNewContactModal}
              onOpenChange={(open) => {
                setOpenNewContactModal(open);
                if (!open) resetModal();
              }}
            >
              <DialogContent
                className="p-0 gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl w-[calc(100vw-2rem)] max-w-[700px] h-[min(700px,calc(100dvh-2rem))] max-h-[calc(100dvh-2rem)] flex flex-col"
                onOpenAutoFocus={(e) => {
                  e.preventDefault(); // prevent Radix stealing focus
                  searchInputRef.current?.focus(); // give it to input instead
                }}
              >
                {/* Required for a11y — visually hidden */}
                <DialogTitle className="sr-only">New message</DialogTitle>
                <DialogDescription className="sr-only">
                  Search for a contact by name or email to start a conversation.
                </DialogDescription>

                {/* Header */}
                <div className="px-5 pt-5 pb-3">
                  <p className="text-base font-semibold text-gray-900">
                    New message
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Search by name or email
                  </p>
                </div>

                {/* Search Input — SIBLING of header, not nested inside it */}

                <div className="px-4 pb-3">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={query}
                      className="bg-transparent outline-none text-sm text-black w-full placeholder-gray-400"
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchContact();
                        }
                      }}
                    />
                    {/* Clear button */}
                    {query && (
                      <button
                        type="button"
                        className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                        onClick={() => {
                          setQuery("");
                          setSearchedContacts([]);
                          setSearchError("");
                          searchInputRef.current?.focus();
                        }}
                        aria-label="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {/* Search button */}
                    <button
                      type="button"
                      onClick={() => searchContact()}
                      className="rounded-lg bg-gray-900 p-2 text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-gray-100 mx-4" />

                {/* Section label */}
                <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 px-5 pt-3 pb-1">
                  {query ? `Results` : "Suggested"}
                </p>

                {/* Results — ScrollArea is a SIBLING of header, at the same level */}
                <ScrollArea
                  className="min-h-0 flex-1 px-3 pb-3"
                >
                  {/* Loading */}
                  {searchLoading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                      <LoaderCircle className="h-5 w-5 animate-spin text-gray-700" />
                      <span className="text-sm">Finding people...</span>
                    </div>
                  )}

                  {/* Error */}
                  {!searchLoading && searchError && (
                    <div className="mx-1 my-2 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-red-600">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="text-sm leading-5">{searchError}</p>
                    </div>
                  )}

                  {/* Empty state */}
                  {!searchLoading &&
                    !searchError &&
                    query &&
                    searchedContacts.length === 0 && (
                      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                          <UsersRound className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          No one matched that search
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Try a different name or email address.
                        </p>
                      </div>
                    )}

                  {/* Prompt to type */}
                  {!searchLoading &&
                    !query &&
                    searchedContacts.length === 0 && (
                      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Find someone to message
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Search by their name or email address.
                        </p>
                      </div>
                    )}

                  {/* Contact cards */}
                  <div className="flex flex-col gap-0.5">
                    {searchedContacts.map((contact) => (
                      <button
                        key={contact._id || contact.id}
                        type="button"
                        onClick={() => handleSelectContact(contact)}
                        className="group w-full rounded-xl text-left outline-none transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-200"
                      >
                        <div className="flex items-center gap-3 px-3 py-3">
                          <div className="relative shrink-0">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold shadow-sm ${getColor(contact.name)}`}
                            >
                              {contact.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-400 text-white">
                              <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="truncate text-sm font-semibold text-gray-900">
                              {contact.name}
                            </span>
                            <span className="truncate text-xs text-gray-400">
                              {contact.email}
                            </span>
                          </div>
                          <span className="translate-x-1 text-xs font-medium text-gray-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                            Message
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {searchedContacts.length > 0
                      ? `${searchedContacts.length} result${searchedContacts.length !== 1 ? "s" : ""}`
                      : "No results yet"}
                  </span>
                  <button className="text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                    New contact
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {contacts.map((contact) => (
                <button
                  key={contact._id || contact.id}
                  type="button"
                  onClick={() => handleSelectContact(contact)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 hover:text-black cursor-pointer transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold hover:text-black   ">
                    {contact.name?.charAt(0).toUpperCase() || "?"}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold truncate text-white hover:text-black  ">{contact.name}</p>
                    <p className="text-sm text-white truncate">{contact.email}</p>
                  </div>
                </button>
              ))}
              {contacts.length === 0 && (
                <p className="text-sm text-gray-500">No contacts found</p>
              )}
            </div>
          </div>

          {/* Channels */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="uppercase text-sm tracking-widest text-gray-500 font-semibold">
                Channels
              </h2>
              <button className="text-2xl font-bold">+</button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-black text-white flex items-center gap-3 cursor-pointer">
                <span className="text-xl">#</span>
                <p className="font-medium">General Chat</p>
              </div>

              <div className="p-4 rounded-2xl hover:bg-gray-100 flex items-center gap-3 cursor-pointer transition-all">
                <span className="text-xl">#</span>
                <p className="font-medium">Development</p>
              </div>     
            </div>

          </div>
        </div>
   {/* Profile */}
          <ProfileInfo />
    
      </aside>
   
  );
}

export default SidebarChats;
