import http from 'http';
import { getAllTimeHigh, getHighHistory } from './steamApi.js';

export function createWebInterfaceServer(port = 3000) {
    const server = http.createServer((req, res) => {
        if (req.url === '/' && req.method === 'GET') {
            const high = getAllTimeHigh();
            const history = getHighHistory();
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <head><title>Limbus Company All-Time High</title></head>
                <body style="font-family:sans-serif;text-align:center;margin-top:5%;background-image:url('https://i.ytimg.com/vi/1gsNj8hwEPw/maxresdefault.jpg');background-size:cover;background-position:center;">
                    <h1 style="background:rgba(255,255,255,0.8);display:inline-block;padding:0.5em 1em;border-radius:8px;">Limbus Company All-Time High Player Count</h1>
                    <p style="font-size:2em;background:rgba(255,255,255,0.7);display:inline-block;padding:0.5em 1em;border-radius:8px;">${high}</p>
                    <h2 style="background:rgba(255,255,255,0.8);display:inline-block;padding:0.3em 0.8em;border-radius:8px;">Last 5 All-Time Highs</h2>
                    <ol style="font-size:1.2em;display:inline-block;text-align:left;background:rgba(255,255,255,0.7);padding:1em 2em;border-radius:8px;">
                        ${history.map(h => `<li>${h.value} <span style='color:#888;font-size:0.8em;'>(${new Date(h.timestamp).toLocaleString()})</span></li>`).join('')}
                    </ol>
                </body>
                </html>
            `);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });
    server.listen(port, () => {
        console.log(`Web interface running on port ${port}`);
    });
    return server;
}
