js2me.createClass({
	/*
	 * 
	 */
	$open$Ljava_lang_String_$Ljavax_microedition_io_Connection_: function(url) {
		var urlStr = url != null ? url.text : '';
		var parts = urlStr.split(':');
		var protocol = parts[0];
		
		if (protocol === 'http' || protocol === 'https') {
			var connection = new javaRoot.$javax.$microedition.$io.$HttpConnection();
			connection.urlStr = urlStr;
			connection.method = 'GET';
			connection.requestHeaders = {};
			connection.responseHeaders = {};
			connection.responseCode = -1;
			connection.responseBuffer = null;
			return connection;
		}
		
		if (protocol === 'socket') {
			var host = parts[1].replace('//', '');
			var port = parts[2];
			
			// Tự động nhận diện host: Nếu chạy local thì 127.0.0.1, nếu chạy trên web thì lấy tên miền web
			var proxyHost = (window.location.hostname !== '' && window.location.hostname !== 'localhost') ? window.location.hostname : '127.0.0.1';
			
			// Khong ghi de host nua de SV1 va SV2 co the ket noi den dung IP cua no
            
			var wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
			
			var ws = new WebSocket(wsProtocol + proxyHost + ':8122/?host=' + host + '&port=' + port);
			ws.binaryType = 'arraybuffer';
			
			// Đệm trước dữ liệu để tránh rớt gói tin
			ws.preBuffer = [];
			ws.addEventListener('message', function(event) {
				var data = new Uint8Array(event.data);
				for (var i = 0; i < data.length; i++) {
					ws.preBuffer.push(data[i]);
				}
			});
			
			var connection = new javaRoot.$javax.$microedition.$io.$SocketConnection();
			connection.ws = ws;
			
			js2me.suspendThread = true;
			var threadId = js2me.currentThread;
			
			ws.onopen = function() {
				js2me.restoreThread(threadId);
			};
			ws.onerror = function(err) {
				js2me.restoreThread(threadId);
			};
			
			js2me.restoreStack[threadId] = [function () {
				if (ws.readyState !== 1) { // not OPEN
					var ex = new javaRoot.$java.$io.$IOException();
					ex._init$$V();
					throw ex;
				}
				return connection;
			}];
			return; // Will return the connection when restored
		}
		
		throw new Error('Unsupported protocol: ' + urlStr);
	}
});
	

