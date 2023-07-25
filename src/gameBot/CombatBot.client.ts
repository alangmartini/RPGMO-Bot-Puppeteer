import BrowserClient from '../browserClient/BrowserClient.client';
import sleep from '../utils/sleep';
import GameBot from './GameBot.client';
import Path from './Handlers/Path/interfaces/Path';
import PathInformation from './Handlers/Path/interfaces/PathInformation';
import SquareLocale from './Handlers/Path/interfaces/SquareLocale';

const players: any = [];

export default class CombatBot extends GameBot {
  private nearestChest: SquareLocale = { x: 21, y: 17 };

  constructor(browserClient: BrowserClient) {
    super(browserClient);
  }

  async run () {
    await this.login();

    // Start several subroutines
    this.runWatchers();

    await sleep(5000);

    // await this.movementHandler.updateCurrentLocation()
    // const current = this.movementHandler.currentLocation;
    // const start = new Nod(current.x, current.y);
    // const goal = new Nod(this.nearestChest.x, this.nearestChest.y);

    // await this.mapHandler.scanMapAsGrid();
    // const grid = this.mapHandler.mapAsGrid;

    // console.log("to aqui");
    // console.time('aStar')
    // console.log('start is:', start);
    // console.log('goal is:', goal);
    // const pat = aStar(start, goal, grid);
    // console.timeEnd('aStar')

    // console.log("pat is", pat)
    const MOB_TO_FIGHT = 'Gray Wizard'
    while (true) {
      sleep(5000);
      try {
        let isFull = await this.inventoryHandler.checkInventoryIsFull();
        console.log('isFull is:', isFull);
  
        if (isFull) {
          const chestPathInfo: PathInformation = await this.getPathToChest(this.nearestChest);
          console.log('pathToChest is:', chestPathInfo.path);
          console.log("chest location is", chestPathInfo.location)
          await this.movementHandler.moveToDestination(chestPathInfo.path);
          await this.movementHandler.interactWithObject(chestPathInfo.location, 'Chest');
          await this.inventoryHandler.stashChest();
        } 

        // await this.mapHandler.scanMapDirect();
        // const pathj = await this.pathHandler.findNearestObjectPath(MOB_TO_FIGHT);
    
        // await this.movementHandler.moveToDestination(pathj.path);
        // await this.movementHandler.interactWithObject(pathj.location, MOB_TO_FIGHT);
        
        // sleep(1000);
        // let isBusy = true;

        // while (isBusy) {
        //   await sleep(200);
        //   isBusy = await this.checkIsBusy();
        //   console.log('isBusy is:', isBusy);
        // }
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