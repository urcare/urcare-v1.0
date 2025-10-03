// PhonePe Proxy API endpoint - forwards requests to PhonePe server
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const phonepeServerUrl = process.env.VITE_PHONEPE_API_URL || 'https://phonepe-server-25jew6ja6-urcares-projects.vercel.app';
    
    console.log('🔄 Proxying PhonePe request to:', `${phonepeServerUrl}/api/phonepe/create`);
    
    // Forward the request to the PhonePe server
    const response = await fetch(`${phonepeServerUrl}/api/phonepe/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`PhonePe server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ PhonePe server response:', data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ PhonePe proxy error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to create payment order',
      details: error.message 
    });
  }
}



