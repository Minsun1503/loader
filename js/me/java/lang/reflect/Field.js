js2me.createClass({
	construct: function (classObj, fieldId) {
		this.classObj = classObj;
		this.fieldId = fieldId;
	},
	$get$Ljava_lang_Object_$Ljava_lang_Object_: function (obj) {
		var target = obj || this.classObj.prototype;
		return target['$' + this.fieldId];
	},
	$getInt$Ljava_lang_Object_$I: function (obj) {
		return this.$get$Ljava_lang_Object_$Ljava_lang_Object_(obj);
	}
});
