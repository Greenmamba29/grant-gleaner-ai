import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  id: string;
  user_id: string;
  name: string;
  sectors: string[] | null;
  keywords: string[] | null;
  team_credentials: Json | null;
  cost_share_capacity: number | null;
  geographic_priorities: string[] | null;
  active_proposal_count: number | null;
  created_at: string;
  updated_at: string;
}

export const authApi = {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Get user error:', error);
      throw error;
    }

    return user;
  },

  // Get user profile
  async getProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Get profile error:', error);
      throw error;
    }

    return data as UserProfile | null;
  },

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Get company profile
  async getCompanyProfile(): Promise<CompanyProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Get company profile error:', error);
      throw error;
    }

    return data as CompanyProfile | null;
  },

  // Create or update company profile
  async upsertCompanyProfile(profile: Partial<Omit<CompanyProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & { name: string }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    // Check if profile exists
    const { data: existing } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('company_profiles')
        .update({
          name: profile.name,
          sectors: profile.sectors,
          keywords: profile.keywords,
          team_credentials: profile.team_credentials,
          cost_share_capacity: profile.cost_share_capacity,
          geographic_priorities: profile.geographic_priorities,
          active_proposal_count: profile.active_proposal_count,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Update company profile error:', error);
        throw error;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('company_profiles')
        .insert({
          user_id: user.id,
          name: profile.name,
          sectors: profile.sectors,
          keywords: profile.keywords,
          team_credentials: profile.team_credentials,
          cost_share_capacity: profile.cost_share_capacity,
          geographic_priorities: profile.geographic_priorities,
          active_proposal_count: profile.active_proposal_count,
        });

      if (error) {
        console.error('Insert company profile error:', error);
        throw error;
      }
    }
  },
};
