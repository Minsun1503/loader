js2me.createClass({
	construct: function (ws) {
		this.ws = ws;
		this.buffer = [];
		this.closed = false;
		this.waitingThreadId = null;
		this._msgCount = 0;

		var self = this;
		this.ws.addEventListener('message', function (event) {
			var data = new Uint8Array(event.data);
			self._msgCount++;
			console.log('[SOCKET_IN] msg #' + self._msgCount + ' received ' + data.length + ' bytes (buf=' + self.buffer.length + ')');
			for (var i = 0; i < data.length; i++) {
				self.buffer.push(data[i]);
			}
			if (self.waitingThreadId != null) {
				var threadId = self.waitingThreadId;
				self.waitingThreadId = null;
				console.log('[SOCKET_IN] msg #' + self._msgCount + ' RESUMES thread ' + threadId);
				js2me.restoreThread(threadId);
			}
		});
		this.ws.addEventListener('close', function () {
			console.log('[SOCKET_IN] WS close fired, closed=' + self.closed + ', buf=' + self.buffer.length + ', waitThread=' + self.waitingThreadId);
			self.closed = true;
			if (self.waitingThreadId != null) {
				var threadId = self.waitingThreadId;
				self.waitingThreadId = null;
				console.log('[SOCKET_IN] WS close RESUMES thread ' + threadId);
				js2me.restoreThread(threadId);
			}
		});
	},
	/*
	 * public int read() throws IOException
	 */
	$read$$I: function () {
		if (this.buffer.length > 0) {
			var value = this.buffer.shift();
			return value;
		}
		if (this.closed) {
			console.log('[SOCKET_IN] read() returns -1 (closed)');
			return -1;
		}

		// Flush pending output data before blocking on read
		if (this.ws._flushOutput) {
			this.ws._flushOutput();
		}

		console.log('[SOCKET_IN] read() BLOCKING (buf=0, thread=' + js2me.currentThread + ')');
		js2me.suspendThread = true;
		var threadId = js2me.currentThread;
		this.waitingThreadId = threadId;

		var self = this;
		js2me.restoreStack[threadId] = [function () {
			console.log('[SOCKET_IN] read() RESUME (buf=' + self.buffer.length + ', closed=' + self.closed + ')');
			if (self.buffer.length > 0) {
				return self.buffer.shift();
			} else if (self.closed) {
				console.log('[SOCKET_IN] read() RESUME returns -1 (closed)');
				return -1;
			}
			console.log('[SOCKET_IN] read() RESUME throws IOException');
			throw new javaRoot.$java.$io.$IOException('Socket closed unexpectedly');
		}];
	},
	/*
	 * public int available() throws IOException
	 */
	$available$$I: function () {
		return this.buffer.length;
	},
	/*
	 * public void close() throws IOException
	 */
	$close$$V: function () {
		console.log('[SOCKET_IN] close() called, buf=' + this.buffer.length);
		// Flush output before closing
		if (this.ws._flushOutput) {
			this.ws._flushOutput();
		}
		this.closed = true;
		this.ws.close();
	},
	superClass: 'javaRoot.$java.$io.$InputStream'
});