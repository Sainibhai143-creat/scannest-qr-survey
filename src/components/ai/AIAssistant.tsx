import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Volume2, VolumeX } from "lucide-react";
import { SurveyData } from "@/types/survey";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${surveyData.name}! I'm your Scannest AI Assistant. I can help you understand your household survey data and provide useful insights. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple AI responses based on survey data
    if (lowerMessage.includes('appliance') || lowerMessage.includes('energy')) {
      const appliances = surveyData.appliances || {};
      const totalAppliances = Object.entries(appliances).reduce((sum, [key, value]) => {
        if (key !== 'others' && typeof value === 'number') {
          return sum + value;
        }
        return sum;
      }, 0);
      
      return `You have ${totalAppliances} appliances recorded in your survey. Here are some energy-saving tips: 
      1. Use LED bulbs instead of regular bulbs
      2. Set your AC to 24°C for optimal energy efficiency
      3. Unplug appliances when not in use
      4. Consider using a power strip to easily turn off multiple devices`;
    }
    
    if (lowerMessage.includes('family') || lowerMessage.includes('member')) {
      return `Your family has ${surveyData.familyMembers?.total || 0} members (${surveyData.familyMembers?.male || 0} male, ${surveyData.familyMembers?.female || 0} female). This information helps us understand your household size for various government schemes and services.`;
    }
    
    if (lowerMessage.includes('health') || lowerMessage.includes('insurance')) {
      return `Based on your health information: 
      - Disability status: ${surveyData.hasDisability ? 'Yes' : 'No'}
      - Health insurance: ${surveyData.hasHealthInsurance ? 'Yes' : 'No'}
      ${surveyData.hasHealthInsurance ? '' : 'Consider getting health insurance for better healthcare coverage.'}`;
    }
    
    if (lowerMessage.includes('house') || lowerMessage.includes('property')) {
      return `Your property details show House No. ${surveyData.houseNumber} with ${surveyData.ownership} ownership. This information is important for property-related government schemes and tax calculations.`;
    }
    
    if (lowerMessage.includes('income') || lowerMessage.includes('job')) {
      let response = `Your income source is listed as ${surveyData.incomeSource}. `;
      if (surveyData.incomeSource === 'governmentJob' && surveyData.governmentJobDetails) {
        response += `You work in ${surveyData.governmentJobDetails.department} as ${surveyData.governmentJobDetails.designation}. This qualifies you for various government employee benefits.`;
      } else {
        response += 'This information helps determine eligibility for various financial schemes and programs.';
      }
      return response;
    }
    
    // Default responses
    const defaultResponses = [
      "That's an interesting question! Based on your survey data, I can help you with information about your household appliances, family details, or health insurance status.",
      "I'm here to help you understand your survey data better. You can ask me about energy savings, government schemes, or any specific details from your survey.",
      "Feel free to ask me about your household information, appliances, or how your data might be relevant for various services and schemes."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Card className="shadow-elegant h-[600px] flex flex-col">
      <CardHeader className="gradient-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Assistant
          <div className="ml-auto flex gap-2">
            {isSpeaking ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
                className="text-primary-foreground hover:bg-white/20"
              >
                <VolumeX className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakMessage(messages[messages.length - 1]?.content || '')}
                className="text-primary-foreground hover:bg-white/20"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your survey data..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};