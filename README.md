# OpenAI Chatbot Backend

## Overview

This project is the backend API for an OpenAI-powered assistant chatbot. It serves as the bridge between the frontend and OpenAI's GPT model, handling user messages, streaming AI responses, and managing feedback submissions. The backend is built with **Node.js** and **Express.js**, ensuring robust security and scalability through middleware like **Helmet**, **rate limiting**, and **CORS**.

## Features

- **Chat API**:
  - Streams responses from OpenAI's GPT models to simulate real-time communication.
  - Validates user input to prevent invalid requests.
  - Supports thread-based message persistence with unique thread IDs.

- **Feedback API**:
  - Allows users to submit feedback on the chatbot's performance.
  - Logs and acknowledges feedback for further analysis.

- **Security Enhancements**:
  - Implements **Helmet** for comprehensive HTTP header protection.
  - Includes **rate limiting** to prevent abuse and ensure availability.
  - Enforces strict **CORS** policies to restrict API access.

- **Environment Validation**:
  - Ensures critical environment variables are set before the server starts.

## Folder Structure

```plaintext
├── config/
│   └── openaiConfig.js        # OpenAI API configuration
├── middleware/
│   └── validateEnv.js         # Validates required environment variables
├── routes/
│   ├── chatRoutes.js          # Handles chat interactions with OpenAI
│   ├── feedbackRoutes.js      # Manages feedback submissions
├── server.js                  # Main server entry point
├── package.json               # Project metadata and dependencies
├── .env                       # Environment variables (not tracked in Git)
└── README.md                  # Documentation
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- OpenAI API Key
- Environment variables:
  - `OPENAI_API_KEY`: API key for OpenAI.
  - `ASSISTANT_ID`: Assistant ID for OpenAI API.
  - `CLIENT_URL`: Frontend client URL.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following content:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   ASSISTANT_ID=your_assistant_id
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the Server**:
   - For production:
     ```bash
     npm start
     ```
   - For development (with hot-reloading):
     ```bash
     npm run dev
     ```

5. **Test the API**:
   - Chat Endpoint: `POST /chat`
   - Feedback Endpoint: `POST /feedback`

## API Endpoints

### 1. **Chat API**
- **Endpoint**: `/chat`
- **Method**: `POST`
- **Description**: Handles user messages and streams AI responses.
- **Headers**:
  - `x-thread-id` (optional): Unique thread ID for continued conversations.
- **Request Body**:
  ```json
  {
    "message": "Your question or input here"
  }
  ```
- **Response**:
  - Streamed AI response in JSON format:
    ```json
    {
      "content": "AI response here"
    }
    ```

### 2. **Feedback API**
- **Endpoint**: `/feedback`
- **Method**: `POST`
- **Description**: Logs user feedback.
- **Request Body**:
  ```json
  {
    "feedback": "Your feedback here"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Feedback received"
  }
  ```

## Security Features

- **Helmet**: Secures HTTP headers to protect against common vulnerabilities.
- **Rate Limiting**: Limits requests to 100 per 15 minutes per IP.
- **CORS**: Restricts API access to the specified frontend URL.

## Dependencies

### Production:
- **express**: Web framework for building the API.
- **dotenv**: Manages environment variables.
- **cors**: Enables cross-origin requests.
- **helmet**: Provides security headers.
- **joi**: Validates API inputs.
- **openai**: Client library for interacting with OpenAI API.
- **express-rate-limit**: Protects against excessive requests.

### Development:
- **nodemon**: Automatically restarts the server on file changes.

## Example Request-Response Flow

### Chat Interaction
1. **Frontend** sends a `POST /chat` request with a user message.
2. Backend:
   - Validates the message.
   - Communicates with OpenAI's API.
   - Streams the AI's response back to the frontend.
3. **Frontend** displays the AI's response in real-time.

---

## Contribution

Feel free to fork and submit pull requests for improvements. Ensure your code adheres to the existing code style and includes tests where applicable.

---

## License

This project is licensed under the MIT License.
