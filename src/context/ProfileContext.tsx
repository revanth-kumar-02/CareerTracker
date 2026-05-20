import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, upsertProfile, SupabaseProfile } from '../utils/supabaseClient';

interface ProfileContextType {
  profile: SupabaseProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<SupabaseProfile | null>;
  updateProfile: (updates: Partial<SupabaseProfile>) => Promise<SupabaseProfile | null>;
}

// Support global singleton in development/HMR to prevent duplicate module context mismatch on Windows casing issues
const ProfileContext = (globalThis as any).__careertrack_profile_context || createContext<ProfileContextType | undefined>(undefined);
if (typeof window !== 'undefined') {
  (window as any).__careertrack_profile_context = ProfileContext;
}

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (): Promise<SupabaseProfile | null> => {
    try {
      const data = await getProfile();
      setProfile(data);
      return data;
    } catch (e) {
      console.error("Failed to load profile in ProfileContext:", e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<SupabaseProfile>): Promise<SupabaseProfile | null> => {
    try {
      const data = await upsertProfile(updates);
      if (data) {
        setProfile(data);
      }
      return data;
    } catch (e) {
      console.error("Failed to update profile in ProfileContext:", e);
      return null;
    }
  };

  useEffect(() => {
    refreshProfile();

    // Support immediate refreshes on manual dispatch events if necessary
    const handleUpdatedEvent = () => {
      refreshProfile();
    };

    window.addEventListener('profile-updated', handleUpdatedEvent);
    return () => {
      window.removeEventListener('profile-updated', handleUpdatedEvent);
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
