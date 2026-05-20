// TypeScript Interfaces for Typesafety and Future DB/API Migrations

export interface JobRole {
  icon: string;
  title: string;
  growth: string;
  desc: string;
  salary: string;
  demand: string;
  demandColor: string;
  category: string;
  demandPercentage: number;
  hiringTrend: string;
}

export interface UserProfile {
  name: string;
  briefing: string;
}

export interface DashboardRoadmap {
  targetRole: string;
  percentage: number;
  skills: {
    name: string;
    width: string;
    completed: boolean;
    inProgress: boolean;
  }[];
}

export interface MarketPulseItem {
  skill: string;
  desc: string;
  change: string;
}

export interface MilestoneItem {
  label: string;
  time: string;
  color: string;
}

export interface MarketHub {
  city: string;
  delta: string;
  trend: string;
  trendColor: string;
  icon: string;
}

export interface SkillPremium {
  name: string;
  percentage: string;
  colorClass: string;
}

export interface SalaryBenchmark {
  role: string;
  experience: string;
  location: string;
  whiskerBottom: string; // CSS style bottom e.g., '20%'
  whiskerHeight: string; // CSS style height e.g., '65%'
  boxHeight: string;     // CSS style height e.g., '40%'
  boxBottom: string;     // CSS style bottom/margin e.g., '30%'
  colorFrom: string;     // e.g., 'from-primary/80'
  colorTo: string;       // e.g., 'to-primary/40'
  borderColor: string;   // e.g., 'border-primary/20'
  medianTop: string;     // Median line top offset e.g., '40%'
}

export interface RoadmapStage {
  stage: number;
  status: 'Completed' | 'In Progress' | 'Locked';
  title: string;
  timeline: string;
  desc: string;
  skills: string[];
  subtasks?: {
    name: string;
    percentage: string;
    status: 'Completed' | 'In Progress' | 'Locked' | 'Start Next';
  }[];
}

export interface SkillGap {
  name: string;
  level: string;
  progressWidth: string;
  colorClass: string;
  aiSuggestion?: boolean;
}

export interface LearningStep {
  category: string;
  title: string;
  desc: string;
  icon: string;
  buttonLabel: string;
}

export interface ResumeSuggestion {
  type: 'warning' | 'add';
  title: string;
  desc: string;
}

export interface PriorityFix {
  icon: string;
  colorClass: string;
  bgClass: string;
  title: string;
  desc: string;
}

export interface ATSChecklist {
  label: string;
  status: 'Pass' | 'Fail';
}

export interface FormulaAnalysis {
  type: 'strong' | 'weak';
  title: string;
  example: string;
  badges: string[];
}

export interface InterviewMessage {
  sender: 'ai' | 'user';
  text: string;
  avatar: string;
}

export interface SimulatorMetric {
  label: string;
  valueText: string;
  colorClass: string;
  progressWidth: string;
}

// ----------------------------------------------------
// Concrete Mock Data Implementations
// ----------------------------------------------------

export const companies: string[] = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
  'Adobe', 'Tesla', 'NVIDIA', 'Spotify', 'OpenAI', 'Figma',
  'Oracle', 'Intel', 'IBM', 'Salesforce', 'Uber', 'Airbnb',
  'JPMorgan', 'Goldman Sachs', 'Infosys', 'TCS', 'Wipro',
  'Zoho', 'Freshworks', 'Paytm', 'Flipkart', 'Swiggy', 'Zomato',
  'Cognizant', 'Accenture', 'Capgemini', 'Deloitte'
];

export const trendingRoles: JobRole[] = [
  // Engineering Category
  {
    icon: 'code',
    title: 'Frontend Engineer',
    growth: '+28% Growth',
    desc: 'Craft responsive, performant, and premium client-side interfaces using modern frameworks.',
    salary: '$110k - $165k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Engineering',
    demandPercentage: 86,
    hiringTrend: 'Accelerating'
  },
  {
    icon: 'dns',
    title: 'Backend Engineer',
    growth: '+32% Growth',
    desc: 'Design robust server architectures, design high-scale database structures, and develop high-speed APIs.',
    salary: '$120k - $185k',
    demand: 'Very High',
    demandColor: 'text-primary',
    category: 'Engineering',
    demandPercentage: 92,
    hiringTrend: 'Hot'
  },
  {
    icon: 'layers',
    title: 'Full Stack Developer',
    growth: '+38% Growth',
    desc: 'Handle end-to-end web architectures, bridging fluid UI designs with robust backend databases.',
    salary: '$130k - $190k',
    demand: 'Very High',
    demandColor: 'text-primary',
    category: 'Engineering',
    demandPercentage: 95,
    hiringTrend: 'Surging'
  },
  {
    icon: 'phone_android',
    title: 'Mobile App Developer',
    growth: '+22% Growth',
    desc: 'Build native iOS and Android apps with beautiful micro-interactions using React Native and Flutter.',
    salary: '$105k - $160k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'Engineering',
    demandPercentage: 78,
    hiringTrend: 'Stable'
  },
  {
    icon: 'terminal',
    title: 'Software Engineer',
    growth: '+18% Growth',
    desc: 'Solve complex algorithmic problems and maintain critical foundational enterprise systems.',
    salary: '$115k - $170k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Engineering',
    demandPercentage: 82,
    hiringTrend: 'Stable'
  },

  // AI & Data (AI/ML and Data Categories)
  {
    icon: 'smart_toy',
    title: 'AI/ML Engineer',
    growth: '+62% Growth',
    desc: 'Architect and deploy scalable deep learning models and neural networks for enterprise systems.',
    salary: '$160k - $245k',
    demand: 'Very High',
    demandColor: 'text-secondary',
    category: 'AI/ML',
    demandPercentage: 98,
    hiringTrend: 'Surging'
  },
  {
    icon: 'forum',
    title: 'Prompt Engineer',
    growth: '+48% Demand',
    desc: 'Structure optimized LLM interactions, system instructions, and advanced model context pipelines.',
    salary: '$125k - $175k',
    demand: 'High',
    demandColor: 'text-secondary',
    category: 'AI/ML',
    demandPercentage: 84,
    hiringTrend: 'Accelerating'
  },
  {
    icon: 'psychology',
    title: 'LLM Engineer',
    growth: '+74% Growth',
    desc: 'Build and fine-tune large language model pipelines, retrieval networks, and RAG systems.',
    salary: '$150k - $230k',
    demand: 'Very High',
    demandColor: 'text-secondary',
    category: 'AI/ML',
    demandPercentage: 97,
    hiringTrend: 'Hot'
  },
  {
    icon: 'robot_2',
    title: 'AI Automation Engineer',
    growth: '+35% Growth',
    desc: 'Integrate artificial intelligence agents to automate business operational pipelines and workflows.',
    salary: '$115k - $165k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'AI/ML',
    demandPercentage: 80,
    hiringTrend: 'Stable'
  },
  {
    icon: 'insights',
    title: 'Data Scientist',
    growth: '+26% Growth',
    desc: 'Use mathematical models and statistics to extract predictive signals from unstructured enterprise data.',
    salary: '$130k - $195k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Data',
    demandPercentage: 88,
    hiringTrend: 'Stable'
  },
  {
    icon: 'analytics',
    title: 'Data Analyst',
    growth: '+15% Growth',
    desc: 'Perform statistical studies on complex tables to synthesize actionable business intelligence reports.',
    salary: '$90k - $140k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'Data',
    demandPercentage: 74,
    hiringTrend: 'Stable'
  },

  // Cloud & Infra
  {
    icon: 'cloud',
    title: 'Cloud Architect',
    growth: '+28% Growth',
    desc: 'Design secure, fault-tolerant, and highly available global cloud-native systems on AWS and Azure.',
    salary: '$155k - $235k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Cloud',
    demandPercentage: 91,
    hiringTrend: 'Accelerating'
  },
  {
    icon: 'settings_suggest',
    title: 'DevOps Engineer',
    growth: '+25% Growth',
    desc: 'Build continuous delivery pipelines, system monitors, and automated script infrastructure.',
    salary: '$120k - $180k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Cloud',
    demandPercentage: 87,
    hiringTrend: 'Stable'
  },
  {
    icon: 'speed',
    title: 'Site Reliability Engineer',
    growth: '+20% Growth',
    desc: 'Engineer resilient infrastructures to ensure 99.99% system availability and mitigate incidents.',
    salary: '$135k - $200k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Cloud',
    demandPercentage: 85,
    hiringTrend: 'Stable'
  },
  {
    icon: 'hub',
    title: 'Platform Engineer',
    growth: '+30% Growth',
    desc: 'Design and build unified internal developer portals to streamline self-service developer lifecycles.',
    salary: '$140k - $210k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Cloud',
    demandPercentage: 89,
    hiringTrend: 'Hot'
  },

  // Security
  {
    icon: 'security',
    title: 'Cybersecurity Analyst',
    growth: '+40% Growth',
    desc: 'Defend organizational assets by auditing security systems and resolving vulnerabilities.',
    salary: '$110k - $165k',
    demand: 'Very High',
    demandColor: 'text-secondary',
    category: 'Cybersecurity',
    demandPercentage: 93,
    hiringTrend: 'Hot'
  },
  {
    icon: 'admin_panel_settings',
    title: 'Security Engineer',
    growth: '+34% Growth',
    desc: 'Build systems and protocols to encrypt and protect organizational data pipelines.',
    salary: '$125k - $185k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Cybersecurity',
    demandPercentage: 89,
    hiringTrend: 'Stable'
  },
  {
    icon: 'vpn_key',
    title: 'Ethical Hacker',
    growth: '+26% Growth',
    desc: 'Conduct penetration testing to discover security loopholes before malicious agents do.',
    salary: '$115k - $175k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'Cybersecurity',
    demandPercentage: 81,
    hiringTrend: 'Stable'
  },

  // Product & Design
  {
    icon: 'assignment',
    title: 'Product Manager',
    growth: '+24% Growth',
    desc: 'Define system roadmap strategy, prioritize product backlogs, and align cross-functional engineering teams.',
    salary: '$130k - $205k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Product',
    demandPercentage: 85,
    hiringTrend: 'Stable'
  },
  {
    icon: 'query_stats',
    title: 'Product Analyst',
    growth: '+18% Growth',
    desc: 'Track and analyze key cohort retention metrics to advise on product experience optimizations.',
    salary: '$95k - $145k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'Product',
    demandPercentage: 76,
    hiringTrend: 'Stable'
  },
  {
    icon: 'palette',
    title: 'UI Designer',
    growth: '+20% Growth',
    desc: 'Build high-fidelity vector patterns, UI design assets, style systems, and layout specs.',
    salary: '$100k - $155k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Design',
    demandPercentage: 83,
    hiringTrend: 'Stable'
  },
  {
    icon: 'group',
    title: 'UX Researcher',
    growth: '+14% Growth',
    desc: 'Conduct detailed usability sessions and interviews to map precise user journeys and friction points.',
    salary: '$95k - $140k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'Design',
    demandPercentage: 72,
    hiringTrend: 'Stable'
  },

  // Finance & Business
  {
    icon: 'trending_up',
    title: 'Quantitative Developer',
    growth: '+30% Growth',
    desc: 'Design trading algorithms and high-speed financial systems for global banking hubs.',
    salary: '$150k - $250k',
    demand: 'Very High',
    demandColor: 'text-secondary',
    category: 'Finance',
    demandPercentage: 94,
    hiringTrend: 'Hot'
  },
  {
    icon: 'account_balance',
    title: 'Financial Analyst',
    growth: '+16% Growth',
    desc: 'Build quantitative spreadsheet models to advise on investments and portfolio distributions.',
    salary: '$90k - $145k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'Finance',
    demandPercentage: 75,
    hiringTrend: 'Stable'
  },

  // Marketing
  {
    icon: 'ads_click',
    title: 'Growth Analyst',
    growth: '+22% Growth',
    desc: 'Analyze acquisition loops, referral systems, and user activation to accelerate viral loops.',
    salary: '$95k - $150k',
    demand: 'High',
    demandColor: 'text-primary',
    category: 'Marketing',
    demandPercentage: 81,
    hiringTrend: 'Stable'
  },
  {
    icon: 'campaign',
    title: 'Marketing Analyst',
    growth: '+14% Growth',
    desc: 'Evaluate organic acquisition models and PPC metrics to optimize brand reach performance.',
    salary: '$85k - $130k',
    demand: 'Steady',
    demandColor: 'text-on-surface-variant',
    category: 'Marketing',
    demandPercentage: 70,
    hiringTrend: 'Stable'
  }
];

export const AVAILABLE_ROLES = trendingRoles.map(role => role.title).sort();

export const userProfile: UserProfile = {
  name: 'Alex',
  briefing: 'Here is your daily career intelligence briefing.',
};

export const dashboardRoadmap: DashboardRoadmap = {
  targetRole: 'Senior Cloud Architect',
  percentage: 72,
  skills: [
    { name: 'Cloud Fundamentals', width: '100%', completed: true, inProgress: false },
    { name: 'System Design', width: '60%', completed: true, inProgress: false },
    { name: 'AWS Cert', width: '40%', completed: false, inProgress: true },
    { name: 'Leadership', width: '10%', completed: false, inProgress: false },
  ],
};

export const dashboardInterviewScore = {
  score: 8.4,
  max: 10,
};

export const marketPulseList: MarketPulseItem[] = [
  {
    skill: 'PyTorch',
    desc: 'Demand up in SF Bay Area this week.',
    change: '+12%',
  },
  {
    skill: 'System Design',
    desc: 'Mentioned in 85% of Staff Engineer postings.',
    change: '+8%',
  },
];

export const activityStreak = {
  currentStreak: 3,
  bestStreak: 14,
  heights: [30, 50, 70, 45, 80, 60, 40], // Weekly visual heights
};

export const recentMilestones: MilestoneItem[] = [
  { label: 'Completed AWS Mocks', time: 'Today, 10:30 AM', color: 'bg-primary' },
  { label: 'Resume ATS Optimized', time: 'Oct 12, 2023', color: 'bg-secondary' },
  { label: 'Skill Added: Kubernetes', time: 'Oct 08, 2023', color: 'bg-surface-container-high' },
];

export const marketHubs: MarketHub[] = [
  {
    city: 'SF Bay Area',
    delta: '+14%',
    trend: 'AI & GenAI roles',
    trendColor: 'text-primary',
    icon: 'local_fire_department',
  },
  {
    city: 'New York City',
    delta: '+5%',
    trend: 'FinTech steady',
    trendColor: 'text-on-surface-variant',
    icon: 'trending_flat',
  },
  {
    city: 'Austin',
    delta: '+22%',
    trend: 'Cloud & Security surge',
    trendColor: 'text-primary',
    icon: 'arrow_upward',
  },
];

export const skillPremiums: SkillPremium[] = [
  { name: 'PyTorch / LLM Fine-tuning', percentage: '+28%', colorClass: 'bg-primary' },
  { name: 'Kubernetes & Orchestration', percentage: '+18%', colorClass: 'bg-secondary' },
  { name: 'Rust / System Dev', percentage: '+15%', colorClass: 'bg-tertiary-container' },
  { name: 'React / Next.js Frameworks', percentage: '+5%', colorClass: 'bg-outline' },
];

export const salaryBenchmarks: SalaryBenchmark[] = [
  {
    role: 'AI Engineer',
    experience: 'L5 (Senior)',
    location: 'San Francisco',
    whiskerBottom: '20%',
    whiskerHeight: '65%',
    boxHeight: '40%',
    boxBottom: '30%',
    colorFrom: 'from-primary/80',
    colorTo: 'to-primary/40',
    borderColor: 'border-primary/20',
    medianTop: '40%',
  },
  {
    role: 'Cloud Architect',
    experience: 'L5 (Senior)',
    location: 'San Francisco',
    whiskerBottom: '15%',
    whiskerHeight: '60%',
    boxHeight: '35%',
    boxBottom: '25%',
    colorFrom: 'from-secondary/80',
    colorTo: 'to-secondary/40',
    borderColor: 'border-secondary/20',
    medianTop: '50%',
  },
  {
    role: 'Full Stack Dev',
    experience: 'L5 (Senior)',
    location: 'San Francisco',
    whiskerBottom: '10%',
    whiskerHeight: '55%',
    boxHeight: '30%',
    boxBottom: '18%',
    colorFrom: 'from-tertiary-container/80',
    colorTo: 'to-tertiary-container/40',
    borderColor: 'border-tertiary-container/20',
    medianTop: '60%',
  },
];

export const targetRoleDetails = {
  title: 'Senior Cloud Architect',
  description: 'Your personalized roadmap to mastering scalable cloud infrastructure and system design. Estimated timeline: 12-18 months.',
};

export const roadmapStages: RoadmapStage[] = [
  {
    stage: 1,
    status: 'Completed',
    title: 'Foundation & Discovery',
    timeline: '3 Months',
    desc: 'Mastered core networking, basic cloud administration, and Linux/Unix command-line essentials.',
    skills: ['Linux Administration', 'TCP/IP Networking', 'AWS Cloud Practitioner'],
  },
  {
    stage: 2,
    status: 'In Progress',
    title: 'Cloud Specialization',
    timeline: 'Month 4 of 6',
    desc: 'Deep dive into advanced serverless architecture, containers, automation pipelines, and infrastructure as code.',
    skills: [],
    subtasks: [
      { name: 'Master AWS Lambda & API Gateway', percentage: '80%', status: 'In Progress' },
      { name: 'Kubernetes Architecture & Fundamentals', percentage: 'Start Next', status: 'Start Next' },
    ],
  },
  {
    stage: 3,
    status: 'Locked',
    title: 'System Design Mastery',
    timeline: 'Future Phase',
    desc: 'Architecting highly available, distributed, and fault-tolerant cloud-native software systems.',
    skills: ['Microservices Design', 'Data Partitioning & Replication'],
  },
];

export const skillGaps: SkillGap[] = [
  { name: 'AWS Cloud Architecture', level: 'Level 3 / 5', progressWidth: '3/5', colorClass: 'bg-primary' },
  { name: 'Distributed System Design', level: 'Level 2 / 5', progressWidth: '2/5', colorClass: 'bg-secondary', aiSuggestion: true },
  { name: 'DevOps & Automation', level: 'Level 4 / 5', progressWidth: '4/5', colorClass: 'bg-tertiary-container' },
];

export const recommendedNextStep: LearningStep = {
  category: 'Recommended Next Step',
  title: 'Grokking the System Design Interview',
  desc: 'Master critical architectural patterns required for senior roles. Focuses heavily on data partitioning, scalability, and replication.',
  icon: 'school',
  buttonLabel: 'Start Learning Module',
};

export const parsedResumeMetadata = {
  filename: 'jdoe_resume_2024.pdf',
  status: 'Parsed',
  atsScore: 85,
  keywordMatch: 'High',
  keywordMatchDesc: 'Matches top tier industry terms for target roles.',
};

export const actionableSuggestions: ResumeSuggestion[] = [
  {
    type: 'warning',
    title: 'Quantify your impact',
    desc: 'Instead of "Managed team," try "Managed a 5-person engineering team, reducing project delivery time by 15%."',
  },
  {
    type: 'add',
    title: 'Add missing skill: Docker',
    desc: 'Based on the target role, explicitly mentioning Docker experience will boost ATS compatibility.',
  },
];

export const priorityFixes: PriorityFix[] = [
  {
    icon: 'bar_chart',
    colorClass: 'text-on-error-container',
    bgClass: 'bg-error-container',
    title: 'Quantify impact in Experience section',
    desc: "3 bullet points under 'Data Corp' lack measurable metrics. Add percentages or dollar values.",
  },
  {
    icon: 'extension',
    colorClass: 'text-tertiary',
    bgClass: 'bg-tertiary/10',
    title: 'Add missing core skills',
    desc: "'SQL' and 'A/B Testing' are frequently requested for Product Analyst roles but missing.",
  },
  {
    icon: 'format_paint',
    colorClass: 'text-secondary',
    bgClass: 'bg-secondary-container/20',
    title: 'Inconsistent formatting detected',
    desc: 'Date alignment shifts on page 2. Standardize to right-aligned MM/YYYY format.',
  },
];

export const atsChecklistItems: ATSChecklist[] = [
  { label: 'Standard Section Headers', status: 'Pass' },
  { label: 'Machine-Readable Font', status: 'Pass' },
  { label: 'Complex Tables & Graphics', status: 'Fail' },
];

export const matchedSkills: string[] = ['Data Visualization', 'Python', 'Agile'];
export const missingSkills: string[] = ['SQL', 'A/B Testing'];

export const googleFormulaAnalysis: FormulaAnalysis[] = [
  {
    type: 'strong',
    title: 'Strong Impact',
    example: '"Increased user retention by 15% (X) over 6 months (Y) by designing and deploying a new onboarding funnel (Z)."',
    badges: ['Action Verb', 'Quantified Impact'],
  },
  {
    type: 'weak',
    title: 'Needs Improvement',
    example: '"Helped with data analysis for the marketing team\'s new campaign launches."',
    badges: ["Weak Verb ('Helped')", 'No Metrics'],
  },
];

export const interviewMessages: InterviewMessage[] = [
  {
    sender: 'ai',
    text: "Hello! Let's start with a classic. Can you tell me about a time you had to overcome a significant technical challenge?",
    avatar: 'smart_toy',
  },
  {
    sender: 'user',
    text: 'Certainly. In my last project, we were migrating a monolithic database to a microservices architecture. Halfway through, we encountered severe latency issues...',
    avatar: 'person',
  },
];

export const liveCoachingMetrics: SimulatorMetric[] = [
  {
    label: 'Confidence Index',
    valueText: 'High (85%)',
    colorClass: 'bg-secondary',
    progressWidth: '85%',
  },
  {
    label: 'Pacing Rate',
    valueText: 'Excellent',
    colorClass: 'bg-primary',
    progressWidth: '100%', // Styled as segments in UI
  },
];

export const targetRoleRequirements: string[] = [
  '5+ years experience building highly-scalable SaaS architectures.',
  'Proven capability balancing complex technical constraints with robust UX standards.',
  'Excellent command of API gateways, web socket clustering, and message brokers.',
];

export const parsedResumeHighlights: string[] = [
  'Lead engineer migrating database monolithic systems into serverless AWS clusters.',
  'Proficient in Docker, AWS, React, and PostgreSQL schema optimizations.',
];
