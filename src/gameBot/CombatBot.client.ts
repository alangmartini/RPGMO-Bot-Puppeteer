import BrowserClient from '../browserClient/BrowserClient.client';
import { aStar, Coordinate, Nod } from '../utils/AStart';
import sleep from '../utils/sleep';
import sleepRandom from '../utils/sleepRandom';
import GameBot from './GameBot.client';
import MovementHandler from './Handlers/Movement.handler';
import { Path, PathInformation, SquareLocale } from './Handlers/PathHandler';
import ArrowKeys from './enums/ArrowKeys.enum';

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
    while (true) {
      sleep(300);
      try {
        await this.mapHandler.scanMapDirect();
        const pathj = await this.pathHandler.getPathToNearestMob('Gray Wizard');
    
        await this.movementHandler.moveToDestination(pathj.path);
        await this.movementHandler.interactWithObject(pathj.location, 'Mago cinzento');
        
        sleep(1000)
        let isBusy = true;

        while (isBusy) {
          await sleep(200);
          isBusy = await this.checkIsBusy();
          console.log('isBusy is:', isBusy);
        }

        let isFull = await this.inventoryHandler.checkInventoryIsFull();
        console.log('isFull is:', isFull);

  
        if (isFull) {
          const pathToChest: Path = await this.getPathToChest(this.nearestChest);
          await this.inventoryHandler.stashChest();
        } 

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