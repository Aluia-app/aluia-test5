// edv.js
(function (global) {
  const EDV = {};
  
  function sanitizeBase(base) {
    if (!base || typeof base !== 'string') return '';
    return base.replace(/\/$/, '');
  }

  function buildCandidateUrls(url) {
    if (/^https?:/i.test(url)) return [url];

    const bases = [''];
    const configuredBase = sanitizeBase(global.__ALUIA_API_BASE);
    const fallbackBase = sanitizeBase(global.__ALUIA_FALLBACK_API_BASE);

    if (configuredBase && !bases.includes(configuredBase)) bases.push(configuredBase);
    if (fallbackBase && !bases.includes(fallbackBase)) bases.push(fallbackBase);

    return bases.map(base => base ? `${base}${url}` : url);
  }

  async function safeFetch(url, options = {}) {
    const targets = buildCandidateUrls(url);
    let lastError = null;

    for (const target of targets) {
      try {
        const res = await fetch(target, options);
        if (!res.ok) {
          let txt = '';
          try { txt = await res.text(); } catch {}
          const err = new Error(`HTTP ${res.status} su ${target}: ${txt}`);
          err.status = res.status;
          throw err;
        }
        return res;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Richiesta fallita');
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
