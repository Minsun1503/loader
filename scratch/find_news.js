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

const classes = ['scratch/MainObject.class', 'scratch/hso_ak.class', 'scratch/hso_bh.class'];

classes.forEach(cPath => {
    try {
        const classBytes = fs.readFileSync(cPath);
        const stream = new js2me.BufferStream(new Uint8Array(classBytes).buffer);
        const cls = js2me.convertClass(stream);
        
        for (let key in cls.prototype) {
            const item = cls.prototype[key];
            if (item && item.data) {
                const data = item.data;
                js2me.generateProgram(data);
                
                const bStream = new js2me.BufferStream(data.stream);
                while (!bStream.isEnd()) {
                    const op = bStream.readUint8();
                    if (op === 0xbb) { // new
                        const cpIdx = bStream.readUint16();
                        const cpItem = data.constantPool[cpIdx];
                        if (cpItem.className.includes('hso_ap')) {
                            console.log(`Method ${cls.prototype.className}.${key} calls: new hso_ap!`);
                        }
                    } else if (op === 0x12) {
                        bStream.readUint8();
                    } else if (op === 0x13 || op === 0x14 || op === 0xbd || op === 0xc0 || op === 0xc1 || op === 0xbb || op === 0xb6 || op === 0xb7 || op === 0xb8 || op === 0xb9 || op === 0xc5) {
                        bStream.readUint16();
                    } else if (op === 0x9f || op === 0xa0 || op === 0xa1 || op === 0xa2 || op === 0xa3 || op === 0xa4 || op === 0x99 || op === 0x9a || op === 0x9b || op === 0x9c || op === 0x9d || op === 0x9e || op === 0xc6 || op === 0xc7 || op === 0xa7 || op === 0xa8 || op === 0x11 || op === 0x84 || op === 0x18 || op === 0x19 || op === 0x37 || op === 0x39 || op === 0x3a || op === 0x15 || op === 0x16 || op === 0x17 || op === 0x36 || op === 0x38) {
                        bStream.readUint16();
                    } else if (op === 0x10 || op === 0xbc) {
                        bStream.readUint8();
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
});
