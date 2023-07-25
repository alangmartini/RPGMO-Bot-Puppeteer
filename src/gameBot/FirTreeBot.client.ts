import BrowserClient from '../browserClient/BrowserClient.client';
import sleep from '../utils/sleep';
import sleepRandom from '../utils/sleepRandom';
import GameBot from './GameBot.client';
import Coordinate from './Handlers/Path/interfaces/Coordinate';
import Path from './Handlers/Path/interfaces/Path';
import PathInformation from './Handlers/Path/interfaces/PathInformation';


const players: any = [];
const Chest = {
  deposit_all: () => {}
}

const Inventory = {
  is_full: (player: any) => {}
}



export default class FirTreeBot extends GameBot {
  private nearestFirTree: Coordinate = { x: 88, y: 32 };
  private nearestChest: Coordinate = { x: 83, y: 38 };

  constructor(browserClient: BrowserClient) {
    super(browserClient);
  }

  async run () {
    // await this.login();

    // // Start several subroutines
    // this.runWatchers();

    // await this.movementHandler.updateCurrentLocation();

    // while (true) {
    //   sleep(2000);
    //   const pathToChest: Path = await this.getPathToChest(this.nearestChest) as Path;
    //   await this.movementHandler.moveToDestination(pathToChest);
    //   await this.movementHandler.interactWithObject(this.nearestChest, 'chest');
    //   await this.inventoryHandler.stashChest();
  
    //   const pathToFirTree: Path = await this.getPathToFirTree();
    //   await this.movementHandler.moveToDestination(pathToFirTree);
    //   await this.cutFirTree();
    // } 
  }

  evalGetCurrentInventory() {
    return Inventory.is_full(players[0]);
  }

  async checkInventoryIsFull() {
    const inventoryIsFull: boolean = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetCurrentInventory);

    return inventoryIsFull;
  }

  async cutFirTree() {
    console.log("cutting fir tree")
    await this.movementHandler.interactWithObject(this.nearestFirTree, 'fir tree');

    let inventoryIsFull = false;
    while (!inventoryIsFull) {
      await sleepRandom();
      inventoryIsFull = await this.checkInventoryIsFull();
      console.log("Chest has space?", inventoryIsFull)
    }
  }

  // async getPathToFirTree() {
  //   console.log("getting path to fir tree")
  //   const pathInfo: Path = await this.pathHandler.findPathTo(this.movementHandler.currentLocation, this.nearestFirTree);
  //   return path;
  // }

  async findNearestFirTreePath() {
    await this.mapHandler.scanMapDirect();
    const path: PathInformation = await this.pathHandler.findNearestObjectPath('Pinheiro');
    
    return path;
  }
}