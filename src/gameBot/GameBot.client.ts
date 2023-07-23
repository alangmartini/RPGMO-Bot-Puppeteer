import BrowserClient from '../browserClient/BrowserClient.client';
import RpgMOSelectors from './enums/RpgMOSelectors.enum';
import dotenv from 'dotenv';
import PageHandler from './Handlers/Page.handler';
import LoginHandler from './Handlers/Login.handler';
import InjectionHandler from './Handlers/Injection.handler';
import CaptchaHandler from './Handlers/Captcha.handler';
import { EventEmitter } from 'events';
import MapHandler from './Handlers/Map.handler';
import PathHandler from './Handlers/PathHandler';

dotenv.config();

class GameBot {
  // BrowserClient handles all operations with Chromium
  private browserClient: BrowserClient;

  // Handlers
  private loginHandler: LoginHandler;
  private pageHandler: PageHandler;
  private injectionHandler: InjectionHandler;
  private captchaHandler: CaptchaHandler;
  private mapHandler: MapHandler;
  private pathHandler: PathHandler;

  // Watchers tasks will watch for these vars
  // to know when to pause or start again
  private pause: boolean = false;
  private resume: boolean = false;

  // A watcher is a loop that checks for something.
  private watchers: Array<Promise<void>> = [];

  // EventEmitter to handle events
  private eventEmitter: EventEmitter;

  constructor(browserClient: BrowserClient) {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on('pause', () => this.pause = true);
    this.eventEmitter.on('resume', () => {
      this.pause = false;
      this.runWatchers();
    });

    this.browserClient = browserClient;

    // Independent handlers
    this.pageHandler = new PageHandler(this.browserClient);
    this.injectionHandler = new InjectionHandler(this.browserClient);
    this.pathHandler = new PathHandler(this.browserClient);
    
    // Dependent handlers
    this.loginHandler = new LoginHandler(this.browserClient, this.pageHandler);
    this.captchaHandler = new CaptchaHandler(this.browserClient, this.eventEmitter, this.pause, this.resume);
    this.mapHandler = new MapHandler(this.browserClient, this.pathHandler);
  }

  async login() {
    await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, { visible: true, timeout: 10000 });

    await this.injectionHandler.setHotkeys();
    
    await this.loginHandler.login();
    
    await this.pageHandler.verifyIsLogged();

    await this.injectionHandler.modifyCaptchaShow();
  }

  async runWatchers() {
    this.watchers = [this.watchCaptcha(), this.watchMap()];
    await Promise.all(this.watchers);
  }

  async watchCaptcha() {
    while (!this.pause) {
      await this.captchaHandler.checkForCaptcha();
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  async watchMap() {
    while (!this.pause) {
      await this.mapHandler.scanMapDirect();
      await new Promise(r => setTimeout(r, 20000));
    }
  }
}

export default GameBot;