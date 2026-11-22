export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/data") {
      if (request.method === "GET") {
        const v = await env.SUPPLIERS.get("data");
        return new Response(v || "{}", {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
        });
      }
      if (request.method === "PUT") {
        const body = await request.text();
        if (body.length > 5000000) return new Response("too large", { status: 413 });
        try {
          const j = JSON.parse(body);
          if (!j || typeof j.m !== "object") throw new Error("bad");
        } catch (e) {
          return new Response("bad request", { status: 400 });
        }
        await env.SUPPLIERS.put("data", body);
        return new Response("ok");
      }
      return new Response("method not allowed", { status: 405 });
    }

    return env.ASSETS.fetch(request);
  }
};
