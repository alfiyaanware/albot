// import {useState} from "react";
// import ReactMarkdown from 'react-markdown';
// import Head from "next/head";
// import TextareaAutosize from "react-textarea-autosize";
// import Navbar from '../components/Navbar';
// import { useUser } from "@supabase/auth-helpers-react";
// import { OpenAIStream, streamOpenAIResponse } from "@/utils/openai";

// const SYSTEM_MESSAGE= "You are Albot, a helpful and versatile AI using state of the art ML models and APIs.";

// export default function Home() {

//   const user= useUser();
//   console.log(user)

//   const [userMessage, setUserMessage] = useState("");
//   const [messages, setMessages ] =useState([{role:"system", content:SYSTEM_MESSAGE},]);
//   // const [messages, setMessages ] =useState([]);
//   console.log(messages)
  
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendRequest();
//     }
//   };

//   const sendRequest = async () => {
    
//     if(!user){
//       alert("Please Log in to send a message.");
//       return;
//     }
//     if(!userMessage){
//       alert("Please enter a message before you hit send.");
//       return;
//     }

//     const oldUserMessage = userMessage;
//     const oldMessages = messages;
//     console.log(oldUserMessage,oldMessages)

//     const updatedMessages = [...messages, {role: "user", content: "hi"},];

//     console.log(updatedMessages)
//     setMessages(updatedMessages);
//     // setUserMessage("");


//     try {
//       // const response = await fetch("api/chat", {
//       //   method: "POST",
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //   },
//         const body = {
//           model: "gpt-3.5-turbo",
//           messages: updatedMessages,
//           stream: true,
//         }
//       // });

//       const response = await OpenAIStream(body);
//       // const response1 = new Response(response, {status: 200})
//       console.log("response: ",response)

//       // if (response.status !== 200) {
//       //   throw new Error(`OpenAI API returned an error.`);
//       // }

//       // Read the response as a stream of data
//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//     var newMessage = "";

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) {
//         break;
//       }
//       // Massage and parse the chunk of data
//       const chunk = decoder.decode(value);
//       const lines = chunk.split("\\n");
//       const parsedLines = lines.map((line) => line.replace(/^data: /, "").trim()).filter((line) => line !== "" && line !== "[DONE]")
//       // .map((line) => JSON.stringify(line))
//       .map((line) => JSON.parse(line)); // Parse the JSON string
//       // const newparse = JSON.parse(parsedLines)
//       console.log(parsedLines)

//       for await (const parsedLine of parsedLines) {
//         const { choices } = parsedLine;
//         console.log(choices)
//         const { delta } = choices[0];
//         console.log(delta)
//         const { content } = delta;
//         console.log(content)
//         // Update the UI with the new content
//         if (content) {
//           newMessage += content;
//           const updatedMessages2 = [...updatedMessages, {role:"assistant", content: newMessage},];
//           setMessages(updatedMessages2);
//         }
//       }
//     }

//       // streamOpenAIResponse(response1, (newMessage) => {
//       //   console.log(response1);
//       //   const updatedMessages2 = [...updatedMessages, {role:"assistant", content: newMessage},];
//       //   setMessages(updatedMessages2);
//       // });
//     } catch (error) {
//       console.error(error);

//       setUserMessage(oldUserMessage);
//       setMessages(oldMessages);
//       window.alert("Error:" + error.message);
//     }
//   };

//   return (
  
//   <><Head><title>Albot - Your friendly neighbourhood AI</title></Head>
  
//   <div className="flex flex-col h-screen">
//     <Navbar />
  

    
//     {/* Message History */}
//     <div className="flex-1 overflow-y-scroll">
//     <div className="w-full max-w-screen-md mx-auto px-4">
//       {messages.filter(message => message.role !== "system").map((message, idx) => (
//         <div key={idx} className="my-3">
//           <div className="font-bold">{message.role === "user" ? "You" : "Albot"}</div>
//           <div className="text-lg prose">
//           <ReactMarkdown>{message.content}</ReactMarkdown>
//           </div>
          
//         </div>
//       ))}
//     </div>
//     </div>
    
//     {/* Message Input Box */}
//     <div>
//       <div className="w-full max-w-screen-md mx-auto flex px-4 pb-4">
//         <TextareaAutosize
//         value={userMessage}
//         autoFocus
//         maxRows={10}
//         onKeyDown={handleKeyDown}
//         placeholder="Ask me anything.."
//         onChange={(e) => setUserMessage(e.target.value)}
//         className="border text-lg rounded-md p-1 flex-1" 
//         rows={1}
//         />
        
//         <button className="border rounded-md p-2 bg-pink-500 hover:bg-pink-600 text-white ml-2"
//       onClick={sendRequest}>
//         Send Request
//       </button>

//       </div>

//     </div>
//   </div>
//   </>
//   )
// }
'use client';
 
import { useChat } from 'ai/react';
 
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
 
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border text-black border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}