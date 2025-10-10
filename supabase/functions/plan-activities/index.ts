import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Detailed prompt for comprehensive timetable generation
function createDetailedPrompt(userProfile: any, selectedPlan: any, primaryGoal: string): string {
  const wakeTime = userProfile.wake_up_time || '07:00';
  const workStart = userProfile.work_start || '09:00';
  const workEnd = userProfile.work_end || '17:00';
  const sleepTime = userProfile.sleep_time || '23:00';
  const dietType = userProfile.diet_type || 'Balanced';
  const chronicConditions = userProfile.chronic_conditions?.join(', ') || 'None';
  
  return "Create detailed daily timetable for: " + userProfile.full_name + ", Age: " + userProfile.age + ", Goal: " + primaryGoal + "\n" +
"Schedule: Wake " + wakeTime + ", Work " + workStart + "-" + workEnd + ", Sleep " + sleepTime + "\n" +
"Diet: " + dietType + ", Conditions: " + chronicConditions + "\n\n" +
"Return ONLY valid JSON in this exact format:\n" +
"{\n" +
"  \"schedule\": [\n" +
"    {\n" +
"      \"time\": \"07:00\",\n" +
"      \"activity\": \"Morning routine\",\n" +
"      \"duration\": \"30min\",\n" +
"      \"category\": \"morning\",\n" +
"      \"food\": \"Oatmeal 50g + Banana 1 medium + Almonds 10g\",\n" +
"      \"instructions\": [\"Step 1: Boil water\", \"Step 2: Add oats\", \"Step 3: Cook 5 minutes\"],\n" +
"      \"exercise\": \"10 pushups, 15 squats\",\n" +
"      \"health_tip\": \"Start slow to avoid stress\"\n" +
"    }\n" +
"  ]\n" +
"}\n\n" +
"CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no extra text. Ensure all JSON syntax is correct with proper commas and brackets.\n\n" +
"Requirements:\n" +
"- Specific foods with quantities (grams/cups) - include exact vegetable names\n" +
"- Step-by-step instructions for each activity\n" +
"- Exercise details with reps/sets\n" +
"- Meal prep instructions with specific vegetables\n" +
"- Health tips for each activity\n\n" +
"IMPORTANT: For vegetarian meals, specify exact vegetables like \"Palak 50g + Aloo 30g + Gobi 40g + Carrot 30g\" instead of just \"Sabzi\"";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { selectedPlan, userProfile, primaryGoal } = await req.json();

    if (!userProfile) {
      return new Response(JSON.stringify({
        error: "Missing required field: userProfile is required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("📅 Generating detailed timetable for user:", userProfile?.id);

    const goal = primaryGoal || 'General wellness';
    const detailedPrompt = createDetailedPrompt(userProfile, selectedPlan, goal);

    // Get Claude API keys
    const claudeKeys = [
      Deno.env.get("claude_api_key"),
      Deno.env.get("claude_api_key_2"),
      Deno.env.get("claude_api_key_3")
    ].filter(Boolean);

    if (claudeKeys.length === 0) {
      throw new Error("No Claude API keys available");
    }

    let response;
    let lastError = null;

    // Try Claude API keys
    for (let i = 0; i < claudeKeys.length; i++) {
      try {
        console.log("🔑 Trying Claude API key " + (i + 1) + "/" + claudeKeys.length + "...");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
          
          response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": claudeKeys[i],
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 4000,
              messages: [
                {
                  role: "user",
                  content: detailedPrompt
                }
              ]
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log("✅ Claude API key " + (i + 1) + " worked! Status: " + response.status);
          break;
        } else {
          console.log("❌ Claude API key " + (i + 1) + " failed: " + response.status);
          lastError = "Status " + response.status;
        }
      } catch (error) {
        console.log("❌ Claude API key " + (i + 1) + " error: " + error.message);
        lastError = error.message;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error("All Claude API keys failed. Last error: " + lastError);
    }

    const data = await response.json();
    console.log("📊 API response received");

    // Extract JSON from response
    let scheduleData;
    let content = "";
    try {
      content = data.content?.[0]?.text || "";
      console.log("📄 Claude response content preview:", content.substring(0, 300) + "...");
      
      // Clean markdown if present
      let cleanContent = content;
      if (content.includes('```')) {
        const match = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (match) {
          cleanContent = match[1];
          console.log("📄 Extracted JSON from markdown");
        }
      }
      
      // Try to find JSON object in the content
      if (!cleanContent.trim().startsWith('{')) {
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanContent = jsonMatch[0];
          console.log("📄 Extracted JSON from text");
        }
      }
      
      // Try to fix common JSON issues
      cleanContent = cleanContent
        .replace(/,\s*}/g, '}')  // Remove trailing commas before }
        .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
        .replace(/([^\\])\n/g, '$1 ')  // Replace newlines with spaces (except escaped ones)
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .replace(/\\"/g, '"')  // Fix escaped quotes
        .replace(/\n/g, ' ')  // Replace any remaining newlines
        .replace(/\r/g, ' ')  // Replace carriage returns
        .replace(/\t/g, ' ')  // Replace tabs
        .replace(/\s+/g, ' ')  // Normalize whitespace again
        .replace(/([^\\])\n/g, '$1 ')  // Replace newlines with spaces again
        .replace(/\n/g, ' ')  // Replace any remaining newlines
        .replace(/\r/g, ' ')  // Replace carriage returns
        .replace(/\t/g, ' ')  // Replace tabs
        .replace(/\s+/g, ' ')  // Normalize whitespace again
        .replace(/,\s*}/g, '}')  // Remove trailing commas before } again
        .replace(/,\s*]/g, ']')  // Remove trailing commas before ] again
        .trim();
      
      console.log("📄 Cleaned content preview:", cleanContent.substring(0, 200) + "...");
      
      try {
        scheduleData = JSON.parse(cleanContent);
      } catch (jsonError) {
        console.log("⚠️ Primary JSON parse failed:", jsonError.message);
        console.log("📄 Content around position 384:", cleanContent.substring(380, 390));
        console.log("📄 Full content length:", cleanContent.length);
        console.log("📄 Content preview:", cleanContent.substring(0, 500));
        
        // Try to extract just the schedule array
        const scheduleMatch = cleanContent.match(/"schedule"\s*:\s*\[([\s\S]*?)\]/);
        if (scheduleMatch) {
          let scheduleArray = '[' + scheduleMatch[1] + ']';
          
          // Try to fix truncated JSON by adding missing closing brackets
          if (!scheduleArray.endsWith(']')) {
            // Count opening and closing brackets to see what's missing
            const openBrackets = (scheduleArray.match(/\[/g) || []).length;
            const closeBrackets = (scheduleArray.match(/\]/g) || []).length;
            const openBraces = (scheduleArray.match(/\{/g) || []).length;
            const closeBraces = (scheduleArray.match(/\}/g) || []).length;
            
            console.log("📊 Bracket analysis - Open: [", openBrackets, "] Close: [", closeBrackets, "] Braces: {", openBraces, "} Close: {", closeBraces, "}");
            
            // Add missing closing brackets
            for (let i = 0; i < (openBraces - closeBraces); i++) {
              scheduleArray += '}';
            }
            for (let i = 0; i < (openBrackets - closeBrackets); i++) {
              scheduleArray += ']';
            }
            
            console.log("📄 Fixed truncated JSON:", scheduleArray.substring(scheduleArray.length - 50));
          }
          
          try {
            const activities = JSON.parse(scheduleArray);
            scheduleData = { schedule: activities };
            console.log("✅ Fallback extraction successful");
          } catch (fallbackError) {
            console.log("⚠️ Fallback extraction also failed:", fallbackError.message);
            console.log("📄 Schedule array content:", scheduleArray.substring(0, 200));
            throw jsonError;
          }
        } else {
          throw jsonError;
        }
      }
      
      // Validate the structure
      if (!scheduleData.schedule || !Array.isArray(scheduleData.schedule)) {
        throw new Error("Invalid schedule structure in response");
      }
      
      console.log(`✅ Successfully parsed ${scheduleData.schedule.length} activities`);
      
    } catch (parseError) {
      console.log("⚠️ JSON parse failed:", parseError);
      console.log("📄 Raw content that failed to parse:", content.substring(0, 500));
      throw new Error(`Failed to parse schedule from Claude response: ${parseError.message}`);
    }

    console.log("✅ Detailed timetable generated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        data: scheduleData,
        meta: {
          provider: "Claude-API",
          timestamp: new Date().toISOString(),
          model: "claude-sonnet-4-20250514"
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Plan Activities error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      meta: {
        provider: "Claude-API",
        timestamp: new Date().toISOString(),
        note: "Plan activities generation failed - no fallback data provided"
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});