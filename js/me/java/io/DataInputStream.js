js2me.createClass({
	/*
	 * public DataInputStream(InputStream in)
	 */
	_init$Ljava_io_InputStream_$V: function (stream) {
		this.stream = stream;
	},
	/*
	 * 
	 */
	$available$$I: function () {
		return this.stream.$available$$I();
	},
	/*
	 * public void mark(int readlimit)
	 */
	$mark$I$V: function (n) {
		this.stream.$mark$I$V(n);
	},
	/*
	 * 
	 */
	$close$$V: function () {
		if (this.stream.$close$$V) this.stream.$close$$V();
		this.closed = true;
	},
	/*
	 * public boolean markSupported()
	 */
	$markSupported$$Z: function () {
		return this.stream.$markSupported$$Z();
	},
	/*
	 * public void mark(int readlimit)
	 */
	$read$$I: function () {
		return this.stream.$read$$I();
	},
	/*
	 * 
	 */
	$read$_B$I: function (buffer) {
		if (this.stream.$read$_B$I) return this.stream.$read$_B$I(buffer);
		return this.$read$_BII$I(buffer, 0, buffer.length);
	},
	/*
	 * 
	 */
	$read$_BII$I: function (buffer, offset, length) {
		if (this.stream.$read$_BII$I) return this.stream.$read$_BII$I(buffer, offset, length);
		for (var i = 0; i < length; i++) {
			var value = this.$read$$I();
			if (value != -1) {
				if (value >= 128) {
					value -= 256;
				}
				buffer[offset + i] = value;
			} else {
				return i;
			}
		}
		return length;
	},
	/*
	 * 
	 */
	$readBoolean$$Z: function () {
		var byte = this.stream.$read$$I();
		if (byte == 0) {
			return 0;
		}
		if (byte > 0) {
			return 1;
		}
		if (byte < 0) {
			throw new javaRoot.$java.$io.$EOFException();
		}
	},
	/*
	 * 
	 */
	$readByte$$B: function () {
		if (this.stream.$readByte$$B) return this.stream.$readByte$$B();
		var value = this.stream.$read$$I();
		if (value == -1) {
			throw new javaRoot.$java.$io.$EOFException();
		}
		if (value >= 128) {
			value -= 256;
		}
		return value;
	},
	/*
	 * 
	 */
	$readChar$$C: function () {
		return this.$readUnsignedShort$$I();
	},
	/*
	 * 
	 */
	$readDouble$$D: function () {
		if (this.stream.$readDouble$$D) return this.stream.$readDouble$$D();
		var hiData = this.readUnsignedInt();
		var loData = this.readUnsignedInt();
		return js2me.dataToDouble(hiData, loData);
	},
	/*
	 * 
	 */
	$readFloat$$F: function () {
		if (this.stream.$readFloat$$F) return this.stream.$readFloat$$F();
		var data = this.readUnsignedInt();
		return js2me.dataToFloat(data);
	},
	/*
	 * 
	 */
	$readFully$_B$V: function (buffer) {
		if (buffer == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		this.$readFully$_BII$V(buffer, 0, buffer.length);
	},
	/*
	 * 
	 */
	$readFully$_BII$V: function (buffer, offset, length) {
		if (this.stream.$readFully$_BII$V) return this.stream.$readFully$_BII$V(buffer, offset, length);
		if (buffer == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		if (offset + length > buffer.length) {
			length = buffer.length - offset;
		}
		if (this.stream.$read$_BII$I(buffer, offset, length) < length) {
			throw new javaRoot.$java.$io.$EOFException();
		}
	},
	/*
	 * 
	 */
	$readInt$$I: function () {
		if (this.stream.$readInt$$I) return this.stream.$readInt$$I();
		var value = 0;
		for (var i = 0; i < 4; i++) {
			value = value << 8;
			var byte = this.stream.$read$$I();
			if (byte == -1) {
				throw new javaRoot.$java.$io.$EOFException();
			} 
			value += byte;
		}
		if (value >= 0x80000000) {
			value -= 0x100000000;
		}
		return value;
	},
	/*
	 * 
	 */
	$readLong$$J: function () {
		if (this.stream.$readLong$$J) return this.stream.$readLong$$J();
		return {hi: this.readUnsignedInt(), lo: this.readUnsignedInt()};
	},
	/*
	 * 
	 */
	$readShort$$S: function () {
		if (this.stream.$readShort$$S) return this.stream.$readShort$$S();
		var a = this.stream.$read$$I() 
		var b = this.stream.$read$$I();
		if (a == -1 || b == -1) {
			throw new javaRoot.$java.$io.$EOFException();
		}
		var value = (a << 8) + b;
		if (value >= 0x8000) {
			value -= 0x10000;
		}
		return value;
	},
	readUnsignedInt: function () {
		var value = this.$readInt$$I();
		if (value < 0) {
			value += 0x100000000;
		}
		return value;
	},
	/*
	 * 
	 */
	$readUnsignedByte$$I: function () {
		if (this.stream.$readUnsignedByte$$I) return this.stream.$readUnsignedByte$$I();
		var value = this.stream.$read$$I();
		if (value == -1) {
			throw new javaRoot.$java.$io.$EOFException();
		}
		return value;
	},
	/*
	 * 
	 */
	$readUnsignedShort$$I: function () {
		if (this.stream.$readUnsignedShort$$I) return this.stream.$readUnsignedShort$$I();
		var a = this.stream.$read$$I();
		var b = this.stream.$read$$I();
		if (a == -1 || b == -1) {
			throw new javaRoot.$java.$io.$EOFException();
		}
		return (a << 8) + b;
	},
	/*
	 * 
	 */
	$readUTF$$Ljava_lang_String_: function () {
		if (this.stream.$readUTF$$Ljava_lang_String_) return this.stream.$readUTF$$Ljava_lang_String_();
		var length = this.$readUnsignedShort$$I();
		var buffer = [];
		if (this.stream.$read$_BII$I(buffer, 0, length) < length) {
			throw new javaRoot.$java.$io.$EOFException();
		}
		var result = js2me.UTF8ToString(buffer);
		if (result == null) {
			throw new javaRoot.$java.$io.$UTFDataFormatException();
		}
		return new javaRoot.$java.$lang.$String(result);
	},
	/*
	 * 
	 */
	$reset$$V: function () {
		this.stream.$reset$$V();
	},
	/*
	 * 
	 */
	$skip$J$J: function (n) {
		return this.stream.$skip$J$J(n);
	},
	/*
	 * 
	 */
	$skipBytes$I$I: function (n) {
		if (this.stream.$skipBytes$I$I) return this.stream.$skipBytes$I$I(n);
		return this.$skip$J$J({hi: 0, lo: n}).lo;
	},
	superClass: 'javaRoot.$java.$io.$InputStream',
	interfaces: ['javaRoot.$java.$io.$DataInput']
});

