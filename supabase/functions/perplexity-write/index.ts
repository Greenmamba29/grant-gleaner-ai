import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const SECTION_TEMPLATES: Record<string, string> = {
  specific_aims: `You are an expert grant writer specializing in federal and foundation proposals. 
Write a compelling Specific Aims section following this structure:

1. OPENING HOOK (2-3 sentences): Start with a compelling problem statement that creates urgency
2. CURRENT GAP: What's missing in current approaches
3. INNOVATION STATEMENT: Your unique solution and why it matters
4. AIMS (2-4 aims): Each aim should have:
   - Clear action verb
   - Measurable outcome
   - Alignment with the funder's priorities
5. IMPACT STATEMENT: What success looks like and broader implications

Key principles:
- Lead with the problem, not your solution
- Use active voice and specific metrics
- Connect to the funder's mission
- Keep aims achievable within the project scope`,

  budget_justification: `You are an expert in federal grant budget preparation.
Create a budget justification narrative that:

1. PERSONNEL: Justify each role with % effort and specific responsibilities
2. EQUIPMENT: Explain why each item is necessary and not available elsewhere
3. TRAVEL: Connect travel to specific project activities
4. SUPPLIES: Group logically and explain consumption rates
5. OTHER COSTS: Justify consultants, subawards, and indirect costs

Key principles:
- Be specific about how costs support the project
- Show cost-effectiveness
- Align with federal cost principles (2 CFR 200)
- Include in-kind contributions if applicable`,

  logic_model: `Create a detailed Logic Model / Theory of Change in narrative format:

STRUCTURE:
1. INPUTS: Resources you're bringing (funding, personnel, equipment, partnerships)
2. ACTIVITIES: Specific actions you'll take (research, development, training, outreach)
3. OUTPUTS: Direct products (prototypes, publications, trained personnel, data)
4. OUTCOMES: Short-term changes (knowledge gained, behaviors changed, systems improved)
5. IMPACT: Long-term societal changes (industry transformation, policy change, community benefit)

Include:
- Causal linkages between each level
- Assumptions and external factors
- Measurable indicators for each outcome`,

  narrative: `Write a compelling project narrative that:

1. SIGNIFICANCE: Why this matters now (urgency, scale of problem, opportunity)
2. INNOVATION: What's new about your approach
3. APPROACH: Methodology with timeline and milestones
4. TEAM: Why your team is uniquely qualified
5. ENVIRONMENT: Resources and partnerships supporting success
6. BROADER IMPACTS: Benefits beyond the immediate project

Key principles:
- Use strong topic sentences
- Include preliminary data or prior art
- Address potential challenges and mitigation
- Show sustainability beyond the grant period`,
};

interface WriteRequest {
  applicationId: string;
  section: string;
  context: {
    title: string;
    agency: string;
    amount: string;
    deadline: string;
  };
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

    const { section, context }: WriteRequest = await req.json();

    if (!section || !context) {
      return new Response(
        JSON.stringify({ success: false, error: 'Section and context are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const template = SECTION_TEMPLATES[section];
    if (!template) {
      return new Response(
        JSON.stringify({ success: false, error: `Unknown section: ${section}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating draft for section:', section);

    const userPrompt = `Generate a draft ${section.replace('_', ' ')} section for this grant application:

GRANT OPPORTUNITY:
- Title: ${context.title}
- Agency: ${context.agency}
- Amount: ${context.amount}
- Deadline: ${context.deadline}

ORGANIZATION FOCUS AREAS:
- Lithium recycling and critical minerals circular economy
- Autism-inclusive employment and education technology
- Clean water infrastructure for underserved communities
- Carbon neutrality and sustainability

Generate professional, compelling content ready for review and editing.
Focus on the intersection of these focus areas where relevant.
Use specific, measurable outcomes and cite general best practices.
Write approximately 500-800 words.`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: template },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
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

    console.log('Generated draft for:', section, 'Length:', content.length);

    return new Response(
      JSON.stringify({
        success: true,
        content,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in perplexity-write:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
