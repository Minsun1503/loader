const fs = require('fs');
const path = require('path');

// Stub browser globals
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
global.document = {
    createElement: () => ({})
};
global.navigator = {};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

// Define js2me
global.js2me = {
    JAVA_ROOT: 'javaRoot',
    usedMethods: {},
    usedByteCodes: {},
    lastFieldId: 1
};

// Load required js2me files
require('../js/utils.js');
require('../js/bufferStream.js');
require('../js/convert.js');
require('../js/methodStub.js');
require('../js/program.js');

function toArrayBuffer(buf) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

try {
    const classBytes = fs.readFileSync('scratch/hso_ay.class');
    const arrayBuffer = toArrayBuffer(classBytes);
    const stream = new js2me.BufferStream(arrayBuffer);
    
    // We need to capture the pool index read by getfield
    const getfieldIndexes = [];
    const originalReadUint16 = js2me.BufferStream.prototype.readUint16;
    
    const newClass = js2me.convertClass(stream);
    const methodName = '$a$$V';
    const methodStub = newClass.prototype[methodName];
    const data = methodStub.data;
    
    // Intercept constant pool reads in generators
    // Let's parse bytecode stream manually to get the constant pool index for each getfield/getstatic
    const bytecode = [];
    const bStream = new js2me.BufferStream(data.stream);
    while (!bStream.isEnd()) {
        const idx = bStream.index;
        const op = bStream.readUint8();
        if (op === 0xb4 || op === 0xb2 || op === 0xb5 || op === 0xb3) { // getfield, getstatic, putfield, putstatic
            const cpIdx = bStream.readUint16();
            bytecode[idx] = { op: op, cpIdx: cpIdx };
        } else if (op === 0x12) { // ldc
            bStream.readUint8();
        } else if (op === 0x13 || op === 0x14 || op === 0xbd || op === 0xc0 || op === 0xc1 || op === 0xbb || op === 0xb6 || op === 0xb7 || op === 0xb8 || op === 0xb9 || op === 0xc5) {
            bStream.readUint16();
        } else if (op === 0x9f || op === 0xa0 || op === 0xa1 || op === 0xa2 || op === 0xa3 || op === 0xa4 || op === 0x99 || op === 0x9a || op === 0x9b || op === 0x9c || op === 0x9d || op === 0x9e || op === 0xc6 || op === 0xc7 || op === 0xa7 || op === 0xa8 || op === 0x11 || op === 0x84 || op === 0x18 || op === 0x19 || op === 0x37 || op === 0x39 || op === 0x3a || op === 0x15 || op === 0x16 || op === 0x17 || op === 0x36 || op === 0x38) {
            // various jumps and 2-byte/3-byte ops
            bStream.readUint16();
        } else if (op === 0x10) {
            bStream.readUint8();
        } else if (op === 0xbc) {
            bStream.readUint8();
        } else if (op === 0xaa) { // tableswitch
            while (bStream.index % 4 !== 0) bStream.readUint8();
            bStream.readInt32(); // default
            const low = bStream.readInt32();
            const high = bStream.readInt32();
            for (let k = 0; k < high - low + 1; k++) bStream.readInt32();
        } else if (op === 0xab) { // lookupswitch
            while (bStream.index % 4 !== 0) bStream.readUint8();
            bStream.readInt32(); // default
            const count = bStream.readInt32();
            for (let k = 0; k < count; k++) {
                bStream.readInt32();
                bStream.readInt32();
            }
        } else if (op === 0xc4) { // wide
            const op2 = bStream.readUint8();
            bStream.readUint16();
            if (op2 === 0x84) bStream.readInt16();
        }
    }
    
    js2me.generateProgram(data);
    
    console.log('--- ANALYSIS OF ARRAY LOADS IN ' + methodName + ' ---');
    
    data.content.forEach((instr, idx) => {
        let offset = -1;
        for (let o = 0; o < data.mapping.length; o++) {
            if (data.mapping[o] === idx) {
                offset = o;
                break;
            }
        }
        console.log(`[JS ${idx}] [J2ME Offset ${offset}]: ${instr.toString().replace(/\n/g, ' ')}`);
    });
} catch (e) {
    console.error(e);
}
