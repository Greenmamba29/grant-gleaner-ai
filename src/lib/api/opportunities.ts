import { supabase } from '@/integrations/supabase/client';

export interface OpportunityRaw {
  id: string;
  source: string;
  external_id: string | null;
  title: string;
  agency: string | null;
  amount_min: number | null;
  amount_max: number | null;
  amount_text: string | null;
  deadline: string | null;
  description: string | null;
  eligibility: string | null;
  source_url: string | null;
  raw_data: Record<string, unknown>;
  is_processed: boolean;
  created_at: string;
}

export interface OpportunityScored {
  id: string;
  user_id: string;
  opportunity_raw_id: string;
  strategic_fit_score: number;
  win_probability_score: number;
  resource_efficiency_score: number;
  strategic_value_score: number;
  bonus_points: number;
  capacity_penalty: number;
  total_score: number;
  decision: 'priority_a' | 'priority_b' | 'conditional' | 'no_go';
  hitl_status: 'pending' | 'approved' | 'rejected' | 'snoozed';
  match_reasons: string[];
  risks: string[];
  scoring_details: Record<string, unknown>;
  snoozed_until: string | null;
  created_at: string;
  updated_at: string;
  opportunity_raw?: OpportunityRaw;
}

export interface ScoredOpportunityWithRaw extends OpportunityScored {
  opportunities_raw: OpportunityRaw;
}

type OpportunityDecision = 'priority_a' | 'priority_b' | 'conditional' | 'no_go';
type HitlStatus = 'pending' | 'approved' | 'rejected' | 'snoozed';

export const opportunitiesApi = {
  // Fetch all scored opportunities for the current user
  async getScored(options?: {
    decision?: OpportunityDecision[];
    hitlStatus?: HitlStatus[];
    limit?: number;
  }): Promise<ScoredOpportunityWithRaw[]> {
    let query = supabase
      .from('opportunities_scored')
      .select(`
        *,
        opportunities_raw (*)
      `)
      .order('total_score', { ascending: false });

    if (options?.decision?.length) {
      query = query.in('decision', options.decision);
    }

    if (options?.hitlStatus?.length) {
      query = query.in('hitl_status', options.hitlStatus);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching scored opportunities:', error);
      throw error;
    }

    return (data as unknown as ScoredOpportunityWithRaw[]) || [];
  },

  // Get a single scored opportunity by ID
  async getScoredById(id: string): Promise<ScoredOpportunityWithRaw | null> {
    const { data, error } = await supabase
      .from('opportunities_scored')
      .select(`
        *,
        opportunities_raw (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching scored opportunity:', error);
      throw error;
    }

    return data as unknown as ScoredOpportunityWithRaw | null;
  },

  // Update HITL status for an opportunity
  async updateHitlStatus(
    id: string,
    status: 'approved' | 'rejected' | 'snoozed',
    snoozedUntil?: string
  ): Promise<void> {
    const updateData: Record<string, unknown> = { hitl_status: status };
    
    if (status === 'snoozed' && snoozedUntil) {
      updateData.snoozed_until = snoozedUntil;
    }

    const { error } = await supabase
      .from('opportunities_scored')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating HITL status:', error);
      throw error;
    }
  },

  // Get dashboard metrics
  async getMetrics(): Promise<{
    priorityA: number;
    priorityB: number;
    pending: number;
    approved: number;
  }> {
    const { data, error } = await supabase
      .from('opportunities_scored')
      .select('decision, hitl_status');

    if (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }

    const metrics = {
      priorityA: 0,
      priorityB: 0,
      pending: 0,
      approved: 0,
    };

    data?.forEach((opp) => {
      if (opp.decision === 'priority_a') metrics.priorityA++;
      if (opp.decision === 'priority_b') metrics.priorityB++;
      if (opp.hitl_status === 'pending') metrics.pending++;
      if (opp.hitl_status === 'approved') metrics.approved++;
    });

    return metrics;
  },

  // Trigger qualification for a raw opportunity
  async qualifyOpportunity(opportunityRawId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('qualify-opportunity', {
      body: { opportunityRawId },
    });

    if (error) {
      console.error('Error qualifying opportunity:', error);
      throw error;
    }
  },
};
