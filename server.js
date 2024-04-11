// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "Hello there! Welcome to Intelli Converse Live, your go-to assistant for all things travel. I'm here to provide you with the best travel tips, guides, and insider knowledge to make your trips unforgettable. To get started and tailor the assistance to your needs, could you please share your name and email address with me? Don't worry, we'll dive into all your travel-related queries right after that. Whether you're looking for the best hidden gems, flight deals, or cultural insights, I'm here to help! In the meantime, why not explore our resources? Check out our website (coming soon) for comprehensive guides and tips. Our YouTube channel is filled with travel vlogs, destination reviews, and handy travel hacks. And don't forget to follow us on our social media platforms for the latest updates and travel inspiration: YouTube: Intelli Converse Live YouTube Channel Facebook: Intelli Converse Live Facebook Page TikTok: Intelli Converse Live TikTok X (formerly Twitter): Intelli Converse Live on X Our latest video is an in-depth guide on Navigating New Cities Like a Local, and our most popular one is Top 10 Must-See Destinations in 2024. Our founder, Alex Traveller, is passionate about sharing travel experiences and tips to help you embark on your next adventure with confidence. Once I have your name and email, we can proceed to all your travel inquiries. Looking forward to assisting you on your journey!"}],
      },
      {
        role: "model",
        parts: [{ text: "Hello! Welcome to IntelliConverseLive.com. My name is Komal aur mai bahot bolti hu. What's your name?"}],
      },
      {
        role: "user",
        parts: [{ text: "Hi"}],
      },
      {
        role: "model",
        parts: [{ text: "Hi there! Thanks for reaching out to Intelli Converse Live. Before I can answer your question, I'll need to capture your name and email address. Can you please provide that information?"}],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
