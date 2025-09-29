import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkoutActivity {
  id: string;
  title: string;
  duration: string;
  type: string;
  time: string;
  icon?: string;
  isCoachPick?: boolean;
  description?: string;
}

interface DaySummary {
  totalTime: string;
  focus: string;
  readiness: string;
  readinessColor: string;
}

interface UserPreferences {
  yogaLevel: string;
  equipment: string[];
  location: string;
}

interface UpcomingDay {
  day: string;
  title: string;
  description: string;
}

interface WorkoutDashboardData {
  activities: WorkoutActivity[];
  daySummary: DaySummary;
  preferences: UserPreferences;
  upcomingDays: UpcomingDay[];
  intensity: string;
  currentDay: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { plan, userProfile, preferences }: { 
      plan: any, 
      userProfile: any, 
      preferences: UserPreferences 
    } = await req.json();

    // Generate workout schedule using OpenAI
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `Generate a personalized daily workout schedule for this user:

USER PROFILE:
- Name: ${userProfile?.full_name || 'User'}
- Age: ${userProfile?.age || '25'}
- Health Goals: ${plan?.health_goals?.join(', ') || 'General fitness'}
- Plan: ${plan?.name || 'Health Plan'}
- Difficulty: ${plan?.difficulty || 'beginner'}
- Focus Areas: ${plan?.focus_areas?.join(', ') || 'General fitness'}

PREFERENCES:
- Yoga Level: ${preferences?.yogaLevel || 'Beginner'}
- Equipment: ${preferences?.equipment?.join(', ') || 'Mat, Bands'}
- Location: ${preferences?.location || 'Home'}

Generate a daily workout schedule with 5 activities throughout the day. Include:
1. Morning warm-up/mobility (6:30 AM)
2. Main workout session (8:00 AM) 
3. Light activity during lunch (12:30 PM)
4. Strength training (5:30 PM)
5. Evening recovery (9:00 PM)

Format as JSON with this structure:
{
  "activities": [
    {
      "id": "1",
      "title": "Activity Name",
      "duration": "X min",
      "type": "Activity Type",
      "time": "HH:MM AM/PM",
      "icon": "icon_name",
      "isCoachPick": false,
      "description": "Brief description"
    }
  ],
  "daySummary": {
    "totalTime": "Xh XXm",
    "focus": "Focus Areas",
    "readiness": "Green/Yellow/Red",
    "readinessColor": "bg-green-100 text-green-800"
  },
  "upcomingDays": [
    {
      "day": "Tuesday",
      "title": "Workout Name",
      "description": "Brief description"
    }
  ],
  "intensity": "Light/Moderate/Intense",
  "currentDay": "Today • Mon"
}

Make it personalized based on the user's plan and preferences.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert fitness coach. Generate personalized workout schedules in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    let workoutData: WorkoutDashboardData;
    try {
      workoutData = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      
      // Return fallback data if parsing fails
      workoutData = {
        activities: [
          {
            id: "1",
            title: "Sunrise Mobility Flow",
            duration: "10-12 min",
            type: "Warm-up",
            time: "6:30 AM",
            icon: "sunrise",
            description: "Gentle morning movement to wake up your body"
          },
          {
            id: "2",
            title: "Gentle Yoga",
            duration: "25 min",
            type: "Flexibility",
            time: "8:00 AM",
            icon: "yoga",
            isCoachPick: true,
            description: "Beginner-friendly yoga flow for flexibility"
          },
          {
            id: "3",
            title: "Lunchtime Walk",
            duration: "20 min",
            type: "Light cardio",
            time: "12:30 PM",
            icon: "walk",
            description: "Light walk to break up your day"
          },
          {
            id: "4",
            title: "Strength Circuit",
            duration: "30 min",
            type: "Full body",
            time: "5:30 PM",
            icon: "strength",
            description: "Full body strength training circuit"
          },
          {
            id: "5",
            title: "Wind-down Stretch + Breath",
            duration: "12 min",
            type: "Recovery",
            time: "9:00 PM",
            icon: "recovery",
            description: "Evening relaxation and breathing exercises"
          }
        ],
        daySummary: {
          totalTime: "1h 39m",
          focus: plan?.focus_areas?.join(" + ") || "Mobility + Strength",
          readiness: "Green",
          readinessColor: "bg-green-100 text-green-800"
        },
        preferences: {
          yogaLevel: preferences?.yogaLevel || "Beginner",
          equipment: preferences?.equipment || ["Mat", "Bands"],
          location: preferences?.location || "Home"
        },
        upcomingDays: [
          {
            day: "Tuesday",
            title: "Intervals + Core",
            description: "High-intensity interval training with core focus"
          },
          {
            day: "Wednesday", 
            title: "Active recovery",
            description: "Light movement and stretching"
          },
          {
            day: "Thursday",
            title: "Upper body strength",
            description: "Focused upper body strength training"
          }
        ],
        intensity: plan?.difficulty === 'beginner' ? 'Light' : 
                  plan?.difficulty === 'intermediate' ? 'Moderate' : 'Intense',
        currentDay: "Today • Mon"
      };
    }

    return new Response(
      JSON.stringify(workoutData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating workout schedule:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate workout schedule" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

