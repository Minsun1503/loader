js2me.createClass({
	_init$Ljava_io_File_$V: function (file) {
		this.file = file;
		var vfs = js2me.vfs || {};
		var data = vfs[file.path];
		if (data === undefined || data === "[DIR]") {
			throw new javaRoot.$java.$io.$IOException(new javaRoot.$java.$lang.$String("File not found or is directory"));
		}
		this.data = data; // Assumed to be comma-separated string of bytes or base64. Let's use JSON array for simplicity
		try {
			this.bytes = JSON.parse(data);
		} catch (e) {
			this.bytes = [];
		}
		this.pos = 0;
	},
	$read$$I: function () {
		if (this.pos >= this.bytes.length) return -1;
		return this.bytes[this.pos++];
	},
	$read$_BII$I: function (buffer, offset, length) {
		if (this.pos >= this.bytes.length) return -1;
		var read = 0;
		while (read < length && this.pos < this.bytes.length) {
			buffer[offset + read] = this.bytes[this.pos++];
			read++;
		}
		return read;
	},
	$close$$V: function () {
		this.closed = true;
	},
	superClass: 'javaRoot.$java.$io.$InputStream'
});
