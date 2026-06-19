const fs = require('fs');
const js2me = { JAVA_ROOT: 'javaRoot', lastFieldId: 1, usedMethods: {} };
global.js2me = js2me;
global.localStorage = { getItem: () => null, setItem: () => {} };
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
require('../js/utils.js');
require('../js/bufferStream.js');
require('../js/methodStub.js');
require('../js/convert.js');

const classBytes = fs.readFileSync('scratch/MainObject.class');
const stream = new js2me.BufferStream(new Uint8Array(classBytes).buffer);
const cls = js2me.convertClass(stream);
const data = cls.prototype['$e$LmGraphics_I$V'].data;

// Opcode names mapping
const opcodes = {
    0x19: 'aload',
    0x2a: 'aload_0',
    0x2b: 'aload_1',
    0x2c: 'aload_2',
    0x2d: 'aload_3',
    0xb2: 'getstatic',
    0xb3: 'putstatic',
    0xb4: 'getfield',
    0xb5: 'putfield',
    0x32: 'aaload',
    0x2e: 'iaload',
    0xbc: 'newarray',
    0xbd: 'anewarray'
};

const bStream = new js2me.BufferStream(data.stream);
console.log('--- DETAILED BYTECODE DUMP (Offsets 50 to 75) ---');
while (!bStream.isEnd()) {
    const idx = bStream.index;
    const op = bStream.readUint8();
    const opName = opcodes[op] || 'op_0x' + op.toString(16);
    
    let info = '';
    if (op === 0xb4 || op === 0xb2 || op === 0xb5 || op === 0xb3) {
        const cpIdx = bStream.readUint16();
        const item = data.constantPool[cpIdx];
        info = `CP[${cpIdx}] -> ${item.className}.${item.name} (${JSON.stringify(item.type)})`;
    } else if (op === 0x19) {
        const localIdx = bStream.readUint8();
        info = `local_${localIdx}`;
    } else if (op === 0x12) {
        const cpIdx = bStream.readUint8();
        info = `CP[${cpIdx}] -> ${JSON.stringify(data.constantPool[cpIdx])}`;
    } else if (op === 0x13 || op === 0x14 || op === 0xbd || op === 0xc0 || op === 0xc1 || op === 0xbb || op === 0xb6 || op === 0xb7 || op === 0xb8 || op === 0xb9 || op === 0xc5) {
        const cpIdx = bStream.readUint16();
        info = `CP[${cpIdx}] -> ${JSON.stringify(data.constantPool[cpIdx])}`;
    } else if (op === 0x9f || op === 0xa0 || op === 0xa1 || op === 0xa2 || op === 0xa3 || op === 0xa4 || op === 0x99 || op === 0x9a || op === 0x9b || op === 0x9c || op === 0x9d || op === 0x9e || op === 0xc6 || op === 0xc7 || op === 0xa7 || op === 0xa8 || op === 0x11 || op === 0x84 || op === 0x18 || op === 0x19 || op === 0x37 || op === 0x39 || op === 0x3a || op === 0x15 || op === 0x16 || op === 0x17 || op === 0x36 || op === 0x38) {
        // Skip 2 bytes
        const b1 = bStream.readUint8();
        const b2 = bStream.readUint8();
        info = `args: ${b1}, ${b2}`;
    } else if (op === 0x10 || op === 0xbc) {
        const val = bStream.readUint8();
        info = `arg: ${val}`;
    }
    
    if (idx >= 50 && idx <= 75) {
        console.log(`Offset ${idx}: ${opName} ${info}`);
    }
}
