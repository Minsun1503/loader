js2me.createClass({
	construct: function (array) {
		this.array = array;
		this.index = 0;
	},
	$hasNext$$Z: function () {
		if (this.index < this.array.length) {
			return 1;
		} else {
			return 0;
		}
	},
	$next$$Ljava_lang_Object_: function () {
		if (this.index >= this.array.length) {
			throw new javaRoot.$java.$util.$NoSuchElementException();
		}
		return this.array[this.index++];
	},
	$remove$$V: function () {
		if (this.index <= 0) {
			throw new javaRoot.$java.$lang.$IllegalStateException();
		}
		this.array.splice(this.index - 1, 1);
		this.index--;
	},
	interfaces: ['javaRoot.$java.$util.$Iterator']
});
