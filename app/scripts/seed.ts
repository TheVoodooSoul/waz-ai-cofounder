
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test user (required for testing)
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      companyName: 'Tech Innovations Inc',
      focusArea: 'AI & Technology',
      preferences: {
        communicationStyle: 'collaborative',
        humorLevel: 'high',
        technicalDepth: 'detailed',
        preferredProjects: ['AI', 'Web Apps', 'Trading']
      },
      learningData: {
        sessions: 0,
        preferences: {},
        patterns: {},
        successfulCollaborations: 0
      }
    },
  });

  // Create some sample projects
  const aiFilmProject = await prisma.project.create({
    data: {
      name: 'AI Film Generation Platform',
      description: 'Revolutionary platform for generating cinematic content using AI',
      category: 'AI Film',
      status: 'ACTIVE',
      goals: [
        'Build AI-powered script generation',
        'Implement video synthesis pipeline',
        'Create user-friendly interface',
        'Launch beta version'
      ],
      milestones: {
        planning: { completed: true, date: new Date('2024-01-15') },
        mvp: { completed: false, target: new Date('2024-03-01') },
        beta: { completed: false, target: new Date('2024-04-15') },
        launch: { completed: false, target: new Date('2024-06-01') }
      },
      userId: testUser.id,
    },
  });

  const tradingAppProject = await prisma.project.create({
    data: {
      name: 'Smart Trading Assistant',
      description: 'AI-powered day trading application with market analysis',
      category: 'Trading App',
      status: 'ACTIVE',
      goals: [
        'Implement real-time market data feeds',
        'Build pattern recognition algorithms',
        'Create risk management system',
        'Develop mobile interface'
      ],
      milestones: {
        research: { completed: true, date: new Date('2024-01-20') },
        prototype: { completed: true, date: new Date('2024-02-10') },
        testing: { completed: false, target: new Date('2024-03-15') },
        release: { completed: false, target: new Date('2024-05-01') }
      },
      userId: testUser.id,
    },
  });

  // Create sample conversations
  await prisma.conversation.create({
    data: {
      title: 'Technical Architecture Discussion',
      agentType: 'TECHNICAL',
      messages: [
        {
          role: 'assistant',
          content: "Hey there, code warrior! 🧘‍♂️ Ready to turn some impossible technical challenges into elegant solutions? I've got all day and infinite patience!",
          timestamp: new Date('2024-02-15T10:00:00Z')
        },
        {
          role: 'user',
          content: 'I need help designing the architecture for an AI film generation platform. What would you recommend?',
          timestamp: new Date('2024-02-15T10:01:00Z')
        },
        {
          role: 'assistant',
          content: "Ah, an AI film platform! *adjusts zen coding posture* Now that's the kind of challenge that gets my circuits excited! 🎬\n\nLet me break this down into digestible pieces - like a good meal, architecture is best consumed thoughtfully:\n\n**Core Architecture Layers:**\n1. **Content Generation Pipeline** - Your AI brain center\n2. **Media Processing Engine** - The visual magic happens here\n3. **User Interface Layer** - Where creativity meets usability\n4. **Storage & CDN** - Because nobody likes buffering drama\n\n**My Zen Recommendation:**\nStart with a microservices approach using containers. Think of it like building with LEGO blocks - each service handles one thing brilliantly rather than trying to be a Swiss Army knife.\n\nFor the AI pipeline, I'd suggest:\n- **Script Generation**: GPT-4 for dialogue and story\n- **Image Generation**: DALL-E or Midjourney APIs\n- **Video Synthesis**: RunwayML or Stable Video Diffusion\n- **Audio**: ElevenLabs for voiceover\n\nWant me to dive deeper into any specific layer? The beauty of good architecture is that it grows with you rather than against you! 🌱",
          timestamp: new Date('2024-02-15T10:02:30Z')
        }
      ],
      userId: testUser.id,
      projectId: aiFilmProject.id,
    },
  });

  // Create some market insights
  await prisma.marketInsight.create({
    data: {
      title: 'AI Video Generation Market Surge',
      category: 'AI Trends',
      content: 'The AI video generation market is experiencing explosive growth with over 300% increase in investment funding in Q1 2024.',
      data: {
        marketSize: '$2.1B',
        growthRate: '45% YoY',
        keyPlayers: ['RunwayML', 'Pika Labs', 'Stable Video'],
        opportunities: ['Enterprise training videos', 'Social media content', 'Film pre-visualization']
      },
      confidence: 0.85,
      source: 'Market Analysis',
      tags: ['AI', 'Video', 'Investment', 'Growth'],
    },
  });

  // Create sample victory
  await prisma.victory.create({
    data: {
      title: 'Successful MVP Launch',
      description: 'Launched the first working prototype of the AI film platform',
      type: 'MILESTONE_COMPLETED',
      impact: 'Validated core concept and attracted first 100 beta users',
      metrics: {
        users: 100,
        retention: '85%',
        nps: 9.2,
        timeToComplete: '45 days'
      },
      celebration: {
        acknowledged: true,
        sharedPublicly: false,
        teamCelebration: 'Pizza party and code review session'
      },
      userId: testUser.id,
      projectId: aiFilmProject.id,
    },
  });

  // Create sample app concept
  await prisma.appConcept.create({
    data: {
      name: 'ZenTrader Pro',
      description: 'Mindful trading app that combines technical analysis with zen philosophy',
      category: 'Trading & Finance',
      targetMarket: 'Mindful investors and day traders seeking balance',
      businessModel: 'Freemium with premium analytics and zen coaching',
      techStack: ['React Native', 'Node.js', 'PostgreSQL', 'WebSockets', 'TensorFlow'],
      features: {
        core: ['Real-time market data', 'Pattern recognition', 'Risk management'],
        premium: ['AI predictions', 'Zen trading coaching', 'Advanced analytics'],
        social: ['Community insights', 'Mindful trading challenges']
      },
      analysis: {
        marketPotential: 'High - growing interest in mindful investing',
        competition: 'Medium - differentiated by zen approach',
        technicalFeasibility: 'High - proven technologies',
        timeToMarket: '6-8 months'
      },
      userId: testUser.id,
      status: 'EVALUATING',
    },
  });

  // Create agent knowledge entries
  const knowledgeEntries = [
    {
      agentType: 'TECHNICAL',
      domain: 'react_patterns',
      key: 'component_architecture',
      value: {
        bestPractices: ['Use functional components', 'Implement proper error boundaries', 'Optimize with React.memo'],
        antiPatterns: ['Deep prop drilling', 'Mutating props directly', 'Using array indexes as keys']
      },
      confidence: 0.95
    },
    {
      agentType: 'BUSINESS',
      domain: 'market_analysis',
      key: 'saas_metrics',
      value: {
        keyMetrics: ['CAC', 'LTV', 'Churn Rate', 'MRR', 'NPS'],
        benchmarks: { 'LTV/CAC': 3.0, 'Monthly Churn': '<5%', 'NPS': '>50' }
      },
      confidence: 0.90
    },
    {
      agentType: 'CREATIVE',
      domain: 'ai_film',
      key: 'generation_pipeline',
      value: {
        workflow: ['Script Generation', 'Storyboarding', 'Asset Creation', 'Video Synthesis', 'Post-processing'],
        tools: { script: 'GPT-4', visual: 'DALL-E 3', video: 'RunwayML', audio: 'ElevenLabs' }
      },
      confidence: 0.88
    }
  ];

  for (const entry of knowledgeEntries) {
    await prisma.agentKnowledge.create({
      data: entry as any,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('Test account created: john@doe.com / johndoe123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
