import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Sample availability data
const availableSlots = [
  { id: '1', datetime: new Date(Date.now() + 86400000).toISOString(), available: true },
  { id: '2', datetime: new Date(Date.now() + 172800000).toISOString(), available: true },
  { id: '3', datetime: new Date(Date.now() + 259200000).toISOString(), available: true },
  { id: '4', datetime: new Date(Date.now() + 345600000).toISOString(), available: true },
];

app.get('/api/availability', (req, res) => {
  res.json(availableSlots);
});

app.post('/api/book', (req, res) => {
  const { slotId, name, email, message } = req.body;
  
  console.log('Booking received:', { slotId, name, email, message });
  
  // Mark slot as unavailable
  const slot = availableSlots.find(s => s.id === slotId);
  if (slot) {
    slot.available = false;
  }
  
  res.json({ success: true, message: 'Meeting booked successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
