import serverless from 'serverless-http';
import app from '../index';

// Export a serverless-compatible handler for Vercel/other platforms
export default serverless(app as any);
