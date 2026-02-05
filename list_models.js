require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the genAI root usually in older SDKs, 
    // but in newer ones it might be different.
    // Actually, the error message suggests calling ListModels.
    // The SDK might not expose it directly on the genAI instance easily.
    
    console.log("Checking API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    
    // Let's try to just generate a simple test with 'gemini-1.5-flash'
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log("Response:", result.response.text());
  } catch (e) {
    console.error("Error Detail:", e);
  }
}

run();
