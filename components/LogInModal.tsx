"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
//import { Button } from "@/components/ui/button";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
            <DialogContent className={"modal log-in"}>
                <DialogHeader>
                <DialogTitle>Sign in to add bathrooms</DialogTitle>
                <DialogDescription>
                    {/* TODO B */}
                </DialogDescription>
                </DialogHeader>
                <GoogleSignInButton onSignedIn={onSignedIn}/>
            </DialogContent>
        </Dialog>
    )
}