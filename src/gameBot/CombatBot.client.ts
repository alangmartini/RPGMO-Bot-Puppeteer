import BrowserClient from '../browserClient/BrowserClient.client';
import sleep from '../utils/sleep';
import sleepRandom from '../utils/sleepRandom';
import GameBot from './GameBot.client';
import MovementHandler from './Handlers/Movement.handler';
import { Path, PathInformation, SquareLocale } from './Handlers/PathHandler';
import ArrowKeys from './enums/ArrowKeys.enum';

const players: any = [];
const Chest = {
  deposit_all: () => {}
}

const Inventory = {
  is_full: (player: any) => {}
}



export default class CombatBot extends GameBot {
  private nearestChest: SquareLocale = { x: 22, y: 17 };
  private movementHandler: MovementHandler;

  constructor(browserClient: BrowserClient) {
    super(browserClient);
    this.movementHandler = new MovementHandler(browserClient);
  }

  async run () {
    await this.login();

    // Start several subroutines
    this.runWatchers();

    
    while (true) {
      // sleep(2000);
      await sleep(5000);
      try {
        await this.mapHandler.scanMapDirect();
        const pathj = await this.findNearestMob('Gray Wizard');
        // console.log("pathj", pathj);
        console.log("pathj.path", pathj.path);
        console.log("pathj.location", pathj.location);
        
        await this.movementHandler.moveToDestination(pathj.path);
        await this.movementHandler.interactWithObject(pathj.location, 'Mago cinzento');
  
        const isFull = await this.checkInventoryIsFull();
  
        if (isFull) {
          const pathToChest: Path = await this.getPathToChest();
          await this.stashChest();
        } 

      } catch {}
    } 
  }

  evalGetCurrentInventory() {
    return Inventory.is_full(players[0]);
  }

  async checkInventoryIsFull() {
    const inventoryIsFull: boolean = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetCurrentInventory);

    return inventoryIsFull;
  }

  evalStashChest() {
    Chest.deposit_all();
  }

  async stashChest() {
    console.log("stashing chest")
    await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalStashChest);
    await sleep(2000);
  }

  async getPathToChest() {{
    console.log("getting path to chest")
    const path: Path = await this.pathHandler.getPathTo(this.nearestChest.x,  this.nearestChest.y);
    return path;
  }}

  async findNearestMob(name: string) {
    await this.mapHandler.scanMapDirect();
    const path: PathInformation = await this.pathHandler.findNearestObjectPath(this.mapHandler.currentMap, name);
    
    return path;
  }
}