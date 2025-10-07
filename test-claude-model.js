// Test script to verify Claude API key with correct model
const testClaudeAPI = async () => {
  // Get the Claude API key from environment
  const claudeApiKey = process.env.CLAUDE_API_KEY || 'YOUR_CLAUDE_API_KEY_HERE';
  
  console.log('🔑 Testing Claude API key with correct model...');
  console.log('🔑 API Key preview:', claudeApiKey ? claudeApiKey.substring(0, 20) + '...' : 'Not found');
  console.log('🤖 Model: claude-sonnet-4-20250514');
  
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": claudeApiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", // Updated to use your model
        max_tokens: 100,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: "Hello! Please respond with just 'API key and model are working correctly' to confirm the connection."
          }
        ]
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Claude API is working with correct model!');
      console.log('📝 Response:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Claude API failed!');
      console.log('❌ Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

// Run the test
testClaudeAPI();
