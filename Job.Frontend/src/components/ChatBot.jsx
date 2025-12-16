import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! 👋 I'm your HireTech assistant. How can I help you find your dream job?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const botResponse = generateResponse(userMessage.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const generateResponse = (text) => {
        const lower = text.toLowerCase();

        if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
            return "Hello! Ready to boost your career? Ask me about jobs, your profile, or applications.";

        if (lower.includes("job") || lower.includes("search") || lower.includes("find"))
            return "You can find the latest opportunities in the main dashboard. Try using the filters for Location and Skills to narrow down your search!";

        if (lower.includes("resume") || lower.includes("profile") || lower.includes("cv"))
            return "Keep your profile updated for better visibility! Go to 'Profile Settings' to upload your latest resume and add new skills.";

        if (lower.includes("application") || lower.includes("status") || lower.includes("applied"))
            return "You can track all your active applications in the 'My Applications' tab. We'll verify your status updates as soon as companies review them.";

        if (lower.includes("salary") || lower.includes("pay"))
            return "Salary information is listed on each job card. You can also filter jobs by minimum salary in the dashboard.";

        if (lower.includes("help") || lower.includes("support"))
            return "I'm here to help! You can ask me about finding jobs, managing your profile, or tracking applications.";

        return "I'm still learning! 🧠 Try asking about 'jobs', 'profile updates', or 'application status'.";
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 bg-[#655be9] text-white rounded-full shadow-[0_8px_30px_rgba(101,91,233,0.4)] flex items-center justify-center hover:scale-110 transition-all z-50 group hover:rotate-12"
                >
                    <MessageCircle size={28} className="group-hover:animate-pulse" />
                    {/* Notification Dot */}
                    <span className="absolute top-0 right-0 h-4 w-4 bg-[#55c79e] rounded-full border-2 border-white"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-[#191e4a] p-4 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#655be9] blur-[40px] opacity-30" />
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-[16px]">HireBot</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-[#55c79e] rounded-full animate-pulse"></span>
                                    <span className="text-gray-300 text-[12px] font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="relative z-10 text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                {msg.isBot && (
                                    <div className="w-8 h-8 rounded-full bg-[#655be9]/10 flex items-center justify-center shrink-0">
                                        <Bot size={16} className="text-[#655be9]" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] p-3.5 rounded-[18px] text-[14px] leading-relaxed shadow-sm ${msg.isBot
                                            ? 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                            : 'bg-[#655be9] text-white rounded-br-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                {!msg.isBot && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <User size={16} className="text-gray-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#655be9]/10 flex items-center justify-center">
                                    <LoaderDots />
                                </div>
                                <div className="bg-white p-3 rounded-[18px] rounded-bl-none border border-gray-100 text-gray-400 text-[12px] font-medium flex items-center gap-1">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about jobs..."
                                className="w-full h-[48px] bg-gray-50 border border-transparent focus:border-[#655be9] focus:bg-white rounded-[14px] pl-4 pr-12 outline-none text-[14px] font-medium transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-2 p-2 bg-[#191e4a] text-white rounded-[10px] hover:bg-[#655be9] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

const LoaderDots = () => (
    <div className="flex space-x-0.5">
        <div className="w-1 h-1 bg-[#655be9] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-[#655be9] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-[#655be9] rounded-full animate-bounce"></div>
    </div>
);

export default ChatBot;
