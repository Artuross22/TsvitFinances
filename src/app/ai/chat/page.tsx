"use client";

import { RespondMessageAi, SendMessageAi } from "@/api/ai";
import { useEffect, useState } from "react";

interface ChatProps {
    onSendMessage: (message: SendMessageAi) => Promise<RespondMessageAi>;
    placeholder?: string;
    title: string;
    emptyStateMessage?: string;
}

export const Page = ({ 
    onSendMessage, 
    placeholder = "Type your message here...",
    title,
    emptyStateMessage = "Start a conversation!"
}: ChatProps) => {
    const [messages, setMessages] = useState<RespondMessageAi[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        
        setIsLoading(true);
        
        // Create user message object
        const userMessage: SendMessageAi = {
            userId: null,
            message: inputMessage,
            thread_id: messages.length > 0 ? messages[messages.length - 1].thread_id : ""
        };
        
        // Add user message to chat
        setMessages(prev => [...prev, {
            userId: inputMessage,
            response: inputMessage,
            current_question: "",
            thread_id: messages.length > 0 ? messages[messages.length - 1].thread_id : ""
        }]);
        
        // Clear input field
        setInputMessage("");
        
        try {
            // Send message to AI
            const response = await onSendMessage(userMessage);
            
            // Add AI response to chat
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                userId: "system",
                response: "Sorry, there was an error processing your request.",
                current_question: "",         
                thread_id: "",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }; 

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 my-8">
                        <p>{emptyStateMessage}</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`mb-4 p-3 rounded-lg ${
                                msg.userId === ""
                                    ? "bg-blue-100 ml-auto max-w-[80%]" 
                                    : "bg-white max-w-[80%]"
                            }`}
                        >
                            <p className="text-sm font-semibold mb-1">
                                {msg.userId === "" ? "You" : "AI Assistant"}
                            </p>
                            <p>{msg.response}</p>
                            {/* {msg.current_question && <p>{msg.current_question}</p>} */}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="bg-white p-3 rounded-lg max-w-[80%] mb-4">
                        <p className="text-sm font-semibold mb-1">AI Assistant</p>
                        <p>Thinking...</p>
                    </div>
                )}
            </div>
            
            <div className="flex gap-2">
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 p-2 border rounded-lg resize-none"
                    rows={2}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Page;