import BrowserClient from './browserClient/BrowserClient.client';
import dotenv from 'dotenv';
import GameBot from './gameBot/GameBot.client';
import FirTreeBot from './gameBot/FirTreeBot.client';

dotenv.config({path: __dirname + '../.env'});

export default class Orchestrator {
  private browserClient: BrowserClient;
  private gameBot: GameBot;
  private firTreeBot: FirTreeBot;
  // private statusHandler: StatusHandler;
  // private movementHandler: MovementHandler;
  // private playerHandler: PlayerHandler;

  constructor() {
    this.browserClient = new BrowserClient();
    const page = this.browserClient.getPage();
    
    this.gameBot = new GameBot(this.browserClient);
    this.firTreeBot = new FirTreeBot(this.browserClient);
  }

  async init() {
    await this.browserClient.init();
    await this.browserClient.config();
    await this.browserClient.goto('https://data.mo.ee/loader.html');
  

    await this.firTreeBot.run();
    // await this.gameBot.login();

    // await this.gameBot.runWatchers();
  }

  // async goto(url) {
  //   await this.browserClient.goto(url);
  // }

  // async login(username, password) {
  //   await this.browserClient.login(username, password);
  // }

  // async move(direction) {
  //   await this.browserClient.move(direction);
  // }

  // async getMap() {
  //   return await this.browserClient.getMap();
  // }

  // async getMapStatus() {
  //   return await this.browserClient.getMapStatus();
  // }

  // async getMobList() {
  //   return await this.browserClient.getMobList();
  // }

  // async getMobInfo(mobId) {
  //   return await this.browserClient.getMobInfo(mobId);
  // }

  // async getMobPosition(mobId) {
  //   return await this.browserClient.getMo
  // }
}