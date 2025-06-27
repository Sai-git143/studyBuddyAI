import { Course } from '../types/course';

export const courses: Course[] = [
  {
    id: 'prompt-engineering-mastery',
    title: 'Prompt Engineering Mastery',
    description: 'Master the art and science of prompt engineering for AI systems. Learn advanced techniques to get better results from ChatGPT, Claude, and other LLMs.',
    category: 'ai-ml',
    difficulty: 'intermediate',
    duration: '8 weeks',
    instructor: 'Dr. Sarah Chen',
    rating: 4.9,
    studentsEnrolled: 12847,
    price: 149,
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['Basic understanding of AI', 'Familiarity with ChatGPT or similar tools'],
    skills: ['Prompt Design', 'Chain-of-Thought', 'Few-Shot Learning', 'Prompt Optimization'],
    tags: ['AI', 'Prompt Engineering', 'LLM', 'ChatGPT', 'Claude'],
    isPopular: true,
    modules: [
      {
        id: 'fundamentals',
        title: 'Prompt Engineering Fundamentals',
        description: 'Learn the basics of how LLMs work and fundamental prompting techniques',
        duration: '2 weeks',
        lessons: [
          { id: 'intro-llms', title: 'Introduction to Large Language Models', type: 'video', duration: '45 min' },
          { id: 'basic-prompting', title: 'Basic Prompting Techniques', type: 'interactive', duration: '30 min' },
          { id: 'prompt-structure', title: 'Anatomy of Effective Prompts', type: 'text', duration: '20 min' },
          { id: 'quiz-fundamentals', title: 'Fundamentals Quiz', type: 'quiz', duration: '15 min' }
        ]
      },
      {
        id: 'advanced-techniques',
        title: 'Advanced Prompting Techniques',
        description: 'Master chain-of-thought, few-shot learning, and other advanced methods',
        duration: '3 weeks',
        lessons: [
          { id: 'chain-of-thought', title: 'Chain-of-Thought Prompting', type: 'video', duration: '50 min' },
          { id: 'few-shot-learning', title: 'Few-Shot and Zero-Shot Learning', type: 'interactive', duration: '40 min' },
          { id: 'role-prompting', title: 'Role-Based Prompting', type: 'text', duration: '25 min' },
          { id: 'prompt-chaining', title: 'Prompt Chaining Strategies', type: 'video', duration: '35 min' }
        ]
      },
      {
        id: 'optimization',
        title: 'Prompt Optimization & Testing',
        description: 'Learn to systematically improve and test your prompts',
        duration: '2 weeks',
        lessons: [
          { id: 'testing-methods', title: 'Prompt Testing Methodologies', type: 'video', duration: '40 min' },
          { id: 'optimization-tools', title: 'Tools for Prompt Optimization', type: 'interactive', duration: '45 min' },
          { id: 'final-project', title: 'Capstone Project', type: 'project', duration: '3 hours' }
        ]
      },
      {
        id: 'real-world-applications',
        title: 'Real-World Applications',
        description: 'Apply your skills to business and creative use cases',
        duration: '1 week',
        lessons: [
          { id: 'business-applications', title: 'Business Use Cases', type: 'video', duration: '30 min' },
          { id: 'creative-applications', title: 'Creative Applications', type: 'interactive', duration: '35 min' },
          { id: 'ethics-considerations', title: 'Ethics and Best Practices', type: 'text', duration: '20 min' }
        ]
      }
    ]
  },
  {
    id: 'llm-development-course',
    title: 'Large Language Model Development',
    description: 'Build, fine-tune, and deploy your own large language models. From transformer architecture to production deployment.',
    category: 'ai-ml',
    difficulty: 'advanced',
    duration: '12 weeks',
    instructor: 'Prof. Alex Rodriguez',
    rating: 4.8,
    studentsEnrolled: 8934,
    price: 299,
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['Python programming', 'Machine learning basics', 'Deep learning fundamentals'],
    skills: ['Transformer Architecture', 'Model Training', 'Fine-tuning', 'Model Deployment', 'PyTorch'],
    tags: ['LLM', 'Deep Learning', 'Transformers', 'PyTorch', 'Model Training'],
    isNew: true,
    modules: [
      {
        id: 'transformer-architecture',
        title: 'Transformer Architecture Deep Dive',
        description: 'Understand the architecture that powers modern LLMs',
        duration: '3 weeks',
        lessons: [
          { id: 'attention-mechanism', title: 'Attention Mechanism', type: 'video', duration: '60 min' },
          { id: 'self-attention', title: 'Self-Attention and Multi-Head Attention', type: 'interactive', duration: '45 min' },
          { id: 'positional-encoding', title: 'Positional Encoding', type: 'text', duration: '30 min' },
          { id: 'transformer-implementation', title: 'Implementing a Transformer', type: 'project', duration: '4 hours' }
        ]
      },
      {
        id: 'training-llms',
        title: 'Training Large Language Models',
        description: 'Learn the techniques and infrastructure for training LLMs',
        duration: '4 weeks',
        lessons: [
          { id: 'data-preparation', title: 'Data Preparation and Preprocessing', type: 'video', duration: '50 min' },
          { id: 'training-strategies', title: 'Training Strategies and Optimization', type: 'interactive', duration: '55 min' },
          { id: 'distributed-training', title: 'Distributed Training', type: 'text', duration: '40 min' },
          { id: 'training-project', title: 'Train Your Own Small LLM', type: 'project', duration: '6 hours' }
        ]
      },
      {
        id: 'fine-tuning',
        title: 'Fine-tuning and Adaptation',
        description: 'Customize pre-trained models for specific tasks',
        duration: '3 weeks',
        lessons: [
          { id: 'fine-tuning-basics', title: 'Fine-tuning Fundamentals', type: 'video', duration: '45 min' },
          { id: 'lora-adapters', title: 'LoRA and Parameter-Efficient Fine-tuning', type: 'interactive', duration: '50 min' },
          { id: 'instruction-tuning', title: 'Instruction Tuning', type: 'text', duration: '35 min' },
          { id: 'rlhf', title: 'Reinforcement Learning from Human Feedback', type: 'video', duration: '55 min' }
        ]
      },
      {
        id: 'deployment',
        title: 'Model Deployment and Optimization',
        description: 'Deploy and optimize LLMs for production use',
        duration: '2 weeks',
        lessons: [
          { id: 'model-optimization', title: 'Model Optimization Techniques', type: 'video', duration: '40 min' },
          { id: 'deployment-strategies', title: 'Deployment Strategies', type: 'interactive', duration: '45 min' },
          { id: 'scaling-inference', title: 'Scaling Inference', type: 'text', duration: '30 min' },
          { id: 'final-deployment', title: 'Deploy Your Model', type: 'project', duration: '5 hours' }
        ]
      }
    ]
  },
  {
    id: 'ai-ethics-governance',
    title: 'AI Ethics and Governance',
    description: 'Navigate the ethical landscape of AI development and deployment. Learn about bias, fairness, and responsible AI practices.',
    category: 'ai-ml',
    difficulty: 'beginner',
    duration: '6 weeks',
    instructor: 'Dr. Maya Patel',
    rating: 4.7,
    studentsEnrolled: 15623,
    price: 99,
    thumbnail: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['Basic understanding of AI'],
    skills: ['AI Ethics', 'Bias Detection', 'Fairness Metrics', 'Responsible AI', 'AI Governance'],
    tags: ['Ethics', 'AI Governance', 'Bias', 'Fairness', 'Responsible AI'],
    modules: [
      {
        id: 'ethics-foundations',
        title: 'Foundations of AI Ethics',
        description: 'Core principles and frameworks for ethical AI',
        duration: '2 weeks',
        lessons: [
          { id: 'ethics-intro', title: 'Introduction to AI Ethics', type: 'video', duration: '40 min' },
          { id: 'ethical-frameworks', title: 'Ethical Frameworks for AI', type: 'text', duration: '30 min' },
          { id: 'case-studies', title: 'Real-World Case Studies', type: 'interactive', duration: '45 min' }
        ]
      }
    ]
  },
  {
    id: 'react-advanced',
    title: 'Advanced React Development',
    description: 'Master advanced React patterns, performance optimization, and modern development practices.',
    category: 'web-dev',
    difficulty: 'advanced',
    duration: '10 weeks',
    instructor: 'Emily Johnson',
    rating: 4.9,
    studentsEnrolled: 23456,
    price: 199,
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['React basics', 'JavaScript ES6+', 'HTML/CSS'],
    skills: ['Advanced React Patterns', 'Performance Optimization', 'Testing', 'State Management'],
    tags: ['React', 'JavaScript', 'Frontend', 'Performance', 'Testing'],
    isPopular: true,
    modules: [
      {
        id: 'advanced-patterns',
        title: 'Advanced React Patterns',
        description: 'Learn compound components, render props, and custom hooks',
        duration: '3 weeks',
        lessons: [
          { id: 'compound-components', title: 'Compound Components Pattern', type: 'video', duration: '50 min' },
          { id: 'render-props', title: 'Render Props and Function as Children', type: 'interactive', duration: '40 min' },
          { id: 'custom-hooks', title: 'Advanced Custom Hooks', type: 'text', duration: '35 min' }
        ]
      }
    ]
  },
  {
    id: 'blockchain-development',
    title: 'Blockchain Development Fundamentals',
    description: 'Learn to build decentralized applications with Ethereum, Solidity, and Web3 technologies.',
    category: 'blockchain',
    difficulty: 'intermediate',
    duration: '14 weeks',
    instructor: 'David Kim',
    rating: 4.6,
    studentsEnrolled: 9876,
    price: 249,
    thumbnail: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['JavaScript programming', 'Basic cryptography knowledge'],
    skills: ['Solidity', 'Smart Contracts', 'Web3.js', 'DApp Development', 'Ethereum'],
    tags: ['Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts', 'DeFi'],
    modules: [
      {
        id: 'blockchain-basics',
        title: 'Blockchain Fundamentals',
        description: 'Understanding blockchain technology and cryptocurrencies',
        duration: '2 weeks',
        lessons: [
          { id: 'blockchain-intro', title: 'What is Blockchain?', type: 'video', duration: '45 min' },
          { id: 'consensus-mechanisms', title: 'Consensus Mechanisms', type: 'text', duration: '30 min' }
        ]
      }
    ]
  },
  {
    id: 'data-science-python',
    title: 'Data Science with Python',
    description: 'Complete data science workflow from data collection to machine learning deployment.',
    category: 'data-science',
    difficulty: 'intermediate',
    duration: '16 weeks',
    instructor: 'Dr. Lisa Wang',
    rating: 4.8,
    studentsEnrolled: 18765,
    price: 179,
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['Python basics', 'Statistics fundamentals'],
    skills: ['Pandas', 'NumPy', 'Scikit-learn', 'Data Visualization', 'Machine Learning'],
    tags: ['Data Science', 'Python', 'Machine Learning', 'Analytics', 'Visualization'],
    modules: [
      {
        id: 'data-manipulation',
        title: 'Data Manipulation with Pandas',
        description: 'Master data cleaning and transformation',
        duration: '3 weeks',
        lessons: [
          { id: 'pandas-basics', title: 'Pandas Fundamentals', type: 'video', duration: '60 min' },
          { id: 'data-cleaning', title: 'Data Cleaning Techniques', type: 'interactive', duration: '45 min' }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn essential cybersecurity concepts, threat analysis, and defense strategies.',
    category: 'cybersecurity',
    difficulty: 'beginner',
    duration: '12 weeks',
    instructor: 'Michael Torres',
    rating: 4.7,
    studentsEnrolled: 14532,
    price: 159,
    thumbnail: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['Basic networking knowledge'],
    skills: ['Network Security', 'Threat Analysis', 'Incident Response', 'Risk Assessment'],
    tags: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Risk Management'],
    modules: [
      {
        id: 'security-basics',
        title: 'Security Fundamentals',
        description: 'Core concepts in cybersecurity',
        duration: '3 weeks',
        lessons: [
          { id: 'security-intro', title: 'Introduction to Cybersecurity', type: 'video', duration: '50 min' },
          { id: 'threat-landscape', title: 'Understanding the Threat Landscape', type: 'text', duration: '35 min' }
        ]
      }
    ]
  },
  {
    id: 'ux-ui-design',
    title: 'UX/UI Design Mastery',
    description: 'Create beautiful and functional user experiences with modern design principles and tools.',
    category: 'design',
    difficulty: 'intermediate',
    duration: '10 weeks',
    instructor: 'Sofia Martinez',
    rating: 4.9,
    studentsEnrolled: 21098,
    price: 139,
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    prerequisites: ['Basic design principles'],
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Figma'],
    tags: ['UX Design', 'UI Design', 'Figma', 'Prototyping', 'User Research'],
    modules: [
      {
        id: 'user-research',
        title: 'User Research and Analysis',
        description: 'Understanding user needs and behaviors',
        duration: '2 weeks',
        lessons: [
          { id: 'research-methods', title: 'User Research Methods', type: 'video', duration: '45 min' },
          { id: 'persona-creation', title: 'Creating User Personas', type: 'interactive', duration: '40 min' }
        ]
      }
    ]
  }
];

export const courseCategories = [
  { id: 'all', label: 'All Courses', icon: '📚' },
  { id: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'programming', label: 'Programming', icon: '💻' },
  { id: 'data-science', label: 'Data Science', icon: '📊' },
  { id: 'web-dev', label: 'Web Development', icon: '🌐' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🔒' },
  { id: 'blockchain', label: 'Blockchain', icon: '⛓️' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'business', label: 'Business', icon: '💼' }
];