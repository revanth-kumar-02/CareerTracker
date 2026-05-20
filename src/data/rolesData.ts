export interface RoleData {
  id: string;
  title: string;
  icon: string;
  category: 'Engineering' | 'Design' | 'AI & Data' | 'Security';
  desc: string;
  techs: string[];
  friendliness: 'Beginner-Friendly' | 'Moderate' | 'Advanced';
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  badge: 'Hot' | 'Surging' | 'Stable' | 'High Demand' | 'New';
  phases: {
    title: string;
    description: string;
    topics: string[];
  }[];
  tools: string[];
  projects: string[];
  codingScale: number; // 1-10
  creativityScale: number; // 1-10
}

export interface SkillItem {
  name: string;
  category: string;
  matters: string;
  whereUsed: string[];
  roles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  friendliness: string;
  relatedTechs: string[];
}

export const ROLES: RoleData[] = [
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    icon: 'smart_toy',
    category: 'AI & Data',
    desc: 'Architect and deploy neural networks, integrate large language models, and build next-generation smart agents.',
    techs: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'Vector Databases'],
    friendliness: 'Advanced',
    duration: '9-12 Months',
    difficulty: 'Hard',
    badge: 'Surging',
    tools: ['Jupyter', 'OpenAI API', 'Pinecone', 'Docker'],
    projects: ['Semantic Search Engine', 'Multi-Agent Support Chatbot', 'LLM Fine-tuning Pipeline'],
    codingScale: 9,
    creativityScale: 7,
    phases: [
      { title: 'Phase 1: Foundations', description: 'Python syntax, linear algebra, statistics, and basic machine learning principles.', topics: ['Python', 'NumPy/Pandas', 'Linear Algebra'] },
      { title: 'Phase 2: Deep Learning', description: 'Neural networks, PyTorch modules, training loops, and computer vision / NLP fundamentals.', topics: ['PyTorch', 'CNNs/RNNs', 'Optimization'] },
      { title: 'Phase 3: LLMs & RAG', description: 'Leveraging APIs, vector databases, prompt structure, and Retrieval Augmented Generation.', topics: ['LangChain', 'Pinecone', 'LLM APIs'] },
      { title: 'Phase 4: MLOps', description: 'Deploying models at scale, microservices, pipeline monitoring, and serverless AI routing.', topics: ['FastAPI', 'Docker', 'Kubernetes'] }
    ]
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    icon: 'code',
    category: 'Engineering',
    desc: 'Craft responsive, pixel-perfect user interfaces and modern interactive experiences using robust client-side frameworks.',
    techs: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Web APIs'],
    friendliness: 'Beginner-Friendly',
    duration: '6 Months',
    difficulty: 'Medium',
    badge: 'High Demand',
    tools: ['Vite', 'VS Code', 'Git', 'Figma'],
    projects: ['Interactive Dashboard SaaS', 'E-commerce UI Flow', 'Real-time Chat App'],
    codingScale: 7,
    creativityScale: 9,
    phases: [
      { title: 'Phase 1: Foundations', description: 'Semantic HTML, structural CSS layout, flexbox/grid, and modern JavaScript syntax.', topics: ['HTML5 & CSS3', 'JavaScript ES6+', 'Git/GitHub'] },
      { title: 'Phase 2: UI Engineering', description: 'Component-driven workflows, styled components, basic responsive design, and animations.', topics: ['TailwindCSS', 'React Basics', 'State & Props'] },
      { title: 'Phase 3: Core Architecture', description: 'State management, custom hooks, network operations, routing, and form verification.', topics: ['TypeScript', 'React Router', 'Redux / Zustand'] },
      { title: 'Phase 4: Meta-Frameworks', description: 'Server-side rendering, static site creation, search optimization, and hosting deployment.', topics: ['Next.js', 'Vercel', 'Web Vitals'] }
    ]
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    icon: 'layers',
    category: 'Engineering',
    desc: 'Build complete end-to-end applications, connecting fluid user interfaces with secure, performant database systems.',
    techs: ['Node.js', 'Express', 'PostgreSQL', 'React', 'TypeScript'],
    friendliness: 'Moderate',
    duration: '8-10 Months',
    difficulty: 'Medium',
    badge: 'Hot',
    tools: ['Postman', 'Docker', 'Prisma', 'Render'],
    projects: ['Collaborative Kanban App', 'RESTful API Marketplace', 'Social Media Platform'],
    codingScale: 8,
    creativityScale: 7,
    phases: [
      { title: 'Phase 1: Frontend Stack', description: 'Master UI layouts, client state, components, and async API integration.', topics: ['HTML/CSS/JS', 'React', 'Axios'] },
      { title: 'Phase 2: Backend Core', description: 'Server architectures, HTTP routing, controllers, middlewares, and server environments.', topics: ['Node.js', 'Express', 'REST APIs'] },
      { title: 'Phase 3: Database Design', description: 'Relational schemas, ORM models, transaction management, and indexing systems.', topics: ['PostgreSQL', 'SQL', 'Prisma ORM'] },
      { title: 'Phase 4: System Integration', description: 'User authentication (JWT/OAuth), security practices, file storage, and containerization.', topics: ['Auth0', 'Docker', 'CI/CD Pipelines'] }
    ]
  },
  {
    id: 'uiux-designer',
    title: 'UI/UX Designer',
    icon: 'palette',
    category: 'Design',
    desc: 'Conduct user research, design wireframes, build high-fidelity interactive mockups, and construct component libraries.',
    techs: ['Figma', 'User Research', 'Wireframing', 'Typography', 'Interactive Prototyping'],
    friendliness: 'Beginner-Friendly',
    duration: '4-6 Months',
    difficulty: 'Easy',
    badge: 'High Demand',
    tools: ['Figma', 'Miro', 'Adobe CC', 'Lottie'],
    projects: ['Mobile Finance App Design', 'SaaS Platform Redesign Study', 'Interactive Design System'],
    codingScale: 2,
    creativityScale: 10,
    phases: [
      { title: 'Phase 1: Foundations', description: 'Design concepts, grid layouts, color theories, typography scales, and UI fundamentals.', topics: ['Color Theory', 'Grid Systems', 'Typography'] },
      { title: 'Phase 2: Figma Mastery', description: 'Auto-layout models, component variants, library architecture, and advanced prototypes.', topics: ['Auto Layout', 'Design Tokens', 'Micro-interactions'] },
      { title: 'Phase 3: User Experience', description: 'Creating user personas, interview studies, empathy mapping, and high-fidelity testing.', topics: ['User Research', 'Wireframing', 'User Testing'] },
      { title: 'Phase 4: Systems & Handoff', description: 'Structuring premium corporate design systems and preparing clean developer specs.', topics: ['Design Systems', 'Handoff Docs', 'Accessibility'] }
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    icon: 'settings_suggest',
    category: 'Engineering',
    desc: 'Automate build pipelines, orchestrate container deployments, and manage resilient cloud infrastructure scripts.',
    techs: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux Bash'],
    friendliness: 'Advanced',
    duration: '8-12 Months',
    difficulty: 'Hard',
    badge: 'Stable',
    tools: ['GitHub Actions', 'Jenkins', 'Kubernetes', 'Terraform'],
    projects: ['Zero-Downtime Deployment Flow', 'Infrastructure-as-Code Setup', 'Prometheus Monitoring Panel'],
    codingScale: 8,
    creativityScale: 4,
    phases: [
      { title: 'Phase 1: System Admin', description: 'Linux systems operation, server management, scripting utilities, and network routing.', topics: ['Bash Scripting', 'Linux Operating System', 'Networking'] },
      { title: 'Phase 2: Containers', description: 'Building isolated application environments, image management, and simple services hosting.', topics: ['Docker', 'Multi-stage Builds', 'Docker Compose'] },
      { title: 'Phase 3: Orchestration', description: 'Scaling dockerized environments, state configurations, and load balancing routers.', topics: ['Kubernetes', 'K8s Pods / Services', 'Helm'] },
      { title: 'Phase 4: Automation (IaC)', description: 'Writing reproducible server scripts, continuous integration builds, and release workflows.', topics: ['Terraform', 'GitHub Actions', 'AWS DevOps'] }
    ]
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    icon: 'cloud',
    category: 'Engineering',
    desc: 'Architect and host robust web apps on secure global networks like AWS, Azure, and Google Cloud Platform.',
    techs: ['AWS Services', 'Serverless Compute', 'IAM Security', 'Cloud Databases', 'Casing/CDN'],
    friendliness: 'Moderate',
    duration: '6-8 Months',
    difficulty: 'Medium',
    badge: 'High Demand',
    tools: ['AWS Console', 'AWS CLI', 'Serverless Framework', 'IAM Roles'],
    projects: ['Serverless REST API Engine', 'Multi-region Fault-tolerant App', 'Static Site Hosting & CDN'],
    codingScale: 7,
    creativityScale: 5,
    phases: [
      { title: 'Phase 1: Cloud Basics', description: 'Understanding global server architecture, computing instances, and simple storage grids.', topics: ['AWS EC2', 'Amazon S3', 'VPCs'] },
      { title: 'Phase 2: Secure Access', description: 'Configuring user permission modules, role connections, and server network barriers.', topics: ['IAM policies', 'Security Groups', 'Subnets'] },
      { title: 'Phase 3: Serverless', description: 'Utilizing non-persistent code execution triggers, automated endpoints, and microservices.', topics: ['AWS Lambda', 'API Gateway', 'DynamoDB'] },
      { title: 'Phase 4: Architecting High Availability', description: 'Deploying automated load scalers, multi-zone recovery networks, and CDN caching modules.', topics: ['CloudFront', 'Auto Scaling', 'Multi-AZ Deployments'] }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    icon: 'insights',
    category: 'AI & Data',
    desc: 'Unearth actionable indicators from complex corporate data, building statistical models and forecasting charts.',
    techs: ['Python', 'SQL', 'Pandas', 'Scikit-Learn', 'Statistical Inference'],
    friendliness: 'Moderate',
    duration: '8-10 Months',
    difficulty: 'Hard',
    badge: 'Stable',
    tools: ['Jupyter Notebook', 'Tableau', 'PostgreSQL', 'Matplotlib'],
    projects: ['Customer Cohort Retention Model', 'Real-estate Valuation App', 'A/B Test Campaign Audit'],
    codingScale: 8,
    creativityScale: 6,
    phases: [
      { title: 'Phase 1: Scripting & Queries', description: 'Mastering data querying syntaxes and scientific programming frameworks.', topics: ['Python Basics', 'SQL Databases', 'Pandas & NumPy'] },
      { title: 'Phase 2: Data Studies', description: 'Applying cleaning algorithms, mapping statistics indicators, and visualization charts.', topics: ['Matplotlib/Seaborn', 'Exploratory Analysis', 'Feature Engineering'] },
      { title: 'Phase 3: Statistical Modeling', description: 'Deploying predictive regression modules, logic trees, and scoring systems.', topics: ['Scikit-Learn', 'Linear Regression', 'Clustering'] },
      { title: 'Phase 4: Analytics Handoff', description: 'Constructing interactive dashboard reporting portals and compiling executive brief summaries.', topics: ['Tableau', 'Streamlit', 'Stakeholder Decking'] }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    icon: 'security',
    category: 'Security',
    desc: 'Monitor company threat vectors, investigate breach incidents, and secure enterprise local networks.',
    techs: ['Network Sniffing', 'SIEM Tools', 'Penetration Testing', 'Firewalls', 'Incident Response'],
    friendliness: 'Moderate',
    duration: '6-9 Months',
    difficulty: 'Medium',
    badge: 'High Demand',
    tools: ['Wireshark', 'Kali Linux', 'Metasploit', 'Splunk'],
    projects: ['Vulnerability Scan Audit Report', 'Intrusion Detection System Setup', 'Active Incident Playbook Design'],
    codingScale: 5,
    creativityScale: 6,
    phases: [
      { title: 'Phase 1: Networks & Protocols', description: 'Understanding data routing protocols, ports, and packet layouts.', topics: ['TCP/IP Model', 'DNS Routing', 'Port Scanning'] },
      { title: 'Phase 2: System Auditing', description: 'Identifying system vulnerabilities, software patch states, and user access flaws.', topics: ['Nmap', 'Vulnerability Assessment', 'Linux Hardening'] },
      { title: 'Phase 3: Breach Detection', description: 'Using log indexing platforms to discover abnormal activity patterns.', topics: ['Splunk / SIEM', 'Log Analysis', 'Network Packet Analysis'] },
      { title: 'Phase 4: Defenses & Rules', description: 'Installing access barriers, firewalls, and preparing emergency response rules.', topics: ['Firewalls', 'Cryptography', 'Risk Management Compliance'] }
    ]
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer',
    icon: 'phone_android',
    category: 'Engineering',
    desc: 'Design and deploy premium mobile apps for iOS and Android, leveraging modern native compilers.',
    techs: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile Web Views'],
    friendliness: 'Beginner-Friendly',
    duration: '6-8 Months',
    difficulty: 'Medium',
    badge: 'Stable',
    tools: ['Xcode', 'Android Studio', 'Expo', 'Git'],
    projects: ['Personal Finance App UI', 'Real-time Delivery Tracking Tracker', 'Offline-First Note Taker'],
    codingScale: 7,
    creativityScale: 8,
    phases: [
      { title: 'Phase 1: Platform Basics', description: 'Understanding operating system files, device hardware setups, and core layout logic.', topics: ['React Native / Expo', 'TypeScript', 'Flexbox App Layout'] },
      { title: 'Phase 2: App Core Modules', description: 'Integrating navigation menus, device files storage, and handling global state.', topics: ['React Navigation', 'AsyncStorage', 'Zustand State'] },
      { title: 'Phase 3: Hardware Integrations', description: 'Using device cameras, mapping location pins, and configuring push notifications.', topics: ['Expo Sensors', 'Geolocation APIs', 'Push Notification Setup'] },
      { title: 'Phase 4: Store Deployment', description: 'Compiling distribution builds and filing updates on Apple and Google Play consoles.', topics: ['App Store Handoff', 'Play Store Console', 'OTA Updates'] }
    ]
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    icon: 'category',
    category: 'Design',
    desc: 'Construct user journey maps, design aesthetic interfaces, construct design systems, and coordinate design hands-offs.',
    techs: ['UX Research', 'Figma Auto-layout', 'Design Systems', 'Interactive Prototyping', 'User Testing'],
    friendliness: 'Beginner-Friendly',
    duration: '5-7 Months',
    difficulty: 'Easy',
    badge: 'New',
    tools: ['Figma', 'Miro', 'Hotjar', 'Lottie'],
    projects: ['E-commerce Activation Flow Design', 'B2B Analytics Panel Prototype', 'Modern Mobile App Case Study'],
    codingScale: 2,
    creativityScale: 10,
    phases: [
      { title: 'Phase 1: Product Research', description: 'Analyzing market competitors, conducting user interviews, and defining feature checklists.', topics: ['Competitive Analysis', 'User Personas', 'User Interviews'] },
      { title: 'Phase 2: Layout Ideation', description: 'Drafting low-fidelity sketch templates and mapping navigation paths.', topics: ['Wireframing', 'User Flow Maps', 'Information Architecture'] },
      { title: 'Phase 3: Style Systems', description: 'Forming standardized typography grids, component cards, and fluid layouts.', topics: ['Figma Auto-layout', 'Typography Scale', 'UI Design Patterns'] },
      { title: 'Phase 4: Validation Studies', description: 'Running click testing experiments and preparing detailed implementation blueprints for developers.', topics: ['Interactive Prototypes', 'A/B Testing UI', 'Developer Hand-off'] }
    ]
  }
];

export const SKILLS: SkillItem[] = [
  {
    name: 'React',
    category: 'Frontend Engineering',
    matters: 'The dominant standard for structuring modular, stateful modern SaaS frontends.',
    whereUsed: ['Single Page Apps', 'Mobile apps (React Native)', 'Interactive Dashboards'],
    roles: ['Frontend Developer', 'Full Stack Developer', 'Mobile App Developer'],
    difficulty: 'Intermediate',
    friendliness: 'High',
    relatedTechs: ['TypeScript', 'Next.js', 'Redux', 'Vite']
  },
  {
    name: 'Python',
    category: 'Data & AI',
    matters: 'The foundational syntax for machine learning, artificial intelligence pipelines, and data manipulation script structures.',
    whereUsed: ['Data Cleaning', 'Neural Network Training', 'FastAPI Servers'],
    roles: ['AI Engineer', 'Data Scientist'],
    difficulty: 'Beginner',
    friendliness: 'Excellent',
    relatedTechs: ['NumPy', 'Pandas', 'PyTorch', 'Scikit-Learn']
  },
  {
    name: 'AI/ML',
    category: 'Data & AI',
    matters: 'Designing predictive logic models, automating task behaviors, and integrating advanced intelligence models.',
    whereUsed: ['Natural Language Processing', 'Computer Vision', 'Recommendation Models'],
    roles: ['AI Engineer', 'Data Scientist'],
    difficulty: 'Advanced',
    friendliness: 'Moderate',
    relatedTechs: ['Hugging Face', 'TensorFlow', 'LLMs', 'Vector Databases']
  },
  {
    name: 'Docker',
    category: 'Infrastructure',
    matters: 'Packaging complete application code scripts together with their exact software environments to prevent server compatibility issues.',
    whereUsed: ['Continuous Integration', 'Local Dev Environments', 'Microservices Hosting'],
    roles: ['DevOps Engineer', 'Cloud Engineer', 'Full Stack Developer'],
    difficulty: 'Intermediate',
    friendliness: 'Medium',
    relatedTechs: ['Kubernetes', 'Docker Compose', 'AWS ECS']
  },
  {
    name: 'Figma',
    category: 'UX/UI Design',
    matters: 'The premium real-time editing standard for mockups, prototypes, style guides, and structural wireframes.',
    whereUsed: ['High-fidelity Screen Designs', 'UX Flow Prototypes', 'Developer Spec Guides'],
    roles: ['UI/UX Designer', 'Product Designer'],
    difficulty: 'Beginner',
    friendliness: 'Excellent',
    relatedTechs: ['Auto-layout', 'Miro', 'Adobe Illustrator']
  },
  {
    name: 'TypeScript',
    category: 'Frontend Engineering',
    matters: 'Prevents interface bugs by adding strict types to raw JavaScript code at layout scale.',
    whereUsed: ['Enterprise Web Apps', 'Shared UI component libraries', 'Node Server pipelines'],
    roles: ['Frontend Developer', 'Full Stack Developer', 'DevOps Engineer'],
    difficulty: 'Intermediate',
    friendliness: 'Medium',
    relatedTechs: ['React', 'Node.js', 'Next.js', 'ESLint']
  },
  {
    name: 'Node.js',
    category: 'Backend Engineering',
    matters: 'Allows compiling and executing scalable backend server code using standard JavaScript.',
    whereUsed: ['REST API creation', 'Websocket channels hosting', 'Microservices backend systems'],
    roles: ['Full Stack Developer', 'DevOps Engineer'],
    difficulty: 'Intermediate',
    friendliness: 'High',
    relatedTechs: ['Express.js', 'TypeScript', 'FastAPI', 'REST']
  },
  {
    name: 'Cloud Computing',
    category: 'Infrastructure',
    matters: 'Deploying applications onto safe, global, serverless grids instead of on-premise physical servers.',
    whereUsed: ['Global Web Hosting', 'Databases Replication', 'Dynamic CDNs'],
    roles: ['Cloud Engineer', 'DevOps Engineer', 'Full Stack Developer'],
    difficulty: 'Intermediate',
    friendliness: 'Medium',
    relatedTechs: ['AWS EC2', 'AWS Lambda', 'S3 Storage', 'Terraform']
  },
  {
    name: 'UI Design',
    category: 'UX/UI Design',
    matters: 'Arranging grids, spacing ratios, colors, icons, and text formats to optimize app readability.',
    whereUsed: ['Mobile app mockups', 'SaaS control panels', 'Corporate Landing layouts'],
    roles: ['UI/UX Designer', 'Product Designer'],
    difficulty: 'Beginner',
    friendliness: 'Excellent',
    relatedTechs: ['Auto-layout', 'Miro', 'Adobe Theory']
  },
  {
    name: 'Cybersecurity',
    category: 'Security',
    matters: 'Protecting user data, credentials, and software APIs from unauthorized access.',
    whereUsed: ['Enterprise networks scanning', 'Password hashing/Auth systems', 'API verification tokens'],
    roles: ['Cybersecurity Analyst'],
    difficulty: 'Intermediate',
    friendliness: 'Medium',
    relatedTechs: ['Wireshark', 'Kali Linux', 'SSL/TLS', 'JWT Auth']
  }
];
