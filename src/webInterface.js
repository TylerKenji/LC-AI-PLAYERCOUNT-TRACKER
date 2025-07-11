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
                <body style="font-family:sans-serif;text-align:center;margin-top:5%;min-height:100vh;background-image:url('https://i.ytimg.com/vi/1gsNj8hwEPw/maxresdefault.jpg');background-size:cover;background-position:center;background-repeat:no-repeat;">
                    <div style="margin-bottom:2em;">
                        <audio id="bg-music" src="https://files.catbox.moe/mvrjq8.mp3" controls loop autoplay>
                            Your browser does not support the audio element.
                        </audio>
                        <br>
                        <label for="volume">Background Music Volume:</label>
                        <input type="range" id="volume" min="0" max="1" step="0.01" value="0.5" style="vertical-align:middle;">
                    </div>
                    <script>
                        const audio = document.getElementById('bg-music');
                        const volumeSlider = document.getElementById('volume');
                        audio.volume = volumeSlider.value;
                        volumeSlider.addEventListener('input', function() {
                            audio.volume = this.value;
                        });
                        // Attempt to play audio on page load
                        window.addEventListener('DOMContentLoaded', function() {
                            audio.play().catch(() => {});
                        });
                    </script>
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
