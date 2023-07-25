import BrowserClient from '../browserClient/BrowserClient.client';
import sleep from '../utils/sleep';
import GameBot from './GameBot.client';
import Path from './Handlers/Path/interfaces/Path';
import PathInformation from './Handlers/Path/interfaces/PathInformation';
import SquareLocale from './Handlers/Path/interfaces/SquareLocale';

const players: any = [];

export default class CombatBot extends GameBot {
  private nearestChest: SquareLocale = { x: 22, y: 17 };

  constructor(browserClient: BrowserClient) {
    super(browserClient);
  }

  async run () {
    await this.login();

    // Start several subroutines
    this.runWatchers();

    await sleep(5000);

    const MOB_TO_FIGHT = 'Green Wizard'
    while (true) {
      await sleep(500)
      try {
        sleep(500);
        let isBusy = await this.checkIsBusy();

        if (isBusy) {
          continue;
        }

        let isFull = await this.inventoryHandler.checkInventoryIsFull();
  
        if (isFull) {
          const chestPathInfo: PathInformation = await this.getPathToChest(this.nearestChest);
          console.log("chest location is", chestPathInfo.location)
          await this.movementHandler.moveToDestination(chestPathInfo.path);
          await this.movementHandler.interactWithObject(chestPathInfo.location, 'Chest');
          await this.inventoryHandler.stashChest();
        } 

        console.time('pathj');
        const pathj = await this.pathHandler.findNearestObjectPath(MOB_TO_FIGHT);
        console.timeEnd('pathj');
        await this.movementHandler.moveToDestination(pathj.path);
        await this.movementHandler.interactWithObject(pathj.location, MOB_TO_FIGHT);
        
        
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