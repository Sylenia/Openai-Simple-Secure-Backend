import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  console.log('Feedback:', req.body);
  res.status(200).json({ message: 'Feedback received' });
});

export default router;
