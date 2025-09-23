
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { AuthGuard } from '../../components/auth-guard';
import { AgentSelector } from '../../components/agent-selector';
import { WazChat } from '../../components/waz-chat';
import { AgentType } from '../../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LogOut, User, Sparkles, Trophy, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);

  const handleAgentSelect = (agentType: AgentType) => {
    setSelectedAgent(agentType);
  };

  const handleBackToAgents = () => {
    setSelectedAgent(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Waz</h1>
                  <p className="text-xs text-muted-foreground">AI Co-founder Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Welcome, {session?.user?.name || 'Entrepreneur'}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {!selectedAgent ? (
              <motion.div
                key="agent-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Welcome Section */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Ready to collaborate?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                      Choose your AI co-founder based on what you're working on today. Each Waz agent brings unique expertise and that signature zen-with-humor approach that makes challenges feel manageable.
                    </p>
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12"
                  >
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Sparkles className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="font-semibold">AI Agents</div>
                        <div className="text-sm text-muted-foreground">5 Specialized</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Trophy className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <div className="font-semibold">Projects</div>
                        <div className="text-sm text-muted-foreground">Ready to Launch</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <BarChart3 className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                        <div className="font-semibold">Learning</div>
                        <div className="text-sm text-muted-foreground">Getting Smarter</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Agent Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-2xl font-semibold mb-6 text-center">Choose Your AI Co-founder</h3>
                  <AgentSelector onSelectAgent={handleAgentSelect} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="chat-interface"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <Button variant="outline" onClick={handleBackToAgents}>
                    ← Back to Agents
                  </Button>
                  <h2 className="text-xl font-semibold">Collaboration Session</h2>
                  <div></div>
                </div>
                <WazChat agentType={selectedAgent} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AuthGuard>
  );
}
