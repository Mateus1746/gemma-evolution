import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getAllFiles(dirPath, arrayOfFiles) {
    const files = readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (statSync(join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(join(dirPath, file));
        }
    });

    return arrayOfFiles;
}

function main() {
    const rootPath = resolve(__dirname, '..');
    
    // Read project configuration
    const metadataPath = resolve(rootPath, 'metadata.json');
    let metadata = { name: "react-example" };
    try {
        metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    } catch (e) {
        // Fallback if metadata.json somehow doesn't exist during execution
    }
    
    const distPath = resolve(rootPath, 'dist');
    const files = [];
    
    try {
        const allFiles = getAllFiles(distPath);
        for (const file of allFiles) {
            const relativePath = file.replace(distPath + '/', '');
            const content = readFileSync(file).toString('base64');
            files.push({
                path: relativePath,
                content: content,
                encoding: 'base64'
            });
        }
    } catch (e) {
        console.error("Error reading dist directory. Did you run 'npm run build' first?", e);
        process.exit(1);
    }

    // Prepare the configuration block for Nexus Renderizador
    const nexusPayload = {
        project: metadata.name || "react-example",
        target: "exports/",
        rendering: {
            engine: "wgpu",
            text_backend: "glyphon",
            compiler: "rust-gpu",
            io_mode: "memory_pipe" // Eliminating disk I/O
        },
        payload_type: "binary_stream",
        data: files
    };

    // Serialize configuration to binary buffer
    const configBuffer = Buffer.from(JSON.stringify(nexusPayload), 'utf-8');
    
    // Send to stdout for the binary pipe
    process.stdout.write(configBuffer);
}

main();
