import BrowserClient from './browserClient/BrowserClient.client';
import dotenv from 'dotenv';
import GameBot from './gameBot/GameBot.client';
import FirTreeBot from './gameBot/FirTreeBot.client';
import CombatBot from './gameBot/CombatBot.client';

dotenv.config();

export default class Orchestrator {
  private browserClient: BrowserClient;
  private combatBot: CombatBot;

  constructor() {
    this.browserClient = new BrowserClient();

    const page = this.browserClient.getPage();
    
    // this.gameBot = new GameBot(this.browserClient);
    // this.firTreeBot = new FirTreeBot(this.browserClient);
    this.combatBot = new CombatBot(this.browserClient);
  }

  async init() {
    await this.browserClient.init();
    await this.browserClient.config();
    await this.browserClient.goto(process.env.GAME_URL || '');
  
    await this.combatBot.run();
  }
}