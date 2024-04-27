import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} remixContext
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  let localDirs =
    process.env.NODE_ENV === 'development'
      ? ['localhost:*', 'ws://localhost:*', 'ws://127.0.0.1:*']
      : [];

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://www.gstatic.com',
      'blob:', // Allow blob URLs in script sources
      ...localDirs,
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://www.gstatic.com',
      ...localDirs,
    ],
    workerSrc: [
      // Explicitly allow worker scripts from specific sources
      "'self'",
      'blob:', // Allow blob URLs for workers
      ...localDirs,
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/remix-oxygen').EntryContext} EntryContext */
