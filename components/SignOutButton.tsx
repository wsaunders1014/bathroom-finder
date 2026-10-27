import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
type SignOutButtonProps = {
    onSignedOut: () => void;
};
export default function SignOutButton({onSignedOut}:SignOutButtonProps){

    const router = useRouter();
    async function signOut(){
        const client = createSupabaseBrowserClient();
        const {error} = await client.auth.signOut({scope:'local'})
        if(error){
            console.error(error);
            return;
        }
        onSignedOut();
        router.refresh();
    }
    return(
        <Button className={"absolute top-6 right-6 z-[1000]"} onClick={signOut}>Sign Out</Button>
    )
}