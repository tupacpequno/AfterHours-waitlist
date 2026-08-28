"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * AFTER HOURS® — Waitlist Landing Page
 *
 * Drop this into a Next.js app as app/page.jsx (App Router) or pages/index.jsx (Pages Router).
 * Tailwind CSS required. No external images. No gradients. No component libraries.
 *
 * Fonts: swap the two `font-family` stacks below for licensed faces in production.
 * Suggested pairing: "Neue Haas Grotesk" / "Suisse Int'l" for display+body,
 * with a monospace face (already system-safe here) for the status ticker.
 */

export default function AfterHoursWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      // Unique-constraint violation just means they're already on the list —
      // treat that as success rather than surfacing a database error.
      if (error.code === "23505") {
        setStatus("done");
        return;
        }


      console.error("[waitlist] insert failed:", error);
alert("SUPABASE ERROR: " + error.message);
setStatus("error");
      return;
    }

    setStatus("done");
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#ece8e1] antialiased selection:bg-[#ece8e1] selection:text-[#050505]">
      {/* film-grain texture, no gradients — pure noise via SVG filter */}
      <svg className="fixed inset-0 h-0 w-0" aria-hidden="true">
        <filter id="ah-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{ filter: "url(#ah-grain)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* status ticker — the only structural device on the page; it encodes a real, changing fact */}
        <header
          className={`flex items-center justify-center gap-2 border-b border-[#1f1f1f] py-4 transition-opacity duration-1000 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8a8680] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8a8680]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#7a766f]">
            Drop Status — Locked
          </span>
        </header>

        {/* hero */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-8">
          <div className="w-full max-w-md">
            {/* monogram */}
            <div
              className={`mx-auto mb-7 flex justify-center transition-all duration-1000 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <Monogram animate={mounted} />
            </div>

            {/* wordmark */}
            <div
              className={`text-center transition-all delay-150 duration-1000 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[13px] font-normal tracking-[0.55em] text-[#ece8e1]">
                AFTER HOURS<sup className="ml-0.5 text-[8px]">®</sup>
              </h1>
            </div>

            {/* headline */}
            <div
              className={`mt-14 text-center transition-all delay-300 duration-1000 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <h2 className="text-balance font-sans text-[28px] font-medium leading-[1.15] tracking-tight text-[#f5f3ee] sm:text-4xl">
                BUILT WHEN
                <br />
                NOBODY&apos;S WATCHING.
              </h2>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8680]">
                The first drop is coming.
              </p>
            </div>

            {/* form / success */}
            <div
              className={`mt-14 transition-all delay-500 duration-1000 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              {status === "done" ? (
                <SuccessState email={email} />
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <label htmlFor="ah-email" className="sr-only">
                    Email address
                  </label>
                  <div className="group relative border-b border-[#3a3a3a] pb-3 transition-colors focus-within:border-[#ece8e1]">
                    <input
                      ref={inputRef}
                      id="ah-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="EMAIL ADDRESS"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      className="w-full bg-transparent font-mono text-[12px] uppercase tracking-[0.2em] text-[#ece8e1] outline-none placeholder:text-[#5c5952] focus:placeholder:text-[#3a3833]"
                      aria-invalid={status === "error"}
                      aria-describedby={status === "error" ? "ah-email-error" : undefined}
                    />
                  </div>

                  {status === "error" && (
                    <p id="ah-email-error" className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a6b5f]">
                      {isValidEmail(email) ? "Something went wrong. Try again." : "Enter a valid email."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group relative mt-6 flex w-full items-center justify-center overflow-hidden border border-[#3a3a3a] py-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#ece8e1] transition-colors duration-300 hover:border-[#ece8e1] hover:text-[#050505] disabled:opacity-60"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-[#ece8e1] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                    <span className="relative">
                      {status === "loading" ? "Joining…" : "Join the Waitlist"}
                    </span>
                  </button>
                </form>
              )}

              <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#5c5952]">
                First access. Limited drop.
              </p>
            </div>
          </div>
        </main>

        {/* footer */}
        <footer
          className={`flex flex-col items-center gap-3 border-t border-[#1f1f1f] py-7 transition-opacity delay-700 duration-1000 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <a
            href="https://instagram.com/afterhourswear"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5c5952] transition-colors hover:text-[#ece8e1]"
          >
            @afterhourswear
          </a>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#3a3833]">
            New money. New rules.
          </span>
        </footer>
      </div>
    </div>
  );
}

function SuccessState({ email }) {
  return (
    <div className="animate-[fadein_0.6s_ease-out] text-center">
      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#ece8e1]">
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
          <path d="M1 5.5L5 9.5L13 1.5" stroke="#ece8e1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="font-sans text-lg font-medium tracking-tight text-[#f5f3ee]">YOU&apos;RE IN.</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8680]">
        You&apos;ll be the first to know.
      </p>
      {email && (
        <p className="mt-4 font-mono text-[9px] tracking-[0.15em] text-[#3a3833]">{email}</p>
      )}
    </div>
  );
}

/** AH monogram — interlocked strokes, drawn in on load. This is the page's signature element. */
function Monogram({ animate }) {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 72 72"
      fill="none"
      className="text-[#ece8e1]"
      role="img"
      aria-label="After Hours monogram"
    >
      {/* A */}
      <path
        d="M22 50L31.5 22H34.5L44 50"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: animate ? 0 : 1,
          transition: "stroke-dashoffset 1.1s cubic-bezier(0.65,0,0.35,1) 0.15s",
        }}
      />
      <path
        d="M25.5 41H40.5"
        stroke="currentColor"
        strokeWidth="2.4"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: animate ? 0 : 1,
          transition: "stroke-dashoffset 0.5s ease-out 1.05s",
        }}
      />
      {/* H, overlapping the A's right leg */}
      <path
        d="M38 22V50"
        stroke="currentColor"
        strokeWidth="2.4"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: animate ? 0 : 1,
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.65,0,0.35,1) 0.55s",
        }}
      />
      <path
        d="M38 35.5H50"
        stroke="currentColor"
        strokeWidth="2.4"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: animate ? 0 : 1,
          transition: "stroke-dashoffset 0.5s ease-out 1.2s",
        }}
      />
      <path
        d="M50 22V50"
        stroke="currentColor"
        strokeWidth="2.4"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: animate ? 0 : 1,
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.65,0,0.35,1) 0.75s",
        }}
      />
    </svg>
  );
}
