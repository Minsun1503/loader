js2me.createClass({
	/*
	 * public Short(short value)
	 */
	_init$S$V: function (value) {
		this.value = value;
	},
	/*
	 * public int hashCode()
	 */
	$hashCode$$I: function () {
		return this.value;
	},
	$parseShort$Ljava_lang_String_$S: function(str) {
		return parseInt(str.text, 10);
	},
	$valueOf$S$Ljava_lang_Short_: function(s) {
		return new javaRoot.$java.$lang.$Short(s);
	},
	package: 'javaRoot.$java.$lang',
	name: '$Short'
});
