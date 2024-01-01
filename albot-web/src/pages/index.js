import {useState} from "react";
import ReactMarkdown from 'react-markdown';
import Head from "next/head";
import { createParser } from "eventsource-parser";

const SYSTEM_MESSAGE= "You are Albot, a helpful and versatile AI created by Alfiya Anware using state of the art ML models and APIs."

export default function Home() {
  const [apiKey, setApiKey] = useState(""); 
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages ] =useState([
    {role:"system", content:SYSTEM_MESSAGE}]);

  const API_URL= "https://api.openai.com/v1/chat/completions";

  const sendRequest = async () => {
    const updatedMessages = [...messages, {role: "user", content: userMessage,},];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      const reader = response.body.getReader();

      let newMessage = "";
      const parser = createParser((event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            return;
          }
          const json = JSON.parse(event.data);
          const content = json.choices[0].delta.content;

          if (!content) {
            return;
          }

          newMessage += content;

          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);
        } else {
          return "";
        }
      });

      // eslint-disable-next-line
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        parser.feed(text);
      }
    } catch (error) {
      console.error("error");
      window.alert("Error:" + error.message);
    }
  };

  return (
  
  <><Head><title>Albot - Your friendly neighbourhood AI</title></Head>
  
  <div className="flex flex-col h-screen">
    <nav className="shadow p-4 flex flex-row justify-between items-center">
      <img src="albot.png" alt="Albot Logo" className="h-12 w-18" />
      <div>
        <input type="password" 
        className="border p-1 rounded" 
        onChange={e => setApiKey(e.target.value)}
        value={apiKey}
        placeholder="Paste API Key here" />
      </div> 
    </nav>

    
    {/* Message History */}
    <div className="flex-1 overflow-y-scroll">
    <div className="w-full max-w-screen-md mx-auto px-4">
      {messages.filter(message => message.role !== "system").map((message, idx) => (
        <div key={idx} className="my-3">
          <div className="font-bold">{message.role === "user" ? "You" : "Albot"}</div>
          <div className="text-lg prose">
          <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          
        </div>
      ))}
    </div>
    </div>
    
    {/* Message Input Box */}
    <div>
      <div className="w-full max-w-screen-md mx-auto flex px-4 pb-4">
        <textarea 
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        className="border text-lg rounded-md p-1 flex-1" rows={1}/>
        
        <button className="border rounded-md p-2 bg-pink-500 hover:bg-black text-white ml-2"
      onClick={sendRequest}>
        Send Request
      </button>

      </div>

    </div>
  </div>
  </>
  )
}
 