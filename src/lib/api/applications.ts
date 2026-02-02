import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface Application {
  id: string;
  user_id: string;
  opportunity_scored_id: string;
  status: 'draft' | 'in_progress' | 'submitted' | 'awarded' | 'rejected';
  content_sections: Json | null;
  team_members: string[] | null;
  notes: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithOpportunity extends Application {
  opportunities_scored: {
    id: string;
    total_score: number;
    opportunities_raw: {
      id: string;
      title: string;
      agency: string | null;
      amount_text: string | null;
      deadline: string | null;
    };
  };
}

export const applicationsApi = {
  // Create a new application from an approved opportunity
  async create(opportunityScoredId: string): Promise<Application> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        opportunity_scored_id: opportunityScoredId,
        status: 'draft',
        content_sections: {
          specific_aims: '',
          budget_justification: '',
          logic_model: '',
          narrative: '',
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      throw error;
    }

    return data as Application;
  },

  // Get all applications for the current user
  async getAll(): Promise<ApplicationWithOpportunity[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunities_scored (
          id,
          total_score,
          opportunities_raw (
            id,
            title,
            agency,
            amount_text,
            deadline
          )
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }

    return (data as unknown as ApplicationWithOpportunity[]) || [];
  },

  // Get a single application by ID
  async getById(id: string): Promise<ApplicationWithOpportunity | null> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunities_scored (
          id,
          total_score,
          opportunities_raw (
            id,
            title,
            agency,
            amount_text,
            deadline
          )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching application:', error);
      throw error;
    }

    return data as unknown as ApplicationWithOpportunity | null;
  },

  // Update application content
  async updateContent(
    id: string,
    contentSections: Json
  ): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .update({ content_sections: contentSections })
      .eq('id', id);

    if (error) {
      console.error('Error updating application content:', error);
      throw error;
    }
  },

  // Update application status
  async updateStatus(
    id: string,
    status: Application['status']
  ): Promise<void> {
    const updateData: Record<string, unknown> = { status };
    
    if (status === 'submitted') {
      updateData.submitted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Generate AI draft for a section
  async generateDraft(
    applicationId: string,
    section: string,
    context: Record<string, string>
  ): Promise<string> {
    const { data, error } = await supabase.functions.invoke('perplexity-write', {
      body: { applicationId, section, context },
    });

    if (error) {
      console.error('Error generating draft:', error);
      throw error;
    }

    return data.content;
  },
};
