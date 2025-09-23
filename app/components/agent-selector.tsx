
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, Brain, TrendingUp, Palette, MessageCircle } from 'lucide-react';
import { AgentType } from '../lib/types';
import { agentPersonalities } from '../lib/agents';
import { motion } from 'framer-motion';

interface AgentSelectorProps {
  onSelectAgent: (agentType: AgentType) => void;
  selectedAgent?: AgentType;
}

const agentIcons = {
  [AgentType.TECHNICAL]: Zap,
  [AgentType.BUSINESS]: Brain,
  [AgentType.TREND]: TrendingUp,
  [AgentType.CREATIVE]: Palette,
  [AgentType.GENERAL]: MessageCircle,
};

const agentColors = {
  [AgentType.TECHNICAL]: 'from-blue-500 to-blue-600',
  [AgentType.BUSINESS]: 'from-green-500 to-green-600',
  [AgentType.TREND]: 'from-purple-500 to-purple-600',
  [AgentType.CREATIVE]: 'from-pink-500 to-pink-600',
  [AgentType.GENERAL]: 'from-indigo-500 to-indigo-600',
};

export function AgentSelector({ onSelectAgent, selectedAgent }: AgentSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.values(AgentType).map((agentType, index) => {
        const agent = agentPersonalities[agentType];
        const AgentIcon = agentIcons[agentType];
        const isSelected = selectedAgent === agentType;

        return (
          <motion.div
            key={agentType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => onSelectAgent(agentType)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${agentColors[agentType]}`}>
                    <AgentIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {agent.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {agent.traits.map((trait: string) => (
                      <Badge key={trait} variant="outline" className="text-xs capitalize">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Specializes in:</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.expertise.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {agent.expertise.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{agent.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    className={`w-full ${isSelected ? 'bg-primary' : ''}`}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAgent(agentType);
                    }}
                  >
                    {isSelected ? 'Selected' : 'Chat with ' + agent.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
