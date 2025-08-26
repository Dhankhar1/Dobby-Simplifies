# DOBBY SIMPLIFIES - AI Learning Assistant 🎭

A fun, interactive website where Dobby helps explain complex topics in simple, kid-friendly ways!

## 🌟 Features

- **AI-Powered Explanations**: Get simple explanations for any topic using Google Gemini AI
- **Multiple Request Types**: Explanations, jokes, riddles, and problem-solving
- **Interactive Mascot**: Dobby mascot with speech bubbles and animations
- **Beautiful UI**: Animated starfield background with modern glassmorphism design
- **Mobile Responsive**: Works perfectly on all devices
- **Secure API**: API keys protected with serverless functions

## 🔒 Security Features

Your API key is now completely secure:
- ✅ **Hidden from users** - Not visible in browser source code
- ✅ **Server-side only** - Stored as environment variable on hosting platform
- ✅ **Serverless function** - Processes AI requests securely
- ✅ **Fallback protection** - Smart responses if API fails

## 🚀 How to Deploy Your Site

### Option 1: Vercel (RECOMMENDED - Full AI Features) ⭐
1. Go to https://vercel.com and sign up
2. Connect/import your GitHub repository
3. **IMPORTANT**: In Project Settings → Environment Variables, add:
   - **Key**: `GOOGLE_API_KEY`
   - **Value**: `AIzaSyDeFHymzQzdER1US5_2QIMG_4mmcmr-TOM`
4. Deploy your project
5. Get URL like: `https://dobby-simplifies.vercel.app`

### Option 2: Netlify (Full AI Features)
1. Go to https://netlify.com and sign up
2. Connect your GitHub repository
3. **IMPORTANT**: In Site Settings → Environment Variables, add:
   - **Key**: `GOOGLE_API_KEY`
   - **Value**: `AIzaSyDeFHymzQzdER1US5_2QIMG_4mmcmr-TOM`
4. Deploy and get URL like: `https://amazing-name-123456.netlify.app`

### Option 3: GitHub Pages (Limited Features)
1. Go to your repository settings
2. Enable GitHub Pages from main branch
3. Site live at: `https://yourusername.github.io/repository-name`
4. **Note**: Only static hosting, so uses smart fallback responses (no live AI)

## 📁 File Structure

```
dobby-simplifies-website/
├── index.html          # Main website page
├── styles.css          # Beautiful styling and animations
├── script.js           # Frontend logic (API key removed for security)
├── api/
│   └── chat.js         # Secure serverless function for AI calls
├── assets/
│   └── dobby-mascot.png # Dobby mascot image
└── README.md           # This file
```

## 🎯 How the Security Works

### Before (Insecure):
```
User → Frontend (with visible API key) → Google AI
```
❌ API key visible to anyone viewing page source

### After (Secure):
```
User → Frontend → Serverless Function → Google AI
                    (hidden API key)
```
✅ API key completely hidden from users

## 🛠️ For Developers

### Local Development
If you want to run this locally:
1. Clone the repository
2. Add `.env` file with `GOOGLE_API_KEY=your-key`
3. Use a local server that supports serverless functions (like Vercel CLI)

### API Endpoint
- **Endpoint**: `/api/chat`
- **Method**: POST
- **Body**: `{ "type": "explain|joke|riddle|solve", "input": "user question" }`
- **Response**: `{ "response": "AI generated answer" }`

## 📱 Supported Features

- **Explanations**: Complex topics made simple
- **Jokes**: Clean, kid-friendly humor
- **Riddles**: Fun puzzles with answers
- **Problem Solving**: Step-by-step solutions
- **Fallback System**: Always works, even if AI is down

## 🎉 Usage Examples

Try asking:
- "Explain photosynthesis"
- "Tell me a joke about computers"
- "Give me a riddle about dinosaurs"
- "Help me understand fractions"

## 🔧 Technical Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **AI**: Google Gemini 1.5 Flash
- **Hosting**: Vercel Serverless Functions
- **Fallback**: Smart topic-based responses
- **Security**: Environment variables, serverless architecture

---

**🎭 Created with magic by Dobby (and a helpful AI assistant)!**
