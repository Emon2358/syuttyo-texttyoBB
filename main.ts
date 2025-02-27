import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

// 受信したリクエストをプロキシする関数
async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
        return new Response("Missing 'url' parameter", { status: 400 });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": targetUrl,
            }
        });

        // レスポンスヘッダーを適切に設定
        const headers = new Headers(response.headers);
        headers.set("Access-Control-Allow-Origin", "*"); // CORS回避
        headers.delete("content-security-policy");
        headers.delete("x-frame-options");

        return new Response(response.body, {
            status: response.status,
            headers,
        });
    } catch (err) {
        return new Response(`Error fetching ${targetUrl}: ${err}`, { status: 500 });
    }
}

serve(handleRequest);
