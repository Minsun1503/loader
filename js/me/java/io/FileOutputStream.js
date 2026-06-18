js2me.createClass({
	_init$Ljava_io_File_$V: function (file) {
		this.file = file;
		this.bytes = [];
	},
	_init$Ljava_lang_String_$V: function (path) {
		this.file = { path: path.text };
		this.bytes = [];
	},
	$write$I$V: function (b) {
		this.bytes.push(b);
	},
	$write$_B$V: function (buffer) {
		for (var i = 0; i < buffer.length; i++) {
			this.bytes.push(buffer[i]);
		}
	},
	$write$_BII$V: function (buffer, offset, length) {
		for (var i = 0; i < length; i++) {
			this.bytes.push(buffer[offset + i]);
		}
	},
	$close$$V: function () {
		var vfs = js2me.vfs || {};
		vfs[this.file.path] = JSON.stringify(this.bytes);
		js2me.vfs = vfs;
		try { localStorage.setItem('js2me_vfs', JSON.stringify(vfs)); } catch (e) {}
		this.closed = true;
	},
	$flush$$V: function () {
		var vfs = js2me.vfs || {};
		vfs[this.file.path] = JSON.stringify(this.bytes);
		js2me.vfs = vfs;
		try { localStorage.setItem('js2me_vfs', JSON.stringify(vfs)); } catch (e) {}
	},
	superClass: 'javaRoot.$java.$io.$OutputStream'
});
