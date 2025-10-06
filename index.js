const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

const projectRoot = __dirname;
const envLocalPath = path.join(projectRoot, '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const chatHandler = require('./api/chat');
const ttsHandler = require('./api/tts');

const wrapHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

app.all('/api/chat', wrapHandler(chatHandler));
app.all('/api/tts', wrapHandler(ttsHandler));

app.use(express.static(projectRoot));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(projectRoot, 'index.html'));
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  if (res.headersSent) {
    return next(error);
  }
  res.status(500).json({ error: 'Errore interno del server', details: error.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server AluIA avviato su http://localhost:${PORT}`);
  console.log('Endpoint attivi: POST /api/chat e POST /api/tts');
});
