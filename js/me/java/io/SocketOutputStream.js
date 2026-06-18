js2me.createClass({
	construct: function (ws) {
		this.ws = ws;
		this.closed = false;
	},
	/*
	 * public void write(int b) throws IOException
	 */
	$write$I$V: function (b) {
		if (this.closed) throw new javaRoot.$java.$io.$IOException('Stream closed');
		if (this.ws.readyState === 1) { // OPEN
			var arr = new Uint8Array(1);
			arr[0] = b;
			this.ws.send(arr);
		}
	},
	/*
	 * public void write(byte[] b, int off, int len) throws IOException
	 */
	$write$_BII$V: function (b, off, len) {
		if (this.closed) throw new javaRoot.$java.$io.$IOException('Stream closed');
		if (this.ws.readyState === 1) { // OPEN
			var arr = new Uint8Array(len);
			for (var i = 0; i < len; i++) {
				arr[i] = b[off + i];
			}
			this.ws.send(arr);
		}
	},
	/*
	 * public void flush() throws IOException
	 */
	$flush$$V: function () {
		// WebSocket sends automatically
	},
	/*
	 * public void close() throws IOException
	 */
	$close$$V: function () {
		this.closed = true;
		this.ws.close();
	},
	superClass: 'javaRoot.$java.$io.$OutputStream'
});
