import Link from "next/link";


export default function Navbar(){
    return (<nav className="shadow p-4 flex flex-row justify-between items-center">
    <img src="albot.png" alt="Albot Logo" className="h-12 w-18" />
    <div>
      <Link href="/login">Log in</Link>
    </div> 
  </nav>);
}