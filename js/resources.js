/**
 * Loads resources from given list of zip entries to local cache.
 * @param {array} entries Array of zip.Entry elements.
 * @param {function} callback Function to execute when all resources are loaded.
 */
js2me.loadResources = function (entries, callback) {
	var remain = entries.length;
	function finish() {
		remain--;
		if (remain == 0) {
			// After all resources loaded, apply filename aliases
			for (var alias in js2me.filenameMap) {
				var target = js2me.filenameMap[alias];
				if (js2me.resources[target] && !js2me.resources[alias]) {
					js2me.resources[alias] = js2me.resources[target];
				}
			}
			callback();
		}
	}
	var i = 0;
	function addResource(entry) {
		entry.getData(new zip.ArrayBufferWriter(), function (content) {
			document.getElementById('screen').innerHTML = 'Loading ' + entry.filename + ' (' + (i + 1) + '/' + entries.length + ')';
			js2me.resources[entry.filename] = new Uint8Array(content);
			finish();
			if (remain > 0) {
				setTimeout(function () {
					i++;
					addResource(entries[i]);
				}, 1);
			}
		});
	}
	js2me.resources = {};
	js2me.filenameMap = {
		'x1/interface/iconarena.png': 'x1/interface/arena_icn.png'
	};
	addResource(entries[i]);
};
