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

export interface DynamicRoadmap {
  targetRole: string;
  description: string;
  successProbability: number;
  successReason: string;
  stages: {
    stage: number;
    status: 'Completed' | 'In Progress' | 'Locked';
    title: string;
    timeline: string;
    desc: string;
    skills: string[];
    subtasks: {
      name: string;
      percentage: string;
      status: 'Completed' | 'In Progress' | 'Locked' | 'Start Next';
    }[];
  }[];
  skillGaps: {
    name: string;
    level: string;
    progressWidth: string; // e.g. "3/5" or "4/5"
    colorClass: string;   // "bg-primary", "bg-secondary", "bg-tertiary-container"
    aiSuggestion?: boolean;
  }[];
  recommendedNextStep: {
    category: string;
    title: string;
    desc: string;
    icon: string;
    buttonLabel: string;
  };
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
  const prompt = `
    You are an expert SaaS React career intelligence coach.
    Create a highly personalized, premium career transition roadmap for a user who wants to become a "${targetRole}".
    ${currentSkills ? `The user currently has these skills: "${currentSkills}". Take this into account.` : ""}
    
    You must output a single, well-formatted JSON object that strictly adheres to the following TypeScript interface:
    interface DynamicRoadmap {
      targetRole: string;
      description: string;
      successProbability: number; // integer 0-100 representing percentage chance of success
      successReason: string; // 1-sentence justification for the success probability
      stages: {
        stage: number; // 1, 2, 3
        status: 'Completed' | 'In Progress' | 'Locked'; // stage 1 should be Completed, stage 2 In Progress, stage 3 Locked
        title: string;
        timeline: string; // e.g. "3 Months", "Month 4 of 6", "Future Phase"
        desc: string; // 1-2 sentence description of what the user focuses on in this stage
        skills: string[]; // 2-3 core skills associated with this stage
        subtasks: {
          name: string;
          percentage: string; // e.g. "80%", "Start Next", "100%", "Locked"
          status: 'Completed' | 'In Progress' | 'Locked' | 'Start Next';
        }[]; // 2 subtasks under the stage
      }[];
      skillGaps: {
        name: string;
        level: string; // e.g. "Level 3 / 5"
        progressWidth: string; // e.g. "3/5", "2/5", "4/5"
        colorClass: string; // MUST be either "bg-primary", "bg-secondary", or "bg-tertiary-container"
        aiSuggestion?: boolean; // true for at least one critical skill gap
      }[]; // exactly 3 items representing core missing skills/topics
      recommendedNextStep: {
        category: string; // e.g. "Recommended Next Step" or "High Priority Course"
        title: string; // specific learning module title
        desc: string; // 1-sentence description of the course
        icon: string; // Material symbols icon name e.g. "school", "terminal", "psychology"
        buttonLabel: string; // e.g. "Start Learning Module"
      };
    }

    Keep descriptions practical, startup-grade, professional, and concise. Avoid placeholder text.
  `;

  // Dynamic fallback generator if API fails or key is missing
  const fallback: DynamicRoadmap = {
    targetRole,
    description: `Your custom-tailored vector path to transition into a elite ${targetRole}. Estimated velocity: 6-12 months.`,
    successProbability: 82,
    successReason: `High due to your strong foundation and modern software engineering paradigms.`,
    stages: [
      {
        stage: 1,
        status: 'Completed',
        title: 'Core Fundamentals',
        timeline: '2 Months',
        desc: `Mastered the foundational architectures, standards, and workflow paradigms required for a ${targetRole}.`,
        skills: ['Core Concepts', 'Toolchain Setup', 'Version Control'],
        subtasks: [
          { name: 'Complete Core Fundamentals Course', percentage: '100%', status: 'Completed' },
          { name: 'Build Initial Sandbox Architecture', percentage: '100%', status: 'Completed' }
        ]
      },
      {
        stage: 2,
        status: 'In Progress',
        title: 'Specialized Applications',
        timeline: 'Month 2 of 4',
        desc: `Deep diving into highly-requested systems design patterns, specialized framework layers, and scalable engineering.`,
        skills: ['Scaling Patterns', 'Advanced Integrations'],
        subtasks: [
          { name: 'Implement Advanced Optimization Patterns', percentage: '60%', status: 'In Progress' },
          { name: 'Construct Orchestrated Automation Pipelines', percentage: 'Start Next', status: 'Start Next' }
        ]
      },
      {
        stage: 3,
        status: 'Locked',
        title: 'Scale & Operations',
        timeline: 'Future Phase',
        desc: `Developing strategic high-availability designs, organizational team leadership, and fault-tolerant architecture standards.`,
        skills: ['Fault-Tolerance', 'System Audit & Refinement'],
        subtasks: [
          { name: 'Perform Full Scale Stress Test Audit', percentage: 'Locked', status: 'Locked' },
          { name: 'Architect Distributed Cluster Systems', percentage: 'Locked', status: 'Locked' }
        ]
      }
    ],
    skillGaps: [
      { name: 'Advanced System Architecture', level: 'Level 2 / 5', progressWidth: '2/5', colorClass: 'bg-primary', aiSuggestion: true },
      { name: 'Infrastructure & Automation', level: 'Level 3 / 5', progressWidth: '3/5', colorClass: 'bg-secondary' },
      { name: 'Security & Optimization', level: 'Level 4 / 5', progressWidth: '4/5', colorClass: 'bg-tertiary-container' }
    ],
    recommendedNextStep: {
      category: 'Recommended Next Step',
      title: `Grokking the ${targetRole} Core Concepts`,
      desc: 'Master the critical scaling and integration patterns required for high-velocity startup operations.',
      icon: 'school',
      buttonLabel: 'Start Learning Module'
    }
  };

  return callGeminiJSON<DynamicRoadmap>(prompt, fallback);
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

  const fallback: DynamicResumeFeedback = {
    atsScore: 78,
    keywordMatch: 'Medium',
    keywordMatchDesc: 'Good usage of technical terms, but lacks strategic cloud deployment terminology.',
    actionableSuggestions: [
      {
        type: 'warning',
        title: 'Quantify your accomplishments',
        desc: `Modify experience descriptions under your previous roles to explicitly mention numeric percentages (e.g. reduced load times by 20%, optimized cost by 15%).`
      },
      {
        type: 'add',
        title: `Add core ${targetRole} skill keywords`,
        desc: `Explicitly integrate missing keywords such as high-availability clustering, system optimizations, and enterprise pipelines to pass strict ATS filters.`
      }
    ],
    priorityFixes: [
      {
        icon: 'bar_chart',
        colorClass: 'text-on-error-container',
        bgClass: 'bg-error-container',
        title: 'Missing quantified impact in achievements',
        desc: 'At least 3 bullet points in your experience history are static descriptions. Rewrite using the X-Y-Z framework.'
      },
      {
        icon: 'extension',
        colorClass: 'text-tertiary',
        bgClass: 'bg-tertiary/10',
        title: 'Incorporate modern pipeline tools',
        desc: `For a ${targetRole}, incorporating automated orchestration and container clustering tools is a top 3 filter requirement.`
      },
      {
        icon: 'format_paint',
        colorClass: 'text-secondary',
        bgClass: 'bg-secondary-container/20',
        title: 'Standardize date formatting',
        desc: 'Your older roles utilize varying date formats. Standardize all employment periods to the MM/YYYY format.'
      }
    ],
    atsChecklist: [
      { label: 'Standard Section Headers', status: 'Pass' },
      { label: 'Machine-Readable Fonts', status: 'Pass' },
      { label: 'No Complex Columns/Tables', status: 'Fail' }
    ],
    matchedSkills: ['Core Architecture', 'Team Collaboration', 'Software Design'],
    missingSkills: ['Automated Testing', 'Cloud Scaling', 'Orchestration Tools'],
    googleFormulaAnalysis: [
      {
        type: 'strong',
        title: 'Strong Impact Example',
        example: '"Designed and scaled a modular architecture, increasing system throughput by 32% over 3 months by implementing parallel processing queues."',
        badges: ['Action Verb', 'Quantified Impact']
      },
      {
        type: 'weak',
        title: 'Needs Improvement Example',
        example: '"Helped with the design and maintenance of our main backend and cloud databases."',
        badges: ["Weak Verb ('Helped')", 'No Metrics']
      }
    ]
  };

  return callGeminiJSON<DynamicResumeFeedback>(prompt, fallback);
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

  const fallback: FallbackResponse = {
    questions: [
      { id: 1, text: `Can you describe a time when you had to balance user needs with strict technical constraints on a tight deadline while architecting for a ${targetRole} role?` },
      { id: 2, text: `How do you approach designing a highly available, fault-tolerant system that can scale gracefully under sudden traffic spikes?` },
      { id: 3, text: `Walk me through how you optimize database index strategies and caching layers to minimize query latency and resource bottlenecks.` },
      { id: 4, text: `Describe a situation where a critical system you built failed in production. How did you diagnose, mitigate, and prevent the issue from recurring?` },
      { id: 5, text: `How do you collaborate with cross-functional product and design teams to translate complex engineering constraints into user-centric interfaces?` }
    ]
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

  const fallback: DynamicInterviewFeedback = {
    coachingTip: "Excellent logical structure. To make it stronger, quantify your impact immediately with metrics like server load reduction percentages or concrete latency savings.",
    confidenceIndex: 85,
    pacingRateText: "Steady",
    pacingWordsPerMin: 124,
    isSTARCompliant: true
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

  const fallback: DynamicMarketData = {
    salaryPercentiles: {
      whiskerBottom: '15%',
      whiskerHeight: '65%',
      boxHeight: '40%',
      boxBottom: '25%',
      medianTop: '45%'
    },
    skillPremiums: [
      { name: 'Advanced System Architecture', percentage: '+24%', colorClass: 'bg-primary' },
      { name: 'Distributed Caching & Orchestration', percentage: '+16%', colorClass: 'bg-secondary' },
      { name: 'Rust / Systems Development', percentage: '+14%', colorClass: 'bg-tertiary-container' },
      { name: 'React 19 & Next.js App Router', percentage: '+8%', colorClass: 'bg-outline' }
    ],
    marketHubs: [
      {
        city: location === 'San Francisco' ? 'SF Bay Area' : location,
        delta: '+16%',
        trend: 'Hyper-demand in AI & Cloud integrations',
        trendColor: 'text-primary',
        icon: 'local_fire_department'
      },
      {
        city: 'Seattle Hub',
        delta: '+12%',
        trend: 'Fintech & SaaS steady growth',
        trendColor: 'text-secondary',
        icon: 'arrow_upward'
      },
      {
        city: 'Austin Tech Hub',
        delta: '+8%',
        trend: 'Security architectures active',
        trendColor: 'text-on-surface-variant',
        icon: 'trending_flat'
      }
    ]
  };

  return callGroqJSON<DynamicMarketData>(prompt, fallback);
}
