// Cloudflare Pages Function: proxy statistik /u/* na Umami na VPS (stejně jako worker.js u Fajbru).
// Skript i odesílání jdou z vlastní domény, aby je neblokovaly blokátory. Bez cookies.
// IP návštěvníka jde dál v X-Fajbr-Ip, nginx na lubosmikula.cz ji předá Umami jako X-Real-IP
// (Umami z ní určí jen zemi a město, IP neukládá).
const UMAMI = 'https://lubosmikula.cz';
const PATHS = { '/u/script.js': 'GET', '/u/api/send': 'POST' };

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const method = PATHS[url.pathname];
  if (!method) return new Response('Not found', { status: 404 });
  if (request.method !== method) return new Response(null, { status: 405, headers: { Allow: method } });
  const ip = request.headers.get('cf-connecting-ip') || '';
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.set('X-Fajbr-Ip', ip);
  headers.set('X-Forwarded-For', ip);
  try {
    const res = await fetch(UMAMI + url.pathname, { method, headers, body: method === 'POST' ? request.body : undefined, redirect: 'manual' });
    return new Response(res.body, { status: res.status, headers: res.headers });
  } catch (e) {
    // statistiky nesmí rozbít web: bez serveru skript chybí a odesílání tiše selže
    return new Response(null, { status: 502 });
  }
}
