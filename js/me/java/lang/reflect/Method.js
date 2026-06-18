js2me.createClass({
	construct: function (classObj, methodKey) {
		this.classObj = classObj;
		this.methodKey = methodKey;
	},
	$invoke$Ljava_lang_Object__arrayLjava_lang_Object_$Ljava_lang_Object_: function (obj, args) {
		var rawArgs = [];
		if (args && args.className) {
			for (var i = 0; i < args.length; i++) {
				rawArgs.push(args[i]);
			}
		} else if (args) {
			rawArgs = args;
		}
		var target = obj || this.classObj.prototype;
		var func = this.classObj.prototype[this.methodKey];
		return func.apply(target, rawArgs);
	},
	$getName$$Ljava_lang_String_: function () {
		var parts = this.methodKey.split('$');
		var name = parts[1] || "";
		return new javaRoot.$java.$lang.$String(name);
	},
	$getParameterTypes$$_Ljava_lang_Class_: function () {
		var arr = [];
		arr.className = '[Ljava.lang.Class;';
		return arr;
	}
});
