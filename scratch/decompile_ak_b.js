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
    const classBytes = fs.readFileSync('scratch/hso_ak.class');
    const stream = new js2me.BufferStream(new Uint8Array(classBytes).buffer);
    const cls = js2me.convertClass(stream);
    
    const data = cls.prototype['$b$III$Lhso_ap_'].data;
    
    // Parse bytecode stream
    const bytecode = [];
    const bStream = new js2me.BufferStream(data.stream);
    while (!bStream.isEnd()) {
        const idx = bStream.index;
        const op = bStream.readUint8();
        if (op === 0xb4 || op === 0xb2 || op === 0xb5 || op === 0xb3) {
            const cpIdx = bStream.readUint16();
            bytecode[idx] = { op: op, cpIdx: cpIdx };
        } else if (op === 0x12) {
            bStream.readUint8();
        } else if (op === 0x13 || op === 0x14 || op === 0xbd || op === 0xc0 || op === 0xc1 || op === 0xbb || op === 0xb6 || op === 0xb7 || op === 0xb8 || op === 0xb9 || op === 0xc5) {
            const cpIdx = bStream.readUint16();
            bytecode[idx] = { op: op, cpIdx: cpIdx };
        } else if (op === 0x9f || op === 0xa0 || op === 0xa1 || op === 0xa2 || op === 0xa3 || op === 0xa4 || op === 0x99 || op === 0x9a || op === 0x9b || op === 0x9c || op === 0x9d || op === 0x9e || op === 0xc6 || op === 0xc7 || op === 0xa7 || op === 0xa8 || op === 0x11 || op === 0x84 || op === 0x18 || op === 0x19 || op === 0x37 || op === 0x39 || op === 0x3a || op === 0x15 || op === 0x16 || op === 0x17 || op === 0x36 || op === 0x38) {
            bStream.readUint16();
        } else if (op === 0x10 || op === 0xbc) {
            bStream.readUint8();
        }
    }
    
    js2me.generateProgram(data);
    
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
        0xbd: 'anewarray',
        0xc5: 'multianewarray',
        0xbb: 'new',
        0xb7: 'invokespecial'
    };
    
    console.log('--- BYTECODE OF hso_ak.b(III)Lhso/ap; ---');
    data.content.forEach((instr, idx) => {
        let offset = -1;
        for (let o = 0; o < data.mapping.length; o++) {
            if (data.mapping[o] === idx) {
                offset = o;
                break;
            }
        }
        
        let opName = 'Unknown';
        const bcInfo = bytecode[offset];
        if (bcInfo) {
            opName = opcodes[bcInfo.op] || 'op_0x' + bcInfo.op.toString(16);
        }
        
        const fStr = instr.toString();
        let detail = fStr.replace(/\s+/g, ' ').substring(0, 80);
        if (bcInfo) {
            const item = data.constantPool[bcInfo.cpIdx];
            if (item) {
                detail += ` | Ref: ${item.className || ''}.${item.name || ''} (${JSON.stringify(item.type || '')})`;
            }
        }
        
        if (idx < 120) {
            console.log(`[JS ${idx}] [J2ME ${offset}]: ${opName} - ${detail}`);
        }
    });
    
} catch (e) {
    console.error(e);
}
