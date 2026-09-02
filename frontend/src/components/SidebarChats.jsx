"use client";
import React from "react";
import { useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../store/chatSlice";

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

  const resetModal = () => {
    setSearchedContacts([]);
    setSearchError("");
    setQuery("");
  };

  const searchContact = async () => {
    const SearchTerm = query;
    console.log("The call too Function for Searching the name starts ");

    if (!SearchTerm || SearchTerm.trim().length === 0) {
      setSearchedContacts([]);
      setSearchError("");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const response = await fetch(`/api/users/search-contact?query=${encodeURIComponent(SearchTerm)}`,
       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ SearchTerm }),
        credentials: "include",
      });

      const data = await response.json();

      console.log("here is the searched contacts", data);

      if (!response.ok) {
        setSearchError(data.message || "Something went wrong. Try again.");
        setSearchedContacts([]);
        return;
      }

      setSearchedContacts(data.contacts || []);
      setSearchError("");
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("Network error. Please try again.");
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
    
      <aside className="w-[320px] border-r border-gray-200 flex flex-col justify-between bg-[#0B0F1A] min-h-screen ">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-6 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xl">
              C
            </div>
            <h1 className="text-xl font-bold">ChatSync</h1>
          </div>

          {/* Direct Messages */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="uppercase text-sm tracking-widest text-gray-500 font-semibold">
                Direct Messages
              </h2>
              <button
                className="text-2xl font-bold cursor-pointer "
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
                      placeholder="Search contacts..."
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
                        type="button"
                        onClick={() => handleSelectContact(contact)}
                        className="w-full text-left"
                      >
                        <div
                          key={contact._id || contact.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group"
                          role="button"
                          tabIndex={0}
                        >
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getColor(
                                contact.name,
                              )}`}
                            >
                              {contact.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            {/* You can wire `contact.isOnline` here */}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                          </div>

                          {/* Info */}
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
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                  Z
                </div>
                <div>
                  <p className="font-semibold">Zain Ahmed</p>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-black text-white cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-semibold">
                  A
                </div>
                <div>
                  <p className="font-semibold">Ali Khan</p>
                  <p className="text-sm text-gray-300">Typing...</p>
                </div>
              </div>
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
    
          <div className="border-t border-gray-200 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h2 className="text-xl font-semibold text-slate-700">
                
                  
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                

                </p>
              </div>
            </div>

            <button
              className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center"
              onClick=""
            >
              ⏻
            </button>
          </div>
    
      </aside>
   
  );
}

export default SidebarChats;
