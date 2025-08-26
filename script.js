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

// API configuration - using free AI service
const USE_FREE_API = true;
const FIREWORKS_API_KEY = 'fw_3ZZeC2fqE3rBp4eGGp8QfrWi'; // Keep as backup

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
            let response;
            if (USE_FREE_API || error) {
                response = await callFallbackAPI(type, input);
            } else {
                console.log('Attempting Fireworks API call with key:', FIREWORKS_API_KEY.substring(0, 10) + '...');
                response = await callFireworksAPI(FIREWORKS_API_KEY, type, input);
            }
            displayResponse(response);
            showSpeechBubble("There you go! I hope that helps! 🎉");
        } catch (error) {
            console.error('Detailed error:', error);
            console.error('Error message:', error.message);
            // Try fallback if main API fails
            try {
                console.log('Trying fallback API...');
                const fallbackResponse = await callFallbackAPI(type, input);
                displayResponse(fallbackResponse);
                showSpeechBubble("There you go! I hope that helps! 🎉");
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                showError('Sorry! Both our AI services are having trouble right now. Please try again later! 😅');
            }
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

        console.log('API Response status:', response.status);
        console.log('API Response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error response:', errorText);
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }
        
        return data.choices[0].message.content;
    }

    async function callFallbackAPI(type, input) {
        // Use Hugging Face free API as fallback
        const typePrompts = {
            explain: `Hi! I'm Dobby! Let me explain "${input}" in a super simple way that even a 5-year-old can understand! 🌟`,
            joke: `Hey there! I'm Dobby and I have a funny joke about "${input}" for you! 😄`,
            riddle: `Hello! I'm Dobby! Here's a fun riddle about "${input}" just for you! 🧩`,
            solve: `Hi! I'm Dobby! Let me help you solve this problem: "${input}" step by step! 💡`
        };

        const prompt = typePrompts[type] || typePrompts.explain;
        
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt + ' ' + input,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Fallback API failed');
            }

            const data = await response.json();
            if (data && data[0] && data[0].generated_text) {
                return data[0].generated_text;
            } else {
                // If Hugging Face also fails, use pre-written responses
                return getFallbackResponse(type, input);
            }
        } catch (error) {
            console.log('Hugging Face API failed, using pre-written responses');
            return getFallbackResponse(type, input);
        }
    }

    function getFallbackResponse(type, input) {
        const responses = {
            explain: [
                `Hi! I'm Dobby! 🏠✨ "${input}" is a really interesting topic! Think of it like... when you're playing with your favorite toy! It's something that makes things work in a special way. Just like how magic makes things happen in my world, "${input}" has its own special way of working! 🌟`,
                `Hello there! 🎭 Let me tell you about "${input}"! Imagine it's like building with blocks - each part has a special job to do! It's like when I help around the house - everything has its place and purpose! "${input}" works in a similar way, making things happen step by step! ✨`,
                `Hey friend! 🌟 "${input}" is like a magical recipe! Just like when we make cookies, we need different ingredients that work together. "${input}" has different parts that team up to create something amazing! It's like teamwork, but with ideas instead of people! 🍪✨`
            ],
            joke: [
                `Why did the ${input} go to school? Because it wanted to be really smart! 📚😄 Just like how I learned to be a good house-elf, everything needs to learn and grow! *giggles* 🏠`,
                `What did one ${input} say to another ${input}? "You're looking great today!" 😊✨ Even I tell the socks they're doing a good job when I fold them! Everything deserves kindness! 🧦`,
                `Knock knock! Who's there? ${input}! ${input} who? ${input} is here to make you smile! 😄🌟 Just like how I love making everyone happy at home! ✨`
            ],
            riddle: [
                `🧩 Here's a fun riddle about "${input}" for you! I'm thinking of something that's related to "${input}" and it's really important! It helps people every day and makes life better! Can you guess what it is? *The answer is: It's the wonderful thing that brings joy and learning - just like "${input}" does!* 🌟`,
                `🎭 Riddle time! What has to do with "${input}" and is always helping people? It's something that makes the world a better place, just like how I try to help everyone! *Answer: It's knowledge and understanding about "${input}"!* ✨`,
                `🌟 Here's a special riddle! I'm related to "${input}" and I love to learn new things every day! I'm always curious and asking questions! Who am I? *Answer: I'm YOU - someone who's curious about "${input}"!* 🎉`
            ],
            solve: [
                `🔧 Let me help you solve this step by step! First, let's understand what "${input}" means - it's like organizing your toys! Step 1: Look at all the parts. Step 2: Figure out how they connect. Step 3: Put them together carefully! Just like how I organize the house - one room at a time! 🏠✨`,
                `💡 Problem-solving time! For "${input}", let's think like detectives! 🕵️ Step 1: What do we know? Step 2: What do we need to find out? Step 3: How can we connect the dots? It's like when I figure out the best way to clean - I plan first, then act! 🧹`,
                `🌟 Let's solve this together! "${input}" might seem tricky, but every big problem is just lots of small problems holding hands! Let's break it down: First, we understand the question. Then, we think of what we know. Finally, we put our knowledge to work! You've got this! 💪✨`
            ]
        };

        const typeResponses = responses[type] || responses.explain;
        const randomIndex = Math.floor(Math.random() * typeResponses.length);
        return typeResponses[randomIndex];
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
