import { LearningData, WorkData } from '@/types';

// Default values for safety
const DEFAULT_LEARNING_DATA: LearningData = {
  learningHours: 0,
  aiToolsExplored: [],
  learningResources: '',
  conceptsLearned: '',
  keyTakeaways: '',
};

const DEFAULT_WORK_DATA: WorkData = {
  tasksCompleted: '',
  featuresDelivered: '',
  bugsFixed: '',
  tomorrowPlan: '',
  currentBlockers: '',
};

// Helper to safely get learning data with defaults
function safeLearningData(learning: LearningData | undefined | null): LearningData {
  if (!learning) return DEFAULT_LEARNING_DATA;
  return {
    learningHours: typeof learning.learningHours === 'number' ? learning.learningHours : 0,
    aiToolsExplored: Array.isArray(learning.aiToolsExplored) ? learning.aiToolsExplored : [],
    learningResources: typeof learning.learningResources === 'string' ? learning.learningResources : '',
    conceptsLearned: typeof learning.conceptsLearned === 'string' ? learning.conceptsLearned : '',
    keyTakeaways: typeof learning.keyTakeaways === 'string' ? learning.keyTakeaways : '',
  };
}

// Helper to safely get work data with defaults
function safeWorkData(work: WorkData | undefined | null): WorkData {
  if (!work) return DEFAULT_WORK_DATA;
  return {
    tasksCompleted: typeof work.tasksCompleted === 'string' ? work.tasksCompleted : '',
    featuresDelivered: typeof work.featuresDelivered === 'string' ? work.featuresDelivered : '',
    bugsFixed: typeof work.bugsFixed === 'string' ? work.bugsFixed : '',
    tomorrowPlan: typeof work.tomorrowPlan === 'string' ? work.tomorrowPlan : '',
    currentBlockers: typeof work.currentBlockers === 'string' ? work.currentBlockers : '',
  };
}

export function calculateLearningScore(learning: LearningData | undefined | null): number {
  const data = safeLearningData(learning);
  let score = 0;
  const maxScore = 100;

  // Learning hours: up to 20 points (up to 8 hours max)
  score += Math.min((data.learningHours || 0) * 2.5, 20);

  // AI tools explored: up to 20 points (2 points each, max 10)
  const toolsExplored = data.aiToolsExplored || [];
  score += Math.min(toolsExplored.length * 2, 20);

  // Learning resources: up to 15 points
  const learningResources = (data.learningResources || '').trim();
  if (learningResources) {
    const wordCount = learningResources.split(/\s+/).filter(w => w.length > 0).length;
    score += Math.min(wordCount * 0.5, 15);
  }

  // Concepts learned: up to 25 points
  const conceptsLearned = (data.conceptsLearned || '').trim();
  if (conceptsLearned) {
    const wordCount = conceptsLearned.split(/\s+/).filter(w => w.length > 0).length;
    score += Math.min(wordCount * 0.5, 25);
  }

  // Key takeaways: up to 20 points
  const keyTakeaways = (data.keyTakeaways || '').trim();
  if (keyTakeaways) {
    const wordCount = keyTakeaways.split(/\s+/).filter(w => w.length > 0).length;
    score += Math.min(wordCount * 0.4, 20);
  }

  return Math.round(score);
}

export function calculateProductivityScore(
  learning: LearningData | undefined | null,
  work: WorkData | undefined | null
): number {
  const safeLearning = safeLearningData(learning);
  const safeWork = safeWorkData(work);

  let score = 0;

  // Learning Hours (max 40)
  score += Math.min(safeLearning.learningHours * 10, 40);

  // AI Tools (max 20)
  score += Math.min(safeLearning.aiToolsExplored.length * 10, 20);

  // Tasks (max 20)
  const taskCount = safeWork.tasksCompleted
    ?.split('\n')
    .filter((t) => t.trim()).length || 0;

  score += Math.min(taskCount * 5, 20);

  // Features Delivered (max 10)
  const featureCount = safeWork.featuresDelivered
    ?.split('\n')
    .filter((t) => t.trim()).length || 0;

  score += Math.min(featureCount * 5, 10);

  // Tomorrow Plan (max 10)
  if (safeWork.tomorrowPlan?.trim()) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
}

export function calculateStatistics(
  entries: Array<{ learning: LearningData | undefined | null; work: WorkData | undefined | null }> | undefined | null
): {
  totalLearningHours: number;
  aiToolsLearned: number;
  reportsGenerated: number;
  productivityScore: number;
} {
  // Handle null/undefined entries array
  const safeEntries = Array.isArray(entries) ? entries : [];

  if (safeEntries.length === 0) {
    return {
      totalLearningHours: 0,
      aiToolsLearned: 0,
      reportsGenerated: 0,
      productivityScore: 0,
    };
  }

  const totalLearningHours = safeEntries.reduce(
    (sum, entry) => {
      const hours = safeLearningData(entry?.learning)?.learningHours || 0;
      return sum + hours;
    },
    0
  );

  const uniqueTools = new Set<string>();
  safeEntries.forEach(entry => {
    const tools = safeLearningData(entry?.learning)?.aiToolsExplored || [];
    tools.forEach(tool => {
      if (tool) uniqueTools.add(tool);
    });
  });

  const avgProductivity = safeEntries.length > 0
    ? safeEntries.reduce(
        (sum, entry) => sum + calculateProductivityScore(entry?.learning, entry?.work),
        0
      ) / safeEntries.length
    : 0;

  const reportsGenerated = safeEntries.filter(e => {
    const l = safeLearningData(e?.learning);
    const w = safeWorkData(e?.work);
    return (l.conceptsLearned || '').trim() || (w.tasksCompleted || '').trim();
  }).length;

  return {
    totalLearningHours: Math.round(totalLearningHours * 10) / 10,
    aiToolsLearned: uniqueTools.size,
    reportsGenerated,
    productivityScore: Math.round(avgProductivity),
  };
}
