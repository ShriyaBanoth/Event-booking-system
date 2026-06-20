const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];

// Fails fast with a clear message if required configuration is missing,
// rather than letting the app boot into a broken state (e.g. JWT signing
// with `undefined` as the secret, or mongoose hanging trying to connect
// to an unset URI).
const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variable(s): ${missing.join(", ")}.\n` +
        `Copy backend/.env.example to backend/.env and fill in the values.`
    );
    process.exit(1);
  }
};

export default validateEnv;
