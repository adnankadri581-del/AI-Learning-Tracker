export interface LearningData {
  learningHours: number;
  aiToolsExplored: string[];
  learningResources: string;
  conceptsLearned: string;
  keyTakeaways: string;
}

export interface WorkData {
  tasksCompleted: string;
  featuresDelivered: string;
  bugsFixed: string;
  tomorrowPlan: string;
  currentBlockers: string;
}

export interface DailyEntry {
  id: string;
  date: string;
  learning: LearningData;
  work: WorkData;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyData {
  day: string;
  learningHours: number;
  productivityScore: number;
  date: string;
}

export interface Statistics {
  totalLearningHours: number;
  aiToolsLearned: number;
  reportsGenerated: number;
  productivityScore: number;
}

export interface GeneratedReport {
  executiveSummary: string;
  aiLearningSummary: string;
  workAccomplishments: string;
  challenges: string;
  tomorrowPlan: string;
  recommendations: string;
  generatedAt: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export const AI_TOOLS_OPTIONS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Copilot',
  'Midjourney',
  'DALL-E',
  'Stable Diffusion',
  'Cursor',
  'GitHub Copilot',
  'CodeWhisperer',
  'Hugging Face',
  'LangChain',
  'OpenAI API',
  'Anthropic API',
  'Other',
];

export const LEARNING_RESOURCES_OPTIONS = [
  'Official Documentation',
  'Online Courses',
  'YouTube Tutorials',
  'Blog Posts',
  'GitHub Repositories',
  'Research Papers',
  'Community Forums',
  'Books',
  'Podcasts',
  'Webinars',
  'Workshops',
  'Bootcamps',
];
