// Debug script to test API keys and see what's happening
const testApiKey = async (keyName, apiKey) => {
  try {
    console.log(`🔑 Testing ${keyName}...`);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Respond with a simple JSON object."
          },
          {
            role: "user",
            content: "Say hello in JSON format"
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    console.log(`📊 ${keyName} Response Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log(`❌ ${keyName}: Unauthorized - Invalid API key`);
      return false;
    } else if (response.status === 429) {
      console.log(`❌ ${keyName}: Rate limited - Too many requests`);
      return false;
    } else if (response.status === 200) {
      const data = await response.json();
      console.log(`✅ ${keyName}: Working! Response: ${data.choices[0]?.message?.content?.substring(0, 50)}...`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ ${keyName}: Error ${response.status} - ${errorText.substring(0, 100)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${keyName}: Network error - ${error.message}`);
    return false;
  }
};

async function debugApiKeys() {
  console.log("🔍 Debugging API Key Issues...\n");
  
  // Test with placeholder keys to see the error patterns
  const testKeys = {
    "GROQ_API_KEY": "gsk_test123...",  // Placeholder
    "GROQ_API_KEY_2": "gsk_test456...",  // Placeholder  
    "GROQ_API_KEY_3": "gsk_test789..."   // Placeholder
  };
  
  for (const [keyName, keyValue] of Object.entries(testKeys)) {
    await testApiKey(keyName, keyValue);
    console.log("");
  }
  
  console.log("💡 Analysis:");
  console.log("• 401 Unauthorized = Invalid API key");
  console.log("• 429 Rate Limited = Too many requests");
  console.log("• 200 Success = API key works");
  console.log("• Network errors = Connection issues");
  console.log("\n🔧 Solutions:");
  console.log("1. Check if API keys are valid in Groq dashboard");
  console.log("2. Verify keys are correctly set in Supabase secrets");
  console.log("3. Check if you have sufficient API credits");
  console.log("4. Ensure keys have proper permissions");
}

debugApiKeys();
