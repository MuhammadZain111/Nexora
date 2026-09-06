"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/axios";
import { socket } from "../lib/socket";
import { setSelectedChat } from "../store/chatSlice";
import ProfileInfo from "./ProfileInfo";
import { ScrollArea } from "./ui/scroll-area";


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
    dispatch(setSelectedChat(contact));

    // Close the search popup
    setOpenNewContactModal(false);

    // Clear search data
    setSearchedContacts([]);
    setQuery("");
    setSearchError("");
  };

  return (
    
      <aside className="w-[320px] shrink-0 min-h-0 overflow-y-auto border-r border-gray-200 flex flex-col justify-between bg-[#0B0F1A] ">
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
              className="w-[500px] h-[600px] "
              onOpenChange={(open) => {
                setOpenNewContactModal(open);
                if (!open) resetModal();
              }}
            >
              <DialogContent
                className="p-0 gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl w-[700px] h-[700px] flex flex-col max-w-none max-h-none  "
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
                        className="text-gray-400 hover:text-black transition-colors text-sm shrink-0"
                        onClick={() => {
                          setQuery("");
                          setSearchedContacts([]);
                          setSearchError("");
                          searchInputRef.current?.focus();
                        }}
                      >
                        ✕
                      </button>
                    )}
                    {/* Search button */}
                    <button
                      type="button"
                      onClick={() => searchContact()}
                      className="shrink-0 text-gray-500 hover:text-black transition-colors"
                      aria-label="Search"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
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
                  className="flex-1 px-3 pb-3"
                  style={{ height: "320px" }}
                >
                  {/* Loading */}
                  {searchLoading && (
                    <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                      <span className="text-sm">Searching...</span>
                    </div>
                  )}

                  {/* Error */}
                  {!searchLoading && searchError && (
                    <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-red-50 mx-1 my-2">
                      <svg
                        className="w-4 h-4 text-red-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm text-red-500">{searchError}</p>
                    </div>
                  )}

                  {/* Empty state */}
                  {!searchLoading &&
                    !searchError &&
                    query &&
                    searchedContacts.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-Black">
                        <p className="text-sm">
                          No contacts found for "{query}"
                        </p>
                      </div>
                    )}

                  {/* Prompt to type */}
                  {!searchLoading &&
                    !query &&
                    searchedContacts.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <p className="text-sm">Type to search contacts</p>
                      </div>
                    )}

                  {/* Contact cards */}
                  <div className="flex flex-col gap-0.5">
                    {searchedContacts.map((contact) => (
                      <button
                        key={contact._id || contact.id}
                        type="button"
                        onClick={() => handleSelectContact(contact)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group">
                          <div className="relative shrink-0">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getColor(contact.name)}`}
                            >
                              {contact.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {contact.name}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                              {contact.email}
                            </span>
                          </div>
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
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
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
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 cursor-pointer transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                    {contact.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{contact.name}</p>
                    <p className="text-sm text-gray-500 truncate">{contact.email}</p>
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
