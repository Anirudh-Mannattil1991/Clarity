const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thoughts, energyLevel = 'medium' } = await req.json();

    if (!thoughts || typeof thoughts !== 'string' || thoughts.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input. Please provide your thoughts.' }),
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

    const energyAdaptation = {
      low: 'Break tasks into very small, manageable steps (5-10 minutes each). Prioritize rest and gentle progress.',
      medium: 'Provide balanced steps with moderate time blocks (15-30 minutes). Mix challenging and easier tasks.',
      high: 'Suggest larger time blocks (30-60 minutes) and ambitious goals. User has strong energy for focused work.'
    };

    const systemPrompt = `You are a calm, empathetic productivity assistant helping users find mental clarity.

The user will provide free-form thoughts or tasks. Their current energy level is: ${energyLevel.toUpperCase()}.
${energyAdaptation[energyLevel as keyof typeof energyAdaptation]}

Your job:

1. Extract each distinct task or concern
2. Categorize each into ONE of these categories:
   - Do Today (urgent and actionable within 24 hours)
   - Schedule Soon (important but not urgent)
   - Delegate / Ask for Help (requires another person)
   - Let It Go (not urgent or not in user's control)

3. For EACH "Do Today" and "Schedule Soon" task:
   - Provide a "next_step" - a gentle, actionable suggestion (1-2 sentences)
   - Assign a "pressure_level" (low/medium/high) based on urgency language, deadlines, and emotional intensity

4. For EACH "Delegate" task:
   - Provide a "next_step" suggestion
   - Add a "delegation_nudge" - specific guidance like "Who specifically can you message?" or "Would sending a short text now reduce uncertainty?"

5. For EACH "Let It Go" task:
   - Provide a "next_step" suggestion
   - Add a "reframe" - compassionate perspective shift using reflective questions (not clinical advice)
   - Example: "Consider: Is there clear evidence this is true, or is it a fear? If it matters to you, a short message could bring clarity."

6. Detect the dominant mood from the text (anxious, calm, overwhelmed, focused, stressed, hopeful, uncertain, motivated, tired, neutral)

7. Calculate a clarity_index_before (0-100) based on:
   - Number of items (more = lower score)
   - Urgency language (urgent words = lower score)
   - Emotional language (anxious words = lower score)

8. Calculate clarity_index_after (0-100) - should be higher, showing improvement after organization

9. Generate ONE short personalized encouragement line (10-15 words) that is calming and supportive. Examples:
   - "You're handling more than you think."
   - "Focus on one small step."
   - "Clarity begins with action."

Return ONLY valid JSON in this EXACT format:
{
  "do_today": [
    {"task": "task text", "next_step": "gentle suggestion", "pressure_level": "low|medium|high"}
  ],
  "schedule_soon": [
    {"task": "task text", "next_step": "gentle suggestion", "pressure_level": "low|medium|high"}
  ],
  "delegate": [
    {"task": "task text", "next_step": "gentle suggestion", "delegation_nudge": "specific guidance"}
  ],
  "let_go": [
    {"task": "task text", "next_step": "gentle suggestion", "reframe": "compassionate perspective with reflective questions"}
  ],
  "dominant_mood": "mood_name",
  "clarity_index_before": 42,
  "clarity_index_after": 68,
  "encouragement": "short personalized affirmation"
}

No explanations. No markdown. Only JSON.`;

    const apiUrl = 'https://app-9uhj8334a0ap-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will analyze the thoughts with energy-level adaptation, categorize them with next steps, pressure levels, delegation nudges, and reframes, detect mood, calculate clarity indices, generate encouragement, and return only valid JSON.' }]
        },
        {
          role: 'user',
          parts: [{ text: thoughts }]
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
        JSON.stringify({ error: 'Failed to process thoughts. Please try again.' }),
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

    let enhancedData;
    try {
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        enhancedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }

      if (!enhancedData.do_today || !enhancedData.schedule_soon || 
          !enhancedData.delegate || !enhancedData.let_go ||
          !enhancedData.dominant_mood || !enhancedData.encouragement ||
          typeof enhancedData.clarity_index_before !== 'number' ||
          typeof enhancedData.clarity_index_after !== 'number') {
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
      JSON.stringify(enhancedData),
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
