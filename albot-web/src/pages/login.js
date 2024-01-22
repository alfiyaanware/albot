import Navbar from "@/components/Navbar";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, {Toaster} from "react-hot-toast";

export default function Login(){
    const[email, setEmail]= useState('');
    const[code, setCode]=useState('');

    const router = useRouter();

    const supabase = useSupabaseClient();

    async function sendCode(){
        console.log(email);
        const { data, error } = await supabase.auth.signInWithOtp({
            email:email,
          });
        if (error){
            toast.error("Failed to send verification code.");
            console.log('Failed to send code', error);
            return;
        }
        if (data){
            toast.success("Verification code sent. Check your email!");
            console.log('Verification code sent', data);
        }
        
    }

    async function submitCode(){
        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: code,
            type: "magiclink",
          });
        if(data?.user){
            toast.success("Signed in successfully!");
            console.log("Signed in successfully", data);
            router.push("/");
        }
        if (error){
            console.error("Failed to sign in", error);
            const { data:d2 , error:e2 } = await supabase.auth.verifyOtp({
                email: email,
                token: code,
                type: "signup",
              });
            if(d2.user){
                toast.success("Signed up successfully!");
                console.log("New user signed in successfully", d2);
                router.push("/");
            }
            if (e2){
                toast.error("Failed to sign up.");
                console.error("Failed to sign in new user", e2);
            }
        }
    }

    return(
        <>
        <Head>
            <title>Albot - Your friendly neighbourhood AI</title>
        </Head>
        <Toaster />
        <div className="flex flex-col h-screen"><Navbar />
            <div className="mx-auto max-w-md">
                <div className="border self-center rounded-lg my-8 m-4 p-4 w-full"> 
                    <div className="text-center text-xl font-bold text-gray-800">
                        <h1>Albot - Log in</h1>
                    </div>
                    <div className="flex flex-col my-4">
                        
                        <label className="font-medium text-gray-600">Email</label>
                        <input 
                            type="email" 
                            className="border p-2 rounded-md mt-1" 
                            placeholder="jane@doe.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button 
                            className="mx-auto border bg-pink-200 w-full text-sm font-medium px-4 py-2 mt-2 rounded-md hover:bg-pink-300"
                            onClick={sendCode}
                        >Send Code</button>

                    </div>
                    <div className="flex flex-col my-4">
                        <label className="font-medium text-gray-600">Verification Code</label>
                        <input 
                            type="password" 
                            className="border p-2 rounded-md mt-1" 
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button 
                            className="mx-auto border bg-pink-500 w-full rounded-md text-sm font-medium px-4 py-2 mt-2 hover:bg-pink-600 text-white"
                            onClick={submitCode}
                        >
                            Sign In
                        </button>
                    
                    </div>
                </div>
            </div>
        </div>
     
        </>
    );
}