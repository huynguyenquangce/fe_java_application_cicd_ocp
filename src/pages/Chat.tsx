
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, Trash2, User, Circle, Sparkles, Mic, MicOff, PaperclipIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Layout from '@/components/Layout';

// Mock data for chat history
const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: "Hello! I'm your healthcare assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 2 * 60 * 1000)
  }
];

// Mock suggestions for the initial conversation
const initialSuggestions = [
  "I've been experiencing headaches for the past week",
  "What doctor should I see for back pain?",
  "How do I prepare for my upcoming appointment?",
  "Can you help me find a cardiologist?"
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 'current', title: 'Current Chat', active: true, preview: "Hello! I'm your healthcare assistant...", timestamp: new Date() },
    { id: 'symptoms', title: 'Symptom Discussion', active: false, preview: "I've been having chest pain and shortness...", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'appointment', title: 'Appointment Help', active: false, preview: "Can you help me schedule an appointment...", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate response based on user input (mock AI)
      let responseText = "I understand your concern. ";
      
      if (inputMessage.toLowerCase().includes('headache')) {
        responseText += "Headaches can have many causes, from stress to dehydration. If they're persistent, you might want to see a neurologist. Would you like me to help you find one in your area?";
        setSuggestions(["Yes, find a neurologist near me", "What could be causing my headaches?", "How can I prevent headaches?"]);
      } else if (inputMessage.toLowerCase().includes('appointment')) {
        responseText += "I can help you schedule an appointment. What type of doctor would you like to see, and what's your preferred date?";
        setSuggestions(["I need a cardiologist", "What's the next available slot?", "I prefer afternoon appointments"]);
      } else if (inputMessage.toLowerCase().includes('pain')) {
        responseText += "I'm sorry to hear you're in pain. Could you tell me more about where the pain is located and how long you've been experiencing it?";
        setSuggestions(["It's in my lower back", "The pain started yesterday", "It's a sharp, constant pain"]);
      } else {
        responseText += "Could you provide more details about your symptoms or what specific health information you're looking for?";
        setSuggestions(["I need to find a specialist", "I have questions about my medication", "What are the symptoms of COVID-19?"]);
      }
      
      // Add AI response
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleRecording = () => {
    if (!isRecording) {
      // Request microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setIsRecording(true);
          toast.success("Voice recording started");
          
          // In a real app, you would handle recording here
          // This is just a mock implementation
        })
        .catch(err => {
          toast.error("Microphone access denied");
          console.error("Error accessing microphone:", err);
        });
    } else {
      // Stop recording in a real implementation
      setIsRecording(false);
      toast.success("Voice recording stopped");
      
      // Simulate speech-to-text after a delay
      setTimeout(() => {
        setInputMessage("I've been having frequent headaches and dizziness. What should I do?");
      }, 500);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: "Hello! I'm your healthcare assistant. How can I help you today?",
        timestamp: new Date()
      }
    ]);
    setSuggestions(initialSuggestions);
    toast.success("Chat history cleared");
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Layout>
      <div className="container mx-auto max-w-5xl py-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile view - chat options in sheet */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Health Assistant</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  Chat History
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-4">
                  <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full flex justify-start gap-2" onClick={clearChat}>
                    <Sparkles className="h-4 w-4" />
                    New Chat
                  </Button>
                  <div className="space-y-2">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-3 rounded-md cursor-pointer ${
                          chat.active ? 'bg-accent' : 'hover:bg-muted'
                        }`}
                      >
                        <div className="font-medium">{chat.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {chat.preview}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {chat.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Card className="h-[calc(100vh-140px)]">
              <CardHeader>
                <CardTitle className="text-lg">Health Assistant</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Button variant="outline" className="w-full flex justify-start gap-2 mb-4 mx-4" onClick={clearChat}>
                  <Sparkles className="h-4 w-4" />
                  New Chat
                </Button>
                <ScrollArea className="h-[calc(100vh-260px)] px-4">
                  <div className="space-y-2 pr-4">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-3 rounded-md cursor-pointer ${
                          chat.active ? 'bg-accent' : 'hover:bg-muted'
                        }`}
                      >
                        <div className="font-medium">{chat.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {chat.preview}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {chat.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat main area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 glass-card h-[calc(100vh-140px)]">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">MediCare Assistant</CardTitle>
                      <div className="flex items-center">
                        <Circle className="h-2 w-2 text-green-500 mr-1.5" fill="currentColor" />
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearChat} title="Clear chat">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 overflow-y-auto h-[calc(100vh-270px)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8 mt-1">
                          {message.role === 'user' ? (
                            <>
                              <AvatarImage src="/placeholder.svg" alt="User" />
                              <AvatarFallback className="bg-muted">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg" alt="Assistant" />
                              <AvatarFallback className="bg-primary/20 text-primary">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        
                        <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-lg p-3 ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {formatTime(new Date(message.timestamp))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Auto scroll target */}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-4">
                <div className="w-full space-y-4">
                  {/* Quick suggestions */}
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Message input */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={isRecording ? 'bg-red-100 text-red-500 animate-pulse' : ''}
                      onClick={toggleRecording}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <div className="relative flex-1">
                      <Textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="min-h-[44px] max-h-[200px] pr-10"
                        rows={1}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-1 bottom-1 opacity-70 hover:opacity-100"
                        onClick={() => {
                          /* Handle file upload in a real implementation */
                          toast.info("File upload not implemented in this demo");
                        }}
                      >
                        <PaperclipIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      size="icon" 
                      disabled={!inputMessage.trim() || isLoading}
                      onClick={handleSendMessage}
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
