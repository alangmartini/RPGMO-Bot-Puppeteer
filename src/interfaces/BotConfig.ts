import Coordinate from '../gameBot/Handlers/Path/interfaces/Coordinate';

interface MapObject {
    coordinates: Coordinate;
}

export interface BotConfig {
    // Your account username and password
    username: string;
    password: string;
    // If you want to use a proxy, set this to true
    proxy?: boolean;
    // Mob name to fight. Ex:  "Gray Wizard"
    "enemy-to-fight": string;
    // If you want the bot to login
    login?: boolean;
    // If you want the bot to work after login
    act?: boolean;
    // Proxy configuration
    "proxy-address"?: string;
    "proxy-port"?: number;
    "proxy-username"?: string;
    "proxy-password"?: string;
    target: MapObject;
    chest: MapObject;
    "bot-type": 'combat' | 'gathering';
    
}
