import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { spawn } from 'child_process';

interface BotConfig {
    username: string;
    password: string;
    proxy?: boolean;
    act?: boolean;
    "proxy-address"?: string;
    "proxy-port"?: number;
    "proxy-username"?: string;
    "proxy-password"?: string;
}

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
        
        const botsConfigs = Object.keys(configs.services);

        for (const config of botsConfigs) {
            const configString = JSON.stringify(config);
            console.log(configString)
            // const proc = spawn('node', ['main.js', configString]);

            // proc.stdout.on('data', (data: Buffer) => console.log(`stdout: ${data}`));
            // proc.stderr.on('data', (data: Buffer) => console.error(`stderr: ${data}`));
            // proc.on('close', (code: number | null) => console.log(`child process exited with code ${code}`));
        }
        
    } catch(err) {
        console.log('Error:', err);
    }
};

main();
