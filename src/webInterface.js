import http from 'http';
import { getAllTimeHigh, getHighHistory } from './steamApi.js';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createWebInterfaceServer(port = 3000) {
    // Log environment information
    console.log('Environment Information:');
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('HOME:', process.env.HOME || 'Not set');
    console.log('WEBSITE_ROOT_PATH:', process.env.WEBSITE_ROOT_PATH || 'Not set');
    
    // Try to list contents of possible asset directories
    const possibleAssetPaths = [
        path.join(__dirname, '..', 'assets'),
        path.join(process.cwd(), 'assets'),
        path.join(process.cwd(), 'steam-limbus-ai-notifier', 'assets'),
        path.join(process.env.HOME || '', 'site', 'wwwroot', 'assets'),
        path.join(process.env.WEBSITE_ROOT_PATH || '', 'assets')
    ];
    
    console.log('Checking all possible asset directories:');
    possibleAssetPaths.forEach(assetPath => {
        try {
            console.log(`\nChecking directory: ${assetPath}`);
            if (fs.existsSync(assetPath)) {
                console.log('Directory exists!');
                const files = fs.readdirSync(assetPath);
                console.log('Contents:', files);
                
                // Get detailed stats for each file
                files.forEach(file => {
                    try {
                        const filePath = path.join(assetPath, file);
                        const stats = fs.statSync(filePath);
                        console.log(`File: ${file}`, {
                            size: stats.size,
                            isFile: stats.isFile(),
                            permissions: stats.mode,
                            created: stats.birthtime,
                            modified: stats.mtime
                        });
                    } catch (err) {
                        console.log(`Error getting stats for ${file}:`, err.message);
                    }
                });
            } else {
                console.log('Directory does not exist');
            }
        } catch (err) {
            console.log('Error accessing directory:', err.message);
        }
    });
    
    const server = http.createServer((req, res) => {
        console.log('\nReceived request:', {
            url: req.url,
            method: req.method,
            headers: req.headers
        });
        
        // Serve static files from /assets
        if (req.url.startsWith('/assets/') && req.method === 'GET') {
            // Log the requested URL and parse components
            const requestedFile = path.basename(req.url);
            console.log('\nAsset request details:', {
                fullUrl: req.url,
                fileName: requestedFile,
                userAgent: req.headers['user-agent']
            });
            
            const possiblePaths = [
                path.join(__dirname, '..', 'assets', requestedFile),
                path.join(process.cwd(), 'assets', requestedFile),
                path.join(process.cwd(), 'steam-limbus-ai-notifier', 'assets', requestedFile),
                path.join(process.env.HOME || '', 'site', 'wwwroot', 'assets', requestedFile),
                path.join(process.env.WEBSITE_ROOT_PATH || '', 'assets', requestedFile)
            ];
            
            console.log('\nChecking these paths:');
            possiblePaths.forEach((p, i) => console.log(`${i + 1}. ${p}`));
            
            const tryPath = (paths) => {
                if (paths.length === 0) {
                    console.error('\nFile not found in any location:', requestedFile);
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                    return;
                }
                
                const currentPath = paths[0];
                console.log(`\nTrying path ${paths.length}/${possiblePaths.length}:`, currentPath);
                
                try {
                    // First check if path exists synchronously
                    if (!fs.existsSync(currentPath)) {
                        console.log('Path does not exist');
                        tryPath(paths.slice(1));
                        return;
                    }
                    
                    const stats = fs.statSync(currentPath);
                    console.log('File exists! Stats:', {
                        size: stats.size,
                        isFile: stats.isFile(),
                        permissions: stats.mode,
                        created: stats.birthtime,
                        modified: stats.mtime
                    });
                    
                    if (!stats.isFile()) {
                        console.log('Path exists but is not a file');
                        tryPath(paths.slice(1));
                        return;
                    }
                    
                    // Read the file
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
                            
                            console.log('Sending response with:', {
                                contentType,
                                size: data.length
                            });
                            
                            // Add CORS headers and caching
                            res.writeHead(200, {
                                'Content-Type': contentType,
                                'Access-Control-Allow-Origin': '*',
                                'Cache-Control': 'public, max-age=31536000',
                                'Content-Length': data.length
                            });
                            res.end(data);
                        }
                    });
                } catch (err) {
                    console.log('Error processing path:', err.message);
                    tryPath(paths.slice(1));
                }
            };
            
            tryPath(possiblePaths);
        } else if (req.url === '/' && req.method === 'GET') {
            console.log('\nServing index page');
            const high = getAllTimeHigh();
            const history = getHighHistory();
            
            // Log the data being rendered
            console.log('Rendering data:', {
                high,
                historyLength: history ? history.length : 0,
                timestamp: new Date().toISOString()
            });

            console.log('\nCurrent directory structure:');
            try {
                const listDir = (dir, depth = 0) => {
                    if (depth > 3) return; // Prevent infinite recursion
                    const items = fs.readdirSync(dir);
                    console.log(`\nContents of ${dir}:`, items);
                    items.forEach(item => {
                        try {
                            const fullPath = path.join(dir, item);
                            const stat = fs.statSync(fullPath);
                            console.log(`- ${item}:`, {
                                isDirectory: stat.isDirectory(),
                                size: stat.size,
                                modified: stat.mtime
                            });
                            if (stat.isDirectory()) {
                                listDir(fullPath, depth + 1);
                            }
                        } catch (err) {
                            console.log(`Error processing ${item}:`, err.message);
                        }
                    });
                };
                listDir(process.cwd());
            } catch (err) {
                console.log('Error listing directory:', err);
            }

            // Check image accessibility
            const testImagePaths = [
                path.join(process.cwd(), 'assets', 'maxresdefault-2.jpg'),
                path.join(process.cwd(), 'steam-limbus-ai-notifier', 'assets', 'maxresdefault-2.jpg'),
                path.join(process.env.HOME || '', 'site', 'wwwroot', 'assets', 'maxresdefault-2.jpg'),
                path.join(process.env.WEBSITE_ROOT_PATH || '', 'assets', 'maxresdefault-2.jpg')
            ];

            console.log('\nChecking image accessibility:');
            testImagePaths.forEach(imagePath => {
                try {
                    console.log(`\nTesting path: ${imagePath}`);
                    const stats = fs.statSync(imagePath);
                    console.log('Image exists! Stats:', {
                        size: stats.size,
                        isFile: stats.isFile(),
                        permissions: stats.mode,
                        created: stats.birthtime,
                        modified: stats.mtime
                    });
                } catch (err) {
                    console.log('Image not found at path:', err.message);
                }
            });
            
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Limbus Company All-Time High</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="font-family:sans-serif;text-align:center;margin:0;padding:5% 0;min-height:100vh;background-image:url('/assets/maxresdefault-2.jpg');background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#ffffff;">
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
                    <h1 style="background:rgba(255,255,255,0.8);display:inline-block;padding:0.5em 1em;border-radius:8px;margin:0;">Limbus Company All-Time High Player Count</h1>
                    <p style="font-size:2em;background:rgba(255,255,255,0.7);display:inline-block;padding:0.5em 1em;border-radius:8px;margin:1em 0;">${high || 'Loading...'}</p>
                    <h2 style="background:rgba(255,255,255,0.8);display:inline-block;padding:0.3em 0.8em;border-radius:8px;margin:0;">Last 5 All-Time Highs</h2>
                    <ol style="font-size:1.2em;display:inline-block;text-align:left;background:rgba(255,255,255,0.7);padding:1em 2em;border-radius:8px;margin:1em 0;">
                        ${history ? history.map(h => `<li>${h.value} <span style='color:#888;font-size:0.8em;'>(${new Date(h.timestamp).toLocaleString()})</span></li>`).join('') : '<li>Loading history...</li>'}
                    </ol>
                </body>
                </html>
            `;
            
            console.log('\nGenerated HTML preview (first 500 chars):', html.substring(0, 500));
            
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Content-Length': Buffer.byteLength(html)
            });
            res.end(html);
            console.log('Index page served');
        } else {
            console.log('404 for URL:', req.url);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });
    
    server.listen(port, () => {
        console.log(`\nWeb interface running on port ${port}`);
    });
    
    return server;
}
