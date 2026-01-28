// Netlify Function entry point
// This file is copied to dist/functions/ during build
import main from '../main.js';

if (!main.handler) {
  console.error('Handler not found in main.js');
  throw new Error('Handler not exported from main.js');
}

export const handler = async (event, context) => {
  return main.handler(event, context);
};
