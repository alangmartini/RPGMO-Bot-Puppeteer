import BrowserClient from '../browserClient/BrowserClient.client';
import RpgMOSelectors from '../browserClient/enums/RpgMOSelectors.enum';
import dotenv from 'dotenv';
import PageHandler from './Handlers/Page.handler';
import LoginHandler from './Handlers/Login.handler';
import InjectionHandler from './Handlers/Injection.handler';
import CaptchaHandler from './Handlers/Captcha.handler';
import { EventEmitter } from 'events';

dotenv.config();

class GameBot {
  // BrowserClient handles all operations with Chromium
  private browserClient: BrowserClient;

  // Handlers
  private loginHandler: LoginHandler;
  private pageHandler: PageHandler;
  private injectionHandler: InjectionHandler;
  private captchaHandler: CaptchaHandler;
  // private mapHandler: MapHandler;


  // Watchers as tasks will watch for these vars
  private pause: boolean = false;
  private resume: boolean = false;

  // EventEmitter to handle events
  private eventEmitter: EventEmitter;

  // A watcher is a loop that checks for something.
  private watchers: Array<Promise<void>> = [];

  constructor(browserClient: BrowserClient) {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on('pause', () => this.pause = true);
    this.eventEmitter.on('resume', () => {
      this.pause = false;
      this.runWatchers();
    });

    this.browserClient = browserClient;
    this.pageHandler = new PageHandler(this.browserClient);
    this.loginHandler = new LoginHandler(this.browserClient, this.pageHandler);
    this.injectionHandler = new InjectionHandler(this.browserClient);
    this.captchaHandler = new CaptchaHandler(this.browserClient, this.eventEmitter, this.pause, this.resume);
    // this.mapHandler = new MapHandler(this.browserClient);
  }

  async login() {
    await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, { visible: true, timeout: 10000 });

    await this.injectionHandler.setHotkeys();
    
    await this.loginHandler.login();
    
    await this.pageHandler.verifyIsLogged();

    await this.injectionHandler.modifyCaptchaShow();
  }

  async runWatchers() {
    this.watchers = [this.watchCaptcha()];
    await Promise.all(this.watchers);
  }

  async watchCaptcha() {
    while (!this.pause) {
      await this.captchaHandler.checkForCaptcha();
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}



export default GameBot;


