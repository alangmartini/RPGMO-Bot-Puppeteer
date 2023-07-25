import BrowserClient from '../browserClient/BrowserClient.client';
import RpgMOSelectors from './enums/RpgMOSelectors.enum';
import PageHandler from './Handlers/Page.handler';
import LoginHandler from './Handlers/Login.handler';
import InjectionHandler from './Handlers/Injection.handler';
import CaptchaHandler from './Handlers/Captcha.handler';
import { EventEmitter } from 'events';
import MapHandler from './Handlers/Map.handler';
import PathHandler from './Handlers/Path/PathHandler';
import { Path } from './Handlers/Path/interfaces/Path';
import { SquareLocale } from './Handlers/Path/SquareLocale';
import Watcher from './Watchers/Watcher.watcher';
import InventoryHandler from './Handlers/Inventory.handler';
import MovementHandler from './Handlers/Movement.handler';
import { aStar } from './Handlers/Path/interfaces/AStar';
import Nod from './Handlers/Path/Nod';


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

  async getPathToChest(nearestChest: SquareLocale) {
    await this.movementHandler.updateCurrentLocation()
    const current = this.movementHandler.currentLocation;



    const start = new Nod(current.x, current.y);
    const goal = new Nod(nearestChest.x, nearestChest.y);

    await this.mapHandler.scanMapAsGrid();
    const grid = this.mapHandler.mapAsGrid;

    console.time('aStar')
    console.log('start is:', start);
    console.log('goal is:', goal);
    const path = aStar(start, goal, grid);
    console.timeEnd('aStar')

    console.log("path length isFinite", path?.length)
    return path?.map((nod) => ({ x: nod.x, y: nod.y } as SquareLocale));

    // const path: Path = await this.pathHandler.getPathTo(nearestChest.x,  nearestChest.y);
    // return path;
  }
}

export default GameBot;