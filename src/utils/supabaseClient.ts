import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const demoEmail = import.meta.env.VITE_DEMO_EMAIL || '';
const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing! Database integration might fail.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseProfile {
  name: string;
  target_role: string;
  briefing: string;
  streak: number;
  xp: number;
  roadmap: any | null;
  resume_analysis: any | null;
  interview_session: any | null;
}

// Cached session promise to prevent concurrent sign-in requests on mount
let authPromise: Promise<any> | null = null;

export async function ensureAuth() {
  if (authPromise) {
    return authPromise;
  }

  authPromise = (async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        return session;
      }

      if (!demoEmail || !demoPassword) {
        throw new Error("Demo credentials are not configured in environment variables!");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) {
        throw error;
      }

      return data.session;
    } catch (err) {
      console.error("Supabase background authentication failed:", err);
      authPromise = null;
      throw err;
    }
  })();

  return authPromise;
}

/**
 * Parses the raw db profile row and merges the JSON payload from the 'dream_company' column.
 */
function parseProfileRow(row: any): SupabaseProfile | null {
  if (!row) return null;

  let extra: any = {};
  if (row.dream_company) {
    try {
      extra = JSON.parse(row.dream_company);
    } catch (e) {
      console.error("Failed to parse profile details from dream_company column:", e);
    }
  }

  return {
    name: extra.name || '',
    target_role: row.role || '',
    briefing: extra.briefing || '',
    streak: row.streak || 0,
    xp: row.xp || 0,
    roadmap: extra.roadmap || null,
    resume_analysis: extra.resume_analysis || null,
    interview_session: extra.interview_session || null,
  };
}

/**
 * Fetch the active user's profile from Supabase.
 */
export async function getProfile(): Promise<SupabaseProfile | null> {
  try {
    const session = await ensureAuth();
    if (!session || !session.user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return parseProfileRow(data);
  } catch (err) {
    console.error("Error fetching profile from Supabase:", err);
    return null;
  }
}

/**
 * Upserts a profile record back to Supabase.
 */
export async function upsertProfile(profileUpdates: Partial<SupabaseProfile>): Promise<SupabaseProfile | null> {
  try {
    const session = await ensureAuth();
    if (!session || !session.user) {
      throw new Error("User not authenticated.");
    }

    const userId = session.user.id;

    // First fetch the current record to merge extra fields stored in dream_company
    const { data: current, error: fetchErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (fetchErr) {
      throw fetchErr;
    }

    let extra: any = {};
    if (current && current.dream_company) {
      try {
        extra = JSON.parse(current.dream_company);
      } catch (e) {}
    }

    // Merge in updates
    if (profileUpdates.name !== undefined) extra.name = profileUpdates.name;
    if (profileUpdates.briefing !== undefined) extra.briefing = profileUpdates.briefing;
    if (profileUpdates.roadmap !== undefined) extra.roadmap = profileUpdates.roadmap;
    if (profileUpdates.resume_analysis !== undefined) extra.resume_analysis = profileUpdates.resume_analysis;
    if (profileUpdates.interview_session !== undefined) extra.interview_session = profileUpdates.interview_session;

    const payload: any = {
      id: userId,
      email: session.user.email,
      dream_company: JSON.stringify(extra),
    };

    if (profileUpdates.target_role !== undefined) payload.role = profileUpdates.target_role;
    if (profileUpdates.streak !== undefined) payload.streak = profileUpdates.streak;
    if (profileUpdates.xp !== undefined) payload.xp = profileUpdates.xp;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return parseProfileRow(data);
  } catch (err) {
    console.error("Error upserting profile in Supabase:", err);
    return null;
  }
}

/**
 * Helper to update streak metrics directly.
 */
export async function updateStreak(streak: number): Promise<SupabaseProfile | null> {
  return upsertProfile({ streak });
}

/**
 * Helper to save generated career roadmaps.
 */
export async function saveRoadmap(roadmap: any): Promise<SupabaseProfile | null> {
  return upsertProfile({ roadmap });
}

/**
 * Helper to save resume ATS analyses.
 */
export async function saveResumeAnalysis(resumeAnalysis: any): Promise<SupabaseProfile | null> {
  return upsertProfile({ resume_analysis: resumeAnalysis });
}

/**
 * Helper to save mock interview sessions.
 */
export async function saveInterviewSession(interviewSession: any): Promise<SupabaseProfile | null> {
  return upsertProfile({ interview_session: interviewSession });
}
