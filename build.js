const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const jsDir = path.join(__dirname, 'js');

const coreFiles = [
    'zip/zip.js',
    'zip/inflate.js',
    'zip/zip-ext.js',
    'js2me.js',
    'bufferStream.js',
    'convert.js',
    'classes.js',
    'emulator.js',
    'execute.js',
    'events.js',
    'manifest.js',
    'methodStub.js',
    'launcher.js',
    'loader.js',
    'numbers.js',
    'program.js',
    'resources.js',
    'threads.js',
    'utils.js'
];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.js')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

async function build() {
    let combinedCode = '';

    // 1. Core files
    for (const file of coreFiles) {
        const filePath = path.join(jsDir, file);
        if (fs.existsSync(filePath)) {
            combinedCode += fs.readFileSync(filePath, 'utf8') + '\n;\n';
        } else {
            console.error(`Missing core file: ${filePath}`);
        }
    }

    // 2. Inject script interceptor and createClass override
    combinedCode += `
js2me.bundledClasses = {};
js2me.bundledDependencies = {};

var originalCreateClass = js2me.createClass;
var currentBundledClassName = "";
js2me.createClass = function(proto) {
    originalCreateClass(proto);
    var obj = js2me.classBucket;
    if (obj && obj.prototype) {
        obj.prototype.require = js2me.bundledDependencies[currentBundledClassName] || [];
    }
};

var originalCreateInterface = js2me.createInterface;
js2me.createInterface = function(proto) {
    originalCreateInterface(proto);
    var obj = js2me.classBucket;
    if (obj && obj.prototype) {
        obj.prototype.require = js2me.bundledDependencies[currentBundledClassName] || [];
    }
};

var originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    var element = originalCreateElement.call(document, tagName);
    if (tagName.toLowerCase() === 'script') {
        var _src = '';
        Object.defineProperty(element, 'src', {
            set: function(val) {
                _src = val;
                if (val.indexOf('js/me/') !== -1) {
                    var classPath = val.substring(val.indexOf('js/me/') + 6, val.indexOf('.js'));
                    var className = 'javaRoot.$' + classPath.replace(/\\//g, '.$');
                    setTimeout(function() {
                        if (js2me.bundledClasses[className]) {
                            currentBundledClassName = className;
                            js2me.bundledClasses[className]();
                            if (element.onload) element.onload();
                        } else {
                            if (element.onerror) element.onerror();
                        }
                    }, 0);
                } else {
                    element.setAttribute('src', val);
                }
            },
            get: function() {
                return _src;
            }
        });
    }
    return element;
};
\n`;

    // 3. Class files in js/me wrapped in bundledClasses
    const meDir = path.join(jsDir, 'me');
    const meFiles = getAllFiles(meDir);
    for (const filePath of meFiles) {
        const relPath = path.relative(meDir, filePath).replace(/\\/g, '/');
        const className = 'javaRoot.$' + relPath.replace(/\//g, '.$').replace('.js', '');

        const content = fs.readFileSync(filePath, 'utf8');
        const reqsMatch = content.match(/javaRoot(\.\$[a-zA-Z0-9_]+)+/g);
        let uniqueReqs = [];
        if (reqsMatch) {
            uniqueReqs = [...new Set(reqsMatch)];
        }

        combinedCode += `js2me.bundledDependencies["${className}"] = ${JSON.stringify(uniqueReqs)};\n`;
        combinedCode += `js2me.bundledClasses["${className}"] = function() {\n`;
        combinedCode += content;
        combinedCode += `\n};\n`;
    }

    console.log('Total length:', combinedCode.length);

    console.log('Bypassing obfuscation for maximum performance...');
    try {
        const finalCode = combinedCode;

        const outPath = path.join('c:/Users/ADMIN/Desktop/HTTH_MINNSUN/htdocs/web_play', 'core.min.js');
        try {
            fs.writeFileSync(outPath, finalCode);
        } catch (err) {
            console.log('External web_play folder not found, skipping external write.');
        }
        const localOutPath = path.join(__dirname, 'core.min.js');
        fs.writeFileSync(localOutPath, finalCode);
        console.log('Build successful! core.min.js created locally. Size:', finalCode.length);
    } catch (e) {
        console.error('Error writing file:', e);
    }
}

build();
