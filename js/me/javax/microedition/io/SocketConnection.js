js2me.createClass({
	construct: function () {
		this._outputStream = null;
	},
	/*
	 * public DataInputStream openDataInputStream()
	 */
	$openDataInputStream$$Ljava_io_DataInputStream_: function () {
		return new javaRoot.$java.$io.$SocketDataInputStream(this.ws);
	},
	/*
	 * public DataOutputStream openDataOutputStream()
	 */
	$openDataOutputStream$$Ljava_io_DataOutputStream_: function () {
		var os = new javaRoot.$java.$io.$SocketOutputStream(this.ws);
		this._outputStream = os;
		var dos = new javaRoot.$java.$io.$DataOutputStream();
		dos._init$Ljava_io_OutputStream_$V(os);
		return dos;
	},
	/*
	 * public InputStream openInputStream()
	 */
	$openInputStream$$Ljava_io_InputStream_: function () {
		return new javaRoot.$java.$io.$SocketInputStream(this.ws);
	},
	/*
	 * public OutputStream openOutputStream()
	 */
	$openOutputStream$$Ljava_io_OutputStream_: function () {
		var os = new javaRoot.$java.$io.$SocketOutputStream(this.ws);
		this._outputStream = os;
		return os;
	},
	/*
	 * public void flush()
	 * Forces any buffered output bytes to be written out.
	 */
	$flush$$V: function () {
		if (this._outputStream) {
			this._outputStream.$flush$$V();
		}
	},
	/*
	 * public void close()
	 */
	$close$$V: function () {
		if (this._outputStream) {
			this._outputStream.$flush$$V();
		}
		if (this.ws) {
			this.ws.close();
		}
	},
	interfaces: ['javaRoot.$javax.$microedition.$io.$SocketConnection']
});