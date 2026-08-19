const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fade In replacements
    content = content.replace(/animate-in fade-in duration-\d+/g, 'ios-fade-in');
    
    // Scale In replacements
    content = content.replace(/animate-in zoom-in-95 duration-\d+/g, 'ios-modal-scale-in');
    content = content.replace(/animate-in fade-in zoom-in-\d+ duration-\d+/g, 'ios-modal-scale-in');
    content = content.replace(/animate-in zoom-in duration-\d+/g, 'ios-modal-scale-in');

    // Slide up replacements
    content = content.replace(/animate-in slide-in-from-bottom-\[?\w+%?\]? duration-\d+/g, 'ios-modal-slide-up');
    content = content.replace(/animate-in slide-in-from-bottom duration-\d+/g, 'ios-modal-slide-up');
    content = content.replace(/animate-in fade-in slide-in-from-bottom-4 duration-300/g, 'ios-modal-slide-up');

    // Clean up stranded animate-in
    content = content.replace(/animate-in /g, '');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
