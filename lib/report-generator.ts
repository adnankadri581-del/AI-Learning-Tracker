import { LearningData, WorkData, GeneratedReport, GeneratedEmail } from '@/types';

// Helper to safely get learning data with defaults
function safeLearningData(learning: LearningData | undefined | null): LearningData {
  if (!learning) {
    return {
      learningHours: 0,
      aiToolsExplored: [],
      learningResources: '',
      conceptsLearned: '',
      keyTakeaways: '',
    };
  }
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
  if (!work) {
    return {
      tasksCompleted: '',
      featuresDelivered: '',
      bugsFixed: '',
      tomorrowPlan: '',
      currentBlockers: '',
    };
  }
  return {
    tasksCompleted: typeof work.tasksCompleted === 'string' ? work.tasksCompleted : '',
    featuresDelivered: typeof work.featuresDelivered === 'string' ? work.featuresDelivered : '',
    bugsFixed: typeof work.bugsFixed === 'string' ? work.bugsFixed : '',
    tomorrowPlan: typeof work.tomorrowPlan === 'string' ? work.tomorrowPlan : '',
    currentBlockers: typeof work.currentBlockers === 'string' ? work.currentBlockers : '',
  };
}

export function generateReport(
  learning: LearningData | undefined | null,
  work: WorkData | undefined | null,
  date: string
): GeneratedReport {
  const safeLearning = safeLearningData(learning);
  const safeWork = safeWorkData(work);

  const today = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const aiToolsExplored = safeLearning.aiToolsExplored || [];
  const learningHours = safeLearning.learningHours || 0;

  // Executive Summary
  const executiveSummary = `On ${today}, significant progress was made in both AI learning initiatives and software development tasks. The learning session focused on exploring ${aiToolsExplored.length > 0 ? aiToolsExplored.join(', ') : 'various AI tools'}, with ${learningHours} hours dedicated to skill development. Development work included task completions and feature deliveries, contributing to overall project advancement.`;

  // AI Learning Summary
  const conceptsLearned = (safeLearning.conceptsLearned || '').trim();
  const keyTakeaways = safeLearning.keyTakeaways || 'Key takeaways were noted for future reference.';
  const aiLearningSummary = conceptsLearned
    ? `During ${learningHours} hours of focused learning, the following key concepts were explored:\n\n${conceptsLearned}\n\nKey takeaways from the session:\n${keyTakeaways}`
    : 'No specific concepts were documented during today\'s learning session.';

  // Work Accomplishments
  const tasksCompleted = (safeWork.tasksCompleted || '').trim();
  const featuresDelivered = (safeWork.featuresDelivered || '').trim();
  const bugsFixed = (safeWork.bugsFixed || '').trim();

  const workAccomplishments = [
    tasksCompleted && `Tasks Completed:\n${tasksCompleted}`,
    featuresDelivered && `Features Delivered:\n${featuresDelivered}`,
    bugsFixed && `Bugs Fixed:\n${bugsFixed}`,
  ]
    .filter(Boolean)
    .join('\n\n') || 'No specific accomplishments were documented for today.';

  // Challenges
  const currentBlockers = (safeWork.currentBlockers || '').trim();
  const challenges = currentBlockers
    ? `Current Blockers:\n${currentBlockers}`
    : 'No blockers were reported for today.';

  // Tomorrow's Plan
  const tomorrowPlan = (safeWork.tomorrowPlan || '').trim();
  const tomorrowPlanText = tomorrowPlan
    ? `Planned Activities:\n${tomorrowPlan}`
    : 'No specific plan has been outlined for tomorrow.';

  // Recommendations
  const recommendations = generateRecommendations(safeLearning, safeWork);

  return {
    executiveSummary,
    aiLearningSummary,
    workAccomplishments,
    challenges,
    tomorrowPlan: tomorrowPlanText,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

function generateRecommendations(learning: LearningData, work: WorkData): string {
  const recommendations: string[] = [];

  const safeLearning = safeLearningData(learning);
  const safeWork = safeWorkData(work);

  // Learning recommendations
  const learningHours = safeLearning.learningHours || 0;
  const aiToolsExplored = safeLearning.aiToolsExplored || [];
  const keyTakeaways = (safeLearning.keyTakeaways || '').trim();

  if (learningHours < 2) {
    recommendations.push('Consider increasing daily learning hours to at least 2 hours for consistent skill development.');
  }
  if (aiToolsExplored.length < 2) {
    recommendations.push('Expanding the range of AI tools explored can provide broader perspective and skill versatility.');
  }
  if (!keyTakeaways) {
    recommendations.push('Documenting key takeaways helps reinforce learning and creates valuable reference material.');
  }

  // Work recommendations
  const currentBlockers = (safeWork.currentBlockers || '').trim();
  const tomorrowPlan = (safeWork.tomorrowPlan || '').trim();
  const tasksCompleted = (safeWork.tasksCompleted || '').trim();
  const featuresDelivered = (safeWork.featuresDelivered || '').trim();

  if (currentBlockers) {
    recommendations.push('Escalate current blockers to ensure timely resolution and maintain productivity.');
  }
  if (!tomorrowPlan) {
    recommendations.push('Creating a detailed plan for tomorrow can improve focus and productivity.');
  }

  // Balance recommendations
  const hasWork = tasksCompleted || featuresDelivered;
  const hasLearning = learningHours > 0;
  if (hasWork && !hasLearning) {
    recommendations.push('Incorporating learning activities alongside work tasks promotes continuous improvement.');
  }
  if (hasLearning && !hasWork) {
    recommendations.push('Applying learned concepts to real work tasks can reinforce understanding and demonstrate value.');
  }

  return recommendations.length > 0
    ? recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')
    : 'Continue maintaining the current pace. Consider setting stretch goals for continued growth.';
}

export function generateEmail(
  learning: LearningData | undefined | null,
  work: WorkData | undefined | null,
  date: string,
  userName: string = 'Team Member'
): GeneratedEmail {
  const safeLearning = safeLearningData(learning);
  const safeWork = safeWorkData(work);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const subject = `Daily Status Update - ${formattedDate}`;

  const sections: string[] = [
    `Hi Team,`,
    ``,
    `Here is my daily status update for ${formattedDate}.`,
    ``,
  ];

  // Learning section
  const learningHours = safeLearning.learningHours || 0;
  const aiToolsExplored = safeLearning.aiToolsExplored || [];
  const conceptsLearned = (safeLearning.conceptsLearned || '').trim();

  if (learningHours > 0 || aiToolsExplored.length > 0) {
    sections.push(`=== Learning & Development ===`);
    sections.push(`Learning Hours: ${learningHours}`);
    if (aiToolsExplored.length > 0) {
      sections.push(`AI Tools Explored: ${aiToolsExplored.join(', ')}`);
    }
    if (conceptsLearned) {
      const firstLine = conceptsLearned.split('\n')[0] || '';
      sections.push(`Key Concepts: ${firstLine}${conceptsLearned.split('\n').length > 1 ? '...' : ''}`);
    }
    sections.push(``);
  }

  // Work section
  sections.push(`=== Work Update ===`);

  const tasksCompleted = (safeWork.tasksCompleted || '').trim();
  const featuresDelivered = (safeWork.featuresDelivered || '').trim();
  const bugsFixed = (safeWork.bugsFixed || '').trim();

  if (tasksCompleted) {
    sections.push(`Tasks Completed:`);
    tasksCompleted.split('\n').filter(l => l.trim()).forEach(line => {
      sections.push(`  - ${line.trim()}`);
    });
  }
  if (featuresDelivered) {
    sections.push(`Features Delivered:`);
    featuresDelivered.split('\n').filter(l => l.trim()).forEach(line => {
      sections.push(`  - ${line.trim()}`);
    });
  }
  if (bugsFixed) {
    sections.push(`Bugs Fixed:`);
    bugsFixed.split('\n').filter(l => l.trim()).forEach(line => {
      sections.push(`  - ${line.trim()}`);
    });
  }
  sections.push(``);

  // Blockers
  const currentBlockers = (safeWork.currentBlockers || '').trim();
  if (currentBlockers) {
    sections.push(`=== Current Blockers ===`);
    sections.push(currentBlockers);
    sections.push(``);
  }

  // Tomorrow's plan
  const tomorrowPlan = (safeWork.tomorrowPlan || '').trim();
  sections.push(`=== Tomorrow's Plan ===`);
  sections.push(tomorrowPlan || 'Will be determined based on priorities.');
  sections.push(``);

  sections.push(`Best regards,`);
  sections.push(userName);

  return {
    subject,
    body: sections.join('\n'),
  };
}

export function generateManagerSummary(
  learning: LearningData | undefined | null,
  work: WorkData | undefined | null,
  date: string,
  productivityScore: number
): string {
  const safeLearning = safeLearningData(learning);
  const safeWork = safeWorkData(work);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const parts: string[] = [];

  // Learning part
  const learningHours = safeLearning.learningHours || 0;
  const aiToolsExplored = safeLearning.aiToolsExplored || [];

  if (learningHours > 0) {
    parts.push(`completed ${learningHours} hours of AI learning`);
    if (aiToolsExplored.length > 0) {
      parts.push(`explored ${aiToolsExplored.length} AI tool${aiToolsExplored.length > 1 ? 's' : ''}`);
    }
  }

  // Work part
  const tasksCompleted = (safeWork.tasksCompleted || '').trim();
  const featuresDelivered = (safeWork.featuresDelivered || '').trim();

  const taskCount = tasksCompleted ? tasksCompleted.split('\n').filter(l => l.trim()).length : 0;
  const featureCount = featuresDelivered ? featuresDelivered.split('\n').filter(l => l.trim()).length : 0;

  if (taskCount > 0 || featureCount > 0) {
    parts.push(`completed ${taskCount + featureCount} development task${taskCount + featureCount > 1 ? 's' : ''}`);
  }

  // Combine
if (parts.length === 0) {
  return `No activity updates were recorded for ${formattedDate}. Performance evaluation requires additional learning and work data.`;
}

const summary = `The employee ${parts.join(', ')} on ${formattedDate}. Productivity score currently stands at ${productivityScore}%, with opportunities to improve through consistent learning and task completion.`;

return summary;
}
