import Navbar from "@/components/Navbar";
import Head from "next/head";

export default function Login(){
    return(
        <>
        <Head>
            <title>Albot - Your friendly neighbourhood AI</title>
        </Head>
        <div className="flex flex-col h-screen"><Navbar />
            <div className="mx-auto max-w-md">Login Dialog</div>
        </div>
     
        </>
    );
}