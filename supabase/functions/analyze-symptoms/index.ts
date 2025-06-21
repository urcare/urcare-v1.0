
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Symptom {
  id: string;
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  bodyPart: string;
  duration: string;
  description?: string;
  location: { x: number; y: number };
}

interface AnalysisRequest {
  symptoms: Symptom[];
  patientAge?: number;
  patientGender?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, patientAge, patientGender }: AnalysisRequest = await req.json();

    if (!symptoms || symptoms.length === 0) {
      return new Response(JSON.stringify({ error: 'No symptoms provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a detailed symptom summary for the AI
    const symptomSummary = symptoms.map(s => 
      `${s.name} (${s.bodyPart}, severity: ${s.severity}/5, duration: ${s.duration}${s.description ? `, notes: ${s.description}` : ''})`
    ).join('; ');

    const patientInfo = patientAge || patientGender ? 
      `Patient info: ${patientAge ? `Age ${patientAge}` : ''}${patientAge && patientGender ? ', ' : ''}${patientGender || ''}. ` : '';

    const systemPrompt = `You are a medical AI assistant that helps analyze symptoms. You provide educational information and general health guidance, but you are NOT a replacement for professional medical care.

IMPORTANT DISCLAIMERS:
- Always emphasize that this is for educational purposes only
- Recommend consulting healthcare professionals for proper diagnosis
- Never provide specific diagnoses or treatment recommendations
- Always suggest emergency care for severe symptoms

Your response should be structured and helpful, including:
1. Summary of reported symptoms
2. Possible common conditions (educational only)
3. General health recommendations
4. When to seek medical care
5. Self-care suggestions (if appropriate)

Be empathetic, clear, and always prioritize patient safety.`;

    const userPrompt = `${patientInfo}Symptoms reported: ${symptomSummary}

Please provide an educational analysis of these symptoms, including possible common conditions that might present with these symptoms, general recommendations, and guidance on when to seek professional medical care.`;

    console.log('Analyzing symptoms with OpenAI:', { symptomSummary, patientInfo });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Calculate urgency score based on symptoms
    const maxSeverity = Math.max(...symptoms.map(s => s.severity));
    const hasMultipleSymptoms = symptoms.length > 1;
    const hasChestPain = symptoms.some(s => s.name.toLowerCase().includes('chest') || s.name.toLowerCase().includes('pain'));
    const hasBreathingIssues = symptoms.some(s => s.name.toLowerCase().includes('breath') || s.name.toLowerCase().includes('shortness'));
    
    let urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency' = 'low';
    
    if (hasChestPain || hasBreathingIssues || maxSeverity >= 5) {
      urgencyLevel = 'emergency';
    } else if (maxSeverity >= 4 || hasMultipleSymptoms) {
      urgencyLevel = 'high';
    } else if (maxSeverity >= 3) {
      urgencyLevel = 'moderate';
    }

    const result = {
      analysis,
      urgencyLevel,
      recommendedActions: getRecommendedActions(urgencyLevel),
      disclaimer: "This analysis is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment."
    };

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze symptoms',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getRecommendedActions(urgencyLevel: string): string[] {
  switch (urgencyLevel) {
    case 'emergency':
      return [
        'Seek immediate emergency medical care',
        'Call 911 or go to the nearest emergency room',
        'Do not delay medical attention'
      ];
    case 'high':
      return [
        'Schedule an appointment with your doctor within 24-48 hours',
        'Monitor symptoms closely',
        'Seek immediate care if symptoms worsen'
      ];
    case 'moderate':
      return [
        'Consider scheduling a doctor\'s appointment within a week',
        'Monitor symptoms and track any changes',
        'Practice self-care measures if appropriate'
      ];
    default:
      return [
        'Monitor symptoms over the next few days',
        'Consider lifestyle modifications that might help',
        'Schedule a routine check-up if symptoms persist'
      ];
  }
}
