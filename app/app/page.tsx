
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Zap, Brain, TrendingUp, Palette, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Waz
            </h1>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your AI Co-founder
            <br />
            <span className="text-muted-foreground">Collaboration Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Inspired by Steve Wozniak's zen wisdom and humor, Waz is your brilliant entrepreneurial partner who makes impossible challenges seem manageable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Collaborating
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-4">Meet Your AI Co-founder Team</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four specialized AI agents, each with unique expertise and personality, ready to help you succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              name: "Technical Waz",
              description: "Your zen coding master who makes complex architecture seem like child's play",
              color: "from-blue-500 to-blue-600",
              expertise: ["Architecture", "Code Review", "Tech Stack"]
            },
            {
              icon: Brain,
              name: "Business Waz",
              description: "The strategic mind who sees opportunity where others see obstacles",
              color: "from-green-500 to-green-600",
              expertise: ["Strategy", "Market Analysis", "Business Models"]
            },
            {
              icon: TrendingUp,
              name: "Trend Waz",
              description: "The pattern-reading prophet who spots tomorrow's opportunities today",
              color: "from-purple-500 to-purple-600",
              expertise: ["Market Timing", "Patterns", "Trading"]
            },
            {
              icon: Palette,
              name: "Creative Waz",
              description: "The visionary who turns imagination into innovation",
              color: "from-pink-500 to-pink-600",
              expertise: ["AI Film", "Art", "Innovation"]
            }
          ].map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${agent.color} w-fit mb-3`}>
                    <agent.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {agent.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Start Building?</h3>
            <p className="text-muted-foreground mb-8">
              Join entrepreneurs who are already collaborating with Waz to build the future.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started for Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
