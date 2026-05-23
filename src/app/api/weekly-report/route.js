import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500 });
    }

    const userData = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `
      Sen çok bilgili, ufuk açan bir yapay zeka gelişim koçusun (VisionOS platformu için). 
      Kullanıcının son haftalık verilerine bakarak ona özel analizler sunacaksın.
      Kullanıcı verileri:
      ${JSON.stringify(userData, null, 2)}

      Bana aşağıdaki JSON formatında bir rapor döndür:
      1. strength: Kullanıcının bu hafta en güçlü olduğu, harika ilerlediği alan (spor sıklığı, namaz istikrarı, kitap okuma adanmışlığı, dil öğrenme vb.) ve motive edici bilgece bir açıklama.
      2. warning: Kullanıcının dikkat etmesi veya iyileştirmesi gereken bir alan (su tüketiminin azlığı, uyku düzensizliği, bütçeyi aşması vb.) ve yapıcı, nazik bir uyarı.
      3. suggestion: Gelecek hafta için uygulanabilir, vizyon katan net bir öneri.

      Yanıtı YALNIZCA RAW JSON olarak döndür. Markdown, \`\`\`json vs kullanma.
      Format:
      {
        "strength": "En güçlü olduğun alan metni...",
        "warning": "Dikkat etmen gereken alan uyarısı metni...",
        "suggestion": "Gelecek hafta için öneri metni..."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Weekly Report AI Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
