import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("🔑 Testing Claude API keys...");
    
    // Get Claude API keys
    const claudeKeys = [
      Deno.env.get("claude_api_key"),
      Deno.env.get("claude_api_key_2"),
      Deno.env.get("claude_api_key_3")
    ].filter(Boolean);
    
    console.log(`🔑 Found ${claudeKeys.length} Claude API keys`);
    
    if (claudeKeys.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "No Claude API keys found"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Test each key with a simple request
    const results = [];
    
    for (let i = 0; i < claudeKeys.length; i++) {
      const key = claudeKeys[i];
      console.log(`🔑 Testing key ${i + 1}: ${key.substring(0, 10)}...`);
      
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": key,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 50,
            messages: [
              {
                role: "user",
                content: "Say 'API working' if you can read this."
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            key: `key-${i + 1}`,
            status: "SUCCESS",
            response: data.content?.[0]?.text || "No content"
          });
          console.log(`✅ Key ${i + 1} works!`);
        } else {
          const errorText = await response.text();
          results.push({
            key: `key-${i + 1}`,
            status: "FAILED",
            error: `Status ${response.status}: ${errorText}`
          });
          console.log(`❌ Key ${i + 1} failed: ${response.status}`);
        }
      } catch (error) {
        results.push({
          key: `key-${i + 1}`,
          status: "ERROR",
          error: error.message
        });
        console.log(`❌ Key ${i + 1} error: ${error.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      results: results,
      totalKeys: claudeKeys.length,
      workingKeys: results.filter(r => r.status === "SUCCESS").length
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('❌ Test error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
