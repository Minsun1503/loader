const fs = require('fs');
global.window = {
    javaRoot: {
        $java: {
            $lang: {
                $String: function(val) { this.value = val; }
            }
        }
    }
};
global.javaRoot = global.window.javaRoot;
global.js2me = { JAVA_ROOT: 'javaRoot', lastFieldId: 1, usedMethods: {} , usedByteCodes: {} };
global.localStorage = { getItem: () => null, setItem: () => {} };

require('../js/utils.js');
require('../js/bufferStream.js');
require('../js/methodStub.js');
require('../js/convert.js');
require('../js/program.js');

try {
    const classBytes = fs.readFileSync('scratch/hso_ap.class');
    const stream = new js2me.BufferStream(new Uint8Array(classBytes).buffer);
    const cls = js2me.convertClass(stream);
    
    const data = cls.prototype['_init$$V'].data;
    js2me.generateProgram(data);
    
    console.log('--- COMPILED JS OF putfield (JS Index 6) ---');
    console.log(data.content[6].toString());
    
} catch (e) {
    console.error(e);
}
