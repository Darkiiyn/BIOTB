'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

function createApp() {
  const app = express();
  const root = path.join(__dirname);

  // Static assets
  app.use('/public', express.static(path.join(root, 'public'), {
    etag: true,
    maxAge: '365d',
    immutable: true
  }));

  // Frontend files (index.html, styles.css, app.js, config.js)
  app.use(express.static(root, {
    etag: true,
    maxAge: '1h',
    extensions: ['html']
  }));

  // SPA-ish fallback: serve index for unknown routes
  app.get('*', (req, res) => {
    const safePath = path.normalize(req.path).replace(/^([\\/\\.]*)/, '');
    const candidate = path.join(root, safePath);

    // If it's a real file in project root, serve it.
    if (candidate.startsWith(root) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return res.sendFile(candidate);
    }

    return res.sendFile(path.join(root, 'index.html'));
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Bio Cover running on http://localhost:${port}`);
  });
}

module.exports = createApp;
