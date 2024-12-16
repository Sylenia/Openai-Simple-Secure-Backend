const validateEnv = () => {
    const requiredEnvVars = ['OPENAI_API_KEY', 'ASSISTANT_ID', 'CLIENT_URL'];
    requiredEnvVars.forEach((key) => {
      if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
      }
    });
  };
  
  export default validateEnv;
  