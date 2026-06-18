js2me.createClass({
	/*
	 * public DataOutputStream(OutputStream out)
	 */
	_init$Ljava_io_OutputStream_$V : function (out) {
		this.out = out;
	},
	/*
	 * 
	 */
	$close$$V: function () {
		this.out.$close$$V();
	},
	/*
	 * 
	 */
	$flush$$V: function () {
		this.out.$flush$$V();
	},
	/*
	 * 
	 */
	$write$I$V: function (value) {
		this.out.$write$I$V(value);
	},
	/*
	 * 
	 */
	$write$_B$V: function (data) {
		this.out.$write$_B$V(data);
	},
	/*
	 * 
	 */
	$write$_BII$V: function (data, offset, length) {
		this.out.$write$_BII$V(data, offset, length);
	},
	/*
	 * 
	 */
	$writeBoolean$Z$V: function (v) {
		if (v) {
			this.out.$write$I$V(1);
		} else {
			this.out.$write$I$V(0);
		}
	},
	/*
	 * 
	 */
	$writeByte$I$V: function (value) {
		this.out.$write$I$V(value & 0xFF);
	},
	/*
	 * 
	 */
	$writeChar$I$V: function (char) {
		this.out.$write$I$V((char >>> 8) & 0xFF);
		this.out.$write$I$V(char & 0xFF);
	},
	/*
	 * 
	 */
	$writeChars$Ljava_lang_String_$V: function (str) {
		for (var i = 0; i < str.text.length; i++) {
			this.$writeChar$I$V(str.text.charCodeAt(i));
		}
	},
	/*
	 * 
	 */
	$writeDouble$D$V: function (value) {
		this.$write$_B$V(js2me.FPToBytes(value.double, 11, 52));
	},
	/*
	 * 
	 */
	$writeFloat$F$V: function (value) {
		this.$write$_B$V(js2me.FPToBytes(value, 8, 23));
	},
	/*
	 * 
	 */
	$writeInt$I$V: function (value) {
		var buffer = [];
		for (var i = 0; i < 4; i++) {
			buffer[i] = value & 0xFF;
			value = value >>> 8;
		}
		buffer.reverse();
		this.out.$write$_B$V(buffer);
	},
	/*
	 * 
	 */
	$writeLong$J$V: function (value) {
		this.$writeInt$I$V(value.hi);
		this.$writeInt$I$V(value.lo);
	},
	/*
	 * 
	 */
	$writeShort$I$V: function (value) {
		this.out.$write$I$V((value >>> 8) & 0xFF);
		this.out.$write$I$V(value & 0xFF);
	},
	/*
	 * 
	 */
	$writeUTF$Ljava_lang_String_$V: function (str) {
		if (str == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		var bytes = str.$getBytes$$_B();
		this.out.$write$I$V((bytes.length & 0xFF00) >> 8);
		this.out.$write$I$V(bytes.length & 0xFF);
		this.out.$write$_B$V(bytes);
	},
	superClass: 'javaRoot.$java.$io.$OutputStream'
});

