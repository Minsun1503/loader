js2me.createClass({
	construct: function (value) {
		this.value = value;
	},
	/*
	 * public Long(long value)
	 */
	_init$J$V: function (value) {
		this.value = value;
	},
	/*
	 * public long longValue()
	 */
	$longValue$$J: function () {
		return this.value;
	},
	/*
	 * public int intValue()
	 */
	$intValue$$I: function () {
		return this.value.lo;
	},
	/*
	 * public double doubleValue()
	 */
	$doubleValue$$D: function () {
		var isNegative = this.value.hi >= 0x80000000;
		var val;
		if (isNegative) {
			var neg = js2me.lneg(this.value);
			val = -(neg.hi * 0x100000000 + neg.lo);
		} else {
			val = this.value.hi * 0x100000000 + this.value.lo;
		}
		return {double: val};
	},
	/*
	 * public float floatValue()
	 */
	$floatValue$$F: function () {
		var isNegative = this.value.hi >= 0x80000000;
		var val;
		if (isNegative) {
			var neg = js2me.lneg(this.value);
			val = -(neg.hi * 0x100000000 + neg.lo);
		} else {
			val = this.value.hi * 0x100000000 + this.value.lo;
		}
		return val;
	},
	/*
	 * public boolean equals(Object obj)
	 */
	$equals$Ljava_lang_Object_$Z: function (obj) {
		if (obj != null && obj.value != null && obj.value.hi === this.value.hi && obj.value.lo === this.value.lo) {
			return 1;
		} else {
			return 0;
		}
	},
	/*
	 * public int hashCode()
	 */
	$hashCode$$I: function () {
		return this.value.hi ^ this.value.lo;
	},
	/*
	 * public static long parseLong(String s) throws NumberFormatException
	 */
	$parseLong$Ljava_lang_String_$J: function (str) {
		return javaRoot.$java.$lang.$Long.prototype.$parseLong$Ljava_lang_String_I$J(str, 10);
	},
	/*
	 * public static long parseLong(String s, int radix) throws NumberFormatException
	 */
	$parseLong$Ljava_lang_String_I$J: function (str, radix) {
		if (str == null || radix < 2 || radix > 36 || (str != null && str.text == '')) {
			throw new javaRoot.$java.$lang.$NumberFormatException();
		}
		var text = str.text.trim();
		var isNegative = false;
		if (text.startsWith('-')) {
			isNegative = true;
			text = text.substring(1);
		} else if (text.startsWith('+')) {
			text = text.substring(1);
		}
		if (text.length === 0) {
			throw new javaRoot.$java.$lang.$NumberFormatException();
		}
		var val = 0n;
		var radixBig = BigInt(radix);
		for (var i = 0; i < text.length; i++) {
			var code = text.charCodeAt(i);
			var digit;
			if (code >= 48 && code <= 57) { // 0-9
				digit = code - 48;
			} else if (code >= 97 && code <= 122) { // a-z
				digit = code - 97 + 10;
			} else if (code >= 65 && code <= 90) { // A-Z
				digit = code - 65 + 10;
			} else {
				throw new javaRoot.$java.$lang.$NumberFormatException();
			}
			if (digit >= radix) {
				throw new javaRoot.$java.$lang.$NumberFormatException();
			}
			val = val * radixBig + BigInt(digit);
		}
		if (isNegative) {
			val = -val;
		}
		var minLong = -9223372036854775808n;
		var maxLong = 9223372036854775807n;
		if (val < minLong || val > maxLong) {
			throw new javaRoot.$java.$lang.$NumberFormatException();
		}
		var hi = Number((val >> 32n) & 0xffffffffn);
		var lo = Number(val & 0xffffffffn);
		if (hi < 0) hi += 0x100000000;
		if (lo < 0) lo += 0x100000000;
		return {hi: hi, lo: lo};
	},
	/*
	 * public static Long valueOf(long l)
	 */
	$valueOf$J$Ljava_lang_Long_: function (value) {
		return new javaRoot.$java.$lang.$Long(value);
	},
	/*
	 * public static Long valueOf(String s) throws NumberFormatException
	 */
	$valueOf$Ljava_lang_String_$Ljava_lang_Long_: function (str) {
		var value = javaRoot.$java.$lang.$Long.prototype.$parseLong$Ljava_lang_String_$J(str);
		return new javaRoot.$java.$lang.$Long(value);
	},
	/*
	 * public static Long valueOf(String s, int radix) throws NumberFormatException
	 */
	$valueOf$Ljava_lang_String_I$Ljava_lang_Long_: function (str, radix) {
		var value = javaRoot.$java.$lang.$Long.prototype.$parseLong$Ljava_lang_String_I$J(str, radix);
		return new javaRoot.$java.$lang.$Long(value);
	},
	/*
	 * public static String toString(long i)
	 */
	$toString$J$Ljava_lang_String_: function (i) {
		return new javaRoot.$java.$lang.$String(js2me.UTF8ToString(js2me.longToString(i)));
	},
	/*
	 * public String toString()
	 */
	$toString$$Ljava_lang_String_: function () {
		return javaRoot.$java.$lang.$Long.prototype.$toString$J$Ljava_lang_String_(this.value);
	}
});
