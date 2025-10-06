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
  const assistantId = typeof body.assistantId === 'string' ? body.assistantId.trim() : '';
  const bodyPromptId = typeof body.promptId === 'string' ? body.promptId.trim() : '';
  const DEFAULT_PROMPT_ID = 'pmpt_68b5876fea1081908e6b472c85d6489a042e34dea2f3df83';
  const effectivePromptId = assistantId ? '' : (bodyPromptId || DEFAULT_PROMPT_ID);

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

  const recentMessages = messages.slice(-10).filter(m => m && typeof m.content === 'string');

  const responseMessages = recentMessages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: [{ type: 'text', text: m.content }]
  }));

  const useResponsesApi = Boolean(
    (assistantId && assistantId.startsWith('asst_'))
    || (effectivePromptId && effectivePromptId.startsWith('pmpt_'))
  );

  const chatPayload = {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 400,
    messages: [{ role: 'system', content: sys }, ...recentMessages]
  };

  const responsesPayload = {
    input: responseMessages.length ? responseMessages : undefined,
    temperature: 0.7,
    max_output_tokens: 600
  };

  if (assistantId) responsesPayload.assistant_id = assistantId;
  if (!assistantId && effectivePromptId) responsesPayload.prompt_id = effectivePromptId;
  if (!responsesPayload.input) delete responsesPayload.input;

  try {
    const url = useResponsesApi ? 'https://api.openai.com/v1/responses' : 'https://api.openai.com/v1/chat/completions';
    const bodyPayload = useResponsesApi ? responsesPayload : chatPayload;

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!r.ok) {
      const errorText = await r.text().catch(() => '');
      console.error(`OpenAI error ${r.status}:`, errorText);
      
      if (r.status === 401) return res.status(500).json({ error: 'API key non valida' });
      if (r.status === 429) return res.status(500).json({ error: 'Limite rate raggiunto' });
      return res.status(500).json({ error: 'Errore AI' });
    }

    const data = await r.json();

    let content;
    if (useResponsesApi) {
      content = data?.output_text
        || data?.output?.[0]?.content?.[0]?.text?.value
        || data?.response?.output_text
        || data?.choices?.[0]?.message?.content;
    } else {
      content = data?.choices?.[0]?.message?.content;
    }

    content = (typeof content === 'string' && content.trim())
      ? content.trim()
      : 'Non ho potuto elaborare la richiesta.';

    return res.status(200).json({ content, usage: data.usage });
    
  } catch (e) {
    console.error('Chat error:', e);
    return res.status(500).json({ error: 'Errore interno', details: e.message });
  }
};
