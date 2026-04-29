import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

// Check if all required ImageKit configs are present
const hasImageKitConfig = publicKey && privateKey && urlEndpoint;

let imagekit;

if (hasImageKitConfig) {
  imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
} else {
  // Create a stub that throws helpful errors only when used
  const missing = [];
  if (!publicKey) missing.push('IMAGEKIT_PUBLIC_KEY');
  if (!privateKey) missing.push('IMAGEKIT_PRIVATE_KEY');
  if (!urlEndpoint) missing.push('IMAGEKIT_URL_ENDPOINT');

  // Export a stub that throws when methods are called
  imagekit = {
    upload: async () => {
      throw new Error('ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env.local');
    },
    uploadStream: async () => {
      throw new Error('ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env.local');
    },
    // Add other methods as needed
  };
}

export default imagekit;