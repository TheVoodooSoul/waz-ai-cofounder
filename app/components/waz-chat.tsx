
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Send, Loader2, Zap, Brain, TrendingUp, Palette, MessageCircle } from 'lucide-react';
import { AgentType } from '../lib/types';
import { agentPersonalities } from '../lib/agents';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface WazChatProps {
  agentType: AgentType;
  projectId?: string | null;
  conversationId?: string | null;
}

const agentIcons = {
  [AgentType.TECHNICAL]: Zap,
  [AgentType.BUSINESS]: Brain,
  [AgentType.TREND]: TrendingUp,
  [AgentType.CREATIVE]: Palette,
  [AgentType.GENERAL]: MessageCircle,
};

const agentColors = {
  [AgentType.TECHNICAL]: 'bg-blue-500',
  [AgentType.BUSINESS]: 'bg-green-500',
  [AgentType.TREND]: 'bg-purple-500',
  [AgentType.CREATIVE]: 'bg-pink-500',
  [AgentType.GENERAL]: 'bg-indigo-500',
};

export function WazChat({ agentType, projectId, conversationId }: WazChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const agent = agentPersonalities[agentType];
  const AgentIcon = agentIcons[agentType];

  useEffect(() => {
    // Add agent greeting when component mounts
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: agent.greeting,
        timestamp: new Date()
      }]);
    }
  }, [agent.greeting, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getApiEndpoint = (agentType: AgentType): string => {
    switch (agentType) {
      case AgentType.TECHNICAL:
        return '/api/chat/technical';
      case AgentType.BUSINESS:
        return '/api/chat/business';
      case AgentType.TREND:
        return '/api/chat/trend';
      case AgentType.CREATIVE:
        return '/api/chat/creative';
      case AgentType.GENERAL:
        return '/api/chat/general';
      default:
        return '/api/chat/general';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(getApiEndpoint(agentType), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          conversationId,
          projectId
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      let partialRead = '';
      while (true) {
        const { done, value } = await reader?.read() ?? { done: true, value: undefined };
        if (done) break;

        partialRead += decoder.decode(value, { stream: true });
        let lines = partialRead.split('\n');
        partialRead = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage.content += parsed.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...assistantMessage };
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again!',
          timestamp: new Date()
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${agentColors[agentType]}`}>
            <AgentIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.description}</p>
          </div>
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {agent.expertise.slice(0, 4).map((skill: string) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.role === 'user' ? (
                        <AvatarFallback>You</AvatarFallback>
                      ) : (
                        <div className={`h-full w-full flex items-center justify-center ${agentColors[agentType]} rounded-full`}>
                          <AgentIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </Avatar>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <div className={`h-full w-full flex items-center justify-center ${agentColors[agentType]} rounded-full`}>
                      <AgentIcon className="h-4 w-4 text-white" />
                    </div>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 mt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Chat with ${agent.name}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
