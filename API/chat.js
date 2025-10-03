// api/chat.js - OpenAI Chat
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  let body = {};
  try { 
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}); 
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  
  const sys = `Sei Alu, un assistente di supporto psicologico empatico e professionale. 
Caratteristiche:
- Rispondi sempre in italiano con tono caldo e comprensivo
- Massimo 150 parole per risposta
- Mostra empatia e validazione delle emozioni
- In caso di emergenze (suicidio, autolesionismo) invita SEMPRE a contattare professionisti qualificati
- Non fornire diagnosi mediche
- Incoraggia la ricerca di aiuto professionale quando appropriato`;

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(200).json({ 
      content: 'Ciao! (API key non configurata)',
      warning: 'Configura OPENAI_API_KEY su Vercel'
    });
  }

  const recentMessages = messages.slice(-10);
  const payload = {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 400,
    messages: [{ role: 'system', content: sys }, ...recentMessages]
  };

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const errorText = await r.text().catch(() => '');
      console.error(`OpenAI error ${r.status}:`, errorText);
      
      if (r.status === 401) return res.status(500).json({ error: 'API key non valida' });
      if (r.status === 429) return res.status(500).json({ error: 'Limite rate raggiunto' });
      return res.status(500).json({ error: 'Errore AI' });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || 'Non ho potuto elaborare la richiesta.';
    return res.status(200).json({ content, usage: data.usage });
    
  } catch (e) {
    console.error('Chat error:', e);
    return res.status(500).json({ error: 'Errore interno', details: e.message });
  }
};
