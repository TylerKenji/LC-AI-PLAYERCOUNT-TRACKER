import http from 'http';
import { getAllTimeHigh } from './steamApi.js';

export function createWebInterfaceServer(port = 3000) {
    const server = http.createServer((req, res) => {
        if (req.url === '/' && req.method === 'GET') {
            const high = getAllTimeHigh();
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <head><title>Limbus Company All-Time High</title></head>
                <body style="font-family:sans-serif;text-align:center;margin-top:10%">
                    <h1>Limbus Company All-Time High Player Count</h1>
                    <p style="font-size:2em;">${high}</p>
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
