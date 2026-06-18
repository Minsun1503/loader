js2me.createClass({
	_init$Ljava_lang_String_$V: function (path) {
		this.path = path.text;
	},
	_init$Ljava_lang_String_Ljava_lang_String_$V: function (parent, child) {
		this.path = parent.text + '/' + child.text;
	},
	$createNewFile$$Z: function () {
		var vfs = js2me.vfs || {};
		if (vfs[this.path]) return 0; // false if exists
		vfs[this.path] = "";
		js2me.vfs = vfs;
		try { localStorage.setItem('js2me_vfs', JSON.stringify(vfs)); } catch (e) {}
		return 1;
	},
	$delete$$Z: function () {
		var vfs = js2me.vfs || {};
		if (vfs[this.path] === undefined) return 0;
		delete vfs[this.path];
		js2me.vfs = vfs;
		try { localStorage.setItem('js2me_vfs', JSON.stringify(vfs)); } catch (e) {}
		return 1;
	},
	$exists$$Z: function () {
		var vfs = js2me.vfs || {};
		return vfs[this.path] !== undefined ? 1 : 0;
	},
	$getName$$Ljava_lang_String_: function () {
		var idx = this.path.lastIndexOf('/');
		if (idx === -1) idx = this.path.lastIndexOf('\\');
		var name = (idx === -1) ? this.path : this.path.substring(idx + 1);
		return new javaRoot.$java.$lang.$String(name);
	},
	$isDirectory$$Z: function () {
		var vfs = js2me.vfs || {};
		return (vfs[this.path] === "[DIR]") ? 1 : 0;
	},
	$list$$_Ljava_lang_String_: function () {
		// Mock empty dir
		var arr = [];
		arr.className = '[Ljava.lang.String;';
		return arr;
	},
	$listFiles$$_Ljava_io_File_: function () {
		var arr = [];
		arr.className = '[Ljava.io.File;';
		return arr;
	},
	$mkdirs$$Z: function () {
		var vfs = js2me.vfs || {};
		vfs[this.path] = "[DIR]";
		js2me.vfs = vfs;
		try { localStorage.setItem('js2me_vfs', JSON.stringify(vfs)); } catch (e) {}
		return 1;
	}
});

// Init vfs
if (!js2me.vfs) {
	try {
		var stored = localStorage.getItem('js2me_vfs');
		if (stored) js2me.vfs = JSON.parse(stored);
		else js2me.vfs = {};
	} catch(e) {
		js2me.vfs = {};
	}
}
