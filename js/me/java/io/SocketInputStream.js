js2me.createClass({
	construct: function (ws) {
		this.ws = ws;
		this.buffer = [];
		this.closed = false;
		this.waitingThreadId = null;
		
		var self = this;
		this.ws.addEventListener('message', function(event) {
			var data = new Uint8Array(event.data);
			for (var i = 0; i < data.length; i++) {
				self.buffer.push(data[i]);
			}
			if (self.waitingThreadId != null) {
				var threadId = self.waitingThreadId;
				self.waitingThreadId = null;
				js2me.restoreThread(threadId);
			}
		});
		this.ws.addEventListener('close', function() {
			self.closed = true;
			if (self.waitingThreadId != null) {
				var threadId = self.waitingThreadId;
				self.waitingThreadId = null;
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
			return -1;
		}
		
		js2me.suspendThread = true;
		var threadId = js2me.currentThread;
		this.waitingThreadId = threadId;
		
		var self = this;
		js2me.restoreStack[threadId] = [function () {
			if (self.buffer.length > 0) {
				return self.buffer.shift();
			} else if (self.closed) {
				return -1;
			}
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
		this.closed = true;
		this.ws.close();
	},
	superClass: 'javaRoot.$java.$io.$InputStream'
});
