const fs = require('fs');

const path = 'client_logs.txt';
try {
    const data = fs.readFileSync(path, 'utf8');
    const lines = data.split('\n');
    console.log(`Total lines: ${lines.length}`);
    
    console.log('\n--- LAST 50 LINES ---');
    lines.slice(-50).forEach(line => console.log(line));

    console.log('\n--- JAVA EXCEPTIONS ---');
    let found = 0;
    lines.forEach((line, idx) => {
        if (line.includes('JAVA EXCEPTION')) {
            found++;
            console.log(`--- Exception #${found} at line ${idx+1} ---`);
            lines.slice(idx, idx + 15).forEach(l => console.log(l));
        }
    });
} catch (e) {
    console.error(e);
}
