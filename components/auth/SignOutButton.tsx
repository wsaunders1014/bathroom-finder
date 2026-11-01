"use client"
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function SignOutButton({}){

    const router = useRouter();
    async function signOut(){
        const client = createSupabaseBrowserClient();
        const {error} = await client.auth.signOut({scope:'local'})
        if(error){
            console.error(error);
            return;
        }
        
        router.refresh();
    }
    return(
        <Button className={"motion-safe:hover:animate-shake-no"} onClick={signOut}>Sign Out</Button>
    )
}