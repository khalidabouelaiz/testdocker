const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'ça marche dans Docker 🚀' });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
