// Create animated stars background
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

// API configuration
const FIREWORKS_API_KEY = 'fw_3ZZeC2fqE3rBp4eGGp8QfrWi';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    
    const submitBtn = document.getElementById('submitBtn');
    const requestType = document.getElementById('requestType');
    const userInput = document.getElementById('userInput');
    const responseSection = document.getElementById('responseSection');
    const responseContent = document.getElementById('responseContent');
    const errorMessage = document.getElementById('errorMessage');
    const mascotContainer = document.getElementById('mascotContainer');
    const speechBubble = document.getElementById('speechBubble');

    // Show mascot after page load
    setTimeout(() => {
        mascotContainer.classList.add('show');
        showSpeechBubble("Hi there! I'm Dobby! Ask me anything and I'll make it super simple to understand! 🌟");
    }, 1000);

    submitBtn.addEventListener('click', handleSubmit);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    });

    async function handleSubmit() {
        const type = requestType.value;
        const input = userInput.value.trim();

        // Hide previous errors
        errorMessage.style.display = 'none';

        // Validation
        if (!input) {
            showError('Please tell me what you\'d like to know!');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = '🤔 Dobby is thinking...';
        responseSection.style.display = 'block';
        responseContent.innerHTML = '<div class="loading">Dobby is working on your answer...</div>';

        try {
            const response = await callFireworksAPI(FIREWORKS_API_KEY, type, input);
            displayResponse(response);
            showSpeechBubble("There you go! I hope that helps! 🎉");
        } catch (error) {
            console.error('Error:', error);
            showError('Oops! Something went wrong. Dobby is having trouble right now!');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✨ Ask Dobby!';
        }
    }

    async function callFireworksAPI(apiKey, type, input) {
        const typePrompts = {
            explain: `Explain "${input}" in a very simple way that a 5-year-old would understand. Use fun examples, simple words, and make it exciting!`,
            joke: `Tell a clean, funny joke about "${input}" that kids would love!`,
            riddle: `Create a fun riddle about "${input}" that's appropriate for children, and then give the answer!`,
            solve: `Help solve this problem: "${input}". Explain the solution step by step in a way a 5-year-old could follow!`
        };

        const prompt = typePrompts[type] || typePrompts.explain;

        const requestBody = {
            model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
            max_tokens: 500,
            temperature: 0.7,
            messages: [{
                role: "system",
                content: "You are Dobby, a friendly and enthusiastic helper who explains things in a very simple, fun way that 5-year-olds can understand. Always be positive, use emojis, and make learning fun!"
            }, {
                role: "user",
                content: prompt
            }]
        };

        const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    function displayResponse(response) {
        responseContent.innerHTML = `<div style="line-height: 1.6; font-size: 1.1rem;">${response.replace(/\n/g, '<br>')}</div>`;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function showSpeechBubble(text) {
        speechBubble.textContent = text;
        speechBubble.classList.add('show');
        
        setTimeout(() => {
            speechBubble.classList.remove('show');
        }, 4000);
    }

    // Add click interaction for mascot
    document.getElementById('mascotImage').addEventListener('click', function() {
        const encouragements = [
            "You're doing great! Keep asking questions! 🌟",
            "I love curious minds like yours! 🧠",
            "Learning is fun when we do it together! 🎉",
            "Every question makes you smarter! 💡",
            "Keep exploring and discovering! 🔍"
        ];
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        showSpeechBubble(randomEncouragement);
    });
});
