js2me.createClass({
	construct: function (className) {
		if (className == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		this.classObj = js2me.findClass(className);
		if (this.classObj == null) {
			throw new javaRoot.$java.$lang.$ClassNotFoundException();
		}
	},
	/*
	 * 
	 */
	$forName$Ljava_lang_String_$Ljava_lang_Class_: function (name) {
		var innerName = ('javaRoot.' + name.text).replace(/\./g, '.$');
		return new javaRoot.$java.$lang.$Class(innerName);
	},
	/*
	 * public InputStream getResourceAsStream(String name)
	 */
	$getResourceAsStream$Ljava_lang_String_$Ljava_io_InputStream_: function (name) {
		var resourceName = name.text;
		if (resourceName.charAt(0) == '/') {
			resourceName = resourceName.substr(1);
		}
		var resource = js2me.resources[resourceName];
		if (resource == null) {
			if (resourceName.endsWith('.img')) {
				resource = js2me.resources[resourceName.substring(0, resourceName.length - 4) + '.png'];
			} else if (resourceName.endsWith('.png')) {
				resource = js2me.resources[resourceName.substring(0, resourceName.length - 4) + '.img'];
			}
		}
		if (resource == null && js2me.filenameMap) {
			var mapped = js2me.filenameMap[resourceName];
			if (mapped) {
				resource = js2me.resources[mapped];
			}
		}
		if (resource == null) {
			console.warn('Resource NOT found: ' + resourceName + ' — returning empty stream');
			var emptyArray = new Uint8Array(0);
			var stream = new js2me.BufferStream(emptyArray);
			return new javaRoot.$java.$io.$BufferStream(stream);
		}
		var stream = new js2me.BufferStream(resource);
		return new javaRoot.$java.$io.$BufferStream(stream);
	},
	/*
	 * public String getName()
	 */
	$getName$$Ljava_lang_String_: function () {
		var className = this.classObj.prototype.className.replace(/\$/g, '').replace('javaRoot.', '');
		return new javaRoot.$java.$lang.$String(className);
	},
	/*
	 * public boolean isArray()
	 */
	$isArray$$Z: function () {
		if (this.className.indexOf('[') != -1) {
			return 1;
		} else {
			return 0;
		}
	},
	/*
	 * public boolean isAssignableFrom(Class cls)
	 */
	$isAssignableFrom$Ljava_lang_Class_$Z: function (cls) {
		if (cls.classObj.prototype.isImplement(this.classObj.prototype.className)) {
			return 1;
		} else {
			return 0;
		}
	},
	/*
	 * public boolean isInstance(Object obj)
	 */
	$isInstance$Ljava_lang_Object_$Z: function (obj) {
		if (obj.isImplement(this.classObj.prototype.className)) {
			return 1;
		} else {
			return 0;
		}
	},
	/*
	 * public boolean isInterface()
	 */
	$isInterface$$Z: function (obj) {
		if (this.classObj.prototype.type == 'interface') {
			return 1;
		} else {
			return 0;
		}
	},
	/*
	 * 
	 */
	$getMethod$Ljava_lang_String__Ljava_lang_Class_$Ljava_lang_reflect_Method_: function (name, parameterTypes) {
		var methodName = name.text;
		var prefix = '$' + methodName + '$';
		for (var key in this.classObj.prototype) {
			if (key.indexOf(prefix) === 0) {
				return new javaRoot.$java.$lang.$reflect.$Method(this.classObj, key);
			}
		}
		throw new javaRoot.$java.$lang.$NoSuchMethodException(methodName);
	},
	/*
	 * 
	 */
	$getField$Ljava_lang_String_$Ljava_lang_reflect_Field_: function (name) {
		var fieldName = name.text;
		var prefix = '$' + fieldName;
		for (var key in this.classObj.prototype) {
			if (key.indexOf(prefix) === 0 && typeof this.classObj.prototype[key] === 'number') {
				var fieldId = this.classObj.prototype[key];
				return new javaRoot.$java.$lang.$reflect.$Field(this.classObj, fieldId);
			}
		}
		throw new javaRoot.$java.$lang.$NoSuchFieldException(fieldName);
	},
	/*
	 * 
	 */
	$newInstance$$Ljava_lang_Object_: function () {
		var obj = new this.classObj();
		obj._init$$V();
		return obj;
	},
	/*
	 * public String toString()
	 */
	$toString$$Ljava_lang_String_: function () {
		var text = 'class ' + this.$getName$$Ljava_lang_String_().text;
		return new javaRoot.$java.$lang.$String(text);
	},
	$getClassLoader$$Ljava_lang_ClassLoader_: function () {
		return null;
	},
	$getMethods$$_Ljava_lang_reflect_Method_: function () {
		var methods = [];
		for (var key in this.classObj.prototype) {
			if (key.indexOf('$') === 0 && typeof this.classObj.prototype[key] === 'function') {
				methods.push(new javaRoot.$java.$lang.$reflect.$Method(this.classObj, key));
			}
		}
		var jArray = methods;
		jArray.className = '[Ljava.lang.reflect.Method;';
		return jArray;
	}
});
