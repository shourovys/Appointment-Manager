// Netlify Function entry point
// This file is copied to dist/functions/ during build
const { handler } = require('../../main.js');

exports.handler = async (event, context) => {
  return handler(event, context);
};
