import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../src/models/Category';
import { Author } from '../src/models/Author';
import { Article } from '../src/models/Article';
import { Comment } from '../src/models/Comment';
import { Tag } from '../src/models/Tag';
import { Page } from '../src/models/Page';
import { PageGroup } from '../src/models/PageGroup';
import { Navigation } from '../src/models/Navigation';
import { SiteSetting } from '../src/models/SiteSetting';
import { Media } from '../src/models/Media';
import { ContentBlock } from '../src/types';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is required in .env file');
  process.exit(1);
}

// ============================================
// Categories data (updated schema)
// ============================================
const categories = [
  {
    name: 'AI News',
    slug: 'ai-news',
    description: 'Latest news and updates from the world of artificial intelligence',
    icon: 'Newspaper',
    color: '#3B82F6', // blue-500
    order: 0,
  },
  {
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Step-by-step guides and tutorials for AI development',
    icon: 'BookOpen',
    color: '#8B5CF6', // purple-500
    order: 1,
  },
  {
    name: 'Tools',
    slug: 'tools',
    description: 'Reviews and guides for AI tools and platforms',
    icon: 'Wrench',
    color: '#F97316', // orange-500
    order: 2,
  },
  {
    name: 'Research',
    slug: 'research',
    description: 'Deep dives into AI research papers and breakthroughs',
    icon: 'FlaskConical',
    color: '#22C55E', // green-500
    order: 3,
  },
  {
    name: 'Industry',
    slug: 'industry',
    description: 'AI applications and trends across industries',
    icon: 'Building2',
    color: '#6366F1', // indigo-500
    order: 4,
  },
  {
    name: 'AI Agents',
    slug: 'agents',
    description: 'Autonomous AI agents and multi-agent systems',
    icon: 'Bot',
    color: '#14B8A6', // teal-500
    order: 5,
  },
];

// ============================================
// Tags data
// ============================================
const tags = [
  { slug: 'gpt', name: 'GPT', color: '#10B981' },
  { slug: 'openai', name: 'OpenAI', color: '#3B82F6' },
  { slug: 'llm', name: 'LLM', color: '#8B5CF6' },
  { slug: 'language-models', name: 'Language Models', color: '#6366F1' },
  { slug: 'deepmind', name: 'DeepMind', color: '#EC4899' },
  { slug: 'alphafold', name: 'AlphaFold', color: '#14B8A6' },
  { slug: 'biology', name: 'Biology', color: '#22C55E' },
  { slug: 'research', name: 'Research', color: '#F59E0B' },
  { slug: 'langchain', name: 'LangChain', color: '#059669' },
  { slug: 'rag', name: 'RAG', color: '#7C3AED' },
  { slug: 'tutorial', name: 'Tutorial', color: '#2563EB' },
  { slug: 'python', name: 'Python', color: '#FBBF24' },
  { slug: 'fine-tuning', name: 'Fine-Tuning', color: '#DC2626' },
  { slug: 'machine-learning', name: 'Machine Learning', color: '#9333EA' },
  { slug: 'huggingface', name: 'Hugging Face', color: '#F97316' },
  { slug: 'transformers', name: 'Transformers', color: '#0EA5E9' },
  { slug: 'nlp', name: 'NLP', color: '#84CC16' },
  { slug: 'claude', name: 'Claude', color: '#D97706' },
  { slug: 'chatgpt', name: 'ChatGPT', color: '#10B981' },
  { slug: 'comparison', name: 'Comparison', color: '#6B7280' },
  { slug: 'coding', name: 'Coding', color: '#4F46E5' },
  { slug: 'copilot', name: 'Copilot', color: '#1D4ED8' },
  { slug: 'cursor', name: 'Cursor', color: '#7C3AED' },
  { slug: 'productivity', name: 'Productivity', color: '#059669' },
  { slug: 'attention', name: 'Attention', color: '#B91C1C' },
  { slug: 'deep-learning', name: 'Deep Learning', color: '#7E22CE' },
  { slug: 'diffusion', name: 'Diffusion', color: '#DB2777' },
  { slug: 'mathematics', name: 'Mathematics', color: '#0D9488' },
  { slug: 'image-generation', name: 'Image Generation', color: '#EA580C' },
  { slug: 'healthcare', name: 'Healthcare', color: '#DC2626' },
  { slug: 'diagnostics', name: 'Diagnostics', color: '#E11D48' },
  { slug: 'medical-ai', name: 'Medical AI', color: '#BE123C' },
  { slug: 'industry', name: 'Industry', color: '#4338CA' },
  { slug: 'finance', name: 'Finance', color: '#15803D' },
  { slug: 'trading', name: 'Trading', color: '#166534' },
  { slug: 'risk', name: 'Risk', color: '#B45309' },
  { slug: 'autogpt', name: 'AutoGPT', color: '#9333EA' },
  { slug: 'agents', name: 'Agents', color: '#0891B2' },
  { slug: 'autonomous', name: 'Autonomous', color: '#0E7490' },
  { slug: 'multi-agent', name: 'Multi-Agent', color: '#155E75' },
  { slug: 'collaboration', name: 'Collaboration', color: '#1E40AF' },
  { slug: 'future', name: 'Future', color: '#5B21B6' },
  { slug: 'crewai', name: 'CrewAI', color: '#6D28D9' },
  { slug: 'orchestration', name: 'Orchestration', color: '#7C2D12' },
];

// ============================================
// Authors data (with social links)
// ============================================
const authors = [
  {
    name: 'Aviv Maman',
    slug: 'aviv-maman',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aviv',
    role: 'AI Researcher & Developer',
    bio: 'Passionate about artificial intelligence and its potential to transform the world.',
    social: {
      twitter: 'avivmaman',
      github: 'avivmaman',
      linkedin: 'avivmaman',
      website: 'https://aviv-m.ai',
    },
  },
  {
    name: 'Sarah Chen',
    slug: 'sarah-chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'Machine Learning Engineer',
    bio: 'Building production ML systems and sharing knowledge along the way.',
    social: {
      twitter: 'sarahchen',
      github: 'sarahchen',
    },
  },
  {
    name: 'Alex Thompson',
    slug: 'alex-thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: 'Tech Writer',
    bio: 'Making complex AI topics accessible to everyone.',
    social: {
      linkedin: 'alexthompson',
    },
  },
];

// ============================================
// Content blocks generator
// ============================================
const generateContentBlocks = (title: string): ContentBlock[] => [
  {
    type: 'heading',
    data: { text: 'Introduction', level: 2 },
  },
  {
    type: 'paragraph',
    data: {
      text: `Artificial intelligence has revolutionized the way we approach complex problems. In this article about "${title}", we'll explore the latest developments and their implications for the future.`,
    },
  },
  {
    type: 'callout',
    data: {
      text: 'This article covers cutting-edge AI topics. Make sure you have a basic understanding of machine learning concepts.',
      type: 'info',
    },
  },
  {
    type: 'heading',
    data: { text: 'Key Concepts', level: 2 },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Understanding the fundamental concepts is crucial for anyone looking to work with AI technologies. Let\'s break down the essential components.',
    },
  },
  {
    type: 'heading',
    data: { text: 'Machine Learning', level: 3 },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.',
    },
  },
  {
    type: 'code',
    data: {
      language: 'python',
      code: `# Example: Simple ML model with scikit-learn
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2%}")`,
    },
  },
  {
    type: 'heading',
    data: { text: 'Deep Learning', level: 3 },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Deep learning uses neural networks with multiple layers to progressively extract higher-level features from raw input.',
    },
  },
  {
    type: 'image',
    data: {
      url: 'https://picsum.photos/seed/neural-network/800/400',
      alt: 'Neural network architecture diagram',
      caption: 'A typical deep neural network architecture',
    },
  },
  {
    type: 'heading',
    data: { text: 'Practical Applications', level: 2 },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The real-world applications of these technologies are vast and growing every day. From healthcare to finance, AI is making significant impacts.',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'Healthcare: Disease diagnosis and drug discovery',
        'Finance: Fraud detection and algorithmic trading',
        'Transportation: Autonomous vehicles and route optimization',
        'Manufacturing: Quality control and predictive maintenance',
      ],
    },
  },
  {
    type: 'quote',
    data: {
      text: 'The development of full artificial intelligence could spell the end of the human race... It would take off on its own, and re-design itself at an ever increasing rate.',
      author: 'Stephen Hawking',
    },
  },
  {
    type: 'heading',
    data: { text: 'Key Takeaways', level: 2 },
  },
  {
    type: 'list',
    data: {
      style: 'ordered',
      items: [
        'AI is transforming every industry',
        'Understanding fundamentals is essential',
        'Practical experience accelerates learning',
        'Stay updated with latest developments',
      ],
    },
  },
  {
    type: 'divider',
    data: {},
  },
  {
    type: 'heading',
    data: { text: 'Conclusion', level: 2 },
  },
  {
    type: 'paragraph',
    data: {
      text: 'As we continue to advance in AI capabilities, it\'s important to consider both the opportunities and challenges that lie ahead. The future of AI is bright, but it requires responsible development and deployment.',
    },
  },
];

const generateSections = () => [
  { id: 'introduction', title: 'Introduction', level: 2 },
  { id: 'key-concepts', title: 'Key Concepts', level: 2 },
  { id: 'machine-learning', title: 'Machine Learning', level: 3 },
  { id: 'deep-learning', title: 'Deep Learning', level: 3 },
  { id: 'practical-applications', title: 'Practical Applications', level: 2 },
  { id: 'key-takeaways', title: 'Key Takeaways', level: 2 },
  { id: 'conclusion', title: 'Conclusion', level: 2 },
];

// ============================================
// Articles data
// ============================================
const articlesData = [
  // AI News
  {
    title: 'GPT-5 Release: What We Know So Far',
    slug: 'gpt-5-release-what-we-know',
    excerpt: 'OpenAI is rumored to be working on GPT-5. Here\'s everything we know about the next generation of language models.',
    categorySlug: 'ai-news',
    readTime: '5 min read',
    tags: ['gpt', 'openai', 'llm', 'language-models'],
    views: 15420,
    isFeatured: true,
  },
  {
    title: 'Google DeepMind Announces Breakthrough in Protein Folding',
    slug: 'deepmind-protein-folding-breakthrough',
    excerpt: 'DeepMind\'s latest AlphaFold update achieves unprecedented accuracy in predicting protein structures.',
    categorySlug: 'ai-news',
    readTime: '7 min read',
    tags: ['deepmind', 'alphafold', 'biology', 'research'],
    views: 8930,
    isFeatured: false,
  },
  // Tutorials
  {
    title: 'Building Your First RAG Application with LangChain',
    slug: 'building-rag-application-langchain',
    excerpt: 'A comprehensive guide to building retrieval-augmented generation applications using LangChain and vector databases.',
    categorySlug: 'tutorials',
    readTime: '12 min read',
    tags: ['langchain', 'rag', 'tutorial', 'python'],
    views: 12340,
    isFeatured: true,
  },
  {
    title: 'Fine-Tuning LLMs: A Practical Guide',
    slug: 'fine-tuning-llms-practical-guide',
    excerpt: 'Learn how to fine-tune large language models for your specific use cases with this step-by-step tutorial.',
    categorySlug: 'tutorials',
    readTime: '15 min read',
    tags: ['fine-tuning', 'llm', 'tutorial', 'machine-learning'],
    views: 9870,
    isFeatured: false,
  },
  {
    title: 'Getting Started with Hugging Face Transformers',
    slug: 'getting-started-hugging-face-transformers',
    excerpt: 'Everything you need to know to start using the Hugging Face Transformers library for NLP tasks.',
    categorySlug: 'tutorials',
    readTime: '10 min read',
    tags: ['huggingface', 'transformers', 'nlp', 'tutorial'],
    views: 7650,
    isFeatured: false,
  },
  // Tools
  {
    title: 'Claude vs ChatGPT: An In-Depth Comparison',
    slug: 'claude-vs-chatgpt-comparison',
    excerpt: 'A detailed comparison of Anthropic\'s Claude and OpenAI\'s ChatGPT across various benchmarks and use cases.',
    categorySlug: 'tools',
    readTime: '8 min read',
    tags: ['claude', 'chatgpt', 'comparison', 'llm'],
    views: 23450,
    isFeatured: true,
  },
  {
    title: 'Best AI Coding Assistants in 2024',
    slug: 'best-ai-coding-assistants-2024',
    excerpt: 'A comprehensive review of the top AI coding assistants including GitHub Copilot, Cursor, and more.',
    categorySlug: 'tools',
    readTime: '10 min read',
    tags: ['coding', 'copilot', 'cursor', 'productivity'],
    views: 18920,
    isFeatured: false,
  },
  // Research
  {
    title: 'Understanding Attention Mechanisms in Transformers',
    slug: 'understanding-attention-mechanisms-transformers',
    excerpt: 'A deep dive into how attention mechanisms work and why they revolutionized natural language processing.',
    categorySlug: 'research',
    readTime: '20 min read',
    tags: ['attention', 'transformers', 'research', 'deep-learning'],
    views: 6540,
    isFeatured: false,
  },
  {
    title: 'The Mathematics Behind Diffusion Models',
    slug: 'mathematics-behind-diffusion-models',
    excerpt: 'Exploring the mathematical foundations of diffusion models used in image generation.',
    categorySlug: 'research',
    readTime: '25 min read',
    tags: ['diffusion', 'mathematics', 'image-generation', 'research'],
    views: 4320,
    isFeatured: false,
  },
  // Industry
  {
    title: 'How AI is Transforming Healthcare Diagnostics',
    slug: 'ai-transforming-healthcare-diagnostics',
    excerpt: 'Exploring the impact of AI on medical diagnostics, from radiology to pathology.',
    categorySlug: 'industry',
    readTime: '9 min read',
    tags: ['healthcare', 'diagnostics', 'medical-ai', 'industry'],
    views: 11230,
    isFeatured: false,
  },
  {
    title: 'AI in Finance: Risk Assessment and Trading',
    slug: 'ai-finance-risk-assessment-trading',
    excerpt: 'How financial institutions are leveraging AI for risk management and algorithmic trading.',
    categorySlug: 'industry',
    readTime: '11 min read',
    tags: ['finance', 'trading', 'risk', 'industry'],
    views: 8760,
    isFeatured: false,
  },
  // AI Agents
  {
    title: 'Building Autonomous AI Agents with AutoGPT',
    slug: 'building-autonomous-ai-agents-autogpt',
    excerpt: 'A guide to creating autonomous AI agents that can complete complex tasks independently.',
    categorySlug: 'agents',
    readTime: '14 min read',
    tags: ['autogpt', 'agents', 'autonomous', 'tutorial'],
    views: 16780,
    isFeatured: true,
  },
  {
    title: 'Multi-Agent Systems: The Future of AI',
    slug: 'multi-agent-systems-future-ai',
    excerpt: 'Exploring how multiple AI agents can work together to solve complex problems.',
    categorySlug: 'agents',
    readTime: '12 min read',
    tags: ['multi-agent', 'collaboration', 'agents', 'future'],
    views: 9340,
    isFeatured: false,
  },
  {
    title: 'CrewAI: Orchestrating AI Agent Teams',
    slug: 'crewai-orchestrating-ai-agent-teams',
    excerpt: 'Learn how to use CrewAI to create and manage teams of AI agents for complex workflows.',
    categorySlug: 'agents',
    readTime: '16 min read',
    tags: ['crewai', 'agents', 'orchestration', 'tutorial'],
    views: 7890,
    isFeatured: false,
  },
];

// ============================================
// Comments data
// ============================================
const commentsData = [
  {
    author: 'John Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    content: 'Great article! This really helped me understand the concepts better.',
    likes: 24,
    status: 'approved' as const,
  },
  {
    author: 'Tech Enthusiast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    content: 'I\'ve been waiting for an explanation like this. Very well written!',
    likes: 18,
    status: 'approved' as const,
  },
  {
    author: 'ML Student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    content: 'Could you elaborate more on the practical applications?',
    likes: 7,
    status: 'approved' as const,
  },
];

const replyData = {
  author: 'Aviv Maman',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aviv',
  content: 'Thanks for the feedback! I\'ll consider writing a follow-up article with more practical examples.',
  likes: 12,
  status: 'approved' as const,
};

// ============================================
// Page Groups data
// ============================================
const pageGroups = [
  {
    slug: 'footer',
    name: 'Footer',
    description: 'Pages displayed in the footer navigation',
    order: 0,
  },
  {
    slug: 'legal',
    name: 'Legal',
    description: 'Legal and policy pages',
    order: 1,
  },
  {
    slug: 'about',
    name: 'About',
    description: 'About the site and team',
    order: 2,
  },
];

// ============================================
// Pages data
// ============================================
const pagesData = [
  {
    slug: 'about',
    title: 'About Us',
    description: 'Learn more about our AI blog and team',
    groupSlug: 'about',
    order: 0,
    content: [
      { type: 'heading', data: { text: 'About AI Blog', level: 1 } },
      { type: 'paragraph', data: { text: 'Welcome to AI Blog, your premier source for artificial intelligence news, tutorials, and insights.' } },
      { type: 'heading', data: { text: 'Our Mission', level: 2 } },
      { type: 'paragraph', data: { text: 'We aim to make AI accessible to everyone by providing high-quality, educational content that bridges the gap between complex research and practical applications.' } },
      { type: 'heading', data: { text: 'Our Team', level: 2 } },
      { type: 'paragraph', data: { text: 'Our team consists of AI researchers, engineers, and writers passionate about sharing knowledge and advancing the field.' } },
    ] as ContentBlock[],
  },
  {
    slug: 'contact',
    title: 'Contact',
    description: 'Get in touch with us',
    groupSlug: 'footer',
    order: 1,
    content: [
      { type: 'heading', data: { text: 'Contact Us', level: 1 } },
      { type: 'paragraph', data: { text: 'We\'d love to hear from you! Whether you have questions, feedback, or collaboration opportunities, feel free to reach out.' } },
      { type: 'heading', data: { text: 'Email', level: 2 } },
      { type: 'paragraph', data: { text: 'contact@ai-blog.com' } },
      { type: 'heading', data: { text: 'Social Media', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: ['Twitter: @aiblog', 'LinkedIn: AI Blog', 'GitHub: ai-blog'] } },
    ] as ContentBlock[],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'Our privacy policy and data handling practices',
    groupSlug: 'legal',
    order: 0,
    content: [
      { type: 'heading', data: { text: 'Privacy Policy', level: 1 } },
      { type: 'paragraph', data: { text: 'Last updated: January 2024' } },
      { type: 'heading', data: { text: 'Information We Collect', level: 2 } },
      { type: 'paragraph', data: { text: 'We collect information you provide directly to us, such as when you subscribe to our newsletter or leave comments.' } },
      { type: 'heading', data: { text: 'How We Use Your Information', level: 2 } },
      { type: 'paragraph', data: { text: 'We use the information we collect to provide, maintain, and improve our services.' } },
      { type: 'heading', data: { text: 'Cookies', level: 2 } },
      { type: 'paragraph', data: { text: 'We use cookies and similar technologies to collect information about your browsing activities.' } },
    ] as ContentBlock[],
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    description: 'Terms and conditions for using our website',
    groupSlug: 'legal',
    order: 1,
    content: [
      { type: 'heading', data: { text: 'Terms of Service', level: 1 } },
      { type: 'paragraph', data: { text: 'By accessing and using this website, you accept and agree to be bound by these terms.' } },
      { type: 'heading', data: { text: 'Use of Content', level: 2 } },
      { type: 'paragraph', data: { text: 'All content on this site is for informational purposes only. You may not reproduce or distribute content without permission.' } },
      { type: 'heading', data: { text: 'User Conduct', level: 2 } },
      { type: 'paragraph', data: { text: 'You agree to use this site only for lawful purposes and in a way that does not infringe on others\' rights.' } },
    ] as ContentBlock[],
  },
];

// ============================================
// Site Settings data
// ============================================
const siteSettings = [
  // General
  { key: 'site_name', value: 'AI Blog', type: 'string', group: 'general', label: 'Site Name', isPublic: true },
  { key: 'site_tagline', value: 'Your guide to artificial intelligence', type: 'string', group: 'general', label: 'Tagline', isPublic: true },
  { key: 'site_description', value: 'AI Blog covers the latest in artificial intelligence, machine learning, and deep learning.', type: 'string', group: 'general', label: 'Site Description', isPublic: true },
  { key: 'site_url', value: 'https://ai-blog.com', type: 'string', group: 'general', label: 'Site URL', isPublic: true },
  { key: 'posts_per_page', value: 10, type: 'number', group: 'general', label: 'Posts Per Page', isPublic: true },

  // SEO
  { key: 'seo_title_template', value: '%s | AI Blog', type: 'string', group: 'seo', label: 'Title Template', isPublic: true },
  { key: 'seo_default_image', value: 'https://ai-blog.com/og-image.png', type: 'image', group: 'seo', label: 'Default OG Image', isPublic: true },

  // Social
  { key: 'social_twitter', value: '@aiblog', type: 'string', group: 'social', label: 'Twitter Handle', isPublic: true },
  { key: 'social_github', value: 'ai-blog', type: 'string', group: 'social', label: 'GitHub', isPublic: true },
  { key: 'social_linkedin', value: 'ai-blog', type: 'string', group: 'social', label: 'LinkedIn', isPublic: true },

  // Appearance
  { key: 'theme_primary_color', value: '#3B82F6', type: 'string', group: 'appearance', label: 'Primary Color', isPublic: true },
  { key: 'theme_dark_mode', value: true, type: 'boolean', group: 'appearance', label: 'Enable Dark Mode', isPublic: true },

  // Contact
  { key: 'contact_email', value: 'contact@ai-blog.com', type: 'string', group: 'contact', label: 'Contact Email', isPublic: true },

  // Analytics
  { key: 'analytics_umami_id', value: 'e9ff7914-dab6-484b-96e7-c6acbae6779e', type: 'string', group: 'analytics', label: 'Umami Website ID', isPublic: false },
  { key: 'analytics_umami_url', value: 'https://umami.aviv-m.cloud', type: 'string', group: 'analytics', label: 'Umami URL', isPublic: false },
];

// ============================================
// Media data
// ============================================
const mediaData = [
  {
    filename: 'hero-ai.jpg',
    originalName: 'hero-ai.jpg',
    mimeType: 'image/jpeg',
    size: 245000,
    url: 'https://picsum.photos/seed/hero-ai/1920/1080',
    alt: 'AI technology hero image',
    caption: 'Artificial Intelligence representation',
    width: 1920,
    height: 1080,
    folder: 'heroes',
  },
  {
    filename: 'neural-network.png',
    originalName: 'neural-network.png',
    mimeType: 'image/png',
    size: 180000,
    url: 'https://picsum.photos/seed/neural-network/800/400',
    alt: 'Neural network diagram',
    caption: 'Deep learning neural network architecture',
    width: 800,
    height: 400,
    folder: 'diagrams',
  },
  {
    filename: 'robot.jpg',
    originalName: 'robot.jpg',
    mimeType: 'image/jpeg',
    size: 320000,
    url: 'https://picsum.photos/seed/robot/1200/800',
    alt: 'Robot image',
    caption: 'AI-powered robot',
    width: 1200,
    height: 800,
    folder: 'robots',
  },
  {
    filename: 'code-screen.png',
    originalName: 'code-screen.png',
    mimeType: 'image/png',
    size: 150000,
    url: 'https://picsum.photos/seed/code-screen/1600/900',
    alt: 'Code on screen',
    caption: 'Python code for machine learning',
    width: 1600,
    height: 900,
    folder: 'screenshots',
  },
];

// ============================================
// Seed Function
// ============================================
async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Author.deleteMany({}),
      Article.deleteMany({}),
      Comment.deleteMany({}),
      Tag.deleteMany({}),
      Page.deleteMany({}),
      PageGroup.deleteMany({}),
      Navigation.deleteMany({}),
      SiteSetting.deleteMany({}),
      Media.deleteMany({}),
    ]);

    // Insert categories
    console.log('Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);
    const categoryMap = new Map(insertedCategories.map(c => [c.slug, c._id]));

    // Insert tags
    console.log('Inserting tags...');
    const insertedTags = await Tag.insertMany(tags);
    const tagMap = new Map(insertedTags.map(t => [t.slug, t._id]));

    // Insert authors
    console.log('Inserting authors...');
    const insertedAuthors = await Author.insertMany(authors);
    const authorIds = insertedAuthors.map(a => a._id);

    // Insert articles
    console.log('Inserting articles...');
    const articlesToInsert = articlesData.map((article, index) => ({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: generateContentBlocks(article.title),
      image: `https://picsum.photos/seed/${article.slug}/1200/600`,
      category: categoryMap.get(article.categorySlug),
      author: authorIds[index % authorIds.length],
      tags: article.tags.map(tagSlug => tagMap.get(tagSlug)).filter(Boolean),
      sections: generateSections(),
      status: 'published' as const,
      readTime: article.readTime,
      views: article.views,
      isFeatured: article.isFeatured,
      seo: {
        title: article.title,
        description: article.excerpt,
      },
      publishedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // Stagger by days
    }));

    const insertedArticles = await Article.insertMany(articlesToInsert);

    // Insert comments for first 5 articles
    console.log('Inserting comments...');
    for (let i = 0; i < 5; i++) {
      const article = insertedArticles[i];

      // Insert root comments
      const rootComments = await Comment.insertMany(
        commentsData.map(comment => ({
          ...comment,
          article: article._id,
        }))
      );

      // Add a reply to the first comment
      await Comment.create({
        ...replyData,
        article: article._id,
        parentId: rootComments[0]._id,
      });
    }

    // Insert page groups
    console.log('Inserting page groups...');
    const insertedPageGroups = await PageGroup.insertMany(pageGroups);
    const pageGroupMap = new Map(insertedPageGroups.map(pg => [pg.slug, pg._id]));

    // Insert pages
    console.log('Inserting pages...');
    const pagesToInsert = pagesData.map(page => ({
      slug: page.slug,
      title: page.title,
      description: page.description,
      content: page.content,
      group: pageGroupMap.get(page.groupSlug),
      status: 'published' as const,
      order: page.order,
      seo: {
        title: page.title,
        description: page.description,
      },
      publishedAt: new Date(),
    }));
    const insertedPages = await Page.insertMany(pagesToInsert);
    const pageMap = new Map(insertedPages.map(p => [p.slug, p._id]));

    // Insert navigation
    console.log('Inserting navigation...');
    await Navigation.insertMany([
      {
        slug: 'main-menu',
        name: 'Main Menu',
        items: [
          { label: 'Home', url: '/', order: 0 },
          { label: 'AI News', url: '/category/ai-news', order: 1 },
          { label: 'Tutorials', url: '/category/tutorials', order: 2 },
          { label: 'Tools', url: '/category/tools', order: 3 },
          { label: 'Research', url: '/category/research', order: 4 },
          { label: 'AI Agents', url: '/category/agents', order: 5 },
        ],
      },
      {
        slug: 'footer-menu',
        name: 'Footer Menu',
        items: [
          { label: 'About', page: pageMap.get('about'), order: 0 },
          { label: 'Contact', page: pageMap.get('contact'), order: 1 },
          { label: 'Privacy Policy', page: pageMap.get('privacy-policy'), order: 2 },
          { label: 'Terms of Service', page: pageMap.get('terms-of-service'), order: 3 },
        ],
      },
      {
        slug: 'social-links',
        name: 'Social Links',
        items: [
          { label: 'Twitter', url: 'https://twitter.com/aiblog', target: '_blank', icon: 'Twitter', order: 0 },
          { label: 'GitHub', url: 'https://github.com/ai-blog', target: '_blank', icon: 'Github', order: 1 },
          { label: 'LinkedIn', url: 'https://linkedin.com/company/ai-blog', target: '_blank', icon: 'Linkedin', order: 2 },
        ],
      },
    ]);

    // Insert site settings
    console.log('Inserting site settings...');
    await SiteSetting.insertMany(siteSettings);

    // Insert media
    console.log('Inserting media...');
    await Media.insertMany(mediaData);

    console.log('\nSeeding completed successfully!');
    console.log(`- ${insertedCategories.length} categories`);
    console.log(`- ${insertedTags.length} tags`);
    console.log(`- ${insertedAuthors.length} authors`);
    console.log(`- ${insertedArticles.length} articles`);
    console.log(`- Comments added to first 5 articles`);
    console.log(`- ${insertedPageGroups.length} page groups`);
    console.log(`- ${insertedPages.length} pages`);
    console.log(`- 3 navigation menus`);
    console.log(`- ${siteSettings.length} site settings`);
    console.log(`- ${mediaData.length} media assets`);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

seed();
