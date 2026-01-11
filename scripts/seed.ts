import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../src/models/Category';
import { Author } from '../src/models/Author';
import { Article } from '../src/models/Article';
import { Comment } from '../src/models/Comment';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is required in .env file');
  process.exit(1);
}

// Categories data matching frontend
const categories = [
  {
    name: 'AI News',
    slug: 'ai-news',
    description: 'Latest news and updates from the world of artificial intelligence',
    icon: 'Newspaper',
    gradient: 'from-blue-500 to-cyan-500',
    accentClass: 'bg-blue-500',
  },
  {
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Step-by-step guides and tutorials for AI development',
    icon: 'BookOpen',
    gradient: 'from-purple-500 to-pink-500',
    accentClass: 'bg-purple-500',
  },
  {
    name: 'Tools',
    slug: 'tools',
    description: 'Reviews and guides for AI tools and platforms',
    icon: 'Wrench',
    gradient: 'from-orange-500 to-red-500',
    accentClass: 'bg-orange-500',
  },
  {
    name: 'Research',
    slug: 'research',
    description: 'Deep dives into AI research papers and breakthroughs',
    icon: 'FlaskConical',
    gradient: 'from-green-500 to-emerald-500',
    accentClass: 'bg-green-500',
  },
  {
    name: 'Industry',
    slug: 'industry',
    description: 'AI applications and trends across industries',
    icon: 'Building2',
    gradient: 'from-indigo-500 to-violet-500',
    accentClass: 'bg-indigo-500',
  },
  {
    name: 'AI Agents',
    slug: 'agents',
    description: 'Autonomous AI agents and multi-agent systems',
    icon: 'Bot',
    gradient: 'from-teal-500 to-cyan-500',
    accentClass: 'bg-teal-500',
  },
];

// Authors data
const authors = [
  {
    name: 'Aviv Maman',
    slug: 'aviv-maman',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aviv',
    role: 'AI Researcher & Developer',
    bio: 'Passionate about artificial intelligence and its potential to transform the world.',
  },
  {
    name: 'Sarah Chen',
    slug: 'sarah-chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'Machine Learning Engineer',
    bio: 'Building production ML systems and sharing knowledge along the way.',
  },
  {
    name: 'Alex Thompson',
    slug: 'alex-thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: 'Tech Writer',
    bio: 'Making complex AI topics accessible to everyone.',
  },
];

// Sample articles content
const sampleContent = `
<h2 id="introduction">Introduction</h2>
<p>Artificial intelligence has revolutionized the way we approach complex problems. In this article, we'll explore the latest developments and their implications for the future.</p>

<h2 id="key-concepts">Key Concepts</h2>
<p>Understanding the fundamental concepts is crucial for anyone looking to work with AI technologies. Let's break down the essential components.</p>

<h3 id="machine-learning">Machine Learning</h3>
<p>Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.</p>

<h3 id="deep-learning">Deep Learning</h3>
<p>Deep learning uses neural networks with multiple layers to progressively extract higher-level features from raw input.</p>

<h2 id="practical-applications">Practical Applications</h2>
<p>The real-world applications of these technologies are vast and growing every day. From healthcare to finance, AI is making significant impacts.</p>

<h2 id="conclusion">Conclusion</h2>
<p>As we continue to advance in AI capabilities, it's important to consider both the opportunities and challenges that lie ahead.</p>
`;

const generateSections = () => [
  { id: 'introduction', title: 'Introduction', level: 2 },
  { id: 'key-concepts', title: 'Key Concepts', level: 2 },
  { id: 'machine-learning', title: 'Machine Learning', level: 3 },
  { id: 'deep-learning', title: 'Deep Learning', level: 3 },
  { id: 'practical-applications', title: 'Practical Applications', level: 2 },
  { id: 'conclusion', title: 'Conclusion', level: 2 },
];

// Articles data
const articlesData = [
  // AI News
  {
    title: 'GPT-5 Release: What We Know So Far',
    slug: 'gpt-5-release-what-we-know',
    excerpt: 'OpenAI is rumored to be working on GPT-5. Here\'s everything we know about the next generation of language models.',
    categorySlug: 'ai-news',
    categoryColor: 'primary' as const,
    readTime: '5 min read',
    tags: ['gpt', 'openai', 'llm', 'language-models'],
    views: 15420,
  },
  {
    title: 'Google DeepMind Announces Breakthrough in Protein Folding',
    slug: 'deepmind-protein-folding-breakthrough',
    excerpt: 'DeepMind\'s latest AlphaFold update achieves unprecedented accuracy in predicting protein structures.',
    categorySlug: 'ai-news',
    categoryColor: 'primary' as const,
    readTime: '7 min read',
    tags: ['deepmind', 'alphafold', 'biology', 'research'],
    views: 8930,
  },
  // Tutorials
  {
    title: 'Building Your First RAG Application with LangChain',
    slug: 'building-rag-application-langchain',
    excerpt: 'A comprehensive guide to building retrieval-augmented generation applications using LangChain and vector databases.',
    categorySlug: 'tutorials',
    categoryColor: 'secondary' as const,
    readTime: '12 min read',
    tags: ['langchain', 'rag', 'tutorial', 'python'],
    views: 12340,
  },
  {
    title: 'Fine-Tuning LLMs: A Practical Guide',
    slug: 'fine-tuning-llms-practical-guide',
    excerpt: 'Learn how to fine-tune large language models for your specific use cases with this step-by-step tutorial.',
    categorySlug: 'tutorials',
    categoryColor: 'secondary' as const,
    readTime: '15 min read',
    tags: ['fine-tuning', 'llm', 'tutorial', 'machine-learning'],
    views: 9870,
  },
  {
    title: 'Getting Started with Hugging Face Transformers',
    slug: 'getting-started-hugging-face-transformers',
    excerpt: 'Everything you need to know to start using the Hugging Face Transformers library for NLP tasks.',
    categorySlug: 'tutorials',
    categoryColor: 'secondary' as const,
    readTime: '10 min read',
    tags: ['huggingface', 'transformers', 'nlp', 'tutorial'],
    views: 7650,
  },
  // Tools
  {
    title: 'Claude vs ChatGPT: An In-Depth Comparison',
    slug: 'claude-vs-chatgpt-comparison',
    excerpt: 'A detailed comparison of Anthropic\'s Claude and OpenAI\'s ChatGPT across various benchmarks and use cases.',
    categorySlug: 'tools',
    categoryColor: 'accent' as const,
    readTime: '8 min read',
    tags: ['claude', 'chatgpt', 'comparison', 'llm'],
    views: 23450,
  },
  {
    title: 'Best AI Coding Assistants in 2024',
    slug: 'best-ai-coding-assistants-2024',
    excerpt: 'A comprehensive review of the top AI coding assistants including GitHub Copilot, Cursor, and more.',
    categorySlug: 'tools',
    categoryColor: 'accent' as const,
    readTime: '10 min read',
    tags: ['coding', 'copilot', 'cursor', 'productivity'],
    views: 18920,
  },
  // Research
  {
    title: 'Understanding Attention Mechanisms in Transformers',
    slug: 'understanding-attention-mechanisms-transformers',
    excerpt: 'A deep dive into how attention mechanisms work and why they revolutionized natural language processing.',
    categorySlug: 'research',
    categoryColor: 'primary' as const,
    readTime: '20 min read',
    tags: ['attention', 'transformers', 'research', 'deep-learning'],
    views: 6540,
  },
  {
    title: 'The Mathematics Behind Diffusion Models',
    slug: 'mathematics-behind-diffusion-models',
    excerpt: 'Exploring the mathematical foundations of diffusion models used in image generation.',
    categorySlug: 'research',
    categoryColor: 'primary' as const,
    readTime: '25 min read',
    tags: ['diffusion', 'mathematics', 'image-generation', 'research'],
    views: 4320,
  },
  // Industry
  {
    title: 'How AI is Transforming Healthcare Diagnostics',
    slug: 'ai-transforming-healthcare-diagnostics',
    excerpt: 'Exploring the impact of AI on medical diagnostics, from radiology to pathology.',
    categorySlug: 'industry',
    categoryColor: 'secondary' as const,
    readTime: '9 min read',
    tags: ['healthcare', 'diagnostics', 'medical-ai', 'industry'],
    views: 11230,
  },
  {
    title: 'AI in Finance: Risk Assessment and Trading',
    slug: 'ai-finance-risk-assessment-trading',
    excerpt: 'How financial institutions are leveraging AI for risk management and algorithmic trading.',
    categorySlug: 'industry',
    categoryColor: 'secondary' as const,
    readTime: '11 min read',
    tags: ['finance', 'trading', 'risk', 'industry'],
    views: 8760,
  },
  // AI Agents
  {
    title: 'Building Autonomous AI Agents with AutoGPT',
    slug: 'building-autonomous-ai-agents-autogpt',
    excerpt: 'A guide to creating autonomous AI agents that can complete complex tasks independently.',
    categorySlug: 'agents',
    categoryColor: 'accent' as const,
    readTime: '14 min read',
    tags: ['autogpt', 'agents', 'autonomous', 'tutorial'],
    views: 16780,
  },
  {
    title: 'Multi-Agent Systems: The Future of AI',
    slug: 'multi-agent-systems-future-ai',
    excerpt: 'Exploring how multiple AI agents can work together to solve complex problems.',
    categorySlug: 'agents',
    categoryColor: 'accent' as const,
    readTime: '12 min read',
    tags: ['multi-agent', 'collaboration', 'agents', 'future'],
    views: 9340,
  },
  {
    title: 'CrewAI: Orchestrating AI Agent Teams',
    slug: 'crewai-orchestrating-ai-agent-teams',
    excerpt: 'Learn how to use CrewAI to create and manage teams of AI agents for complex workflows.',
    categorySlug: 'agents',
    categoryColor: 'accent' as const,
    readTime: '16 min read',
    tags: ['crewai', 'agents', 'orchestration', 'tutorial'],
    views: 7890,
  },
];

// Comments data
const commentsData = [
  {
    author: 'John Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    content: 'Great article! This really helped me understand the concepts better.',
    likes: 24,
  },
  {
    author: 'Tech Enthusiast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    content: 'I\'ve been waiting for an explanation like this. Very well written!',
    likes: 18,
  },
  {
    author: 'ML Student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    content: 'Could you elaborate more on the practical applications?',
    likes: 7,
  },
];

const replyData = {
  author: 'Aviv Maman',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aviv',
  content: 'Thanks for the feedback! I\'ll consider writing a follow-up article with more practical examples.',
  likes: 12,
};

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
    ]);

    // Insert categories
    console.log('Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);
    const categoryMap = new Map(insertedCategories.map(c => [c.slug, c._id]));

    // Insert authors
    console.log('Inserting authors...');
    const insertedAuthors = await Author.insertMany(authors);
    const authorIds = insertedAuthors.map(a => a._id);

    // Insert articles
    console.log('Inserting articles...');
    const articlesToInsert = articlesData.map((article, index) => ({
      ...article,
      content: sampleContent,
      image: `https://picsum.photos/seed/${article.slug}/1200/600`,
      category: categoryMap.get(article.categorySlug),
      author: authorIds[index % authorIds.length],
      sections: generateSections(),
      isPublished: true,
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

    console.log('\nSeeding completed successfully!');
    console.log(`- ${insertedCategories.length} categories`);
    console.log(`- ${insertedAuthors.length} authors`);
    console.log(`- ${insertedArticles.length} articles`);
    console.log(`- Comments added to first 5 articles`);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

seed();
