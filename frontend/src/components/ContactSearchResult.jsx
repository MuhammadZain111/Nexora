import React from "react";
import { User } from "lucide-react";

function ContactSearchResult({ contacts }) {
  return (
    <div
      className="absolute top-14 left-0 w-full bg-white dark:bg-zinc-900 
                    rounded-xl shadow-lg border border-gray-200 
                    dark:border-zinc-700 overflow-hidden z-50"
    >
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <div
            key={contact._id}
            className="flex items-center gap-3 px-4 py-3 
                       hover:bg-gray-100 dark:hover:bg-zinc-800
                       cursor-pointer transition"
          >
            {/* Profile Image */}
            <div
              className="w-10 h-10 rounded-full bg-blue-500 
                            flex items-center justify-center
                            text-white font-semibold"
            >
              {contact.name?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {contact.name}
              </h3>

              <p className="text-sm text-gray-500">{contact.email}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-5 text-center text-gray-500">No contacts found</div>
      )}
    </div>
  );
}

export default ContactSearchResult;
