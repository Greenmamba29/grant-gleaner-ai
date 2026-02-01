import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface GrantSearchResult {
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string;
  sourceUrl: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, filters } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!apiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Perplexity API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching grants with query:', query);
    console.log('Filters:', filters);

    // Build the search prompt for grant discovery
    const systemPrompt = `You are Grant Hunter Pro, an expert AI grant researcher. Your task is to find real, current grant opportunities based on the user's search query.

When searching for grants, focus on:
- SBIR/STTR programs from federal agencies
- NSF, NIH, DOE, NASA, DARPA grants
- State and local economic development grants
- Private foundation grants
- Corporate innovation programs

For each grant opportunity found, provide structured information including:
- Grant title and program name
- Funding agency/organization
- Funding amount (range if applicable)
- Application deadline
- Brief description
- Eligibility requirements
- Source URL

Always cite your sources and provide accurate, up-to-date information about real grant programs.`;

    const userPrompt = `Search for grant opportunities matching: "${query}"
${filters?.fundingRange ? `Funding range: ${filters.fundingRange}` : ''}
${filters?.deadline ? `Deadline preference: ${filters.deadline}` : ''}
${filters?.sector ? `Technology sector: ${filters.sector}` : ''}

Find 5-10 relevant grant opportunities and return them as a JSON array with this structure:
[{
  "title": "Grant Program Name",
  "agency": "Funding Organization",
  "amount": "$X - $Y",
  "deadline": "Date or Rolling",
  "description": "Brief program description",
  "eligibility": "Who can apply",
  "sourceUrl": "https://..."
}]

Return ONLY the JSON array, no additional text.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Perplexity API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: PerplexityResponse = await response.json();
    console.log('Perplexity response received');

    const content = data.choices?.[0]?.message?.content;
    const citations = data.citations || [];

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'No results from Perplexity' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the grant results from the response
    let grants: GrantSearchResult[] = [];
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        grants = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, return raw content for debugging
        console.log('Raw content:', content);
        grants = [];
      }
    } catch (parseError) {
      console.error('Error parsing grants:', parseError);
      console.log('Raw content:', content);
    }

    console.log(`Found ${grants.length} grant opportunities`);

    return new Response(
      JSON.stringify({
        success: true,
        grants,
        citations,
        query,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in perplexity-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
