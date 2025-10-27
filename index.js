const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use Vercel's PORT env var if available

// Middleware to parse JSON (if needed for APIs)
app.use(express.json());

// Root route example
app.get('/', (req, res) => {
  res.send('Welcome to MoneyGod.ONE Ecosystem! Explore our projects at https://github.com/MoneyGodONE/MGO');
});

// Add more routes as needed, e.g., for serving static files from /frontend
// app.use(express.static('frontend'));

// Error handling (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
