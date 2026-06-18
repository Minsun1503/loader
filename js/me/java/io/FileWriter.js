js2me.createClass({
	_init$Ljava_io_File_$V: function (file) {
		this.os = new javaRoot.$java.$io.$FileOutputStream();
		this.os._init$Ljava_io_File_$V(file);
	},
	_init$Ljava_lang_String_$V: function (path) {
		this.os = new javaRoot.$java.$io.$FileOutputStream();
		this.os._init$Ljava_lang_String_$V(path);
	},
	$close$$V: function() {
		this.os.$close$$V();
	},
	$flush$$V: function() {
		this.os.$flush$$V();
	},
	$write$I$V: function(c) {
		this.os.$write$I$V(c);
	},
	$write$Ljava_lang_String_$V: function(str) {
		var text = str.text;
		for (var i = 0; i < text.length; i++) {
			this.os.$write$I$V(text.charCodeAt(i));
		}
	},
	superClass: 'javaRoot.$java.$io.$Writer'
});
