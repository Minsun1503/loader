js2me.createClass({
	_init$Ljava_io_Writer_$V: function (writer) {
		this.writer = writer;
	},
	$close$$V: function() {
		if (this.writer && this.writer.$close$$V) {
			this.writer.$close$$V();
		}
	},
	$flush$$V: function() {
		if (this.writer && this.writer.$flush$$V) {
			this.writer.$flush$$V();
		}
	},
	$write$Ljava_lang_String_$V: function(str) {
		if (this.writer && this.writer.$write$Ljava_lang_String_$V) {
			this.writer.$write$Ljava_lang_String_$V(str);
		} else if (this.writer && this.writer.$write$I$V) {
			var text = str.text;
			for (var i = 0; i < text.length; i++) {
				this.writer.$write$I$V(text.charCodeAt(i));
			}
		}
	},
	superClass: 'javaRoot.$java.$io.$Writer'
});
