import { API_CONFIG, getAuthHeaders } from '../config/api';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface LearningContext {
  subject: string;
  currentTopic: string;
  userLevel: string;
  emotionalState: string;
  learningStyle: string;
  strugglingAreas: string[];
  strongAreas: string[];
}

export interface ContentGenerationRequest {
  type: 'explanation' | 'example' | 'practice' | 'quiz' | 'visual';
  topic: string;
  difficulty: number;
  userContext: LearningContext;
  previousContent?: string;
}

class OpenAIService {
  private baseUrl = API_CONFIG.OPENAI.BASE_URL;
  private apiKey = API_CONFIG.OPENAI.API_KEY;

  async chatCompletion(request: ChatCompletionRequest): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || 'gpt-4',
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 1000,
          stream: request.stream || false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('OpenAI chat completion error:', error);
      
      // Provide fallback response
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or missing. Please check your configuration.');
      }
      
      throw error;
    }
  }

  async generateTutorResponse(
    userMessage: string, 
    context: LearningContext
  ): Promise<string> {
    const systemPrompt = this.createSystemPrompt(context);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    return await this.chatCompletion({ 
      messages,
      temperature: 0.8, // Slightly higher for more engaging responses
      max_tokens: 800
    });
  }

  async generateRealTimeContent(request: ContentGenerationRequest): Promise<string> {
    const prompt = this.createContentPrompt(request);
    
    const messages: ChatMessage[] = [
      { 
        role: 'system', 
        content: 'You are an expert AI tutor creating real-time educational content. Provide clear, engaging, and adaptive explanations that match the user\'s learning style and emotional state.' 
      },
      { role: 'user', content: prompt }
    ];

    return await this.chatCompletion({ 
      messages,
      temperature: 0.7,
      max_tokens: 1200
    });
  }

  async generatePracticeProblems(
    subject: string, 
    topic: string, 
    difficulty: string, 
    count: number = 5,
    userWeaknesses: string[] = []
  ): Promise<any[]> {
    const weaknessContext = userWeaknesses.length > 0 
      ? `Focus on these areas where the user struggles: ${userWeaknesses.join(', ')}.`
      : '';

    const prompt = `Generate ${count} practice problems for ${subject} on the topic of ${topic} at ${difficulty} level. 
    ${weaknessContext}
    
    Format as a JSON array with objects containing:
    - question: string
    - options: array of 4 strings
    - correctAnswer: string (must match one of the options exactly)
    - explanation: string (detailed explanation of why the answer is correct)
    - difficulty: string
    - hints: array of 2-3 helpful hints
    
    Make the problems engaging and educational. Ensure explanations are clear and help reinforce learning.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are an expert educator creating practice problems. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.chatCompletion({ 
        messages,
        temperature: 0.6,
        max_tokens: 2000
      });
      
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate practice problems:', error);
      // Return fallback problems
      return this.getFallbackProblems(subject, topic, count);
    }
  }

  async generateLearningInsights(
    sessionData: any,
    userProgress: any,
    emotionalState: string
  ): Promise<string[]> {
    const prompt = `Based on this learning session data: ${JSON.stringify(sessionData)} 
    and user progress: ${JSON.stringify(userProgress)}, 
    and current emotional state: ${emotionalState},
    
    Generate 4-5 personalized learning insights and recommendations. 
    Make them encouraging, specific, and actionable.
    
    Format as a simple array of strings, each insight being one complete sentence.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are an AI learning analyst providing personalized insights. Be encouraging and specific.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.chatCompletion({ 
        messages,
        temperature: 0.7,
        max_tokens: 600
      });
      
      // Parse insights from response
      const insights = response.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 10);
      
      return insights.slice(0, 5);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return this.getFallbackInsights(emotionalState);
    }
  }

  async generateVisualExplanation(concept: string, learningStyle: string): Promise<{
    description: string;
    visualType: 'diagram' | 'chart' | 'animation' | 'interactive';
    instructions: string;
    elements: string[];
  }> {
    const prompt = `Create a visual explanation for the concept: "${concept}" 
    optimized for a ${learningStyle} learner.
    
    Provide:
    1. A clear description of what visual aid would be most effective
    2. The type of visual (diagram, chart, animation, or interactive)
    3. Step-by-step instructions for creating or understanding the visual
    4. Key visual elements that should be highlighted
    
    Format as JSON with: description, visualType, instructions, elements (array)`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are an expert in educational visualization. Create clear, effective visual learning aids.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.chatCompletion({ 
        messages,
        temperature: 0.6,
        max_tokens: 800
      });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate visual explanation:', error);
      return {
        description: `A visual representation would help explain ${concept} more clearly.`,
        visualType: 'diagram',
        instructions: `Create a simple diagram showing the key components of ${concept}.`,
        elements: ['Main concept', 'Key relationships', 'Examples']
      };
    }
  }

  async adaptContentDifficulty(
    originalContent: string,
    userPerformance: number,
    timeSpent: number,
    targetDifficulty: number
  ): Promise<string> {
    const adaptationDirection = targetDifficulty > 5 ? 'increase' : 'decrease';
    
    const prompt = `Adapt this educational content to ${adaptationDirection} difficulty:
    
    Original content: "${originalContent}"
    User performance: ${userPerformance}%
    Time spent: ${timeSpent} minutes
    Target difficulty: ${targetDifficulty}/10
    
    ${adaptationDirection === 'increase' 
      ? 'Make the content more challenging with advanced concepts, complex examples, and deeper analysis.'
      : 'Simplify the content with clearer explanations, basic examples, and step-by-step breakdowns.'
    }
    
    Keep the core learning objectives but adjust the complexity appropriately.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are an expert educator adapting content difficulty. Maintain educational value while adjusting complexity.' },
      { role: 'user', content: prompt }
    ];

    return await this.chatCompletion({ 
      messages,
      temperature: 0.6,
      max_tokens: 1000
    });
  }

  async generateStudyPlan(
    subject: string,
    currentLevel: string,
    goals: string[],
    timeAvailable: number,
    weakAreas: string[]
  ): Promise<any> {
    const prompt = `Create a personalized study plan for:
    
    Subject: ${subject}
    Current Level: ${currentLevel}
    Goals: ${goals.join(', ')}
    Time Available: ${timeAvailable} minutes per day
    Weak Areas: ${weakAreas.join(', ')}
    
    Generate a structured study plan with:
    - Daily topics and activities
    - Time allocation for each activity
    - Progressive difficulty increase
    - Regular review sessions
    - Milestone checkpoints
    
    Format as JSON with a clear structure.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are an expert study planner creating personalized learning schedules.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.chatCompletion({ 
        messages,
        temperature: 0.5,
        max_tokens: 1500
      });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      return this.getFallbackStudyPlan(subject, timeAvailable);
    }
  }

  private createSystemPrompt(context: LearningContext): string {
    return `You are StudyBuddy AI, an empathetic and intelligent tutor powered by OpenAI. 

Current Context:
- Subject: ${context.subject}
- Topic: ${context.currentTopic}
- User Level: ${context.userLevel}
- Emotional State: ${context.emotionalState}
- Learning Style: ${context.learningStyle}
- Struggling Areas: ${context.strugglingAreas.join(', ')}
- Strong Areas: ${context.strongAreas.join(', ')}

Guidelines:
1. Adapt your teaching style to the user's emotional state and learning preferences
2. Use their preferred learning style (visual, auditory, kinesthetic, reading)
3. Be encouraging, supportive, and patient
4. Break down complex concepts into manageable pieces
5. Provide relevant examples and analogies
6. Check for understanding before moving forward
7. Celebrate progress and achievements
8. Use real-time adaptive teaching methods

Emotional Adaptations:
- Calm: Maintain steady, clear explanations with good pacing
- Excited: Match their energy with enthusiasm while staying focused
- Frustrated: Be extra patient, break things down more, offer encouragement
- Confident: Challenge them appropriately with advanced concepts
- Anxious: Provide reassurance, go slower, emphasize that mistakes are normal

Learning Style Adaptations:
- Visual: Use descriptions of diagrams, charts, and visual metaphors
- Auditory: Use verbal explanations, discussions, and sound-based analogies
- Kinesthetic: Suggest hands-on activities and physical demonstrations
- Reading: Provide detailed written explanations and text-based examples

Respond as a caring, knowledgeable tutor who genuinely wants to help the student succeed.`;
  }

  private createContentPrompt(request: ContentGenerationRequest): string {
    const { type, topic, difficulty, userContext, previousContent } = request;
    
    const contextInfo = `
    User Context:
    - Subject: ${userContext.subject}
    - Current Topic: ${topic}
    - Difficulty Level: ${difficulty}/10
    - Learning Style: ${userContext.learningStyle}
    - Emotional State: ${userContext.emotionalState}
    - Weak Areas: ${userContext.strugglingAreas.join(', ')}
    `;

    const previousContentInfo = previousContent 
      ? `\nPrevious Content: ${previousContent}\n(Build upon this or provide a different perspective)`
      : '';

    const typeInstructions = {
      explanation: 'Provide a clear, comprehensive explanation of the concept. Use analogies and examples.',
      example: 'Give a detailed, practical example that illustrates the concept in action.',
      practice: 'Create a practice exercise or problem for the user to work through.',
      quiz: 'Generate quiz questions to test understanding of the concept.',
      visual: 'Describe a visual representation that would help explain this concept.'
    };

    return `${contextInfo}${previousContentInfo}

Content Type: ${type}
Instructions: ${typeInstructions[type]}

Create engaging, educational content that matches the user's learning style and emotional state. 
Make it appropriate for difficulty level ${difficulty}/10.`;
  }

  private getFallbackProblems(subject: string, topic: string, count: number): any[] {
    const problems = [];
    for (let i = 0; i < count; i++) {
      problems.push({
        question: `Practice problem ${i + 1} for ${topic} in ${subject}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: `This is the correct answer because it demonstrates the key principles of ${topic}.`,
        difficulty: 'medium',
        hints: ['Consider the fundamental concepts', 'Think about the examples we discussed']
      });
    }
    return problems;
  }

  private getFallbackInsights(emotionalState: string): string[] {
    const baseInsights = [
      'Your consistent study schedule is building strong learning habits.',
      'Focus on practicing the areas where you feel less confident.',
      'Your progress shows steady improvement - keep up the great work!'
    ];

    const emotionalInsights = {
      frustrated: 'Remember that feeling challenged is part of the learning process - you\'re growing!',
      anxious: 'Take breaks when needed and remember that learning takes time.',
      excited: 'Channel your enthusiasm into tackling more challenging concepts!',
      confident: 'Your confidence is well-earned - ready for the next level?',
      calm: 'Your focused approach to learning is very effective.'
    };

    return [
      ...baseInsights,
      emotionalInsights[emotionalState as keyof typeof emotionalInsights] || emotionalInsights.calm
    ];
  }

  private getFallbackStudyPlan(subject: string, timeAvailable: number): any {
    return {
      title: `${subject} Study Plan`,
      dailyTime: timeAvailable,
      weeks: [
        {
          week: 1,
          focus: 'Foundation Building',
          dailyActivities: [
            { activity: 'Review basics', time: Math.floor(timeAvailable * 0.4) },
            { activity: 'Practice problems', time: Math.floor(timeAvailable * 0.4) },
            { activity: 'Reflection', time: Math.floor(timeAvailable * 0.2) }
          ]
        }
      ]
    };
  }
}

export const openaiService = new OpenAIService();