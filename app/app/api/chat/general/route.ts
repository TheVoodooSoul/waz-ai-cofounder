
import { NextRequest } from 'next/server';
import { getAuth } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { AgentType } from '../../../../lib/types';
import { getAgentSystemPrompt } from '../../../../lib/agents';

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages, conversationId, projectId } = await req.json();

    // Get user preferences for personalization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true, learningData: true }
    });

    const systemPrompt = getAgentSystemPrompt(AgentType.GENERAL, user?.preferences);

    // Prepare messages for LLM
    const llmMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: llmMessages,
        stream: true,
        max_tokens: 3000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error('LLM API request failed');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let fullResponse = '';

        try {
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
                  // Save conversation to database
                  await saveConversation(
                    session.user.id, 
                    conversationId, 
                    projectId, 
                    AgentType.GENERAL,
                    [...messages, { role: 'assistant', content: fullResponse }]
                  );
                  return;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('General Waz API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function saveConversation(
  userId: string,
  conversationId: string | null,
  projectId: string | null,
  agentType: AgentType,
  messages: any[]
) {
  try {
    if (conversationId) {
      // Update existing conversation
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { 
          messages: messages,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new conversation
      await prisma.conversation.create({
        data: {
          userId,
          projectId,
          agentType,
          messages: messages,
          title: `General Discussion - ${new Date().toLocaleDateString()}`
        }
      });
    }
  } catch (error) {
    console.error('Failed to save conversation:', error);
  }
}
