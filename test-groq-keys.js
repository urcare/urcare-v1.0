// Test Groq API keys directly
const testGroqKey = async (keyName, apiKey) => {
  try {
    console.log(`🧪 Testing ${keyName}...`);
    
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
            content: "You are a helpful assistant. Respond with a simple JSON object containing a 'message' field."
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

    if (!response.ok) {
      console.log(`❌ ${keyName} failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ ${keyName} working! Response:`, data.choices[0]?.message?.content?.substring(0, 100));
    return true;
  } catch (error) {
    console.log(`❌ ${keyName} error:`, error.message);
    return false;
  }
};

async function testAllKeys() {
  console.log("🔑 Testing all Groq API keys...\n");
  
  // Test with placeholder keys (these will fail but show the structure)
  const keys = {
    "GROQ_API_KEY": "test_key_1",
    "GROQ_API_KEY_2": "test_key_2", 
    "GROQ_API_KEY_3": "test_key_3"
  };
  
  for (const [keyName, keyValue] of Object.entries(keys)) {
    await testGroqKey(keyName, keyValue);
    console.log("");
  }
  
  console.log("💡 Note: These are placeholder keys. The actual keys in Supabase should work.");
  console.log("💡 If you see 401 errors, it means the API key format is correct but the key is invalid.");
  console.log("💡 If you see other errors, there might be a network or configuration issue.");
}

testAllKeys();
