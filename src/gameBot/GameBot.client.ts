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
import sleep from '../utils/sleep';
import Watcher from './Watchers/Watcher.watcher';

dotenv.config();

class GameBot {
  // BrowserClient handles all operations with Chromium
  protected browserClient: BrowserClient;

  // Handlers
  protected loginHandler: LoginHandler;
  protected pageHandler: PageHandler;
  protected injectionHandler: InjectionHandler;
  protected captchaHandler: CaptchaHandler;
  protected mapHandler: MapHandler;
  protected pathHandler: PathHandler;

  // Watchers tasks will watch for these vars
  // to know when to pause or start again
  protected pause: boolean = false;
  protected resume: boolean = false;

  // A watcher is a loop that checks for something.
  protected watchers: Array<Promise<void>> = [];
  private captchaWatcher: Watcher;

  // EventEmitter to handle events
  protected eventEmitter: EventEmitter;

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
    this.mapHandler = new MapHandler(this.browserClient);

    // Watchers

    this.captchaWatcher = new Watcher(
        this.eventEmitter,
        'captcha',
        5000,
        this.captchaHandler.checkForCaptcha.bind(this.captchaHandler)
      );
  }

  async login() {
    await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, { visible: true, timeout: 10000 });

    await this.injectionHandler.setHotkeys();
    
    await this.loginHandler.login();
    
    await this.pageHandler.verifyIsLogged();

    await this.injectionHandler.modifyCaptchaShow();
  }

  async runWatchers() {
    this.captchaWatcher.run();
    // this.watchers = [this.watchCaptcha(), this.watchMap()];
    // await Promise.all(this.watchers);
  }

  async watchCaptcha() {
    while (!this.pause) {
      await this.captchaHandler.checkForCaptcha();
      await new Promise(r => setTimeout(r, 5000));
    }

    // await sleep(600000);

    // this.eventEmitter.emit('resume');
  }

  async watchMap() {
    while (!this.pause) {
      await this.mapHandler.scanMapDirect();
      await new Promise(r => setTimeout(r, 20000));
    }

    // this.eventEmitter.emit('resume');
  }
}

export default GameBot;