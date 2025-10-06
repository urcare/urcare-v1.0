// Test script to verify new Groq API keys work
const testGroqKey = async (keyName, apiKey) => {
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

async function testNewKeys() {
  console.log("🧪 Testing New Groq API Keys...\n");
  
  // Replace these with your actual new API keys
  const newKeys = {
    "GROQ_API_KEY": "gsk_YOUR_NEW_KEY_1_HERE",
    "GROQ_API_KEY_2": "gsk_YOUR_NEW_KEY_2_HERE", 
    "GROQ_API_KEY_3": "gsk_YOUR_NEW_KEY_3_HERE"
  };
  
  console.log("⚠️  IMPORTANT: Replace the placeholder keys above with your actual new API keys!");
  console.log("📝 Instructions:");
  console.log("1. Get new keys from https://console.groq.com/");
  console.log("2. Replace the placeholder values in this script");
  console.log("3. Run: node test-new-api-keys.js");
  console.log("4. Update Supabase secrets with working keys");
  console.log("5. Test the functions again\n");
  
  let workingKeys = 0;
  
  for (const [keyName, keyValue] of Object.entries(newKeys)) {
    if (keyValue.includes("YOUR_NEW_KEY")) {
      console.log(`⏭️  Skipping ${keyName} - placeholder key`);
      continue;
    }
    
    const isWorking = await testGroqKey(keyName, keyValue);
    if (isWorking) workingKeys++;
    console.log("");
  }
  
  console.log(`🎯 Summary: ${workingKeys}/3 keys working`);
  
  if (workingKeys === 3) {
    console.log("✅ All keys working! Update Supabase secrets and test functions.");
  } else {
    console.log("❌ Some keys not working. Check the keys and try again.");
  }
}

testNewKeys();
