import axios from 'axios';

export async function generatePlan(messages) {
  const provider = process.env.LLM_PROVIDER || 'GROQ'; // 'GROQ' or 'GROK'
  
  if (provider === 'GROQ') {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-8b-instant', // Updated model name
      messages
    }, { 
      headers: { 
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    return res.data;
  } else if (provider === 'GROK') {
    // xAI/grok: use provided endpoint/SDK; many docs state compatibility with OpenAI SDKs.
    const res = await axios.post(process.env.GROK_API_URL || 'https://x.ai/api/v1/chat/completions', {
      model: 'grok-4', 
      messages
    }, { 
      headers: { 
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    return res.data;
  } else {
    throw new Error('Unknown LLM_PROVIDER');
  }
}

// Polling function for async operations
export async function pollPlanStatus(jobId, maxAttempts = 30, interval = 2000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`/api/plan-status/${jobId}`);
      const result = await response.json();
      
      if (result.status === 'completed') {
        return result;
      } else if (result.status === 'failed') {
        throw new Error(result.error || 'Plan generation failed');
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  throw new Error('Plan generation timeout');
}
