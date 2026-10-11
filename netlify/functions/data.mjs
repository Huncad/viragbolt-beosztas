// Közös, titkosított tároló a beosztásnak.
// A szerver csak titkosított adatot lát; olvasni és írni csak a jelszóból származó tokennel lehet.
import { getStore } from "@netlify/blobs";

const STORE = { name: "viragbolt", consistency: "strong", region: "eu-central-1" };
const KEY = "state";
const noStore = { "cache-control": "no-store" };

async function current(store) {
  const r = await store.getWithMetadata(KEY, { type: "json" });
  return r ? { etag: r.etag, ...r.data } : null;
}

export default async (req) => {
  const token = Netlify.env.get("WRITE_TOKEN");
  if (!token || req.headers.get("x-token") !== token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const store = getStore(STORE);

  if (req.method === "GET") {
    return Response.json(await current(store), { headers: noStore });
  }

  if (req.method === "PUT") {
    let body;
    try { body = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }
    if (typeof body.iv !== "string" || typeof body.c !== "string" || body.c.length > 5_000_000) {
      return new Response("Bad request", { status: 400 });
    }
    const value = { iv: body.iv, c: body.c };
    const res = body.etag
      ? await store.setJSON(KEY, value, { onlyIfMatch: body.etag })
      : await store.setJSON(KEY, value, { onlyIfNew: true });
    if (!res.modified) {
      return Response.json(await current(store), { status: 409, headers: noStore });
    }
    return Response.json({ etag: res.etag }, { headers: noStore });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/data" };
