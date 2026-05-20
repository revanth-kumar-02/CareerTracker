// Central AI Service utilizing the Gemini 2.5 API and Groq Llama 3.3 for dynamic career generation

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Helper to make API calls to Gemini in JSON mode
async function callGeminiJSON<T>(prompt: string, fallbackData: T): Promise<T> {
  if (!GEMINI_API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is missing. Using smart client-side dynamic mock generation.");
    return fallbackData;
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const json = await response.json();
    const textOutput = json.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textOutput) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(textOutput) as T;
  } catch (error) {
    console.error("Gemini API error, falling back to local generator:", error);
    return fallbackData;
  }
}

// Helper to make API calls to Groq in JSON mode (with Gemini fallback)
async function callGroqJSON<T>(prompt: string, fallbackData: T): Promise<T> {
  if (!GROQ_API_KEY) {
    console.warn("VITE_GROQ_API_KEY is missing. Utilizing Gemini Pro as fallback provider.");
    return callGeminiJSON<T>(prompt, fallbackData);
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: {
          type: "json_object"
        },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API responded with status ${response.status}`);
    }

    const json = await response.json();
    const textOutput = json.choices?.[0]?.message?.content;
    
    if (!textOutput) {
      throw new Error("Empty response from Groq API");
    }

    return JSON.parse(textOutput) as T;
  } catch (error) {
    console.error("Groq API error, falling back to Gemini Pro:", error);
    return callGeminiJSON<T>(prompt, fallbackData);
  }
}

// ----------------------------------------------------
// Interfaces (Aligning with App Pages)
// ----------------------------------------------------

export interface SkillNode {
  id: string;
  label: string;
  desc: string;
  status: 'Completed' | 'In Progress' | 'Locked';
  dependencies: string[]; // parent node IDs
  category: string; // e.g. "Core Skills", "Advanced Skills", "Specialized Skills"
}

export interface CareerAction {
  id: string;
  title: string;
  desc: string;
  hiringImpact: 'High' | 'Critical' | 'Medium';
  skillBoost: string; // e.g. "+15%"
  completionTime: string; // e.g. "4h", "2 days"
  marketRelevance: string; // e.g. "Top Priority"
  companyAlignmentGain: string; // e.g. "Figma +10%"
  status: 'Pending' | 'Completed';
}

export interface CompanyMatch {
  companyName: string;
  matchPercentage: number;
  missingSkills: string[];
  portfolioGaps: string[];
  interviewWeaknesses: string[];
  atsMismatch: string[];
}

export interface SalaryTrendPoint {
  year: string;
  salary: number;
}

export interface RegionalHiringPoint {
  region: string;
  demand: number;
}

export interface MarketMetrics {
  marketDemand: string; // e.g. "+31%"
  salaryRange: string; // e.g. "₹18L–₹42L"
  growthTrend: string; // e.g. "Rapid Growth"
  hiringMomentum: string; // e.g. "Accelerating"
  topHiringCompanies: string[]; // e.g. ["Google", "Adobe", "Figma", "Swiggy"]
  aiConfidenceScore: number; // e.g. 92
  fastestGrowingSkills: string[];
  remoteWorkDemand: string; // e.g. "65%"
  aiImpact: string; // e.g. "Augmented"
  competitionLevel: string; // e.g. "Moderate"
  salaryTrendPoints: SalaryTrendPoint[];
  regionalHiring: RegionalHiringPoint[];
}

export interface ConceptDetails {
  whatIsThis: string;
  whyItMatters: string;
  whereIsUsed: string;
  simpleExample: string;
  miniVisualization?: string; // e.g. text flowchart or short code block
  relatedConcepts: string[]; // e.g. ["Props", "State", "JSX"]
  quickPractice: string;
  analogy: string;
}

export interface DayLearnTask {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  type: 'LEARN' | 'PRACTICE';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  xpReward: number;
  status: 'Locked' | 'Available' | 'Completed';
  concept?: ConceptDetails; // provided only if type is 'LEARN'
}

export interface CheckpointQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface MiniCheckpoint {
  title: string;
  questions: CheckpointQuestion[];
  confidenceSkills: string[];
  passed: boolean;
}

export interface PhaseProject {
  title: string;
  description: string;
  timeEstimate: string;
  xpReward: number;
  portfolioValue: string;
  hiringImpact: 'High' | 'Medium' | 'Critical';
  status: 'Locked' | 'Available' | 'Completed';
}

export interface Phase {
  id: string;
  title: string;
  focus: string;
  duration: string;
  completionPercentage: number;
  xpReward: number;
  unlockedSkills: string[];
  days: DayLearnTask[];
  checkpoint: MiniCheckpoint;
  finalProject: PhaseProject;
}

export interface DynamicRoadmap {
  targetRole: string;
  description: string;
  totalXP: number;
  successProbability: number;
  successReason: string;
  phases: Phase[];
  
  // Keep empty or minimal objects for these for backward compatibility
  marketMetrics?: any;
  alignment?: any;
  skillNodes?: any[];
  actions?: any[];
  companyMatches?: any[];
  stages?: any[];
  skillGaps?: any[];
  recommendedNextStep?: any;
}

export interface DynamicResumeFeedback {
  atsScore: number;
  keywordMatch: string; // "High" | "Medium" | "Low"
  keywordMatchDesc: string;
  actionableSuggestions: {
    type: 'warning' | 'add';
    title: string;
    desc: string;
  }[];
  priorityFixes: {
    icon: string; // e.g. "bar_chart", "extension", "format_paint"
    colorClass: string;
    bgClass: string;
    title: string;
    desc: string;
  }[];
  atsChecklist: {
    label: string;
    status: 'Pass' | 'Fail';
  }[];
  matchedSkills: string[];
  missingSkills: string[];
  googleFormulaAnalysis: {
    type: 'strong' | 'weak';
    title: string;
    example: string;
    badges: string[];
  }[];
}

export interface DynamicInterviewQuestion {
  id: number;
  text: string;
}

export interface DynamicInterviewFeedback {
  coachingTip: string;
  confidenceIndex: number; // 0-100
  pacingRateText: string;  // e.g. "Excellent", "Too Fast", "Steady"
  pacingWordsPerMin: number;
  isSTARCompliant: boolean;
}

export interface DynamicMarketData {
  salaryPercentiles: {
    whiskerBottom: string;
    whiskerHeight: string;
    boxHeight: string;
    boxBottom: string;
    medianTop: string;
    minSalary: number; // raw USD integer e.g., 90000
    maxSalary: number; // raw USD integer e.g., 380000
    medianSalary: number; // raw USD integer e.g., 220000
    p25Salary: number; // raw USD integer e.g., 150000
    p75Salary: number; // raw USD integer e.g., 280000
  };
  skillPremiums: {
    name: string;
    percentage: string;
    colorClass: string;
  }[];
  marketHubs: {
    city: string;
    delta: string;
    trend: string;
    trendColor: string;
    icon: string;
  }[];
}

// ----------------------------------------------------
// Implementation Functions
// ----------------------------------------------------

/**
 * 1. Generates a custom career roadmap based on target role and optional user skills.
 */
export async function generateRoadmap(targetRole: string, currentSkills: string = ""): Promise<DynamicRoadmap> {
  const isUIDesigner = targetRole.toLowerCase().includes('design') || targetRole.toLowerCase().includes('ux');
  const isAIEngineer = targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine') || targetRole.toLowerCase().includes('ml') || targetRole.toLowerCase().includes('prompt');
  const isCybersecurity = targetRole.toLowerCase().includes('cyber') || targetRole.toLowerCase().includes('security') || targetRole.toLowerCase().includes('hack');
  
  const prompt = `
    You are an elite AI learning-system architect, educational designer, and expert career transition mentor.
    Create a highly personalized, immersive guided learning journey for a user transitioning into a "${targetRole}".
    ${currentSkills ? `The user currently has these skills: "${currentSkills}". Adjust the daily syllabus accordingly to focus on gaps.` : ""}
    
    You must output a single JSON object strictly adhering to this TypeScript interface:

    interface ConceptDetails {
      whatIsThis: string;       // Simple beginner-friendly explanation (max 2 sentences)
      whyItMatters: string;     // Real-world importance (max 2 sentences)
      whereIsUsed: string;      // Practical applications (max 2 sentences)
      simpleExample: string;    // Beginner code snippet or step-by-step example (formatted in markdown or clear text)
      miniVisualization?: string; // Optional ASCII diagram, simple mental map, or concept layout
      relatedConcepts: string[]; // 2-3 connected skills/topics
      quickPractice: string;    // 1-sentence mini practice action to reinforce
      analogy: string;          // A memorable real-world analogy
    }

    interface DayLearnTask {
      id: string;               // Unique ID e.g., "p1-day1"
      dayNumber: number;        // Day index e.g., 1, 2, 3, etc.
      title: string;            // Simple, descriptive title (e.g. "What is Figma?", "Variables & Data Types")
      description: string;      // Paced description of what they are learning
      type: 'LEARN' | 'PRACTICE'; // LEARN = conceptual understanding, PRACTICE = hands-on coding exercises.
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
      timeEstimate: string;     // e.g. "30 mins", "1 hour"
      xpReward: number;         // e.g., 50 for LEARN, 100 for PRACTICE
      status: 'Locked' | 'Available' | 'Completed'; // Phase 1 Day 1 task should be "Available". All other days "Locked".
      concept?: ConceptDetails;  // MUST populate this block if type is 'LEARN'
    }

    interface CheckpointQuestion {
      question: string;
      options: string[];
      correctAnswer: string;
    }

    interface MiniCheckpoint {
      title: string;            // e.g. "Phase 1 Assessment"
      questions: CheckpointQuestion[]; // 2 simple quiz questions based on the phase's daily content
      confidenceSkills: string[]; // 3 confidence check statements (e.g., "Can you write a loop?")
      passed: boolean;          // false
    }

    interface PhaseProject {
      title: string;            // e.g. "Build a Basic Chatbot"
      description: string;      // Rewarding portfolio-ready task description
      timeEstimate: string;     // e.g. "2 days", "8 hours"
      xpReward: number;         // e.g. 500
      portfolioValue: string;   // How this helps their portfolio
      hiringImpact: 'High' | 'Medium' | 'Critical';
      status: 'Locked' | 'Available' | 'Completed'; // Start as "Locked"
    }

    interface Phase {
      id: string;               // e.g. "phase-1"
      title: string;            // e.g. "Phase 1: Foundation"
      focus: string;            // e.g. "UI Fundamentals"
      duration: string;         // e.g. "2 Weeks"
      completionPercentage: number; // 0
      xpReward: number;         // e.g. 1000
      unlockedSkills: string[];  // Skills gained after completing this phase
      days: DayLearnTask[];     // Generate 5-7 daily syllabus cards.
      checkpoint: MiniCheckpoint;
      finalProject: PhaseProject; // The BUILD project task at the end of the phase
    }

    interface DynamicRoadmap {
      targetRole: string;
      description: string;
      totalXP: number;          // 0
      successProbability: number;
      successReason: string;
      phases: Phase[];          // Generate exactly 3 progressive phases
    }

    Ensure outputs are customized to "${targetRole}". 
    Pacing is CRITICAL.
    Phase 1 must contain ONLY basic learn & practice tasks. The Final Project must appear ONLY at the end of the phase as the Phase Project.
    Only Phase 1 Day 1 task should be 'Available', all other tasks should be 'Locked'.
  `;

  // Fallback data structure for UI Designer, fully structured under the new guided syllabus schema.
  const fallback: DynamicRoadmap = {
    targetRole,
    description: `Embark on a structured journey to become a skilled ${targetRole}, starting from core basics up to high-impact portfolio projects.`,
    totalXP: 0,
    successProbability: 75,
    successReason: "Guided daily steps ensure consistent learning before project building.",
    phases: [
      {
        id: "phase-1",
        title: "Phase 1: Foundations of Design",
        focus: "Visual Hierarchy, Color Theory & Figma Setup",
        duration: "2 Weeks",
        completionPercentage: 0,
        xpReward: 800,
        unlockedSkills: ["Figma Setup", "Visual Contrast"],
        days: [
          {
            id: "p1-d1",
            dayNumber: 1,
            title: "What is Visual Hierarchy?",
            description: "Understand spacing, contrast, and alignment to guide the user's eye naturally.",
            type: "LEARN",
            difficulty: "Beginner",
            timeEstimate: "30 mins",
            xpReward: 50,
            status: "Available",
            concept: {
              whatIsThis: "Visual Hierarchy is the arrangement and presentation of design elements in order of importance.",
              whyItMatters: "It helps users scan information quickly and complete tasks with minimal cognitive load.",
              whereIsUsed: "Every landing page, app screen, or newsletter layout uses size and weight hierarchy.",
              simpleExample: "An H1 title in bold 32px text followed by a small 14px body text defines visual importance.",
              miniVisualization: "H1 Title (32px Bold) \n  └─ Subtitle (18px Regular) \n      └─ Body Text (14px Muted)",
              relatedConcepts: ["Typography Scale", "Contrast Ratio", "White Space"],
              quickPractice: "Open a popular site like Stripe and list the first 3 visual elements that catch your eye.",
              analogy: "Think of a newspaper header vs. the body paragraph; the big bold title instantly tells you what's key."
            }
          },
          {
            id: "p1-d2",
            dayNumber: 2,
            title: "Recreate a Reusable Button",
            description: "Implement primary and secondary button components in Figma with proper padding.",
            type: "PRACTICE",
            difficulty: "Beginner",
            timeEstimate: "1 hour",
            xpReward: 100,
            status: "Locked"
          },
          {
            id: "p1-d3",
            dayNumber: 3,
            title: "Color Theory & Contrast ratios",
            description: "Learn how to select accessible colors that align with WCAG AA/AAA guidelines.",
            type: "LEARN",
            difficulty: "Beginner",
            timeEstimate: "45 mins",
            xpReward: 50,
            status: "Locked",
            concept: {
              whatIsThis: "Color Theory is the rules and guidelines designers use to communicate with users through appealing color schemes.",
              whyItMatters: "Using correct contrast ensures accessibility for colorblind or visually impaired users.",
              whereIsUsed: "Buttons, text layers, and alert statuses (red/green) must meet accessibility guidelines.",
              simpleExample: "Black text on a white background has a 21:1 contrast ratio, which is highly readable.",
              miniVisualization: "🟢 High Contrast (Web Content Accessibility compliant) vs. 🔴 Low Gray-on-Light-Gray Contrast",
              relatedConcepts: ["WCAG Guidelines", "Color Harmonies", "Muted Palettes"],
              quickPractice: "Use an online contrast checker to test if a light yellow button with white text is readable.",
              analogy: "A high-visibility safety vest is bright orange with silver stripes so it stands out against dark roads."
            }
          }
        ],
        checkpoint: {
          title: "Phase 1 Checkpoint",
          questions: [
            {
              question: "Which contrast ratio is generally recommended for body text under WCAG AA standards?",
              options: ["At least 4.5:1", "Exactly 1:1", "Around 2:1", "At least 15:1"],
              correctAnswer: "At least 4.5:1"
            },
            {
              question: "What is the primary purpose of visual hierarchy in UI design?",
              options: ["To make interfaces load faster", "To guide the user's focus in order of importance", "To use as many colors as possible", "To replace all text with icons"],
              correctAnswer: "To guide the user's focus in order of importance"
            }
          ],
          confidenceSkills: [
            "I understand contrast ratios and can spot poor accessibility.",
            "I can create buttons with appropriate visual hierarchy."
          ],
          passed: false
        },
        finalProject: {
          title: "Design a Landing Page Hero Section",
          description: "Build a responsive hero section in Figma including typography scale, primary call-to-action button, and accessible visual hierarchy.",
          timeEstimate: "4 hours",
          xpReward: 400,
          portfolioValue: "High - Demonstrates layout, alignment, color accessibility and hierarchy basics.",
          hiringImpact: "High",
          status: "Locked"
        }
      },
      {
        id: "phase-2",
        title: "Phase 2: Interaction Design & Prototyping",
        focus: "Figma Auto-Layout, Components & Micro-animations",
        duration: "2 Weeks",
        completionPercentage: 0,
        xpReward: 1000,
        unlockedSkills: ["Auto-Layout", "Components"],
        days: [
          {
            id: "p2-d1",
            dayNumber: 1,
            title: "Figma Auto-Layout Basics",
            description: "Learn how to build designs that stretch and resize automatically using Auto-Layout frames.",
            type: "LEARN",
            difficulty: "Intermediate",
            timeEstimate: "40 mins",
            xpReward: 50,
            status: "Locked",
            concept: {
              whatIsThis: "Auto-layout is a Figma feature that lets you create dynamic frames that respond to content size changes.",
              whyItMatters: "It mimics flexbox in CSS, ensuring your button grows as you type or your layout is responsive.",
              whereIsUsed: "Figma cards, navbars, item grids, and reusable components use auto-layout extensively.",
              simpleExample: "Adding a padding of 16px horizontal and 8px vertical around a text layer automatically makes it a button.",
              miniVisualization: "[ Text Label ] + Auto-layout padding = Resizable Button Component",
              relatedConcepts: ["CSS Flexbox", "Constraints", "Grid Systems"],
              quickPractice: "Create a frame in Figma, add Auto-layout, and see what happens when you set spacing to 20px.",
              analogy: "Like a rubber band that stretches when you put more objects inside a bag."
            }
          },
          {
            id: "p2-d2",
            dayNumber: 2,
            title: "Build a Dynamic Navbar",
            description: "Practice using Figma Auto-Layout to align menu links and responsive CTA buttons.",
            type: "PRACTICE",
            difficulty: "Intermediate",
            timeEstimate: "1 hour",
            xpReward: 100,
            status: "Locked"
          }
        ],
        checkpoint: {
          title: "Phase 2 Checkpoint",
          questions: [
            {
              question: "Which CSS layout engine is Figma Auto-Layout based on?",
              options: ["CSS Grid", "Flexbox", "Absolute Positioning", "Floats"],
              correctAnswer: "Flexbox"
            }
          ],
          confidenceSkills: [
            "I can build responsive components in Figma.",
            "I know when to use Auto-layout vs. basic groups."
          ],
          passed: false
        },
        finalProject: {
          title: "Interactive E-Commerce Card Grid",
          description: "Create a grid of interactive cards with dynamic hover states, responsive layouts, and auto-layout tags.",
          timeEstimate: "6 hours",
          xpReward: 500,
          portfolioValue: "High - Displays advanced Figma component construction and responsiveness rules.",
          hiringImpact: "Critical",
          status: "Locked"
        }
      }
    ],
    marketMetrics: { marketDemand: "", salaryRange: "", growthTrend: "", hiringMomentum: "", topHiringCompanies: [], aiConfidenceScore: 0, fastestGrowingSkills: [], remoteWorkDemand: "", aiImpact: "", competitionLevel: "", salaryTrendPoints: [], regionalHiring: [] },
    alignment: { skillAlignment: 0, portfolioReadiness: 0, interviewReadiness: 0, marketCompetitiveness: 0, companyCompatibility: 0 },
    skillNodes: [],
    actions: [],
    companyMatches: [],
    stages: [],
    skillGaps: [],
    recommendedNextStep: { category: "", title: "", desc: "", icon: "", buttonLabel: "" }
  };

  return callGroqJSON<DynamicRoadmap>(prompt, fallback);
}

/**
 * 2. Audits resume text against a target role and provides deep ATS/Google formula feedback.
 */
export async function analyzeResume(resumeText: string, targetRole: string): Promise<DynamicResumeFeedback> {
  const prompt = `
    You are an expert AI Talent Acquisition Director and ATS Audit Specialist.
    Analyze the following resume text against the target role of "${targetRole}":
    
    Resume Text:
    """
    ${resumeText}
    """

    Generate a comprehensive, premium quality resume audit and output a single JSON object matching this TypeScript interface:
    interface DynamicResumeFeedback {
      atsScore: number; // integer 0-100 representing the ATS score
      keywordMatch: string; // must be exactly "High", "Medium", or "Low"
      keywordMatchDesc: string; // 1-sentence analysis of keyword density
      actionableSuggestions: {
        type: 'warning' | 'add';
        title: string; // brief bold title
        desc: string; // 1-2 sentences of actionable career advice
      }[]; // 2 items
      priorityFixes: {
        icon: string; // Material symbols icon: "bar_chart", "extension", "format_paint", or "warning"
        colorClass: string; // e.g. "text-on-error-container" or "text-tertiary" or "text-secondary"
        bgClass: string; // e.g. "bg-error-container" or "bg-tertiary/10" or "bg-secondary-container/20"
        title: string;
        desc: string;
      }[]; // exactly 3 critical formatting/content fixes
      atsChecklist: {
        label: string; // e.g. "Standard Section Headers", "No Text Boxes/Columns", "Machine Readable Font"
        status: 'Pass' | 'Fail';
      }[]; // exactly 3 items
      matchedSkills: string[]; // 3-4 skills found in the resume relevant to targetRole
      missingSkills: string[]; // 2-3 key skills for targetRole missing in the resume
      googleFormulaAnalysis: {
        type: 'strong' | 'weak';
        title: string; // "Strong Impact" or "Needs Improvement"
        example: string; // quote a line from resume or write a specific example explaining how they did X, measured by Y, by doing Z
        badges: string[]; // badges like "Action Verb", "Quantified Impact", "Weak Verb", "No Metrics"
      }[]; // exactly 2 items comparing strong/weak resume phrasing based on Google's X-Y-Z formula
    }

    Return strict, valid, professional JSON. No placeholders. Ensure suggestions directly quote or mention items relevant to ${targetRole}.
  `;

  // Dynamic Rule-based fallback generator
  const category = getRoleCategory(targetRole);
  
  const skillPools: Record<string, string[]> = {
    'AI/ML': ['PyTorch', 'LLM', 'RAG', 'Python', 'MLOps', 'Transformers', 'CUDA', 'Deep Learning', 'TensorFlow', 'Quantization'],
    'Cloud': ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'AWS', 'GCP', 'Ansible', 'GitOps', 'Prometheus', 'Linux'],
    'Cybersecurity': ['OWASP', 'Penetration Testing', 'SIEM', 'Zero-Trust', 'IAM', 'Encryption', 'TLS', 'SOC2', 'Firewalls', 'Wireshark'],
    'Data': ['SQL', 'Snowflake', 'BigQuery', 'dbt', 'Airflow', 'Spark', 'ETL', 'Tableau', 'Data Warehousing', 'Python'],
    'Product': ['Figma', 'A/B Testing', 'Product Roadmap', 'Wireframes', 'Amplitude', 'Mixpanel', 'PRD', 'Agile', 'Scrum', 'User Journeys'],
    'Finance': ['Financial Modeling', 'DCF', 'LBO', 'Valuation', 'Excel', 'Corporate Finance', 'Accounting', 'Risk Analysis', 'Asset Allocation', 'Python'],
    'Marketing': ['SEO', 'Google Analytics', 'Amplitude', 'PPC', 'Growth Loops', 'Referral Systems', 'CAC', 'LTV', 'A/B Testing', 'Copywriting'],
    'Engineering': ['React', 'Node.js', 'TypeScript', 'JavaScript', 'REST APIs', 'PostgreSQL', 'Redis', 'System Design', 'Git', 'CSS']
  };

  const pool = skillPools[category] || skillPools['Engineering'];
  const resumeLower = resumeText.toLowerCase();
  
  const matched = pool.filter(skill => resumeLower.includes(skill.toLowerCase()));
  const missing = pool.filter(skill => !resumeLower.includes(skill.toLowerCase()));

  // Calculate ATS Score dynamically
  let rawScore = 55 + (matched.length * 5);
  // Add penalties for common ATS formatting issues if detected
  const hasTextboxes = resumeLower.includes('textbox') || resumeLower.includes('column') || resumeLower.includes('table');
  if (hasTextboxes) rawScore -= 8;
  if (rawScore > 96) rawScore = 96;
  if (rawScore < 45) rawScore = 45;

  let densityDesc = `Low density of critical technical markers. Found only ${matched.length} key competencies.`;
  let matchLevel = 'Low';
  if (matched.length >= 6) {
    densityDesc = `Excellent alignment! Found ${matched.length} core keywords matching the standard ${targetRole} matrix.`;
    matchLevel = 'High';
  } else if (matched.length >= 3) {
    densityDesc = `Moderate keyword density. Found ${matched.length} target indicators, but key areas remain unaddressed.`;
    matchLevel = 'Medium';
  }

  // Google formula examples matching category
  let strongGoogleExample = '"Designed and scaled a modular architecture, increasing system throughput by 32% over 3 months by implementing parallel processing queues."';
  let weakGoogleExample = '"Helped with the design and maintenance of our main backend and cloud databases."';
  
  if (category === "AI/ML") {
    strongGoogleExample = '"Fine-tuned an open-source 8B parameter LLM using LoRA adapters, reducing operational inference cost by 42% while improving model accuracy by 6.4%."';
    weakGoogleExample = '"Worked on training models and adding vector embeddings to our search search engine."';
  } else if (category === "Cloud") {
    strongGoogleExample = '"Automated infrastructure deployment with Terraform, cutting infrastructure provisioning latency from 2 days to 14 minutes with GitOps pipelines."';
    weakGoogleExample = '"Managed servers, setup Kubernetes clusters, and handled general cloud configurations."';
  } else if (category === "Cybersecurity") {
    strongGoogleExample = '"Audited and secured microservice ingress controllers, blocking 100% of OWASP injections and raising security audit score to 99%."';
    weakGoogleExample = '"Ran vulnerability scans and helped the developers fix code exploits."';
  } else if (category === "Data") {
    strongGoogleExample = '"Refactored analytics SQL queries in dbt, reducing Snowflake query processing compute cost by 34% (saving $12,000 monthly)."';
    weakGoogleExample = '"Wrote database pipelines, cleaned SQL reports, and made cohort dashboards."';
  } else if (category === "Product") {
    strongGoogleExample = '"Re-designed the user registration sequence in Figma, increasing user trial activation rates by 18% over a 30-day cohort run."';
    weakGoogleExample = '"Led design workshops and helped engineers decide features for the new release."';
  }

  const fallback: DynamicResumeFeedback = {
    atsScore: rawScore,
    keywordMatch: matchLevel,
    keywordMatchDesc: densityDesc,
    actionableSuggestions: [
      {
        type: 'warning',
        title: 'Quantify your accomplishments',
        desc: `Modify experience descriptions under your previous roles to explicitly mention numeric percentages (e.g., reduced load times by 20%, optimized costs by $15k).`
      },
      {
        type: 'add',
        title: `Add core ${targetRole} keywords`,
        desc: `Explicitly integrate missing keywords such as ${missing.slice(0, 2).join(", ") || 'system design methodologies'} to pass strict ATS filters.`
      }
    ],
    priorityFixes: [
      {
        icon: 'bar_chart',
        colorClass: 'text-on-error-container',
        bgClass: 'bg-error-container',
        title: 'Missing quantified impact in achievements',
        desc: 'At least 3 accomplishments are written as static duties. Rewrite them using Google\'s X-Y-Z framework (Accomplished [X], measured by [Y], by doing [Z]).'
      },
      {
        icon: 'extension',
        colorClass: 'text-tertiary',
        bgClass: 'bg-tertiary/10',
        title: `Incorporate modern ${category} tool chains`,
        desc: `Recruiters filter heavily for tool competencies. Incorporate tools like ${missing.slice(0, 3).join(", ") || 'advanced frameworks'} into your experience statements.`
      },
      {
        icon: 'format_paint',
        colorClass: 'text-secondary',
        bgClass: 'bg-secondary-container/20',
        title: 'Remove complex layout elements',
        desc: 'Your CV layout contains multi-column blocks or graphics. ATS parsers are linear; simplify to single-column standard flow.'
      }
    ],
    atsChecklist: [
      { label: 'Standard Section Headers', status: 'Pass' },
      { label: 'Machine-Readable Fonts', status: 'Pass' },
      { label: 'No Complex Columns/Tables', status: hasTextboxes ? 'Fail' : 'Pass' }
    ],
    matchedSkills: matched.length > 0 ? matched.slice(0, 4) : ['Core Development', 'Version Control', 'Software Lifecycle'],
    missingSkills: missing.length > 0 ? missing.slice(0, 3) : ['High-throughput Architectures', 'Cloud Operations'],
    googleFormulaAnalysis: [
      {
        type: 'strong',
        title: 'Strong Impact Example',
        example: strongGoogleExample,
        badges: ['Action Verb', 'Quantified Impact']
      },
      {
        type: 'weak',
        title: 'Needs Improvement Example',
        example: weakGoogleExample,
        badges: ["Weak Verb", 'No Metrics']
      }
    ]
  };

  return callGroqJSON<DynamicResumeFeedback>(prompt, fallback);
}

/**
 * 3. Generates a custom set of 5 interview questions for a given role.
 */
export async function generateInterviewQuestions(targetRole: string): Promise<DynamicInterviewQuestion[]> {
  const prompt = `
    You are an AI Tech Lead conducting a highly technical, interactive coding/architecture interview.
    Generate a list of exactly 5 challenging, realistic interview questions for a candidate interviewing for the role: "${targetRole}".
    The questions should range from core architecture design, behavioral (STAR framework), to practical optimization challenges.

    Output a single JSON array matching this TypeScript interface:
    interface QuestionList {
      questions: {
        id: number; // 1 to 5
        text: string; // The interview question text
      }[];
    }

    Return ONLY the questions array inside the JSON structure: { "questions": [...] }. Keep it clean and highly professional.
  `;

  interface FallbackResponse {
    questions: DynamicInterviewQuestion[];
  }

  const category = getRoleCategory(targetRole);

  const questionsPools: Record<string, string[]> = {
    'AI/ML': [
      `Can you explain the mathematical differences between pre-training and fine-tuning an LLM? When would you use LoRA vs full weight adjustments?`,
      `How do you design a retrieval-augmented generation (RAG) system with sub-second latencies over billions of tokens? Detail your index structure.`,
      `Describe how you debugged a model convergence or vanishing gradient issue during a large-scale training run.`,
      `How would you handle hardware boundaries, such as fitting a 70B parameter model on a single GPU server using quantization?`,
      `Talk about a time you had to optimize GPU compute throughput. How did you identify bottlenecks in your data loaders?`
    ],
    'Cloud': [
      `How do you architect a secure VPC across multi-zones? Walk through subnets, gateways, and security access logs.`,
      `Explain how a Kubernetes cluster manages Pod networking and how you scale nodes dynamically based on load.`,
      `Describe a zero-downtime microservice migration strategy you implemented for a high-traffic endpoint.`,
      `How do you set up system alerting rules in Prometheus to capture memory leaks before they trigger OOM kills?`,
      `Explain how you handle shared state locks and state file recovery inside multi-engineer Terraform workflows.`
    ],
    'Cybersecurity': [
      `Walk through how you audit and test a web app API for OWASP Top 10 vulnerabilities (e.g., SSRF or broken authentication).`,
      `How do you design a secure Zero-Trust IAM access control system for developers working across hybrid clouds?`,
      `Describe how you would isolate resources and run forensics during a suspected active API token compromise.`,
      `Explain TLS handshakes in detail. How do you secure data transmission against adversary-in-the-middle attacks?`,
      `How do you build a secure SIEM logging infrastructure that prevents log tampering or deletion by malicious actors?`
    ],
    'Data': [
      `How do you design an ingestion pipeline that handles late-arriving data while ensuring absolute idempotency?`,
      `Compare row-oriented databases to columnar data warehouses. In what scenarios would you choose BigQuery vs Postgres?`,
      `How do you partition and index warehouse tables to ensure analytical queries return in seconds over billions of rows?`,
      `Describe how you deploy automated dbt validation testing to flag malformed data in an upstream database feed.`,
      `Walk through how you modeled user cohorts to calculate accurate customer retention metrics and user lifecycles.`
    ],
    'Product': [
      `How do you prioritize a product roadmap when engineering resources are tight and stakeholders present competing needs?`,
      `Describe how you would design an onboarding experience that reduces product churn rates during the first week.`,
      `How do you use behavioral cohort data (e.g. Mixpanel) to locate where users get stuck in a conversion funnel?`,
      `Walk us through a feature you designed and launched that failed. How did you measure failure and pivot?`,
      `How do you translate complex technical constraints from developers into simple, delighting user interface screens?`
    ],
    'Finance': [
      `Walk me through a 3-statement financial model and explain how a change in capital depreciation flows through them.`,
      `How do you calculate Weighted Average Cost of Capital (WACC)? What macro indicators shift WACC values?`,
      `Detail the differences between leveraged buyout (LBO) and DCF models. When is LBO preferred for valuation?`,
      `How do you evaluate structural covenants and credit metrics when advising a corporate borrower?`,
      `What is your investment thesis on a recent macro market trend, and how does it influence equity pricing?`
    ],
    'Marketing': [
      `How do you configure multi-touch attribution models to accurately measure organic and paid social acquisition loops?`,
      `Walk through a viral growth loop you engineered that resulted in compounding organic user signups.`,
      `How do you determine target CAC limitations based on customer LTV, churn rates, and startup margins?`,
      `What is your approach to technical SEO audits? Detail indexation, crawl budgets, and site architecture controls.`,
      `Describe an A/B test run on a key conversion flow. How did you compute and verify statistical significance?`
    ],
    'Engineering': [
      `Compare REST vs GraphQL vs gRPC. When would you prefer one over the others in a microservices setup?`,
      `How do you implement a distributed caching layer (e.g. Redis) to minimize database query latency and resource bottlenecks?`,
      `Walk us through a time you debugged a memory leak or optimized component re-render speeds in a client app.`,
      `How do you manage production database schema migrations on tables containing millions of active records?`,
      `Describe your approach to designing a highly available, fault-tolerant system that can handle sudden traffic spikes.`
    ]
  };

  const questions = questionsPools[category] || questionsPools['Engineering'];

  const fallback: FallbackResponse = {
    questions: questions.map((text, idx) => ({ id: idx + 1, text }))
  };

  try {
    const res = await callGroqJSON<FallbackResponse>(prompt, fallback);
    return res.questions || fallback.questions;
  } catch {
    return fallback.questions;
  }
}

/**
 * 4. Provides real-time coaching feedback and metrics for a user's answer.
 */
export async function generateInterviewFeedback(
  question: string,
  answer: string,
  targetRole: string
): Promise<DynamicInterviewFeedback> {
  const prompt = `
    You are a premium AI Executive Interview Coach.
    Analyze the candidate's answer to the following technical question for the role: "${targetRole}".
    
    Question: "${question}"
    Candidate's Answer: "${answer}"

    Provide constructive, concise feedback. Output a single JSON object matching this TypeScript interface:
    interface DynamicInterviewFeedback {
      coachingTip: string; // 1-2 sentences of actionable coaching feedback. Point out what was strong and how to improve.
      confidenceIndex: number; // integer 0-100 based on tone, phrasing, and assertiveness of answer text
      pacingRateText: string; // e.g. "Excellent", "Too Fast", "Steady", or "Too Hesitant"
      pacingWordsPerMin: number; // typical simulated words per min, integer e.g. 110-140
      isSTARCompliant: boolean; // true if they structured it with Situation, Task, Action, and Result
    }

    Keep it encouraging but highly precise, reflecting elite startup interview expectations.
  `;

  // Dynamic feedback analyzer based on candidate's answer text metrics
  const answerLower = answer.toLowerCase();
  
  // Count key STAR methodology keywords
  const starWords = ["situation", "task", "action", "result", "metric", "%", "percent", "scale", "optimize", "lead", "led", "solve", "reduce", "increase", "achieved", "designed"];
  const matches = starWords.filter(word => answerLower.includes(word));
  
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const isSTAR = matches.length >= 3;

  // Simulated pacing rate based on word count
  let pacingText = "Steady";
  let pacingWPM = 124;

  if (wordCount < 20) {
    pacingText = "Too Brief";
    pacingWPM = 158;
  } else if (wordCount > 200) {
    pacingText = "Too Wordy";
    pacingWPM = 108;
  } else if (wordCount < 50) {
    pacingText = "Steady but Brief";
    pacingWPM = 118;
  }

  // Calculate confidence index dynamically
  let score = 55 + (matches.length * 5);
  if (wordCount >= 40 && wordCount <= 180) {
    score += 15; // sweet spot for answer length
  }
  if (score > 96) score = 96;
  if (score < 40) score = 40;

  // Custom actionable coaching tip
  let tip = "";
  if (wordCount < 25) {
    tip = "Your response is very brief. Expand it by explaining the specific context, the technical challenge you faced, and your step-by-step actions.";
  } else if (!isSTAR) {
    tip = "Good technical points, but structure it using the STAR framework. Clearly define the Situation, the Task, the Actions you personally took, and the final outcomes.";
  } else if (matches.length < 5) {
    tip = "Great logical flow. To make it bulletproof, quantify the final business outcomes using metrics like server load reductions, throughput increases, or dollars saved.";
  } else {
    tip = "Excellent! You have dynamic STAR anchors, clear task ownership, and quantified metrics. This is a very strong response.";
  }

  const fallback: DynamicInterviewFeedback = {
    coachingTip: tip,
    confidenceIndex: score,
    pacingRateText: pacingText,
    pacingWordsPerMin: pacingWPM,
    isSTARCompliant: isSTAR
  };

  return callGroqJSON<DynamicInterviewFeedback>(prompt, fallback);
}

/**
 * 5. Generates compensation ranges, skill premiums, and local hub speeds for any role/city/experience level.
 */
export async function generateMarketInsights(
  role: string,
  experience: string,
  location: string
): Promise<DynamicMarketData> {
  const prompt = `
    You are an elite Compensation Architect and Tech Labor Market Analyst.
    Calculate live salary percentiles, skill premium percentages, and hiring hub speeds for:
    Role: "${role}"
    Seniority Level: "${experience}"
    Location: "${location}"

    Generate realistic data based on current 2026 tech trends and output a single JSON object matching this TypeScript interface:
    interface DynamicMarketData {
      salaryPercentiles: {
        whiskerBottom: string; // CSS style bottom percentage (e.g. "10%") representing 10th percentile salary scale (low range)
        whiskerHeight: string; // CSS style height percentage (e.g. "60%") representing total 10th-90th span
        boxHeight: string; // CSS style height percentage (e.g. "35%") representing 25th-75th core range
        boxBottom: string; // CSS style bottom percentage (e.g. "20%") representing starting position of 25th percentile
        medianTop: string; // CSS style top percentage (e.g. "45%") representing median line offset from top of the box
        minSalary: number; // raw 10th percentile USD integer (e.g. 110000)
        maxSalary: number; // raw 90th percentile USD integer (e.g. 370000)
        medianSalary: number; // raw 50th percentile median USD integer (e.g. 230000)
        p25Salary: number; // raw 25th percentile USD integer (e.g. 170000)
        p75Salary: number; // raw 75th percentile USD integer (e.g. 290000)
      }; // These values must place whiskerBottom < boxBottom < medianTop < (boxBottom + boxHeight) < (whiskerBottom + whiskerHeight) for visual correctness.
      skillPremiums: {
        name: string; // Skill name e.g. "PyTorch / Fine-tuning", "Kubernetes", "System Design"
        percentage: string; // e.g. "+25%", "+18%"
        colorClass: string; // MUST be "bg-primary", "bg-secondary", "bg-tertiary-container", or "bg-outline"
      }[]; // exactly 4 high-demand skill premiums for this role
      marketHubs: {
        city: string; // City name (e.g. "SF Bay Area", "New York", "Austin", "Bangalore")
        delta: string; // e.g. "+15%", "+22%", "+8%"
        trend: string; // e.g. "Surging demand", "Fintech steady", "Cloud hypergrowth"
        trendColor: string; // MUST be "text-primary", "text-secondary", or "text-on-surface-variant"
        icon: string; // Material symbols icon: "local_fire_department", "trending_flat", "arrow_upward"
      }[]; // exactly 3 major hiring hubs relevant to the tech field
    }

    Note on CSS box models: The whisker lines and boxes are drawn in a vertical chart. Ensure your bottom and height percentages align properly so the rendering is beautifully aligned and visually accurate.
  `;

  // Scale raw salary numbers based on geographic index (keeping raw USD format)
  let geoScale = 1.0;
  const loc = location.toLowerCase();
  
  if (loc.includes('bangalore') || loc.includes('bengaluru') || loc.includes('india') || loc.includes('mumbai') || loc.includes('delhi') || loc.includes('hyderabad') || loc.includes('pune')) {
    geoScale = 0.28; // India market salary scale in equivalent USD
  } else if (loc.includes('london') || loc.includes('uk') || loc.includes('europe') || loc.includes('berlin') || loc.includes('amsterdam') || loc.includes('germany') || loc.includes('paris')) {
    geoScale = 0.76; // European standard scale
  } else if (loc.includes('francisco') || loc.includes('sf') || loc.includes('bay') || loc.includes('seattle') || loc.includes('york') || loc.includes('nyc') || loc.includes('california')) {
    geoScale = 1.15; // Tier-1 high cost tech hubs
  }

  let baseMin = 120000;
  let baseMax = 280000;
  let baseMedian = 195000;
  let baseP25 = 150000;
  let baseP75 = 240000;

  const exp = experience.toLowerCase();
  if (exp.includes('l4') || exp.includes('junior') || exp.includes('entry') || exp.includes('associate')) {
    baseMin = 85000;
    baseMax = 160000;
    baseMedian = 120000;
    baseP25 = 100000;
    baseP75 = 140000;
  } else if (exp.includes('l6') || exp.includes('staff') || exp.includes('principal') || exp.includes('director') || exp.includes('lead') || exp.includes('senior')) {
    baseMin = 180000;
    baseMax = 440000;
    baseMedian = 310000;
    baseP25 = 240000;
    baseP75 = 370000;
  }

  const minSalary = Math.round(baseMin * geoScale);
  const maxSalary = Math.round(baseMax * geoScale);
  const medianSalary = Math.round(baseMedian * geoScale);
  const p25Salary = Math.round(baseP25 * geoScale);
  const p75Salary = Math.round(baseP75 * geoScale);

  // Customize skills list based on role category
  const category = getRoleCategory(role);
  let premiums = [
    { name: 'Advanced System Architecture', percentage: '+24%', colorClass: 'bg-primary' },
    { name: 'Distributed Caching & Orchestration', percentage: '+16%', colorClass: 'bg-secondary' },
    { name: 'Rust / Systems Development', percentage: '+14%', colorClass: 'bg-tertiary-container' },
    { name: 'React 19 & Next.js App Router', percentage: '+8%', colorClass: 'bg-outline' }
  ];

  if (category === "AI/ML") {
    premiums = [
      { name: 'PyTorch & Neural Training', percentage: '+34%', colorClass: 'bg-primary' },
      { name: 'Vector DBs & semantic search', percentage: '+22%', colorClass: 'bg-secondary' },
      { name: 'CUDA Kernel Optimizations', percentage: '+20%', colorClass: 'bg-tertiary-container' },
      { name: 'Model Quantization & Deploy', percentage: '+15%', colorClass: 'bg-outline' }
    ];
  } else if (category === "Cloud") {
    premiums = [
      { name: 'Kubernetes Administration', percentage: '+26%', colorClass: 'bg-primary' },
      { name: 'Terraform Infrastructure IaC', percentage: '+18%', colorClass: 'bg-secondary' },
      { name: 'Multi-Cloud VPC Routing', percentage: '+15%', colorClass: 'bg-tertiary-container' },
      { name: 'Prometheus Log Monitoring', percentage: '+8%', colorClass: 'bg-outline' }
    ];
  } else if (category === "Cybersecurity") {
    premiums = [
      { name: 'Exploit Audits & PenTesting', percentage: '+28%', colorClass: 'bg-primary' },
      { name: 'Zero-Trust IAM Systems', percentage: '+22%', colorClass: 'bg-secondary' },
      { name: 'SIEM Logging & Incident Plans', percentage: '+14%', colorClass: 'bg-tertiary-container' },
      { name: 'SOC2 Compliance Standards', percentage: '+10%', colorClass: 'bg-outline' }
    ];
  } else if (category === "Data") {
    premiums = [
      { name: 'Snowflake / BigQuery Schemas', percentage: '+22%', colorClass: 'bg-primary' },
      { name: 'Apache Spark Data Streaming', percentage: '+18%', colorClass: 'bg-secondary' },
      { name: 'dbt Transformation Modeling', percentage: '+16%', colorClass: 'bg-tertiary-container' },
      { name: 'Airflow Pipeline Scheduling', percentage: '+10%', colorClass: 'bg-outline' }
    ];
  } else if (category === "Product") {
    premiums = [
      { name: 'Figma Layout Prototyping', percentage: '+20%', colorClass: 'bg-primary' },
      { name: 'Amplitude Analytics Tracking', percentage: '+16%', colorClass: 'bg-secondary' },
      { name: 'A/B Test Funnel Optimization', percentage: '+15%', colorClass: 'bg-tertiary-container' },
      { name: 'Agile Product Specifications', percentage: '+8%', colorClass: 'bg-outline' }
    ];
  } else if (category === "Finance") {
    premiums = [
      { name: 'DCF / LBO Modeling Structures', percentage: '+24%', colorClass: 'bg-primary' },
      { name: 'M&A Advisory Valuation', percentage: '+18%', colorClass: 'bg-secondary' },
      { name: 'Derivatives & Portfolio Risk', percentage: '+15%', colorClass: 'bg-tertiary-container' },
      { name: 'Capital Debt Restructuring', percentage: '+10%', colorClass: 'bg-outline' }
    ];
  } else if (category === "Marketing") {
    premiums = [
      { name: 'Growth loop Optimization', percentage: '+25%', colorClass: 'bg-primary' },
      { name: 'Technical SEO Auditing', percentage: '+18%', colorClass: 'bg-secondary' },
      { name: 'Ad Copy Conversion Optimizations', percentage: '+14%', colorClass: 'bg-tertiary-container' },
      { name: 'Cohort LTV/CAC Analyzers', percentage: '+12%', colorClass: 'bg-outline' }
    ];
  }

  // Customize market hubs
  const primaryHub = location.trim() ? location : (category === "Engineering" || category === "AI/ML" ? "San Francisco" : "New York");
  const secondaryHub = geoScale < 0.5 ? "Mumbai Hub" : "Seattle Tech Hub";
  const tertiaryHub = geoScale < 0.5 ? "Hyderabad Hub" : "Austin Tech Hub";

  const fallback: DynamicMarketData = {
    salaryPercentiles: {
      whiskerBottom: '15%',
      whiskerHeight: '65%',
      boxHeight: '40%',
      boxBottom: '25%',
      medianTop: '45%',
      minSalary,
      maxSalary,
      medianSalary,
      p25Salary,
      p75Salary
    },
    skillPremiums: premiums,
    marketHubs: [
      {
        city: primaryHub,
        delta: '+18%',
        trend: `Surging demand for local ${role} specialists`,
        trendColor: 'text-primary',
        icon: 'local_fire_department'
      },
      {
        city: secondaryHub,
        delta: '+12%',
        trend: 'High volume microservice integrations',
        trendColor: 'text-secondary',
        icon: 'arrow_upward'
      },
      {
        city: tertiaryHub,
        delta: '+8%',
        trend: 'Enterprise SaaS product scaling active',
        trendColor: 'text-on-surface-variant',
        icon: 'trending_flat'
      }
    ]
  };

  return callGroqJSON<DynamicMarketData>(prompt, fallback);
}

// ----------------------------------------------------
// Private Helpers
// ----------------------------------------------------

function getRoleCategory(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('ai') || r.includes('ml') || r.includes('prompt') || r.includes('llm') || r.includes('intelligence') || r.includes('machine learning')) return 'AI/ML';
  if (r.includes('cloud') || r.includes('devops') || r.includes('reliability') || r.includes('platform') || r.includes('aws') || r.includes('infrastructure') || r.includes('sre')) return 'Cloud';
  if (r.includes('cyber') || r.includes('security') || r.includes('hacker') || r.includes('penetration') || r.includes('red team')) return 'Cybersecurity';
  if (r.includes('data') || r.includes('analyst') || r.includes('science') || r.includes('analytics') || r.includes('warehouse')) return 'Data';
  if (r.includes('product') || r.includes('manager') || r.includes('design') || r.includes('ux') || r.includes('ui') || r.includes('figma')) return 'Product';
  if (r.includes('finance') || r.includes('investment') || r.includes('bank') || r.includes('quant') || r.includes('accounting') || r.includes('valuation')) return 'Finance';
  if (r.includes('marketing') || r.includes('growth') || r.includes('seo') || r.includes('acquisition') || r.includes('cac')) return 'Marketing';
  return 'Engineering';
}
