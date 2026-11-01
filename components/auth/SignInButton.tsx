"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import LogInModal from "./LogInModal";

export default function SignInButton(){
    const [open, setOpen] = useState(false);
    const router = useRouter();
    function handleSignedIn(){
        setOpen(false);
        router.refresh();
    }
    return (
        <>
            <Button className={"motion-safe:hover:animate-nod-yes"} onClick={()=>{setOpen(true)}}>Sign In</Button>
            <LogInModal open={open} onOpenChange={() => setOpen(false)} onSignedIn={handleSignedIn} />
        </>
    )

}