const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.jar': 'application/java-archive'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Handle logging endpoint
    if (parsedUrl.pathname === '/log' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const msg = `[${new Date().toISOString()}] [${data.type.toUpperCase()}] ${data.args.join(' ')}\n`;
                process.stdout.write(msg);
                fs.appendFileSync('client_logs.txt', msg);
            } catch (e) {
                console.error("Error parsing log:", body);
            }
            res.writeHead(200);
            res.end('OK');
        });
        return;
    }
    
    // Serve static files
    let pathname = `.${parsedUrl.pathname}`;
    if (pathname === './') pathname = './index.html';
    
    const ext = path.parse(pathname).ext;
    
    fs.readFile(pathname, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found!');
            return;
        }
        res.setHeader('Content-type', MIME_TYPES[ext] || 'text/plain');
        
        // Inject script into index.html
        if (pathname === './index.html') {
            const inject = `
            <script>
            (function() {
                const originalLog = console.log;
                const originalWarn = console.warn;
                const originalError = console.error;
                
                function sendLog(type, args) {
                    var strArgs = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a));
                    fetch('/log', {
                        method: 'POST',
                        body: JSON.stringify({ type: type, args: strArgs }),
                        headers: { 'Content-Type': 'application/json' }
                    }).catch(err => {});
                }
                
                console.log = function() {
                    originalLog.apply(console, arguments);
                    sendLog('log', arguments);
                };
                console.warn = function() {
                    originalWarn.apply(console, arguments);
                    sendLog('warn', arguments);
                };
                console.error = function() {
                    originalError.apply(console, arguments);
                    sendLog('error', arguments);
                };
            })();
            </script>
            `;
            let html = data.toString();
            html = html.replace('<head>', '<head>' + inject);
            res.end(html);
        } else {
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    // Xoa log cu moi khi khoi dong server moi
    fs.writeFileSync('client_logs.txt', '');
    
    console.log(`===================================================`);
    console.log(`  KHOI DONG SERVER WEB CHO J2ME LOADER (NODEJS)`);
    console.log(`===================================================`);
    console.log(`Dang khoi dong Web Server tren cong ${PORT}`);
    console.log(`Dung cua so nay de tat va XEM LOG TU BROWSER`);
    console.log(`---------------------------------------------------`);
});
