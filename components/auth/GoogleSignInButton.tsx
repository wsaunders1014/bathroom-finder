/// <reference types="google.accounts" />
"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Returns [nonce, hashedNonce]: the original goes to Supabase, the hash goes to Google.
async function generateNonce(): Promise<[string, string]> {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nonce));
  const hashedNonce = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return [nonce, hashedNonce];
}

// Google only keeps the last initialize() call, so it runs once per page load and is
// shared by every button. Each button only renders itself into its own div.
let initPromise: Promise<void> | null = null;

// The button that was clicked, so the shared callback knows whose onSignedIn to call.
let activeButton: { onSignedIn: () => void; setIsLoading: (loading: boolean) => void } | null = null;

function initializeGoogleOnce() {
  initPromise ??= (async () => {
    const [nonce, hashedNonce] = await generateNonce();

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
      callback: async (response) => {
        const button = activeButton;
        const client = createSupabaseBrowserClient();
        const { error } = await client.auth.signInWithIdToken({ provider: 'google', token: response.credential, nonce })
        if (error) {
          console.error(error);
          button?.setIsLoading(false);
        } else {
          // A nonce should only be used once, so the next sign-in starts fresh.
          initPromise = null;
          button?.onSignedIn();
        }
      }
    })
  })();
  return initPromise;
}

type GoogleSignInButtonProps = {
  onSignedIn: () => void;
};

export default function GoogleSignInButton({ onSignedIn }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function renderGoogleButton() {
    await initializeGoogleOnce();

    if (buttonRef.current !== null) {
      google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        size: 'large',
        theme: "filled_black",
        shape: "pill",
        click_listener: () => {
          activeButton = { onSignedIn, setIsLoading };
          setIsLoading(true);
        },
      })
    }

    //google.accounts.id.prompt();
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={() => { void renderGoogleButton() }} />
      {/* Reserves the 44px height Google's button iframe takes, so the dialog doesn't jump when it loads.
          overflow-hidden clips the real iframe button while Google briefly shows it below its HTML placeholder copy. */}
      <div className="h-11 overflow-hidden">
        <div ref={buttonRef} className={isLoading ? "hidden":""}/>
        {isLoading && <p>Signing in...</p>}
      </div>
    </>
  );
}
