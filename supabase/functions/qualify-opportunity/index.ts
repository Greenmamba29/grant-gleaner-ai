import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const SCORING_SYSTEM_PROMPT = `You are the Grant Qualification Engine for an organization focused on:
- Lithium recycling & critical minerals (primary)
- Autism-inclusive employment & education technology  
- Clean water infrastructure for underserved communities
- Carbon neutrality & circular economy

SCORING MATRIX (return exact scores for each category):

A. Strategic Fit (40 points max)
   - Technical Alignment (0-15): 15=Lithium recycling, 10=Critical minerals/water, 5=General STEM, 0=Unrelated
   - Social Impact Alignment (0-15): 15=Autism employment + underserved, 10=Disability/education, 5=General social, 0=None
   - Geographic Priority (0-10): 10=USA/EU priority regions, 5=Eligible but not priority, 0=Ineligible

B. Win Probability (30 points max)
   - Competition Density (0-10): 10=<50 apps (niche), 5=50-200, 0=>200 or highly competitive
   - Differentiation Potential (0-10): 10=Unique autism-lithium angle, 5=Tech only, 0=Commodity
   - Track Record Match (0-10): 10=Similar past wins, 5=Related experience, 0=New area

C. Resource Efficiency (20 points max)
   - Cost-Benefit Ratio (0-10): Based on award size vs. effort required
   - Cost-Share Leverage (0-10): 10=Industry partner committed, 5=In-kind only, 0=100% match required

D. Strategic Value (10 points max)
   - Partnership Access (0-5): Opens door to major partners
   - Future Pipeline (0-5): Phase 1 of multi-phase program

BONUSES & PENALTIES:
+20 if intersectionality matches (social-tech hybrid with both lithium AND autism/education)
+10 if award >$5M AND cost-share <25%
-15 if organization has >3 other proposals due within 30 days (assume 1 currently)

DECISION THRESHOLDS (based on total_score):
85-100: priority_a
70-84: priority_b
55-69: conditional
<55: no_go

IMPORTANT: Return ONLY valid JSON with no markdown formatting.`;

interface QualificationRequest {
  opportunity: {
    id: string;
    title: string;
    agency: string | null;
    amount_text: string | null;
    amount_min: number | null;
    amount_max: number | null;
    deadline: string | null;
    description: string | null;
    eligibility: string | null;
  };
  companyProfile?: {
    sectors: string[];
    keywords: string[];
    active_proposal_count: number;
  };
}

interface QualificationResponse {
  strategic_fit_score: number;
  win_probability_score: number;
  resource_efficiency_score: number;
  strategic_value_score: number;
  bonus_points: number;
  capacity_penalty: number;
  total_score: number;
  decision: 'priority_a' | 'priority_b' | 'conditional' | 'no_go';
  match_reasons: string[];
  risks: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { opportunity, companyProfile }: QualificationRequest = await req.json();

    if (!opportunity) {
      return new Response(
        JSON.stringify({ success: false, error: 'Opportunity data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Qualifying opportunity:', opportunity.title);

    const userPrompt = `Analyze this grant opportunity and score it:

OPPORTUNITY:
Title: ${opportunity.title}
Agency: ${opportunity.agency || 'Unknown'}
Amount: ${opportunity.amount_text || `$${opportunity.amount_min || '?'} - $${opportunity.amount_max || '?'}`}
Deadline: ${opportunity.deadline || 'Not specified'}
Description: ${opportunity.description || 'No description available'}
Eligibility: ${opportunity.eligibility || 'Not specified'}

${companyProfile ? `COMPANY CONTEXT:
- Current sectors: ${companyProfile.sectors.join(', ') || 'Not specified'}
- Focus keywords: ${companyProfile.keywords.join(', ') || 'Not specified'}
- Active proposals: ${companyProfile.active_proposal_count}` : ''}

Return a JSON object with this exact structure:
{
  "strategic_fit_score": <0-40>,
  "win_probability_score": <0-30>,
  "resource_efficiency_score": <0-20>,
  "strategic_value_score": <0-10>,
  "bonus_points": <0 or positive number>,
  "capacity_penalty": <0 or negative number>,
  "total_score": <sum of all scores>,
  "decision": "<priority_a|priority_b|conditional|no_go>",
  "match_reasons": ["reason1", "reason2", "reason3"],
  "risks": ["risk1", "risk2"]
}`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SCORING_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `AI Gateway error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let qualification: QualificationResponse;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      qualification = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw content:', content);
      
      // Provide default qualification if parsing fails
      qualification = {
        strategic_fit_score: 20,
        win_probability_score: 15,
        resource_efficiency_score: 10,
        strategic_value_score: 5,
        bonus_points: 0,
        capacity_penalty: 0,
        total_score: 50,
        decision: 'conditional',
        match_reasons: ['Unable to fully analyze - manual review recommended'],
        risks: ['AI analysis incomplete'],
      };
    }

    console.log('Qualification result:', qualification.decision, 'Score:', qualification.total_score);

    return new Response(
      JSON.stringify({
        success: true,
        qualification,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in qualify-opportunity:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
