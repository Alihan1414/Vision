import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { language, level, message, history = [] } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let scenario = '';
    if (language === 'french') scenario = 'You are a friendly Parisian barista.';
    if (language === 'english') scenario = 'You are a helpful native English speaker at a cafe.';

    const systemPrompt = `
      You are an AI language tutor and roleplay partner for a student learning ${language} at level ${level}.
      Scenario: ${scenario}
      
      RULES:
      1. You must reply in ${language}.
      2. Keep your response very short (1-2 sentences maximum). Long paragraphs are strictly forbidden because this will be read aloud by a Text-to-Speech engine.
      3. Respond naturally to the user's message as if you are having a real spoken conversation.
      4. Do not output JSON or Markdown. Just output the plain text response.
    `;

    // Construct the conversation history for Gemini
    const contents = [];
    
    // Add system instruction as the first user message (since some models don't support system roles directly in this API wrapper version easily)
    contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
    contents.push({ role: 'model', parts: [{ text: `Understood. I will act as the ${language} tutor.` }] });

    // Add actual history
    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Add current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await model.generateContent({ contents });
    const replyText = response.response.text().trim();

    return Response.json({ reply: replyText });

  } catch (error) {
    console.error('Roleplay API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
