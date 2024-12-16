import express from 'express';
import openai from '../config/openaiConfig.js';
import Joi from 'joi';

const router = express.Router();
const ASSISTANT_ID = process.env.ASSISTANT_ID;

const messageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(1000).required(), // Validates the message input
});

router.post('/', async (req, res) => {
  try {
    const { error } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Invalid input: ' + error.details[0].message });
    }

    const { message } = req.body;
    let threadId = req.headers['x-thread-id'] || null;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;

      res.write(`data: ${JSON.stringify({ info: { id: threadId } })}\n\n`);
      res.flush?.();
    }

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
      additional_messages: [{ role: 'user', content: message }],
      stream: true,
    });

    let accumulated = ""; // Buffer for the full message
    const sanitizeChunk = (chunk) => chunk.replace(/【\d+:\d+†[^\s】]+】/g, '');

    for await (const event of run) {
      if (event.event === 'thread.message.delta') {
        if (event.data?.delta?.content?.[0]?.type === 'text') {
          let chunk = sanitizeChunk(event.data?.delta?.content[0].text.value);
          if (chunk) {
            accumulated += chunk;
          }
        }
      }
    }
    
    accumulated = accumulated.replace(/\s+/g, ' ').trim();

    // Send the complete message at once
    if (accumulated) {
      res.write(`data: ${JSON.stringify({ content: accumulated })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
});

export default router;
