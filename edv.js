// edv.js
(function (global) {
  const EDV = {};
  
  async function safeFetch(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) {
      let txt = '';
      try { txt = await res.text(); } catch {}
      const err = new Error(`HTTP ${res.status} su ${url}: ${txt}`);
      err.status = res.status;
      throw err;
    }
    return res;
  }

  EDV.chat = async (messagesOrBody) => {
    const body = Array.isArray(messagesOrBody)
      ? { messages: messagesOrBody }
      : (messagesOrBody || {});
      
    const res = await safeFetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await res.json().catch(() => ({}));
    const content = data?.content ?? data?.message ?? data?.reply ??
      (Array.isArray(data?.choices) ? data.choices?.[0]?.message?.content : undefined);
      
    return { raw: data, content };
  };

  EDV.tts = async ({ text, voiceId }) => {
    const res = await safeFetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId })
    });
    return await res.blob();
  };

  global.EDV = EDV;
  console.log('✅ edv.js caricato');
})(window);
