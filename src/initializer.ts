import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { spawn } from 'child_process';
import { BotConfig } from './interfaces/BotConfig';

interface Services {
    [key: string]: BotConfig;
}

interface Initializer {
    services: Services;
}

const main = async () => {
    try {
        const yamlString = await fs.readFile('./initializer.yaml', 'utf8');
        const configs: Initializer = yaml.load(yamlString) as Initializer;
        
        const botsConfigs = Object.entries(configs.services);

        for (const config of botsConfigs) {
            const configString = JSON.stringify(config[1]);
            const proc = spawn('node', ['./dist/main.js', configString]);

            proc.stdout.on('data', (data: Buffer) => console.log(`service ${config[0]} stdout: ${data}`));
            proc.stderr.on('data', (data: Buffer) => console.error(`service ${config[0]} stderr: ${data}`));
            proc.on('close', (code: number | null) => console.log(`service ${config[0]} process exited with code ${code}`));
        }
        
    } catch(err) {
        console.log('Error:', err);
    }
};

main();
