import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import validateEnv from './middleware/validateEnv.js';
import chatRoutes from './routes/chatRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import rateLimit from 'express-rate-limit';

dotenv.config();
validateEnv();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Allow resources from the same origin
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts if necessary
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
        imgSrc: ["'self'", "data:"], // Allow images from the same origin or data URIs
        connectSrc: ["'self'", "https://api.openai.com"], // Allow API connections to OpenAI
        fontSrc: ["'self'", "https:"], // Allow fonts from the same origin or over HTTPS
        objectSrc: ["'none'"], // Disallow embedding objects
        frameAncestors: ["'none'"], // Prevent clickjacking by disallowing framing
      },
    },
    crossOriginEmbedderPolicy: true, // Secure embedded resources
    crossOriginOpenerPolicy: { policy: "same-origin" }, // Protect against side-channel attacks
    crossOriginResourcePolicy: { policy: "same-origin" }, // Restrict resource sharing
    dnsPrefetchControl: { allow: false }, // Prevent DNS prefetching
    expectCt: { enforce: true, maxAge: 30 }, // Enforce Certificate Transparency
    frameguard: { action: 'deny' }, // Disallow iframing
    hidePoweredBy: true, // Remove X-Powered-By header
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Enforce HTTPS
    ieNoOpen: true, // Prevent opening of untrusted HTML files in IE
    noSniff: true, // Prevent MIME type sniffing
    permittedCrossDomainPolicies: { policy: "none" }, // Block Adobe Flash/PDF vulnerabilities
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Modern referrer policy
    xssFilter: true, // Add XSS filter header
  })
);

app.use('/chat', limiter);

app.use('/chat', chatRoutes);
app.use('/feedback', feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
