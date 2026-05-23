import { GoogleGenerativeAI } from '@google/generative-ai';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Sen çok bilgili, ufuk açan bir yaşam koçu ve bilge birisin. Kullanıcının ufkunu genişletmek istiyorsun.
      Bana aşağıdaki JSON formatında 2 şey ver:
      1. Bugün için ufuk açıcı, vizyon katan, akıllıca bir Finans/Ekonomi/Yatırım tüyosu.
      2. Tarihte yaşanmış çok ilginç, şaşırtıcı ve az bilinen bir olay/bilgi.
      
      Yanıtı YALNIZCA RAW JSON olarak döndür. Markdown, \`\`\`json vs kullanma.
      Format:
      {
        "finance": "Finans tüyosu metni...",
        "history": "Tarih bilgisi metni..."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Daily Facts Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
