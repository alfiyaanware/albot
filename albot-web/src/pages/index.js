import {useState} from "react";
const SYSTEM_MESSAGE= "You are Albot, a helpful and versatile AI created by Alfiya Anware using state of the art ML models and APIs."

export default function Home() {
  const [apiKey, setApiKey] = useState(""); 
  const [botMessage, setBotMessage] = useState("");

  const API_URL= "https://api.openai.com/v1/chat/completions";

  async function sendRequest(){
    const response = await fetch(API_URL, {
      method: "POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+ apiKey,
      },
      body:JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {role:"system", content:SYSTEM_MESSAGE},
          {role: "user", content: "Hello, introduce yourself."},]
      }),
    });

    const responseJson= await response.json();
    
    setBotMessage(responseJson.choices[0].message.content);
    
  }

  return <div className="flex flex-col h-screen">
    <nav className="shadow p-4 flex flex-row justify-between items-center">
      <div className="text-xl font-bold">Albot</div>
      <div>
        <input type="password" 
        className="border p-1 rounded" 
        onChange={e => setApiKey(e.target.value)}
        value={apiKey}
        placeholder="Paste API Key here" />
      </div> 
    </nav>

    <div className="p-4">
      <button className="border rounded-md p-2 bg-pink-500 hover:bg-black text-white"
      onClick={sendRequest}>
        Send Request
      </button>
      <div className="text-lg mt-4">{botMessage}</div>
    </div>
  </div>
}
 