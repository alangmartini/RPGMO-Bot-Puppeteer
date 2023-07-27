import BrowserClient from '../browserClient/BrowserClient.client';
import sleep from '../utils/sleep';
import GameBot from './GameBot.client';
import Path from './Handlers/Path/interfaces/Path';
import PathInformation from './Handlers/Path/interfaces/PathInformation';
import SquareLocale from './Handlers/Path/interfaces/SquareLocale';

const players: any = [];

export default class GatheringBot extends GameBot {
  // private nearestChest: SquareLocale = { x: 83, y: 38 };
  private chestCoordinates = this.browserClient.configs.chest.coordinates;
  private resourceCoordinates = this.browserClient.configs.target.coordinates;
  private pause: boolean = false;

  constructor(browserClient: BrowserClient) {
    super(browserClient);
    this.eventEmitter.on('pause', () => this.pause = true);
    this.eventEmitter.on('resume', () => this.pause = false);
  }

  async run () {
    await this.login();

    if (!this.browserClient.configs.act) return;

    // Start several subroutines
    this.runWatchers();

    while (true) {
      if (this.pause) {
        await sleep(10000);
      }

      try {
        sleep(1000);
        let isBusy = await this.checkIsBusy();
 
        if (isBusy) {
          continue;
        }

        let isFull = await this.inventoryHandler.checkInventoryIsFull();
  
        if (isFull) {
          const chestPathInfo: PathInformation = await this.getPathToChest(this.chestCoordinates);

          await this.movementHandler.moveToDestination(chestPathInfo.path);
          await this.movementHandler.interactWithObject(chestPathInfo.location, 'Chest');
          await this.inventoryHandler.stashChest();
        } 

        const pathj = await this.getPathToTarget(this.resourceCoordinates);
        await this.movementHandler.moveToDestination(pathj.path);
        await this.movementHandler.interactWithObject(pathj.location, 'Resource');
        
      } catch (e){
        console.log("error on main loop", e)
      }
    } 
  }
 
  evalCheckIsBusy() {
    return players[0].temp.busy;
  }

  async checkIsBusy() {
    const isBusy: boolean = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalCheckIsBusy);

    return isBusy;
  }

}