import BrowserClient from '../browserClient/BrowserClient.client';
import RpgMOSelectors from './enums/RpgMOSelectors.enum';
import dotenv from 'dotenv';
import PageHandler from './Handlers/Page.handler';
import LoginHandler from './Handlers/Login.handler';
import InjectionHandler from './Handlers/Injection.handler';
import CaptchaHandler from './Handlers/Captcha.handler';
import { EventEmitter } from 'events';
import MapHandler from './Handlers/Map.handler';
import PathHandler, { Path, SquareLocale } from './Handlers/PathHandler';
import sleep from '../utils/sleep';
import Watcher from './Watchers/Watcher.watcher';
import InventoryHandler from './Handlers/Inventory.handler';
import MovementHandler from './Handlers/Movement.handler';

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
  protected inventoryHandler: InventoryHandler;
  protected movementHandler: MovementHandler;

  // A watcher is a loop that checks for something.
  private captchaWatcher: Watcher;

  // EventEmitter to handle events
  protected eventEmitter: EventEmitter;

  constructor(browserClient: BrowserClient) {
    this.eventEmitter = new EventEmitter();
    this.browserClient = browserClient;

    // Independent handlers
    this.pageHandler = new PageHandler(this.browserClient);
    this.injectionHandler = new InjectionHandler(this.browserClient);
    this.inventoryHandler = new InventoryHandler(this.browserClient);
    this.mapHandler = new MapHandler(this.browserClient);
    this.movementHandler = new MovementHandler(browserClient);
    
    // Dependent handlers
    this.loginHandler = new LoginHandler(this.browserClient, this.pageHandler);
    this.captchaHandler = new CaptchaHandler(this.browserClient, this.eventEmitter);
    this.pathHandler = new PathHandler(this.browserClient, this.mapHandler);

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
  }

  async watchMap() {
    while (!this.pause) {
      await this.mapHandler.scanMapDirect();
      await new Promise(r => setTimeout(r, 20000));
    }
  }

  async getPathToChest(nearestChest: SquareLocale) {
    await this.movementHandler.updateCurrentLocation()
    const current = this.movementHandler.currentLocation;
    const start = new Nod(current.x, current.y);
    const goal = new Nod(this.nearestChest.x, this.nearestChest.y);

    await this.mapHandler.scanMapAsGrid();
    const grid = this.mapHandler.mapAsGrid;

    console.log("to aqui");
    console.time('aStar')
    console.log('start is:', start);
    console.log('goal is:', goal);
    const pat = aStar(start, goal, grid);
    console.timeEnd('aStar')

    console.log("pat is", pat)
    console.log("getting path to chest")
    const path: Path = await this.pathHandler.getPathTo(nearestChest.x,  nearestChest.y);
    return path;
  }
}

export default GameBot;