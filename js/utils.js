/**
 * Converts given array into string.
 * @param {array} array Array of bytes which is correct UTF8 content.
 */
js2me.UTF8ToString = function (sourceArray, offset, length) {
	if (offset == null) {
		offset = 0;
	}
	var i = 0;
	if (length == null) {
		length = sourceArray.length;
	}
	var array = [];
	for (var j = 0; j < length; j++) {
		var code = sourceArray[offset + j];
		if (code < 0) {
			code += 256;
		}
		array[j] = code;
	}
	var result = '';
	while(i < length) {
		if (array[i] < 0x80) {
			var code = array[i];
			i++;
		} else if ((array[i] & 0xE0) == 0xC0) {
			var code = ((array[i] & 0x1F) << 6) | (array[i + 1] & 0x3F);
			i += 2;
		} else if ((array[i] & 0xF0) == 0xE0) {
			var code = (((array[i] & 0x0F) << 12) | ((array[i + 1] & 0x3F) << 6) | (array[i + 2] & 0x3F));
			i += 3;
		} else {
			return null;
		}
		
		var char = String.fromCharCode(code);
		if (char != '') {
			result += char;
		} else {
			return null;
		}
	}
	return result;
};
js2me.stringToUTF8 = function (text) {
	var result = [];
	for (var i = 0; i < text.length; i++) {
		var char = text.charCodeAt(i);
		if (char >= 0x01 && char <= 0x007F) {
			result.push(char);
		}
		if (char == 0 || (char >= 0x0080 && char <= 0x07FF)) {
			result.push(0xC0 | (0x1F & (char >> 6)));
			result.push(0x80 | (0x3F & char));
		}
		if (char >= 0x0800 && char <= 0xFFFF) {
			result.push(0xE0 | (0x0F & (char >> 12)));
			result.push(0x80 | (0x3F & (char >>  6)));
			result.push(0x80 | (0x3F & char));
		}
	}
	return result;
};
js2me.bytesToDataURI = function (bytes, offset, length, mime) {
	var uint8;
	if (bytes instanceof Uint8Array) {
		uint8 = bytes.subarray(offset, offset + length);
	} else if (bytes instanceof Int8Array) {
		uint8 = new Uint8Array(bytes.buffer, bytes.byteOffset + offset, length);
	} else {
		uint8 = new Uint8Array(length);
		for (var i = 0; i < length; i++) {
			var val = bytes[offset + i];
			uint8[i] = val < 0 ? val + 256 : val;
		}
	}
	var binString = '';
	for (var i = 0; i < uint8.length; i++) {
		binString += String.fromCharCode(uint8[i]);
	}
	return 'data:' + mime + ';base64,' + btoa(binString);
};

js2me.markUnsafe = function (func) {
	func.isUnsafe = true;
	return func;
};
