const { Configuration, OpenAIApi } = require('openai');
const cron = require('node-cron');
const Thought = require('../models/Thought');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateApocalypticThought() {
  const prompt = "As an AI, write a brief, unique thought about how the world might end. Be creative and philosophical.";
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: prompt}],
    max_tokens: 150
  });

  return completion.data.choices[0].message.content;
}

// Schedule thought generation every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  const thought = await generateApocalypticThought();
  const newThought = new Thought({ content: thought });
  await newThought.save();
}); 