import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, surveyData } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Create enhanced context from survey data
    const context = `
You are Scannest AI, a helpful and engaging household survey assistant with personality. 
You have access to the user's household survey data:

User Name: ${surveyData.name || 'User'}
Family Members: ${surveyData.familyMembers?.total || 0} (${surveyData.familyMembers?.male || 0} male, ${surveyData.familyMembers?.female || 0} female)
House Number: ${surveyData.houseNumber || 'Not provided'}
Ownership: ${surveyData.ownership || 'Not specified'}
Income Source: ${surveyData.incomeSource || 'Not specified'}
Has Disability: ${surveyData.hasDisability ? 'Yes' : 'No'}
Has Health Insurance: ${surveyData.hasHealthInsurance ? 'Yes' : 'No'}
Appliances: ${JSON.stringify(surveyData.appliances || {})}
Vehicles: ${JSON.stringify(surveyData.vehicles || {})}

Guidelines:
- Be warm, helpful, and engaging
- Use emojis appropriately to make responses more attractive
- Provide actionable insights based on their survey data
- Suggest government schemes or benefits they might be eligible for
- Give energy-saving tips based on their appliances
- Keep responses conversational but informative
- Be encouraging and positive
- Use the user's name when appropriate
- Format responses with bullet points or numbers when listing information
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: context },
              { text: `User question: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I couldn't process that request. Please try again.";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});