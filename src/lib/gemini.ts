import { GoogleGenAI, Modality } from "@google/genai";

export const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

const CACHE_PREFIX = "gemma4_speech_cache_";

export async function synthesizeSpeech(text: string): Promise<string | undefined> {
  // Chave de cache mais robusta e determinística
  const cacheKey = CACHE_PREFIX + btoa(unescape(encodeURIComponent(text.trim()))).substring(0, 64);
  
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    console.log("Using persistent cached audio for:", text.substring(0, 30) + "...");
    return cached;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Falling back to browser TTS or silence.");
    return undefined;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Diga de forma clara e profissional em português brasileiro: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (audioData) {
      try {
        localStorage.setItem(cacheKey, audioData);
      } catch (e) {
        console.warn("Storage quota exceeded, could not cache audio.");
      }
    }

    return audioData;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return undefined;
  }
}

export async function playPCM(base64: string): Promise<void> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 24000,
  });

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert Uint8Array buffer to Int16Array (16-bit PCM)
  const int16Data = new Int16Array(bytes.buffer);
  const float32Data = new Float32Array(int16Data.length);

  for (let i = 0; i < int16Data.length; i++) {
    float32Data[i] = int16Data[i] / 32768.0;
  }

  const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
  audioBuffer.getChannelData(0).set(float32Data);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  
  return new Promise((resolve) => {
    source.onended = () => {
      audioContext.close();
      resolve();
    };
    source.start();
  });
}
