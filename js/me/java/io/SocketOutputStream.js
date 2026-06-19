js2me.createClass({
	construct: function (ws) {
		this.ws = ws;
		this.closed = false;
		this._buffer = [];
		this._flushScheduled = false;
		this._totalBytesSent = 0;
		this._flushCount = 0;
		// Gắn flush function lên ws để SocketInputStream có thể gọi trước khi block read
		var self = this;
		ws._flushOutput = function () {
			if (self._buffer && self._buffer.length > 0) {
				self._flushBuffer();
			}
		};
		console.log('[SOCKET_OUT] construct', 'ws.readyState=' + ws.readyState);
	},
	_scheduleFlush: function () {
		if (this._flushScheduled) return;
		this._flushScheduled = true;
		var self = this;
		if (typeof Promise !== 'undefined') {
			Promise.resolve().then(function () {
				self._flushBuffer();
			});
		} else {
			setTimeout(function () {
				self._flushBuffer();
			}, 0);
		}
	},
	_flushBuffer: function () {
		this._flushScheduled = false;
		if (this._buffer.length === 0) return;
		this._flushCount++;
		this._totalBytesSent += this._buffer.length;
		console.log('[SOCKET_OUT] flush #' + this._flushCount + ' ' + this._buffer.length + ' bytes (total=' + this._totalBytesSent + ', wsState=' + this.ws.readyState + ')');
		if (this.ws.readyState === 1) {
			var arr = new Uint8Array(this._buffer);
			this.ws.send(arr);
		} else {
			console.warn('[SOCKET_OUT] cannot flush: wsState=' + this.ws.readyState + ' (1=OPEN)');
		}
		this._buffer = [];
	},
	/*
	 * public void write(int b) throws IOException
	 */
	$write$I$V: function (b) {
		if (this.closed) throw new javaRoot.$java.$io.$IOException('Stream closed');
		this._buffer.push(b & 0xFF);
		if (this._buffer.length >= 8192) {
			this._flushBuffer();
		} else {
			this._scheduleFlush();
		}
	},
	/*
	 * public void write(byte[] b, int off, int len) throws IOException
	 */
	$write$_BII$V: function (b, off, len) {
		if (this.closed) throw new javaRoot.$java.$io.$IOException('Stream closed');
		for (var i = 0; i < len; i++) {
			this._buffer.push(b[off + i]);
		}
		if (this._buffer.length >= 8192) {
			this._flushBuffer();
		} else {
			this._scheduleFlush();
		}
	},
	/*
	 * public void flush() throws IOException
	 */
	$flush$$V: function () {
		console.log('[SOCKET_OUT] flush() called');
		this._flushBuffer();
	},
	/*
	 * public void close() throws IOException
	 */
	$close$$V: function () {
		console.log('[SOCKET_OUT] close() called, flushing ' + this._buffer.length + ' remaining bytes');
		this._flushBuffer();
		this.closed = true;
		this.ws.close();
	},
	superClass: 'javaRoot.$java.$io.$OutputStream'
});