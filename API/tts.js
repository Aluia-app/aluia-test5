// api/tts.js - OpenAI TTS
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  let body = {};
  if (req.body) {
    if (typeof req.body === 'string') {
      try { body = JSON.parse(req.body); } 
      catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }
    } else {
      body = req.body;
    }
  }

  const { text, voiceId } = body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text required' });
  }
  if (text.length > 4096) {
    return res.status(400).json({ error: 'Text too long (max 4096)' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API key non configurata' });
  }

  const selectedVoice = voiceId || process.env.OPENAI_REALTIME_VOICE || 'nova';
  const cleanText = text
    .replace(/[🔥💙✅❌⚠️🆘🎤💬🔒👋❤️🌍🚨🛡️🏥💚🤝📞]/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .trim() || 'Messaggio vuoto';

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: cleanText,
        voice: selectedVoice,
        response_format: 'mp3',
        speed: 1.0
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text().catch(() => '');
      console.error(`OpenAI TTS error ${openaiResponse.status}:`, errorText);
      
      if (openaiResponse.status === 401) {
        return res.status(500).json({ error: 'API key non valida' });
      } else if (openaiResponse.status === 429) {
        return res.status(500).json({ error: 'Limite rate raggiunto' });
      }
      return res.status(500).json({ error: 'Errore TTS', details: errorText });
    }

    const audioBuffer = await openaiResponse.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength.toString());
    return res.status(200).send(Buffer.from(audioBuffer));
    
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: 'Errore interno TTS', details: error.message });
  }
};
