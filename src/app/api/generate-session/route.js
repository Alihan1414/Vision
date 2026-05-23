import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { type, level, reviewWords = [] } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY in .env.local' }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt = '';

    if (type === 'french' || type === 'english') {
      const reviewPrompt = reviewWords.length > 0 
        ? `\nCRITICAL SPACED REPETITION REQUIREMENT: You MUST include the following previously learned words in your new text/story to help the user review them: ${reviewWords.join(', ')}.` 
        : '';

      prompt = `
      You are an expert language teacher.
      Create a dynamic learning session for a student learning ${type} at level ${level} (1 is beginner, higher is more advanced).
      ${reviewPrompt}
      
      You must respond ONLY with a raw JSON object with NO markdown formatting, NO \`\`\`json wrappers, just the raw JSON object.
      
      Format:
      {
        "words": [
          { "word": "foreign word 1", "meaning": "english or turkish meaning" },
          { "word": "foreign word 2", "meaning": "english or turkish meaning" },
          { "word": "foreign word 3", "meaning": "english or turkish meaning" },
          { "word": "foreign word 4", "meaning": "english or turkish meaning" },
          { "word": "foreign word 5", "meaning": "english or turkish meaning" }
        ],
        "text": "A short, coherent paragraph or story using these words (and the review words if provided), written entirely in ${type}.",
        "quiz": {
          "question": "A multiple choice question testing comprehension of the 'text' or meaning of the words. Question should be in English or Turkish.",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0 // index of the correct option (0-3)
        }
      }
      `;
    } else if (type === 'software') {
      // Pick a random topic so AI generates fresh content every time
      const allTopics = {
        1: ['HTML & CSS Basics', 'JavaScript Variables & Functions', 'DOM Manipulation', 'Git & Version Control', 'Basic Algorithms'],
        2: ['React Components & Props', 'useState & useEffect Hooks', 'CSS Flexbox & Grid', 'REST API Basics', 'Array Methods (map, filter, reduce)'],
        3: ['React Context API', 'Asynchronous JS (Promises, async/await)', 'Next.js Routing & Pages', 'Local Storage & State Persistence', 'Error Handling & Try/Catch'],
        4: ['React Performance Optimization', 'TypeScript Basics', 'Database Design Concepts', 'JWT Authentication', 'WebSocket & Real-time Data'],
        5: ['Microservices Architecture', 'Docker & Containerization', 'CI/CD Pipelines', 'System Design Patterns', 'Advanced TypeScript Generics'],
      };
      const topicList = allTopics[Math.min(level, 5)] || allTopics[1];
      const randomTopic = topicList[Math.floor(Math.random() * topicList.length)];
      const timestamp = Date.now(); // Forces unique response every time

      const reviewPrompt = reviewWords.length > 0 
        ? `\nCRITICAL SPACED REPETITION REQUIREMENT: You MUST include or refer to the following previously learned concepts in your explanation to help the user review them: ${reviewWords.join(', ')}.` 
        : '';

      prompt = `
      You are an expert senior software engineer and mentor.
      Create a unique coding concept learning session about the topic: "${randomTopic}" at level ${level} (1 is beginner).
      Session ID (ignore this, it just ensures variety): ${timestamp}
      ${reviewPrompt}
      
      You must respond ONLY with a raw JSON object with NO markdown formatting, NO \`\`\`json wrappers, just the raw JSON object.
      
      Format:
      {
        "words": [
          { "word": "Concept 1 (related to ${randomTopic})", "meaning": "Short, clear explanation in simple language" },
          { "word": "Concept 2 (related to ${randomTopic})", "meaning": "Short, clear explanation in simple language" },
          { "word": "Concept 3 (related to ${randomTopic})", "meaning": "Short, clear explanation in simple language" },
          { "word": "Concept 4 (related to ${randomTopic})", "meaning": "Short, clear explanation in simple language" },
          { "word": "Concept 5 (related to ${randomTopic})", "meaning": "Short, clear explanation in simple language" }
        ],
        "text": "A concrete, real-world explanation or example code scenario demonstrating the topic '${randomTopic}'. Include the review concepts naturally.",
        "quiz": {
          "question": "A specific technical question about '${randomTopic}' testing comprehension of the text above.",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 2
        }
      }
      `;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the AI ignores instructions
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate content' }), { status: 500 });
  }
}
