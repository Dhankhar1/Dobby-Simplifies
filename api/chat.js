// Vercel serverless function to handle AI requests securely
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, input } = req.body;

        // Validate input
        if (!input || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get API key from environment variable
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        
        if (!GOOGLE_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const typePrompts = {
            explain: `Explain "${input}" in a very simple way that a 5-year-old would understand. Use fun examples, simple words, and make it exciting!`,
            joke: `Tell a clean, funny joke about "${input}" that kids would love!`,
            riddle: `Create a fun riddle about "${input}" that's appropriate for children, and then give the answer!`,
            solve: `Help solve this problem: "${input}". Explain the solution step by step in a way a 5-year-old could follow!`
        };

        const prompt = `You are Dobby, a friendly and enthusiastic helper who explains things in a very simple, fun way that 5-year-olds can understand. Always be positive, use emojis, and make learning fun! ${typePrompts[type] || typePrompts.explain}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            return res.status(500).json({ error: 'AI service temporarily unavailable' });
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            return res.status(500).json({ error: 'Invalid AI response format' });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Return the AI response
        res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
