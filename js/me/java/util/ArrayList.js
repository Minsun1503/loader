js2me.createClass({
	_init$$V: function () {
		this.array = [];
	},
	_init$I$V: function (capacity) {
		this.array = [];
	},
	_init$Ljava_util_Collection_$V: function (collection) {
		this.array = [];
		if (collection) {
			var it = collection.$iterator$$Ljava_util_Iterator_ ? collection.$iterator$$Ljava_util_Iterator_() : null;
			if (it) {
				while (it.$hasNext$$Z()) {
					this.array.push(it.$next$$Ljava_lang_Object_());
				}
			}
		}
	},
	$add$Ljava_lang_Object_$Z: function (obj) {
		this.array.push(obj);
		return 1;
	},
	$add$ILjava_lang_Object_$V: function (index, obj) {
		if (index < 0 || index > this.array.length) {
			throw new javaRoot.$java.$lang.$ArrayIndexOutOfBoundsException();
		}
		this.array.splice(index, 0, obj);
	},
	$addAll$Ljava_util_Collection_$Z: function (collection) {
		if (!collection) return 0;
		var changed = 0;
		var it = collection.$iterator$$Ljava_util_Iterator_ ? collection.$iterator$$Ljava_util_Iterator_() : null;
		if (it) {
			while (it.$hasNext$$Z()) {
				this.array.push(it.$next$$Ljava_lang_Object_());
				changed = 1;
			}
		}
		return changed;
	},
	$clear$$V: function () {
		this.array = [];
	},
	$contains$Ljava_lang_Object_$Z: function (obj) {
		for (var i = 0; i < this.array.length; i++) {
			if (this.array[i] == obj) {
				return 1;
			}
		}
		return 0;
	},
	$get$I$Ljava_lang_Object_: function (index) {
		if (index < 0 || index >= this.array.length) {
			throw new javaRoot.$java.$lang.$ArrayIndexOutOfBoundsException();
		}
		return this.array[index];
	},
	$indexOf$Ljava_lang_Object_$I: function (obj) {
		for (var i = 0; i < this.array.length; i++) {
			if (this.array[i] == obj) {
				return i;
			}
		}
		return -1;
	},
	$isEmpty$$Z: function () {
		if (this.array.length > 0) {
			return 0;
		} else {
			return 1;
		}
	},
	$iterator$$Ljava_util_Iterator_: function () {
		var it = new javaRoot.$java.$util.$ArrayIterator(this.array);
		return it;
	},
	$remove$I$Ljava_lang_Object_: function (index) {
		if (index < 0 || index >= this.array.length) {
			throw new javaRoot.$java.$lang.$ArrayIndexOutOfBoundsException();
		}
		var oldVal = this.array[index];
		this.array.splice(index, 1);
		return oldVal;
	},
	$remove$Ljava_lang_Object_$Z: function (obj) {
		var index = this.$indexOf$Ljava_lang_Object_$I(obj);
		if (index >= 0) {
			this.array.splice(index, 1);
			return 1;
		}
		return 0;
	},
	$set$ILjava_lang_Object_$Ljava_lang_Object_: function (index, obj) {
		if (index < 0 || index >= this.array.length) {
			throw new javaRoot.$java.$lang.$ArrayIndexOutOfBoundsException();
		}
		var oldVal = this.array[index];
		this.array[index] = obj;
		return oldVal;
	},
	$size$$I: function () {
		return this.array.length;
	},
	$toArray$$_Ljava_lang_Object_: function () {
		var arr = new Array(this.array.length);
		for (var i = 0; i < this.array.length; i++) {
			arr[i] = this.array[i];
		}
		return arr;
	},
	$toArray$_Ljava_lang_Object_$_Ljava_lang_Object_: function (a) {
		var size = this.array.length;
		if (a.length < size) {
			a = new Array(size);
		}
		for (var i = 0; i < size; i++) {
			a[i] = this.array[i];
		}
		if (a.length > size) {
			a[size] = null;
		}
		return a;
	},
	interfaces: ['javaRoot.$java.$util.$List']
});
