js2me.createClass({
	construct: function (ws) {
		this.ws = ws;
		this._msgCount = 0;
		this._byteCount = 0;
		if (ws.readIndex == null) {
			ws.readIndex = 0;
		}
		this.buffer = ws.preBuffer || [];
		ws.preBuffer = this.buffer; // Liên kết lại để mảng tự động nhận data mới
		this.closed = false;
		this.waitingThreadId = null;
		this.waitingBytes = 0;

		var self = this;
		this.ws.addEventListener('message', function (event) {
			var data = new Uint8Array(event.data);
			self._msgCount++;
			self._byteCount += data.length;
			console.log('[SOCKET_IN_DATA] msg #' + self._msgCount + ' received ' + data.length + ' bytes (total=' + self._byteCount + ', bufSize=' + (self.buffer.length - self.ws.readIndex) + ')');
			if (self.waitingThreadId != null && (self.buffer.length - self.ws.readIndex) >= self.waitingBytes) {
				var threadId = self.waitingThreadId;
				self.waitingThreadId = null;
				console.log('[SOCKET_IN_DATA] msg #' + self._msgCount + ' triggers RESUME thread ' + threadId);
				js2me.restoreThread(threadId);
			}
		});
		this.ws.addEventListener('close', function () {
			console.log('[SOCKET_IN_DATA] WS close event fired, closed=' + self.closed + ', waitThread=' + self.waitingThreadId + ', buf=' + (self.buffer.length - self.ws.readIndex) + '/' + self.waitingBytes);
			self.closed = true;
			if (self.waitingThreadId != null) {
				var threadId = self.waitingThreadId;
				self.waitingThreadId = null;
				console.log('[SOCKET_IN_DATA] WS close RESUMES thread ' + threadId);
				js2me.restoreThread(threadId);
			}
		});
	},

	_readByte: function () {
		if (this.ws.readIndex >= this.buffer.length) {
			return null;
		}
		var val = this.buffer[this.ws.readIndex++];
		if (this.ws.readIndex > 10000) {
			this.buffer.splice(0, this.ws.readIndex);
			this.ws.readIndex = 0;
		}
		return val;
	},

	_suspendUntil: function (bytesNeeded, callback) {
		var avail = this.buffer.length - this.ws.readIndex;
		if (avail >= bytesNeeded) {
			return callback();
		}
		if (this.closed) {
			console.log('[SOCKET_IN_DATA] throw EOF (closed=true, need=' + bytesNeeded + ', avail=' + avail + ')');
			throw new javaRoot.$java.$io.$EOFException('Socket closed');
		}

		// Flush pending output data before blocking on read
		if (this.ws._flushOutput) {
			this.ws._flushOutput();
		}

		console.log('[SOCKET_IN_DATA] BLOCK: need=' + bytesNeeded + ' bytes, avail=' + avail + ', thread=' + js2me.currentThread);
		js2me.suspendThread = true;
		var threadId = js2me.currentThread;
		this.waitingThreadId = threadId;
		this.waitingBytes = bytesNeeded;

		var self = this;
		js2me.restoreStack[threadId] = [function () {
			var availNow = self.buffer.length - self.ws.readIndex;
			console.log('[SOCKET_IN_DATA] RESUME: need=' + bytesNeeded + ', avail=' + availNow + ', closed=' + self.closed);
			if (availNow >= bytesNeeded) {
				return callback();
			} else if (self.closed) {
				console.log('[SOCKET_IN_DATA] RESUME throws EOF (avail=' + availNow + ' < need=' + bytesNeeded + ')');
				throw new javaRoot.$java.$io.$EOFException('Socket closed');
			}
			throw new javaRoot.$java.$io.$IOException('Unknown error in socket suspend');
		}];
	},

	$read$$I: function () {
		return this._suspendUntil(1, () => {
			return this._readByte();
		});
	},

	$read$_B$I: function (buffer) {
		return this.$read$_BII$I(buffer, 0, buffer.length);
	},

	$read$_BII$I: function (buffer, offset, length) {
		return this._suspendUntil(1, () => {
			var available = this.buffer.length - this.ws.readIndex;
			var toRead = Math.min(length, available);
			for (var i = 0; i < toRead; i++) {
				var val = this._readByte();
				buffer[offset + i] = (val >= 128) ? val - 256 : val;
			}
			return toRead;
		});
	},

	$readByte$$B: function () {
		return this._suspendUntil(1, () => {
			var value = this._readByte();
			return (value >= 128) ? value - 256 : value;
		});
	},

	$readUnsignedByte$$I: function () {
		return this._suspendUntil(1, () => {
			return this._readByte();
		});
	},

	$readShort$$S: function () {
		return this._suspendUntil(2, () => {
			var a = this._readByte();
			var b = this._readByte();
			var value = (a << 8) + b;
			if (value >= 0x8000) value -= 0x10000;
			return value;
		});
	},

	$readUnsignedShort$$I: function () {
		return this._suspendUntil(2, () => {
			var a = this._readByte();
			var b = this._readByte();
			return (a << 8) + b;
		});
	},

	$readInt$$I: function () {
		return this._suspendUntil(4, () => {
			var value = 0;
			for (var i = 0; i < 4; i++) {
				value = (value << 8) + this._readByte();
			}
			if (value >= 0x80000000) value -= 0x100000000;
			return value;
		});
	},

	$readLong$$J: function () {
		return this._suspendUntil(8, () => {
			var hi = 0;
			for (var i = 0; i < 4; i++) {
				hi = (hi << 8) + this._readByte();
			}
			if (hi >= 0x80000000) hi -= 0x100000000;
			if (hi < 0) hi += 0x100000000;

			var lo = 0;
			for (var i = 0; i < 4; i++) {
				lo = (lo << 8) + this._readByte();
			}
			if (lo >= 0x80000000) lo -= 0x100000000;
			if (lo < 0) lo += 0x100000000;

			return { hi: hi, lo: lo };
		});
	},

	$readFloat$$F: function () {
		return this._suspendUntil(4, () => {
			var value = 0;
			for (var i = 0; i < 4; i++) {
				value = (value << 8) + this._readByte();
			}
			if (value < 0) value += 0x100000000;
			return js2me.dataToFloat(value);
		});
	},

	$readDouble$$D: function () {
		return this._suspendUntil(8, () => {
			var hi = 0;
			for (var i = 0; i < 4; i++) {
				hi = (hi << 8) + this._readByte();
			}
			if (hi < 0) hi += 0x100000000;

			var lo = 0;
			for (var i = 0; i < 4; i++) {
				lo = (lo << 8) + this._readByte();
			}
			if (lo < 0) lo += 0x100000000;

			return js2me.dataToDouble(hi, lo);
		});
	},

	$readBoolean$$Z: function () {
		return this._suspendUntil(1, () => {
			return this._readByte() > 0 ? 1 : 0;
		});
	},

	$readFully$_B$V: function (buffer) {
		this.$readFully$_BII$V(buffer, 0, buffer.length);
	},

	$readFully$_BII$V: function (buffer, offset, length) {
		return this._suspendUntil(length, () => {
			for (var i = 0; i < length; i++) {
				var val = this._readByte();
				buffer[offset + i] = (val >= 128) ? val - 256 : val;
			}
		});
	},

	$readUTF$$Ljava_lang_String_: function () {
		return this._suspendUntil(2, () => {
			var a = this.buffer[this.ws.readIndex];
			var b = this.buffer[this.ws.readIndex + 1];
			var length = (a << 8) + b;

			return this._suspendUntil(length + 2, () => {
				this._readByte(); // consume a
				this._readByte(); // consume b
				var utfBytes = [];
				for (var i = 0; i < length; i++) {
					utfBytes.push(this._readByte());
				}
				var result = js2me.UTF8ToString(utfBytes);
				if (result == null) throw new javaRoot.$java.$io.$UTFDataFormatException();
				return new javaRoot.$java.$lang.$String(result);
			});
		});
	},

	$available$$I: function () {
		return this.buffer.length - this.ws.readIndex;
	},

	$close$$V: function () {
		this.closed = true;
		this.ws.close();
	},

	$skip$J$J: function (n) {
		var bytesToSkip = n.lo;
		if (n.hi >= 0x80000000 || bytesToSkip <= 0) {
			return { hi: 0, lo: 0 };
		}
		return this._suspendUntil(bytesToSkip, () => {
			for (var i = 0; i < bytesToSkip; i++) {
				this._readByte();
			}
			return { hi: 0, lo: bytesToSkip };
		});
	},

	$skipBytes$I$I: function (n) {
		if (n <= 0) {
			return 0;
		}
		return this._suspendUntil(n, () => {
			for (var i = 0; i < n; i++) {
				this._readByte();
			}
			return n;
		});
	},

	superClass: 'javaRoot.$java.$io.$InputStream',
	interfaces: ['javaRoot.$java.$io.$DataInput']
});
