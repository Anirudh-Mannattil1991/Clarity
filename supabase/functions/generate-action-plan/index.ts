const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskText, energyLevel = 'medium' } = await req.json();

    if (!taskText || typeof taskText !== 'string' || taskText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input. Please provide a task.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      console.error('INTEGRATIONS_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const energyGuidance = {
      low: 'Break into very small steps (5-10 minutes each). Keep it gentle and achievable.',
      medium: 'Create balanced steps (15-30 minutes each). Mix challenging and easier parts.',
      high: 'Suggest focused blocks (30-60 minutes). User has strong energy for deep work.'
    };

    const systemPrompt = `You are a calm, supportive productivity coach.

Generate a simple 3-5 step action plan for this task: "${taskText}"

User's current energy level: ${energyLevel.toUpperCase()}
${energyGuidance[energyLevel as keyof typeof energyGuidance]}

Requirements:
- 3-5 steps maximum
- Each step should have a time estimate
- Use gentle, encouraging tone
- Make it practical and actionable
- Format as a simple numbered list

Return ONLY valid JSON in this format:
{
  "steps": [
    "Step 1 (15 mins): Description",
    "Step 2 (30 mins): Description",
    "Step 3 (20 mins): Description"
  ]
}

No explanations. No markdown. Only JSON.`;

    const apiUrl = 'https://app-9uhj8334a0ap-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate action plan. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr && jsonStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(jsonStr);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  fullText += text;
                }
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        }
      }
    }

    let planData;
    try {
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }

      if (!planData.steps || !Array.isArray(planData.steps)) {
        throw new Error('Invalid JSON structure');
      }
    } catch (e) {
      console.error('JSON parsing error:', e, 'Full text:', fullText);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(planData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Let\'s try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
