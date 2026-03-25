const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rewriteText = async (initialText) => {
  if (!initialText || initialText.trim() === '') {
    throw new Error('Please enter some text to rewrite');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional task manager assistant. Rewrite the following task description to be clear, professional, and actionable. Fix any grammar and spelling errors. Do not add any extra conversational text outside of the rewritten task description itself.',
      },
      {
        role: 'user',
        content: initialText,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return response.choices[0].message.content.trim();
};

module.exports = { rewriteText };
