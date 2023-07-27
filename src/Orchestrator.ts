import BrowserClient from './browserClient/BrowserClient.client';
import dotenv from 'dotenv';
import GameBot from './gameBot/GameBot.client';
import FirTreeBot from './gameBot/FirTreeBot.client';
import CombatBot from './gameBot/CombatBot.client';
import { BotConfig } from './interfaces/BotConfig';
import GatheringBot from './gameBot/GatheringBot.client';

dotenv.config();

export default class Orchestrator {
  private browserClient: BrowserClient;

  constructor() {
    const configurations: BotConfig = this.getConfigurations();

    this.browserClient = new BrowserClient(configurations);

    const page = this.browserClient.getPage();
    
    // // this.gameBot = new GameBot(this.browserClient);
    // // this.firTreeBot = new FirTreeBot(this.browserClient);
    // this.combatBot = new CombatBot(this.browserClient);
  }

  getConfigurations(): BotConfig {
    const configsString = process.argv[2];
    const configs: BotConfig = JSON.parse(configsString);

    return configs;
  }

  async init() {
    await this.browserClient.init();
    await this.browserClient.config();
    await this.browserClient.goto(process.env.GAME_URL || '');
  
    let bot: GatheringBot | CombatBot | undefined;

    if (this.browserClient.configs['bot-type'] === 'gathering') {
      bot = new GatheringBot(this.browserClient);
    }

    if (this.browserClient.configs['bot-type'] === 'combat') {
      bot = new CombatBot(this.browserClient);
    }

    if (!bot) {
      throw new Error("Inser the bot-type in initializer.yaml");
    }

    await bot.run();
  }
}