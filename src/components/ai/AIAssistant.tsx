import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Volume2, VolumeX, Sparkles, Zap } from "lucide-react";
import { SurveyData } from "@/types/survey";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  surveyData: SurveyData;
}

export const AIAssistant = ({ surveyData }: AIAssistantProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `✨ Hello ${surveyData.name}! I'm your enhanced Scannest AI Assistant powered by Gemini! 🚀 I can help you understand your household survey data and provide personalized insights. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: userMessage,
          surveyData: surveyData
        }
      });

      if (error) throw error;
      
      return data.response || "I'm sorry, I couldn't process that request. Please try again.";
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      
      return "I'm having trouble connecting right now. Please check your internet connection and try again. 🔄";
    } finally {
      setIsLoading(false);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    const currentMessage = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponseContent = await generateAIResponse(currentMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponseContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="shadow-elegant h-[600px] flex flex-col animate-fade-in relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse opacity-50" />
      
      <CardHeader className="gradient-primary text-primary-foreground relative">
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-bounce text-yellow-300" />
          </div>
          <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent font-bold">
            Gemini AI Assistant
          </span>
          <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
          
          <div className="ml-auto flex gap-2">
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            )}
            {isSpeaking ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
                className="text-primary-foreground hover:bg-white/20 transition-all hover:scale-110"
              >
                <VolumeX className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakMessage(messages[messages.length - 1]?.content || '')}
                className="text-primary-foreground hover:bg-white/20 transition-all hover:scale-110"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 relative">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.type === 'assistant' && (
                  <Avatar className="w-8 h-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg transition-all hover:scale-[1.02] ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto shadow-lg border border-primary/20'
                      : 'bg-gradient-to-br from-muted to-muted/50 shadow-md border border-border/20 hover:shadow-lg'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.type === 'assistant' && (
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    )}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 ring-2 ring-accent/20 hover:ring-accent/40 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {(isTyping || isLoading) && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <Avatar className="w-8 h-8 ring-2 ring-primary/20 animate-pulse">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-br from-muted to-muted/50 p-4 rounded-lg shadow-md border border-border/20">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isLoading ? 'Gemini is thinking...' : 'Typing...'}
                    </span>
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-gradient-to-r from-background/50 to-muted/30">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="✨ Ask me anything about your survey data..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1 border-primary/20 focus:border-primary/40 transition-all bg-background/80"
              disabled={isTyping || isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isTyping || isLoading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary" />
            Powered by Google Gemini AI
          </p>
        </div>
      </CardContent>
    </Card>
  );
};