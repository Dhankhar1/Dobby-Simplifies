# Dobby Simplifies 🧙‍♂️✨

A friendly AI-powered learning assistant that explains complex topics in simple, fun ways that kids can understand!

## 🌟 Features

- **AI-Powered Explanations**: Uses Google Gemini AI to provide clear, kid-friendly explanations
- **Multiple Response Types**: Explanations, jokes, riddles, and step-by-step problem solving
- **Smart Fallback System**: Intelligent pre-written responses ensure the site always works
- **Secure API Implementation**: API keys are safely stored as environment variables
- **Beautiful UI**: Animated stars background with friendly Dobby mascot
- **Mobile Responsive**: Works perfectly on all devices

## 🔐 Security Features

- ✅ API key stored securely in environment variables
- ✅ Serverless function prevents client-side key exposure  
- ✅ Comprehensive error handling and fallback responses
- ✅ Input validation and sanitization

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. **Fork this repository** on GitHub
2. **Sign up for Vercel** at [vercel.com](https://vercel.com)
3. **Connect your GitHub repository** to Vercel
4. **Set environment variables** in your Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `GOOGLE_AI_API_KEY` = `your_actual_api_key_here`
5. **Deploy!** Vercel will automatically build and deploy your site

### Option 2: Deploy to Netlify

1. **Fork this repository** on GitHub
2. **Sign up for Netlify** at [netlify.com](https://netlify.com)
3. **Connect your GitHub repository** to Netlify
4. **Set environment variables** in your Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add: `GOOGLE_AI_API_KEY` = `your_actual_api_key_here`
5. **Deploy!** Netlify will automatically build and deploy your site

## 🔑 Getting Your Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (keep it secret!)
5. Add it to your hosting platform's environment variables

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dobby-simplifies.git
   cd dobby-simplifies
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your API key
   ```

3. **Start a local server** (choose one):
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Node.js (with http-server)
   npx http-server -p 3000
   
   # PHP
   php -S localhost:3000
   ```

4. **Open in browser**: http://localhost:3000

## 📁 Project Structure

```
dobby-simplifies-website/
├── index.html          # Main HTML file
├── style.css          # Styling and animations  
├── script.js          # Frontend JavaScript
├── api/
│   └── chat.js        # Secure serverless function
├── assets/
│   └── dobby.png      # Dobby mascot image
├── .env.example       # Environment variables template
└── README.md          # This file
```

## 🔧 How It Works

1. **User Input**: Kids ask questions through the friendly interface
2. **Secure Processing**: Frontend calls the serverless function (`/api/chat`)
3. **AI Response**: Serverless function securely calls Google Gemini API
4. **Smart Fallback**: If API fails, intelligent pre-written responses are used
5. **Kid-Friendly Output**: All responses are optimized for 5-year-olds

## 🛡️ Security Best Practices

- **Never commit API keys** to your repository
- **Use environment variables** for all sensitive configuration
- **Implement proper error handling** to prevent information leakage
- **Validate all inputs** on both client and server side
- **Use HTTPS** in production (automatic with Vercel/Netlify)

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-color: #4A90E2;    /* Blue */
    --secondary-color: #7B68EE;  /* Purple */
    --accent-color: #FFD700;     /* Gold */
}
```

### Adding New Topics
Add new topics to the fallback responses in `script.js` and `api/chat.js`:
```javascript
const topicMatcher = {
    yourTopic: {
        keywords: ['keyword1', 'keyword2'],
        content: {
            explain: "Your explanation...",
            joke: "Your joke...",
            riddle: "Your riddle..."
        }
    }
};
```

## 🔄 Updating Your Site

1. **Make changes** to your local files
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push
   ```
3. **Automatic deployment** - Vercel/Netlify will automatically deploy your changes!

## 🐛 Troubleshooting

### Site Not Working After Deployment?
1. **Check environment variables** - make sure `GOOGLE_AI_API_KEY` is set correctly
2. **Check API key validity** - ensure your Google AI API key is working
3. **Check browser console** for error messages
4. **Test fallback responses** - they should work even without API key

### API Key Issues?
1. **Verify the API key** at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Check quotas and billing** in your Google Cloud Console
3. **Ensure proper permissions** are set for the Gemini API

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables are set correctly  
3. Test with different browsers/devices
4. Check that your API key has proper permissions

## 📜 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Google Gemini AI** for intelligent responses
- **Dobby character** inspired by the beloved house-elf
- **Created with ❤️** for kids who love to learn!

---

Made with ✨ magic and 💻 code to make learning fun for everyone!
