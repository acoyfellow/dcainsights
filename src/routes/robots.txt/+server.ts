import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${url.origin}/sitemap.xml
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
} 