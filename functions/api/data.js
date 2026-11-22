export async function onRequestGet({ env }) {
  const v = await env.SUPPLIERS.get("data");
  return new Response(v || "{}", {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

export async function onRequestPut({ request, env }) {
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
