import Link from "next/link";
import {useUser} from "@supabase/auth-helpers-react";

export default function Navbar(){
    const user= useUser();

    return (
    <nav className="shadow p-4 flex flex-row justify-between items-center">
    <img src="albot.png" alt="Albot Logo" className="h-12 w-18" />
    <div className="text-xl font-medium">
      {user ? (<Link href="/logout">Log out</Link>) : (<Link href="/login">Log in</Link>) }
    </div> 
  </nav>
  );
}