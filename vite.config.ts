import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Helper: use .env file value first, fallback to system env (for Vercel)
  const getEnv = (key: string) => env[key] || process.env[key] || '';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY_1': JSON.stringify(getEnv('VITE_GEMINI_API_KEY_1')),
      'import.meta.env.VITE_GEMINI_API_KEY_2': JSON.stringify(getEnv('VITE_GEMINI_API_KEY_2')),
      'import.meta.env.VITE_GEMINI_API_KEY_3': JSON.stringify(getEnv('VITE_GEMINI_API_KEY_3')),
      'import.meta.env.VITE_GEMINI_API_KEY_4': JSON.stringify(getEnv('VITE_GEMINI_API_KEY_4')),
      'import.meta.env.VITE_GEMINI_API_KEY_5': JSON.stringify(getEnv('VITE_GEMINI_API_KEY_5')),

      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(getEnv('VITE_FIREBASE_API_KEY')),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(getEnv('VITE_FIREBASE_AUTH_DOMAIN')),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(getEnv('VITE_FIREBASE_PROJECT_ID')),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(getEnv('VITE_FIREBASE_STORAGE_BUCKET')),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID')),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(getEnv('VITE_FIREBASE_APP_ID')),

      'import.meta.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify(getEnv('VITE_CLOUDINARY_CLOUD_NAME')),
      'import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET': JSON.stringify(getEnv('VITE_CLOUDINARY_UPLOAD_PRESET')),
      'import.meta.env.VITE_HUGGINGFACE_API_KEY': JSON.stringify(getEnv('VITE_HUGGINGFACE_API_KEY')),
      'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(getEnv('VITE_GROQ_API_KEY'))
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
