import { getIsSignedIn } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";

export default async function TopBarAuth() {

    const isSignedIn = await getIsSignedIn();
    return isSignedIn ? <SignOutButton /> : <SignInButton/>;
}