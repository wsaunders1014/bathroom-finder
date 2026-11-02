"use client";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import GoogleSignInButton from "./GoogleSignInButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
type SignInDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignedIn: ()=> void;
};
export default function LogInModal({open, onOpenChange, onSignedIn}:SignInDialogProps){


    async function signInWithGoogle() {
         const client = createSupabaseBrowserClient();
        const {error} = await client.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
       if(error) console.error(error);

    }
    return(
        <Dialog  open={open} onOpenChange={onOpenChange}>
            {/* The default close button is swapped for the design's larger X below. */}
            <DialogContent
                showCloseButton={false}
                className="flex w-auto flex-col items-center gap-[31px] rounded-[28px] border-2 border-[rgba(214,206,187,0.3)] bg-white px-6 pt-14 pb-[38px] ring-0 drop-shadow-[18px_31px_27px_rgba(0,0,0,0.25)] sm:max-w-none sm:px-[75px] sm:pt-[38px]"
            >
                {/* The card's surface, from the design: a soft warm gradient, then a faint grain. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
                    <div className="absolute inset-0 bg-[linear-gradient(31deg,rgba(220,220,220,0.36)_0%,rgba(255,252,245,0.36)_44%,rgba(220,220,220,0.36)_88%)] mix-blend-multiply" />
                    <div className="absolute inset-0 bg-grain opacity-15" />
                </div>

                {/* The logo is the dialog's title, so screen readers announce "PooPal" when it opens. */}
                {/* Smaller below sm, so it fits a phone and clears the close button. */}
                <DialogTitle className="relative flex items-center gap-3 font-heading text-5xl leading-none font-bold tracking-[-0.02em] text-(--brand-primary-blue) sm:gap-[18px] sm:text-[64px]">
                    <Image src="/icons/icon-pooey.svg" alt="" width={85} height={100} className="h-auto w-16 sm:w-[85px]" />
                    PooPal
                </DialogTitle>

                <div className="relative">
                    <GoogleSignInButton onSignedIn={onSignedIn}/>
                </div>

                <DialogDescription className="relative w-[338px] max-w-full text-center text-base font-medium tracking-[-0.32px] text-black">
                    Welcome to the world’s first crowdsourced directory of public toilets. To add a bathroom, please create an account or sign in.
                </DialogDescription>

                <DialogClose
                    aria-label="Close"
                    className="absolute top-2 right-2 grid size-12 cursor-pointer place-items-center rounded-full text-(--brand-primary-blue) outline-none hover:text-(--brand-darker-blue) focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <XIcon className="size-12" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}
