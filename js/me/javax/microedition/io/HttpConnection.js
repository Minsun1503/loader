js2me.createClass({
	_init$$V: function () {
	},
	$setRequestMethod$Ljava_lang_String_$V: function (method) {
		this.method = method.text;
	},
	$setRequestProperty$Ljava_lang_String_Ljava_lang_String_$V: function (key, value) {
		this.requestHeaders[key.text] = value.text;
	},
	_doRequest: function() {
		if (this.requested) return;
		this.requested = true;
		
		js2me.suspendThread = true;
		var threadId = js2me.currentThread;
		var self = this;
		
		var xhr = new XMLHttpRequest();
		var proxyHost = (window.location.hostname !== '' && window.location.hostname !== 'localhost') ? window.location.hostname : '127.0.0.1';
		var proxyUrl = 'http://' + proxyHost + ':8123/';
		
		xhr.open(this.method, proxyUrl, true);
		xhr.responseType = 'arraybuffer';
		xhr.setRequestHeader('X-Target-URL', this.urlStr);
		
		for (var key in this.requestHeaders) {
			xhr.setRequestHeader(key, this.requestHeaders[key]);
		}
		
		xhr.onload = function() {
			self.responseCode = xhr.status;
			self.responseBuffer = new Uint8Array(xhr.response);
			var headersString = xhr.getAllResponseHeaders();
			var arr = headersString.trim().split(/[\r\n]+/);
			arr.forEach(function (line) {
				var parts = line.split(': ');
				var header = parts.shift();
				var value = parts.join(': ');
				self.responseHeaders[header.toLowerCase()] = value;
			});
			js2me.restoreThread(threadId);
		};
		
		xhr.onerror = function() {
			self.error = true;
			js2me.restoreThread(threadId);
		};
		
		xhr.send();
		
		js2me.restoreStack[threadId] = [function () {
			if (self.error) {
				throw new javaRoot.$java.$io.$IOException();
			}
			return; // just continue
		}];
	},
	$getResponseCode$$I: function () {
		this._doRequest();
		if (js2me.suspendThread) return;
		return this.responseCode;
	},
	$getLength$$J: function () {
		this._doRequest();
		if (js2me.suspendThread) return;
		if (this.responseBuffer) return {hi: 0, lo: this.responseBuffer.length};
		return {hi: 0, lo: 0};
	},
	$openInputStream$$Ljava_io_InputStream_: function () {
		this._doRequest();
		if (js2me.suspendThread) return;
		
		var is = new javaRoot.$java.$io.$ByteArrayInputStream();
		var signedBytes = new Int8Array(this.responseBuffer.buffer, this.responseBuffer.byteOffset, this.responseBuffer.byteLength);
		var arr = Array.from(signedBytes);
		// ByteArrayInputStream needs byte array
		var jArray = arr;
		jArray.className = '[B';
		is._init$_B$V(jArray);
		return is;
	},
	$close$$V: function () {
		this.closed = true;
	},
	interfaces: ['javaRoot.$javax.$microedition.$io.$HttpConnection']
});
