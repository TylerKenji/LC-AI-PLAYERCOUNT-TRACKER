import http from 'http';
import { getAllTimeHigh, getHighHistory } from './steamApi.js';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

export function createWebInterfaceServer(port = 3000) {
    // Log environment information
    console.log('Environment Information:');
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('HOME:', process.env.HOME || 'Not set');
    console.log('WEBSITE_ROOT_PATH:', process.env.WEBSITE_ROOT_PATH || 'Not set');
    console.log('Azure WebApp Name:', process.env.AZURE_WEBAPP_NAME || 'Not set');
    console.log('Azure Resource Group:', process.env.AZURE_RESOURCE_GROUP || 'Not set');
    
    // Try to list contents of assets directory
    try {
        const assetsDir = path.join(__dirname, '..', 'assets');
        const files = fs.readdirSync(assetsDir);
        console.log('Assets directory contents:', files);
    } catch (err) {
        console.log('Error listing assets directory:', err.message);
    }
    
    const server = http.createServer((req, res) => {
        // Serve static files from /assets
        if (req.url.startsWith('/assets/') && req.method === 'GET') {
            console.log('Received asset request:', req.url);
            
            const possiblePaths = [
                path.join(__dirname, '..', 'assets', path.basename(req.url)),
                path.join(process.cwd(), 'assets', path.basename(req.url)),
                path.join(process.cwd(), 'steam-limbus-ai-notifier', 'assets', path.basename(req.url)),
                path.join(process.env.HOME || '', 'site', 'wwwroot', 'assets', path.basename(req.url)),
                path.join(process.env.WEBSITE_ROOT_PATH || '', 'assets', path.basename(req.url))
            ];
            
            console.log('Checking these paths:');
            possiblePaths.forEach(p => console.log('- ', p));
            
            const tryPath = (paths) => {
                if (paths.length === 0) {
                    console.error('File not found in any location');
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                    return;
                }
                
                const currentPath = paths[0];
                console.log('Checking path:', currentPath);
                
                fs.stat(currentPath, (statErr, stats) => {
                    if (statErr) {
                        console.log('File not found at:', currentPath);
                        console.log('Error:', statErr.message);
                        tryPath(paths.slice(1));
                        return;
                    }
                    
                    console.log('File exists at:', currentPath);
                    console.log('File stats:', {
                        size: stats.size,
                        isFile: stats.isFile(),
                        permissions: stats.mode,
                        created: stats.birthtime,
                        modified: stats.mtime
                    });
                    
                    fs.readFile(currentPath, (err, data) => {
                        if (err) {
                            console.log('Error reading file:', err.message);
                            tryPath(paths.slice(1));
                        } else {
                            console.log('Successfully read file:', {
                                path: currentPath,
                                size: data.length
                            });
                            
                            let contentType = 'application/octet-stream';
                            if (currentPath.endsWith('.jpg') || currentPath.endsWith('.jpeg')) contentType = 'image/jpeg';
                            else if (currentPath.endsWith('.png')) contentType = 'image/png';
                            else if (currentPath.endsWith('.gif')) contentType = 'image/gif';
                            
                            res.writeHead(200, { 'Content-Type': contentType });
                            res.end(data);
                        }
                    });
                });
            };
            
            tryPath(possiblePaths);
            
        } else if (req.url === '/' && req.method === 'GET') {
            const high = getAllTimeHigh();
            const history = getHighHistory();
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <head><title>Limbus Company All-Time High</title></head>
                <body style="font-family:sans-serif;text-align:center;margin-top:5%;min-height:100vh;background-image:url('/assets/maxresdefault-2.jpg');background-size:cover;background-position:center;background-repeat:no-repeat;">
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
