const INDEX_PATH = "/index.html";

async function serveAsset(request, env) {
  if (!env?.ASSETS?.fetch) {
    return new Response("Static asset binding is unavailable.", { status: 500 });
  }

  const directResponse = await env.ASSETS.fetch(request);
  if (directResponse.status !== 404) {
    return directResponse;
  }

  const url = new URL(request.url);
  const acceptsHtml = request.headers.get("accept")?.includes("text/html");
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname);

  if (request.method === "GET" && acceptsHtml && !hasFileExtension) {
    url.pathname = INDEX_PATH;
    return env.ASSETS.fetch(new Request(url, request));
  }

  return directResponse;
}

export default {
  fetch: serveAsset,
};
