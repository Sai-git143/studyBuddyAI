import { API_CONFIG } from '../config/api';
import { openaiService } from './openaiService';
import { elevenLabsService } from './elevenLabsService';

export interface LiveTutoringSession {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  startTime: Date;
  isActive: boolean;
  participants: string[];
}

export interface RealTimeContent {
  id: string;
  type: 'explanation' | 'example' | 'practice' | 'quiz' | 'visual';
  content: string;
  metadata: {
    difficulty: number;
    estimatedTime: number;
    prerequisites: string[];
    learningObjectives: string[];
  };
  interactive: boolean;
  timestamp: Date;
}

export interface LiveFeedback {
  understanding: number; // 0-100
  engagement: number; // 0-100
  confusion_points: string[];
  suggested_actions: string[];
  next_topics: string[];
}

class RealTimeTutoringService {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private contentQueue: RealTimeContent[] = [];
  private feedbackCallbacks: ((feedback: LiveFeedback) => void)[] = [];

  async startLiveTutoringSession(
    subject: string,
    topic: string,
    userLevel: string,
    learningStyle: string
  ): Promise<LiveTutoringSession> {
    try {
      // Initialize WebSocket connection for real-time communication
      await this.initializeWebSocket();

      const session: LiveTutoringSession = {
        id: `session_${Date.now()}`,
        subject,
        topic,
        difficulty: userLevel as any,
        duration: 0,
        startTime: new Date(),
        isActive: true,
        participants: ['user']
      };

      this.sessionId = session.id;

      // Generate initial content based on topic
      await this.generateInitialContent(subject, topic, userLevel, learningStyle);

      console.log('Live tutoring session started:', session);
      return session;
    } catch (error) {
      console.error('Failed to start tutoring session:', error);
      throw error;
    }
  }

  private async initializeWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // In production, this would connect to your real-time server
        // For demo, we'll simulate WebSocket behavior
        this.ws = {
          send: (data: string) => {
            console.log('WebSocket send:', data);
            // Simulate server response
            setTimeout(() => {
              this.handleWebSocketMessage({
                data: JSON.stringify({
                  type: 'content_update',
                  content: this.generateMockContent()
                })
              } as MessageEvent);
            }, 1000);
          },
          close: () => console.log('WebSocket closed'),
          addEventListener: (event: string, callback: Function) => {
            if (event === 'message') {
              this.handleWebSocketMessage = callback as any;
            }
          }
        } as any;

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'content_update':
          this.contentQueue.push(data.content);
          break;
        case 'feedback':
          this.feedbackCallbacks.forEach(callback => callback(data.feedback));
          break;
        case 'session_update':
          console.log('Session update:', data);
          break;
      }
    } catch (error) {
      console.error('WebSocket message handling error:', error);
    }
  };

  async generateRealTimeContent(
    userInput: string,
    currentUnderstanding: number,
    emotionalState: string
  ): Promise<RealTimeContent> {
    try {
      // Analyze user input and current state
      const contentType = this.determineContentType(userInput, currentUnderstanding);
      
      // Generate personalized content using AI
      const prompt = this.createContentPrompt(userInput, contentType, emotionalState);
      const generatedContent = await openaiService.chatCompletion({
        messages: [
          {
            role: 'system',
            content: 'You are an expert tutor creating real-time educational content. Provide clear, engaging explanations adapted to the user\'s current understanding level and emotional state.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const content: RealTimeContent = {
        id: `content_${Date.now()}`,
        type: contentType,
        content: generatedContent,
        metadata: {
          difficulty: this.calculateDifficulty(currentUnderstanding),
          estimatedTime: this.estimateContentTime(generatedContent),
          prerequisites: this.extractPrerequisites(userInput),
          learningObjectives: this.generateLearningObjectives(userInput)
        },
        interactive: contentType === 'practice' || contentType === 'quiz',
        timestamp: new Date()
      };

      return content;
    } catch (error) {
      console.error('Real-time content generation failed:', error);
      throw error;
    }
  }

  async provideLiveFeedback(
    userResponse: string,
    timeSpent: number,
    interactionData: any
  ): Promise<LiveFeedback> {
    try {
      // Analyze user response and interaction patterns
      const understanding = this.analyzeUnderstanding(userResponse, interactionData);
      const engagement = this.analyzeEngagement(timeSpent, interactionData);
      
      // Generate personalized feedback
      const feedback: LiveFeedback = {
        understanding,
        engagement,
        confusion_points: this.identifyConfusionPoints(userResponse),
        suggested_actions: this.generateSuggestedActions(understanding, engagement),
        next_topics: this.recommendNextTopics(understanding, userResponse)
      };

      // Send feedback through WebSocket
      if (this.ws) {
        this.ws.send(JSON.stringify({
          type: 'feedback_update',
          sessionId: this.sessionId,
          feedback
        }));
      }

      return feedback;
    } catch (error) {
      console.error('Live feedback generation failed:', error);
      throw error;
    }
  }

  async generateInteractiveProblem(
    topic: string,
    difficulty: number,
    userWeaknesses: string[]
  ): Promise<any> {
    try {
      const prompt = `Create an interactive problem for ${topic} at difficulty level ${difficulty}/10. 
      Focus on these weak areas: ${userWeaknesses.join(', ')}.
      Include: question, multiple choice options, correct answer, detailed explanation, and hints.
      Format as JSON.`;

      const problemData = await openaiService.chatCompletion({
        messages: [
          {
            role: 'system',
            content: 'You are an expert problem creator. Generate engaging, educational problems with clear explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return JSON.parse(problemData);
    } catch (error) {
      console.error('Interactive problem generation failed:', error);
      return this.getFallbackProblem(topic);
    }
  }

  async generateVisualExplanation(concept: string): Promise<{
    description: string;
    visualType: 'diagram' | 'chart' | 'animation' | 'interactive';
    instructions: string;
  }> {
    try {
      const prompt = `Create a visual explanation for the concept: ${concept}.
      Describe what visual aid would be most effective and provide detailed instructions for creating it.
      Consider diagrams, charts, animations, or interactive elements.`;

      const visualData = await openaiService.chatCompletion({
        messages: [
          {
            role: 'system',
            content: 'You are an expert in educational visualization. Create clear, effective visual learning aids.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Parse the response to extract visual information
      return {
        description: visualData,
        visualType: 'diagram',
        instructions: visualData
      };
    } catch (error) {
      console.error('Visual explanation generation failed:', error);
      throw error;
    }
  }

  async adaptContentDifficulty(
    currentContent: RealTimeContent,
    userPerformance: number,
    timeSpent: number
  ): Promise<RealTimeContent> {
    try {
      let newDifficulty = currentContent.metadata.difficulty;
      
      // Adjust difficulty based on performance
      if (userPerformance > 80 && timeSpent < currentContent.metadata.estimatedTime) {
        newDifficulty = Math.min(10, newDifficulty + 1);
      } else if (userPerformance < 60 || timeSpent > currentContent.metadata.estimatedTime * 1.5) {
        newDifficulty = Math.max(1, newDifficulty - 1);
      }

      // Generate adapted content
      const adaptedContent = await this.generateRealTimeContent(
        `Adapt this content to difficulty level ${newDifficulty}: ${currentContent.content}`,
        userPerformance,
        'calm'
      );

      return {
        ...adaptedContent,
        metadata: {
          ...adaptedContent.metadata,
          difficulty: newDifficulty
        }
      };
    } catch (error) {
      console.error('Content adaptation failed:', error);
      return currentContent;
    }
  }

  // Helper methods
  private determineContentType(
    userInput: string,
    understanding: number
  ): RealTimeContent['type'] {
    if (userInput.includes('example') || userInput.includes('show me')) {
      return 'example';
    } else if (userInput.includes('practice') || userInput.includes('try')) {
      return 'practice';
    } else if (userInput.includes('quiz') || userInput.includes('test')) {
      return 'quiz';
    } else if (understanding < 50) {
      return 'explanation';
    } else {
      return 'example';
    }
  }

  private createContentPrompt(
    userInput: string,
    contentType: string,
    emotionalState: string
  ): string {
    const emotionalAdaptation = {
      frustrated: 'Be extra patient and break things down into very simple steps.',
      anxious: 'Provide reassurance and go slowly with clear explanations.',
      excited: 'Match their energy with engaging examples and challenges.',
      confident: 'Provide appropriately challenging content.',
      calm: 'Maintain a steady, clear teaching pace.'
    };

    return `User input: "${userInput}"
    Content type needed: ${contentType}
    User emotional state: ${emotionalState}
    
    Adaptation instruction: ${emotionalAdaptation[emotionalState as keyof typeof emotionalAdaptation]}
    
    Create ${contentType} content that directly addresses their input while adapting to their emotional state.`;
  }

  private calculateDifficulty(understanding: number): number {
    return Math.max(1, Math.min(10, Math.floor(understanding / 10) + 1));
  }

  private estimateContentTime(content: string): number {
    // Estimate reading/completion time based on content length and complexity
    const wordCount = content.split(' ').length;
    return Math.max(2, Math.floor(wordCount / 50)); // ~50 words per minute
  }

  private extractPrerequisites(userInput: string): string[] {
    // Analyze input to determine prerequisites
    return ['Basic understanding of the topic'];
  }

  private generateLearningObjectives(userInput: string): string[] {
    return [
      'Understand the core concept',
      'Apply knowledge to examples',
      'Solve related problems'
    ];
  }

  private analyzeUnderstanding(userResponse: string, interactionData: any): number {
    // Analyze response quality, time taken, etc.
    const responseLength = userResponse.length;
    const hasKeywords = userResponse.includes('understand') || userResponse.includes('clear');
    
    let score = 50; // Base score
    if (responseLength > 50) score += 20;
    if (hasKeywords) score += 20;
    if (interactionData.timeSpent < 30) score += 10;
    
    return Math.min(100, score);
  }

  private analyzeEngagement(timeSpent: number, interactionData: any): number {
    // Analyze engagement based on interaction patterns
    const expectedTime = 60; // seconds
    const ratio = timeSpent / expectedTime;
    
    if (ratio > 0.5 && ratio < 2) return 80; // Good engagement
    if (ratio < 0.5) return 40; // Too fast, might not be engaged
    return 60; // Took too long, might be struggling
  }

  private identifyConfusionPoints(userResponse: string): string[] {
    const confusionIndicators = ['confused', 'don\'t understand', 'unclear', 'help'];
    const points: string[] = [];
    
    confusionIndicators.forEach(indicator => {
      if (userResponse.toLowerCase().includes(indicator)) {
        points.push(`User expressed confusion about the concept`);
      }
    });
    
    return points;
  }

  private generateSuggestedActions(understanding: number, engagement: number): string[] {
    const actions: string[] = [];
    
    if (understanding < 60) {
      actions.push('Provide additional examples');
      actions.push('Break down the concept further');
    }
    
    if (engagement < 60) {
      actions.push('Add interactive elements');
      actions.push('Change teaching approach');
    }
    
    if (understanding > 80 && engagement > 80) {
      actions.push('Introduce more challenging concepts');
      actions.push('Provide advanced applications');
    }
    
    return actions;
  }

  private recommendNextTopics(understanding: number, userResponse: string): string[] {
    if (understanding > 75) {
      return ['Advanced applications', 'Related concepts', 'Practice problems'];
    } else {
      return ['Review fundamentals', 'Additional examples', 'Simplified explanations'];
    }
  }

  private generateMockContent(): RealTimeContent {
    return {
      id: `mock_${Date.now()}`,
      type: 'explanation',
      content: 'This is real-time generated content based on your learning progress.',
      metadata: {
        difficulty: 5,
        estimatedTime: 3,
        prerequisites: ['Basic knowledge'],
        learningObjectives: ['Understand concept']
      },
      interactive: false,
      timestamp: new Date()
    };
  }

  private getFallbackProblem(topic: string): any {
    return {
      question: `Practice problem for ${topic}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'This is the correct answer because...',
      hints: ['Think about the basic principles', 'Consider the examples we discussed']
    };
  }

  private async generateInitialContent(
    subject: string,
    topic: string,
    userLevel: string,
    learningStyle: string
  ): Promise<void> {
    try {
      const initialContent = await this.generateRealTimeContent(
        `Start teaching ${topic} in ${subject} for a ${userLevel} level student with ${learningStyle} learning style`,
        50, // Assume moderate understanding to start
        'calm'
      );
      
      this.contentQueue.push(initialContent);
    } catch (error) {
      console.error('Failed to generate initial content:', error);
    }
  }

  // Public methods for external access
  onFeedback(callback: (feedback: LiveFeedback) => void): void {
    this.feedbackCallbacks.push(callback);
  }

  getNextContent(): RealTimeContent | null {
    return this.contentQueue.shift() || null;
  }

  endSession(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = null;
    this.contentQueue = [];
    this.feedbackCallbacks = [];
  }
}

export const realTimeTutoringService = new RealTimeTutoringService();