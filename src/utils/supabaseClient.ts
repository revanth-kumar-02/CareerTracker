import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing! Database integration might fail.");
}

// Global singleton to prevent multiple GoTrueClient warnings on HMR or path casing issues in Vite
let supabaseInstance: SupabaseClient;

if ((globalThis as any).__careertrack_supabase_instance) {
  supabaseInstance = (globalThis as any).__careertrack_supabase_instance;
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  if (typeof window !== 'undefined') {
    (window as any).__careertrack_supabase_instance = supabaseInstance;
  }
}

export const supabase = supabaseInstance;

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

export async function ensureAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
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
    const session = await ensureAuth().catch(() => null);
    if (!session || !session.user) {
      // Local fallback if not authenticated
      const localData = localStorage.getItem('careertrack_offline_profile');
      return localData ? JSON.parse(localData) : null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const parsed = parseProfileRow(data);
    if (parsed) {
      localStorage.setItem('careertrack_offline_profile', JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Error fetching profile from Supabase, trying local cache:", err);
    const localData = localStorage.getItem('careertrack_offline_profile');
    return localData ? JSON.parse(localData) : null;
  }
}

/**
 * Upserts a profile record back to Supabase.
 */
export async function upsertProfile(profileUpdates: Partial<SupabaseProfile>): Promise<SupabaseProfile | null> {
  let offlineFallbackProfile: SupabaseProfile | null = null;
  try {
    // Attempt to parse existing local fallback cache to preserve fields offline
    const cached = localStorage.getItem('careertrack_offline_profile');
    if (cached) {
      try {
        offlineFallbackProfile = JSON.parse(cached);
      } catch (e) {}
    }
  } catch (e) {}

  // Construct initial merged profile for offline use
  const mergedOfflineProfile: SupabaseProfile = {
    name: profileUpdates.name !== undefined ? profileUpdates.name : (offlineFallbackProfile?.name || ''),
    target_role: profileUpdates.target_role !== undefined ? profileUpdates.target_role : (offlineFallbackProfile?.target_role || ''),
    briefing: profileUpdates.briefing !== undefined ? profileUpdates.briefing : (offlineFallbackProfile?.briefing || ''),
    streak: profileUpdates.streak !== undefined ? profileUpdates.streak : (offlineFallbackProfile?.streak || 0),
    xp: profileUpdates.xp !== undefined ? profileUpdates.xp : (offlineFallbackProfile?.xp || 0),
    roadmap: profileUpdates.roadmap !== undefined ? profileUpdates.roadmap : (offlineFallbackProfile?.roadmap || null),
    resume_analysis: profileUpdates.resume_analysis !== undefined ? profileUpdates.resume_analysis : (offlineFallbackProfile?.resume_analysis || null),
    interview_session: profileUpdates.interview_session !== undefined ? profileUpdates.interview_session : (offlineFallbackProfile?.interview_session || null),
  };

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

    const parsed = parseProfileRow(data);
    if (parsed) {
      localStorage.setItem('careertrack_offline_profile', JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Error upserting profile in Supabase, using localStorage fallback:", err);
    try {
      localStorage.setItem('careertrack_offline_profile', JSON.stringify(mergedOfflineProfile));
    } catch (e) {}
    return mergedOfflineProfile;
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
