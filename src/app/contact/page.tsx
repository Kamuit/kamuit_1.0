"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const [mode, setMode] = useState<"feedback" | "contact">("feedback");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const stored = localStorage.getItem("currentUser");
    const user = stored ? JSON.parse(stored) : null;

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: mode,
        contact,
        message,
        userId: user?.id || null,
      }),
    });

    setContact("");
    setMessage("");
    alert("Thanks for reaching out!");
    setSubmitting(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-start md:items-center justify-center px-4 py-10 md:py-0">
      <div className="max-w-md w-full">
        <div className="flex space-x-4 mb-6">
          <button
            className={`w-1/2 py-2 rounded-full font-semibold ${
              mode === "feedback"
                ? "bg-emerald-500 text-black"
                : "bg-zinc-800 text-white"
            }`}
            onClick={() => setMode("feedback")}
          >
            Feedback
          </button>
          <button
            className={`w-1/2 py-2 rounded-full font-semibold ${
              mode === "contact"
                ? "bg-emerald-500 text-black"
                : "bg-zinc-800 text-white"
            }`}
            onClick={() => setMode("contact")}
          >
            Contact Us
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {mode === "feedback"
            ? "Got something to say? Rant, rave, or report a bug!"
            : "Wanna chat, collab, or connect with us?"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your email or phone"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <textarea
            placeholder={
              mode === "feedback"
                ? "What's going wrong or what should we improve?"
                : "Tell us why you're reaching out!"
            }
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 text-black font-semibold rounded-full"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}