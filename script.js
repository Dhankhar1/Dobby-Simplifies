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

// API configuration - using secure serverless function
const USE_SECURE_API = true;
// API key is now safely stored in environment variables on the server!

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
            if (USE_SECURE_API) {
                console.log('Using secure API endpoint...');
                response = await callSecureAPI(type, input);
            } else {
                response = await callFallbackAPI(type, input);
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

    async function callGoogleGeminiAPI(apiKey, type, input) {
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

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Gemini API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error response:', errorText);
            throw new Error(`Gemini API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini API Response data:', data);
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('Invalid Gemini API response format');
        }
        
        return data.candidates[0].content.parts[0].text;
    }

    async function callSecureAPI(type, input) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, input })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || 'API request failed');
        }

        const data = await response.json();
        return data.response;
    }

    async function callFallbackAPI(type, input) {
        // Use intelligent pre-written responses as fallback
        console.log('Using fallback intelligent responses...');
        return getFallbackResponse(type, input);
    }

    function getFallbackResponse(type, input) {
        const topic = input.toLowerCase().trim();
        
        // Smart topic matching with synonyms and variations
        const topicMatcher = {
            gravity: {
                keywords: ['gravity', 'gravitation', 'gravitational', 'fall', 'falling', 'weight', 'pull down', 'attraction'],
                content: {
                    explain: "🌟 Hi! I'm Dobby! Gravity is like an invisible friend that always pulls things down! Imagine if everything could float around like magic - that would be chaos! Gravity keeps your feet on the ground and makes sure your toys don't float to the ceiling! It's like Earth is giving everything a gentle hug, pulling it close! When you drop a ball, gravity catches it and brings it down to the ground! ✨",
                    joke: "Why doesn't gravity ever get tired? Because it never stops working out! 😄 It's always doing pull-ups with everything on Earth! Just like how I never stop helping around the house! 🏠",
                    riddle: "🧩 I'm invisible but I'm always there, I pull things down with the greatest care. Without me, you'd float in the air! What am I? *Answer: Gravity!* It's the force that keeps us all grounded! 🌍"
                }
            },
            space: {
                keywords: ['space', 'universe', 'cosmos', 'stars', 'planets', 'moon', 'sun', 'solar system', 'astronaut', 'rocket', 'galaxy'],
                content: {
                    explain: "🚀 Hello friend! Space is like the biggest, darkest room you can imagine - but instead of walls, it goes on FOREVER! It's where all the stars live, like tiny sparkly lights in the sky! The Moon is our neighbor up there, and the Sun is like a giant light bulb that keeps us warm! Astronauts wear special suits to visit space because there's no air to breathe up there! ✨🌟",
                    joke: "Why didn't the Sun go to school? Because it was already too bright! 😄☀️ And why don't aliens ever land at airports? Because they're looking for space! Just like how I always look for space to store things in the house! 🛸",
                    riddle: "🌌 I'm dark and vast, with stars that shine, planets dance in a cosmic line. Astronauts visit me with rockets so fast, what am I that's infinitely vast? *Answer: Space!* The final frontier where dreams take flight! 🚀"
                }
            },
            water: {
                keywords: ['water', 'h2o', 'liquid', 'ocean', 'sea', 'river', 'rain', 'ice', 'steam', 'vapor', 'drink'],
                content: {
                    explain: "💧 Hi there! Water is super special - it's like a shape-shifter! Sometimes it's liquid like in your cup, sometimes it's solid like ice cubes, and sometimes it's gas like steam from hot soup! We drink it, swim in it, and it makes plants grow big and strong! It's clear and has no taste, but it's the most important thing for all living things! Every creature needs water to live! 🌊",
                    joke: "What did the ocean say to the beach? Nothing, it just waved! 🌊😄 And why do fish live in salt water? Because pepper makes them sneeze! Just like how I have to be careful with spices when I'm cooking! 🐟",
                    riddle: "💧 I can be liquid, solid, or gas, through pipes and rivers I travel fast. I'm clear to see but wet to touch, all living things need me so much! *Answer: Water!* The essence of life itself! 🌊"
                }
            },
            math: {
                keywords: ['math', 'mathematics', 'number', 'numbers', 'count', 'add', 'subtract', 'multiply', 'divide', 'plus', 'minus', 'equation', 'calculation'],
                content: {
                    explain: "🔢 Hello! Math is like a fun puzzle game! It helps us count things, like how many cookies are in the jar, or figure out how to share toys equally with friends! Numbers are like letters, but instead of making words, they help us solve problems and understand the world! Adding is like collecting things, and subtracting is like giving them away! ➕➖",
                    joke: "Why was 6 afraid of 7? Because 7, 8 (ate), 9! 😄 And why did the math book look so sad? Because it had too many problems! Just like how I sometimes have too many chores to do! 📚",
                    riddle: "🧮 I use numbers, symbols, and signs, to help you solve problems and find designs. From counting to adding, I make things clear, what subject am I that students sometimes fear? *Answer: Math!* The language of numbers and logic! ✨"
                }
            },
            animals: {
                keywords: ['animal', 'animals', 'dog', 'cat', 'bird', 'fish', 'elephant', 'lion', 'tiger', 'bear', 'rabbit', 'horse', 'cow', 'pig', 'chicken', 'pet', 'pets', 'zoo'],
                content: {
                    explain: "🐶 Hi friend! Animals are amazing living creatures that share our world! They come in all shapes and sizes - some are big like elephants, some are tiny like ants! Some animals are pets that live with us like dogs and cats, and some are wild and live in forests and jungles! Each animal has special things they're good at - birds can fly, fish can swim, and cheetahs can run super fast! 🦋✨",
                    joke: "What do you call a sleeping bull? A bulldozer! 😄🐂 And what do you call a bear with no teeth? A gummy bear! Just like the gummy treats, but much bigger and fuzzier! 🐻",
                    riddle: "🦁 I come in many shapes and sizes, some have fur and some have feathers. Some live in water, some on land, we share this world together! What are we? *Answer: Animals!* The wonderful creatures that make our world so interesting! 🌍"
                }
            },
            colors: {
                keywords: ['color', 'colors', 'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'rainbow'],
                content: {
                    explain: "🌈 Hello! Colors make our world beautiful and bright! Red is like fire trucks and strawberries, blue is like the sky and ocean, green is like grass and trees! Yellow is sunny like the sun, purple is royal like grapes, and orange is cheerful like... well, oranges! Colors help us recognize things and make everything prettier! 🎨✨",
                    joke: "What's a color's favorite music? The blues! 😄🎵 And why did the crayon go to school? To get more colorful! Just like how I learn new things to become a better helper! ️",
                    riddle: "🌈 I make the world bright and fun to see, from red roses to the deep blue sea. I paint the sunset and morning dew, what am I that comes in every hue? *Answer: Colors!* The magic that makes everything beautiful! 🎨"
                }
            }
        };
        
        // Smart matching function
        function findMatchingTopic(userInput) {
            for (const [topicName, topicData] of Object.entries(topicMatcher)) {
                for (const keyword of topicData.keywords) {
                    if (userInput.includes(keyword)) {
                        return topicData.content;
                    }
                }
            }
            return null;
        }
        
        // Try to find a matching topic
        const matchedContent = findMatchingTopic(topic);
        if (matchedContent) {
            if (type === 'explain' && matchedContent.explain) return matchedContent.explain;
            if (type === 'joke' && matchedContent.joke) return matchedContent.joke;
            if (type === 'riddle' && matchedContent.riddle) return matchedContent.riddle;
            if (type === 'solve' && matchedContent.explain) return `🔧 Let me help! ${matchedContent.explain} Now let's break this down step by step!`;
        }
        
        // Generic but more intelligent responses
        const intelligentResponses = {
            explain: [
                `🌟 Hi! I'm Dobby! Let me think about "${input}"... This is something that works in a special way! Imagine you're building something amazing - every part has to work together perfectly! That's exactly how "${input}" works - it has different pieces that all help each other to create something wonderful! It's like magic, but it follows rules that make sense! ✨`,
                `Hello friend! 🎭 "${input}" is fascinating! Think of it like your favorite story - it has a beginning, middle, and end, and everything connects together! The cool thing about "${input}" is that once you understand how it works, you can use that knowledge to understand other things too! It's like learning a secret code! 🗝️`,
                `Hey there! 🌟 "${input}" is like a puzzle that makes sense when you see all the pieces! Just like how I organize things in the house - everything has its place and purpose! When you understand "${input}", it's like finding the missing piece that makes the whole picture clear! Knowledge is truly magical! 📚✨`
            ],
            joke: [
                `😄 Here's a Dobby special! What makes "${input}" so great? It's always there when you need it most! Just like how socks always disappear when you need them - but "${input}" is the opposite, it appears when you're curious about it! *giggles* I love curious minds! 🧦✨`,
                `🎭 Knock knock! Who's there? Someone who wants to learn about "${input}"! And you know what? That's the best kind of person - curious and ready to discover new things! Just like how I discovered that helping others makes me happy! 😊🌟`,
                `😄 Why is "${input}" like a good friend? Because the more time you spend with it, the better you understand it! And just like friends, "${input}" can surprise you with how interesting it really is! Just like how every sock has its own personality! 🧦💫`
            ],
            riddle: [
                `🧩 Here's a riddle for you! I'm something you can learn about, something you can think about, and something that becomes clearer the more you explore me. I'm related to "${input}" and I grow stronger in your mind the more attention you give me! What am I? *Answer: Understanding!* When you truly understand "${input}", you unlock a new superpower! 🌟`,
                `🎯 Riddle time! I start as a question in your curious mind, I grow when you seek and search to find. I'm all about "${input}" and I shine so bright, when you discover me, everything feels right! What am I? *Answer: Knowledge!* The most magical treasure of all! ✨📚`,
                `🌟 Here's a special riddle! I can't be touched but I can be shared, I can't be seen but I can be declared. I'm all about "${input}" and I make you wise, I live in your mind and help your thoughts rise! What am I? *Answer: Learning!* The adventure that never ends! 🚀`
            ],
            solve: [
                `🔧 Let's solve this together! First, let's break "${input}" down into smaller, easier pieces - like sorting toys into different boxes! Step 1: What do we already know? Step 2: What do we want to find out? Step 3: How can we connect what we know to what we want to learn? It's like being a detective, but for knowledge! 🕵️✨`,
                `💡 Problem-solving time! "${input}" might seem big and complicated, but every expert was once a beginner! Let's start simple: What's the most important thing about "${input}"? Then we'll build on that, like stacking blocks to make a tower! Each new thing we learn makes us stronger! 🏗️🌟`,
                `🌟 Here's how we tackle "${input}"! First, we stay curious and patient - just like how I learned to be a good helper! Then we ask good questions: What? How? Why? When? Where? Every question is like a key that opens a door to understanding! You're braver than you think and smarter than you know! 🗝️✨`
            ]
        };

        const typeResponses = intelligentResponses[type] || intelligentResponses.explain;
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
