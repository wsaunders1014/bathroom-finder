"use client"
import { Button } from "../ui/button";

type SignInButtonProps = {
    onClick: () => void;
}

// Only opens the log in modal; BathroomMap owns the modal so there's just one.
export default function SignInButton({onClick}:SignInButtonProps){
    return (
        <Button className={"motion-safe:hover:animate-nod-yes"} onClick={onClick}>Sign In</Button>
    )

}
