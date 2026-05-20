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

export const companies: string[] = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
  'Adobe', 'Tesla', 'NVIDIA', 'Spotify', 'OpenAI', 'Figma',
  'Oracle', 'Intel', 'IBM', 'Salesforce', 'Uber', 'Airbnb',
  'JPMorgan', 'Goldman Sachs', 'Infosys', 'TCS', 'Wipro',
  'Zoho', 'Freshworks', 'Paytm', 'Flipkart', 'Swiggy', 'Zomato',
  'Cognizant', 'Accenture', 'Capgemini', 'Deloitte'
];

export const trendingRoles: JobRole[] = [
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
  {
    icon: 'ads_click',
    title: 'Growth Analyst',
    growth: '+22% Growth',
    desc: 'Analyze acquisition loops, referral systems, and user acquisition to accelerate viral loops.',
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

export const AVAILABLE_ROLES: string[] = trendingRoles.map(role => role.title).sort();
