"use client"

import React from "react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-12 max-w-5xl mx-auto space-y-12">

      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Welcome to Kamuit 1.0</h1>
        <p className="text-gray-300 text-base md:text-lg">
          <span className="block font-medium mb-2">Built by students. Powered by community.</span>
          Kamuit 1.0 is a real-time, student-first rideshare zone. Think of it as the social side of carpooling — a mix between WhatsApp ride groups and Craigslist posts, but built into one clean platform.
          No middlemen. No fees. Just you, your route, and a better way to travel.
        </p>
      </section>

      {/* Why Kamuit */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Why Kamuit?</h2>
        <p className="text-gray-300 mb-4">
          We were students too. Getting from campus to the nearest airport, city, or even Costco was brutal without a car — and Uber was always too expensive.
        </p>
        <p className="italic text-emerald-400 mb-6">
          “If someone’s already going that way... why not ride together?”
        </p>
      </section>

      {/* Dual Benefit */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Dual Benefit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-semibold mb-2 text-emerald-400">For Riders</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Save money</li>
              <li>Feel safe riding with fellow students</li>
            </ul>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-semibold mb-2 text-emerald-400">For Drivers</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Offset fuel & tolls</li>
              <li>Help someone headed your way</li>
            </ul>
          </div>
        </div>
        <p className="text-gray-300 mt-6">
          Kamuit is built on that spirit — <span className="font-semibold text-white">community-first travel</span>.
          From students who needed a ride out of town to young grads with a car and an open seat — <span className="text-emerald-400 font-medium">Kamuit is here for every step of the journey</span>.
          That’s why we built this: <span className="font-bold text-white">so no one has to ride alone or pay too much to get somewhere that matters.</span>
        </p>
      </section>

      {/* Who We Are */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-zinc-800">
            <thead className="bg-zinc-800 text-emerald-400">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-t border-zinc-700">
                <td className="p-3">Yogesh</td>
                <td className="p-3">Product Lead</td>
              </tr>
              <tr className="border-t border-zinc-700">
                <td className="p-3">Kaushik</td>
                <td className="p-3">Technical Lead</td>
              </tr>
              <tr className="border-t border-zinc-700">
                <td className="p-3">Vikram</td>
                <td className="p-3">Senior Developer</td>
              </tr>
              <tr className="border-t border-zinc-700">
                <td className="p-3">Smrithi</td>
                <td className="p-3">Business & Community</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-300 mt-4 border-l-4 border-emerald-400 pl-4 italic">
          We’re students who faced this problem — and then decided to fix it. No VC money. No marketing agencies. Just late nights and a working Wi-Fi connection.
        </p>
      </section>

      {/* Try It Now */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Try It Now</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Post a ride or request one</li>
          <li>Add your university to match faster</li>
          <li>DM other riders right inside the app</li>
          <li>
            Follow us on Instagram: <a href="https://instagram.com/kamuit" className="underline text-emerald-400" target="_blank" rel="noopener noreferrer">@kamuit</a>
          </li>
        </ul>
        <p className="text-gray-400 mt-3">Got feedback? Drop it. We’re always listening.</p>
      </section>

      {/* What's Kamuit 1.0 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">What’s Kamuit 1.0?</h2>
        <p className="text-gray-300 mb-4">
          Kamuit 1.0 is our early-access <span className="font-semibold">carpool social platform</span> where you can:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Post or request a ride</li>
          <li>Filter by university, pickup location, and more</li>
          <li>Message inside the app</li>
          <li>Match with nearby students going the same way</li>
        </ul>
        <p className="text-gray-300 mt-4">
          It’s like your car group chat, Facebook post, and spreadsheet — all in one place.
          <br />
          It’s free to use. Always will be during early access.
        </p>
      </section>

      {/* Coming Soon */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Coming Soon: Kamuit 2.0</h2>
        <p className="text-gray-300 mb-4">
          We’re cooking something even bigger — Kamuit 2.0, launching this <span className="font-semibold text-white">Fall 2025 (targeting September–October)</span>.
        </p>
        <p className="text-gray-300 mb-4">This next version will take things to a whole new level:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Tap-to-request rides, instantly matched</li>
          <li>Smart routing based on real-time detours</li>
          <li>Future payment support for verified rides</li>
          <li>Rides for everything — from Costco runs to airport drop-offs to last-minute errands</li>
        </ul>
        <p className="text-gray-300 mt-4">
          Kamuit 2.0 is the on-demand carpooling engine we always wanted as students — and it’s coming soon to make shared travel smarter, safer, and cheaper.
        </p>
        <p className="text-emerald-400 font-medium mt-2">
          Stay tuned. You’ll want to be part of this from Day 1.
        </p>
      </section>

      {/* Final Word */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Final Word</h2>
        <p className="text-gray-300 mb-4">
          This isn’t about building the next unicorn. It’s about making everyday travel easier, cheaper, and more human.
        </p>
        <p className="text-gray-300 mb-4">
          Welcome to Kamuit 1.0. <br />
          The first carpooling platform that actually feels like <span className="font-semibold text-white">your people built it.</span>
        </p>
        <p className="font-semibold text-emerald-400">
          Ready to ride? <Link href="/login" className="underline">[Login]</Link> or <Link href="/signup" className="underline">[Sign Up]</Link> now.
        </p>
      </section>
    </div>
  )
}