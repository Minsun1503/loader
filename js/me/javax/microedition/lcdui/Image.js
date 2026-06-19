js2me.createClass({
	/*
	 * public static Image createImage(InputStream stream)
	 */
	$createImage$Ljava_io_InputStream_$Ljavax_microedition_lcdui_Image_: js2me.markUnsafe(function (stream) {
		console.error("WARNING: createImage(InputStream) is called! This might consume the whole stream incorrectly!");
		if (stream == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		var data = [];
		var byte;
		while ((byte = stream.$read$$I()) != -1) {
			if (byte >= 128) {
				byte -= 256;
			}
			data.push(byte);
		}
		return this.$createImage$_BII$Ljavax_microedition_lcdui_Image_(data, 0, data.length);
	}),
	/*
	 * public static Image createImage(int width, int height)
	 */
	$createImage$II$Ljavax_microedition_lcdui_Image_: function (width, height) {
		var image = new javaRoot.$javax.$microedition.$lcdui.$Image();
		image.element = document.createElement('canvas');
		image.element.width = width;
		image.element.height = height;
		image.mutable = true;
		return image;
	},
	/*
	 * public static Image createImage(int width, int height)
	 */
	$createImage$Ljava_lang_String_$Ljavax_microedition_lcdui_Image_: js2me.markUnsafe(function (name) {
		if (name == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		var input = javaRoot.$java.$lang.$Class.prototype.$getResourceAsStream$Ljava_lang_String_$Ljava_io_InputStream_(name);
		if (input == null) {
			console.warn('Resource not found: ' + name + ' — returning 1x1 placeholder');
			return javaRoot.$javax.$microedition.$lcdui.$Image.prototype.$createImage$II$Ljavax_microedition_lcdui_Image_(1, 1);
		}
		var bytes = input.stream.array || input.stream;
		if (!bytes || bytes.length === 0) {
			console.warn('Resource ' + name + ' has empty data — returning 1x1 placeholder');
			return javaRoot.$javax.$microedition.$lcdui.$Image.prototype.$createImage$II$Ljavax_microedition_lcdui_Image_(1, 1);
		}
		var data = new Int8Array(bytes);
		return javaRoot.$javax.$microedition.$lcdui.$Image.prototype.$createImage$_BII$Ljavax_microedition_lcdui_Image_(data, 0, data.length);
	}),
	/*
	 * public static Image createImage(int width, int height)
	 */
	$createImage$Ljavax_microedition_lcdui_Image_$Ljavax_microedition_lcdui_Image_: function (source) {
		if (source == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		var image = javaRoot.$javax.$microedition.$lcdui.$Image.prototype.$createImage$II$Ljavax_microedition_lcdui_Image_(source.$getWidth$$I(), source.$getHeight$$I());
		var graphics = image.$getGraphics$$Ljavax_microedition_lcdui_Graphics_();
		graphics.$drawImage$Ljavax_microedition_lcdui_Image_III$V(source, 0, 0, 0);
		image.mutable = false;
		return image;
	},
	/*
	 * public static Image createImage(int width, int height)
	 */
	$createImage$Ljavax_microedition_lcdui_Image_IIIII$Ljavax_microedition_lcdui_Image_: function (source, x, y, width, height, transform) {
		var image = javaRoot.$javax.$microedition.$lcdui.$Image.prototype.$createImage$II$Ljavax_microedition_lcdui_Image_(width, height);
		var graphics = image.$getGraphics$$Ljavax_microedition_lcdui_Graphics_();
		graphics.$drawRegion$Ljavax_microedition_lcdui_Image_IIIIIIII$V(source, x, y, width, height, transform, 0, 0, 0);
		image.mutable = false;
		return image;
	},
	/*
	 * public static Image createImage(int width, int height)
	 */
	$createImage$_BII$Ljavax_microedition_lcdui_Image_: js2me.markUnsafe(function (data, offset, length) {
		if (data == null) {
			throw new javaRoot.$java.$lang.$NullPointerException();
		}
		if (length < 0 || offset >= data.length || offset + length > data.length) {
			throw new javaRoot.$java.$lang.$ArrayIndexOutOfBoundsException();
		}

		var xorHeader = [-118, 83, 77, 68, 14, 9, 25, 9];
		var isXoredBy3 = true;
		if (length >= 8) {
			for (var j = 0; j < 8; j++) {
				if (data[offset + j] != xorHeader[j]) {
					isXoredBy3 = false;
					break;
				}
			}
		} else {
			isXoredBy3 = false;
		}

		if (isXoredBy3) {
			console.log("Detected unnecessarily XORed PNG. Restoring original bytes...");
			for (var i = 0; i < length; i++) {
				data[offset + i] ^= 3;
			}
		}

		var headers = {
			'image/png': [-119, 80, 78, 71, 13, 10, 26, 10]
		};
		var mime = null;
		if (length < 1000) {
			// console.log('createImage bytes: ' + Array.from(data.slice(offset, offset + 10)));
		}
		for (var i in headers) {
			var good = true;
			for (var j = 0; j < headers[i].length; j++) {
				if (data[offset + j] != headers[i][j]) {
					good = false;
				}
			}
			if (good) {
				mime = i;
			}
		}
		if (mime == null) {
			throw new Error('Unsupported image format');
		}
		var image = new javaRoot.$javax.$microedition.$lcdui.$Image.prototype.$createImage$II$Ljavax_microedition_lcdui_Image_(100, 100);
		var imageElement = new Image();
		imageElement.onload = function () {
			image.element.width = imageElement.width;
			image.element.height = imageElement.height;
			image.element.getContext('2d').drawImage(imageElement, 0, 0);
			js2me.restoreThread(threadId);
		};
		var isError = false;
		imageElement.onerror = function () {
			console.error('Image load failed! size: ' + length + ' bytes. header: ' + Array.from(data.slice(offset, offset + 10)));
			isError = true;
			js2me.restoreThread(threadId);
		};
		var url = js2me.bytesToDataURI(data, offset, length, mime);
		imageElement.src = url;
		js2me.suspendThread = true;
		var threadId = js2me.currentThread;
		js2me.restoreStack[threadId] = [function () {
			if (isError) {
				console.warn('Cannot load image, throwing IOException');
				throw new javaRoot.$java.$io.$IOException('Cannot decode image data');
			}
			return image;
		}];
		image.mutable = false;
		return image;
	}),
	/*
	 * public static Image createRGBImage(int[] rgb, int width, int height, boolean processAlpha)
	 */
	$createRGBImage$_IIIZ$Ljavax_microedition_lcdui_Image_: function (rgb, width, height, alphaProcessing) {
		var image = this.$createImage$II$Ljavax_microedition_lcdui_Image_(width, height);
		var context = image.element.getContext('2d');
		var imageData = context.getImageData(0, 0, width, height);
		for (var i = 0; i < width * height; i++) {
			var value = rgb[i];
			if (value < 0) {
				value += 0x100000000;
			}
			var blue = value % 256;
			value = Math.floor(value / 256);
			var green = value % 256;
			value = Math.floor(value / 256);
			var red = value % 256;
			value = Math.floor(value / 256);
			var alpha = value % 256;
			imageData.data[i * 4] = red;
			imageData.data[i * 4 + 1] = green;
			imageData.data[i * 4 + 2] = blue;
			if (alphaProcessing) {
				imageData.data[i * 4 + 3] = alpha;
			} else {
				imageData.data[i * 4 + 3] = 255;
			}
		}
		context.putImageData(imageData, 0, 0);
		image.mutable = false;
		return image;
	},
	/*
	 * public Graphics getGraphics()
	 */
	$getGraphics$$Ljavax_microedition_lcdui_Graphics_: function () {
		if (!this.element) {
			return new javaRoot.$javax.$microedition.$lcdui.$Graphics(document.createElement('canvas')); // return dummy graphics
		}
		return new javaRoot.$javax.$microedition.$lcdui.$Graphics(this.element);
	},
	/*
	 * public int getWidth()
	 */
	$getWidth$$I: function () {
		return this.element ? this.element.width : 0;
	},
	/*
	 * public int getHeight()
	 */
	$getHeight$$I: function () {
		return this.element ? this.element.height : 0;
	},
	/*
	 * public boolean isMutable()
	 */
	$isMutable$$Z: function () {
		if (this.mutable) {
			return 1;
		} else {
			return 0;
		}
	},
	/*
	 * public void getRGB(int[] rgbData, int offset, int scanlength, int x, int y, int width, int height)
	 */
	$getRGB$_IIIIIII$V: function (rgbData, offset, scanlength, x, y, width, height) {
		if (!this.element) return;
		var context = this.element.getContext('2d');
		var imageData = context.getImageData(x, y, width, height);
		var data = imageData.data;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var index = (i * width + j) * 4;
				var a = data[index + 3];
				var r = data[index];
				var g = data[index + 1];
				var b = data[index + 2];
				var pixel = (a << 24) | (r << 16) | (g << 8) | b;
				rgbData[offset + i * scanlength + j] = pixel;
			}
		}
	}
});
