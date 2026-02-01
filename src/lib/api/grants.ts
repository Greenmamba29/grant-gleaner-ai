import { supabase } from '@/integrations/supabase/client';

export interface Grant {
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string;
  sourceUrl: string;
}

export interface SearchFilters {
  fundingRange?: string;
  deadline?: string;
  sector?: string;
}

export interface SearchResponse {
  success: boolean;
  grants?: Grant[];
  citations?: string[];
  query?: string;
  error?: string;
}

export const grantsApi = {
  async search(query: string, filters?: SearchFilters): Promise<SearchResponse> {
    const { data, error } = await supabase.functions.invoke('perplexity-search', {
      body: { query, filters },
    });

    if (error) {
      console.error('Search error:', error);
      return { success: false, error: error.message };
    }

    return data;
  },
};
