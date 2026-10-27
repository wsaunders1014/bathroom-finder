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

type GoogleSignInButtonProps = {
  onSignedIn: () => void;
};

export default function GoogleSignInButton({ onSignedIn }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  async function initializeGoogle() {
    const [nonce, hashedNonce] = await generateNonce();

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
      callback: async (response) => {
        const client = createSupabaseBrowserClient();
        const { error } = await client.auth.signInWithIdToken({ provider: 'google', token: response.credential, nonce })
        if (error) {
          console.error(error);
          setIsLoading(false);
        } else {
          onSignedIn();
        }

      }
    })



    if (buttonRef.current !== null) {
      google.accounts.id.renderButton(buttonRef.current, { type: "standard", size: 'large', theme: "filled_black", click_listener:()=> setIsLoading(true) })
    }

    //google.accounts.id.prompt();
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={() => { void initializeGoogle() }} />
      <div ref={buttonRef} className={isLoading ? "hidden":""}/>
      {isLoading && <p>Signing in...</p>}
    </>
  );
}