import {useState} from "react";
import ReactMarkdown from 'react-markdown';
import Head from "next/head";
import TextareaAutosize from "react-textarea-autosize";
import Navbar from '../components/Navbar';
import { useUser } from "@supabase/auth-helpers-react";
import { streamOpenAIResponse } from "@/utils/openai";

const SYSTEM_MESSAGE= "You are Albot, a helpful and versatile AI created by Alfiya Anware using state of the art ML models and APIs.";

export default function Home() {

  const user= useUser();

  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages ] =useState([{role:"system", content:SYSTEM_MESSAGE}]);
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendRequest();
    }
  };

  const sendRequest = async () => {
    
    if(!user){
      alert("Please Log in to send a message.");
      return;
    }
    if(!userMessage){
      alert("Please enter a message before you hit send.");
      return;
    }

    const oldUserMessage = userMessage;
    const oldMessages = messages;

    const updatedMessages = [...messages, {role: "user", content: userMessage,},];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      if (response.status !== 200) {
        throw new Error(`OpenAI API returned an error.`);
      }

      streamOpenAIResponse(response, (newMessage) => {
        console.log(newMessage);
        const updatedMessages2 = [...updatedMessages, {role:"assistant", content: newMessage},];
        setMessages(updatedMessages2);
      });
    } catch (error) {
      console.error("error");

      setUserMessage(oldUserMessage);
      setMessages(oldMessages);
      window.alert("Error:" + error.message);
    }
  };

  return (
  
  <><Head><title>Albot - Your friendly neighbourhood AI</title></Head>
  
  <div className="flex flex-col h-screen">
    <Navbar />
  

    
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
        <TextareaAutosize
        value={userMessage}
        autoFocus
        maxRows={10}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything.."
        onChange={(e) => setUserMessage(e.target.value)}
        className="border text-lg rounded-md p-1 flex-1" 
        rows={1}
        />
        
        <button className="border rounded-md p-2 bg-pink-500 hover:bg-pink-600 text-white ml-2"
      onClick={sendRequest}>
        Send Request
      </button>

      </div>

    </div>
  </div>
  </>
  )
}
 