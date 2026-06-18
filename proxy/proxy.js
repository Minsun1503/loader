const net = require('net');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8122 });

wss.on('connection', function connection(ws, req) {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const targetHost = urlParams.get('host');
  const targetPort = parseInt(urlParams.get('port'), 10);

  if (!targetHost || !targetPort) {
    console.error('Missing host or port in WebSocket URL');
    ws.close();
    return;
  }

  console.log(`[Proxy] Nhận yêu cầu kết nối tới ${targetHost}:${targetPort}`);
  const tcpClient = new net.Socket();
  
  tcpClient.connect(targetPort, targetHost, function() {
    console.log(`[Proxy] Đã kết nối thành công tới ${targetHost}:${targetPort}`);
  });

  tcpClient.on('data', function(data) {
    ws.send(data);
  });

  ws.on('message', function incoming(message) {
    tcpClient.write(message);
  });

  tcpClient.on('close', function() {
    console.log(`[Proxy] Mất kết nối TCP từ ${targetHost}:${targetPort}`);
    ws.close();
  });

  ws.on('close', function() {
    console.log(`[Proxy] Trình giả lập (trình duyệt) đã ngắt kết nối WebSocket`);
    tcpClient.destroy();
  });
  
  tcpClient.on('error', function(err) {
    console.error(`[Proxy] Lỗi TCP: ${err.message}`);
    ws.close();
  });
});

console.log('--------------------------------------------------');
console.log(' WebSocket to TCP Proxy đang chạy tại ws://127.0.0.1:8122');

const http = require('http');
const https = require('https');

const httpProxy = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const targetUrl = req.headers['x-target-url'];
  if (!targetUrl) {
    res.writeHead(400);
    res.end('Missing X-Target-URL header');
    return;
  }

  const { URL } = require('url');
  let urlObj;
  try {
    urlObj = new URL(targetUrl);
  } catch (e) {
    res.writeHead(400);
    res.end('Invalid X-Target-URL');
    return;
  }
  
  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
    path: urlObj.pathname + urlObj.search,
    method: req.method,
    headers: { ...req.headers }
  };
  
  delete options.headers['host'];
  delete options.headers['x-target-url'];
  delete options.headers['connection'];
  delete options.headers['origin'];
  delete options.headers['referer'];

  const clientModule = urlObj.protocol === 'https:' ? https : http;
  const proxyReq = clientModule.request(options, (proxyRes) => {
    Object.keys(proxyRes.headers).forEach(key => {
        res.setHeader(key, proxyRes.headers[key]);
    });
    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error(`[Proxy HTTP] Lỗi khi gọi tới ${targetUrl}: ${e.message}`);
    if (!res.headersSent) res.writeHead(502);
    res.end();
  });

  req.pipe(proxyReq);
});

httpProxy.listen(8123, () => {
  console.log(' HTTP CORS Proxy đang chạy tại http://127.0.0.1:8123');
  console.log(' Hãy để cửa sổ này mở trong khi chơi game...');
  console.log('--------------------------------------------------');
});
