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



export default class FirTreeBot extends GameBot {
  private nearestFirTree: SquareLocale = { x: 88, y: 32 };
  private nearestChest: SquareLocale = { x: 83, y: 38 };
  private movementHandler: MovementHandler;

  constructor(browserClient: BrowserClient) {
    super(browserClient);
    this.movementHandler = new MovementHandler(browserClient);
  }

  async run () {
    await this.login();

    // Start several subroutines
    this.runWatchers();

    await this.movementHandler.updateCurrentLocation();

    while (true) {
      sleep(2000);
      const pathToChest: Path = await this.getPathToChest();
      await this.movementHandler.moveToDestination(pathToChest);
      await this.movementHandler.interactWithObject(this.nearestChest, 'chest');
      await this.stashChest();
  
      const pathToFirTree: Path = await this.getPathToFirTree();
      await this.movementHandler.moveToDestination(pathToFirTree);
      await this.cutFirTree();
    } 
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

  evalStashChest() {
    Chest.deposit_all();
  }

  async stashChest() {
    console.log("stashing chest")
    await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalStashChest);
    await sleep(2000);
  }

  async getPathToFirTree() {
    console.log("getting path to fir tree")
    const path: Path = await this.pathHandler.getPathTo(this.nearestFirTree.x,  this.nearestFirTree.y);
    return path;
  }

  async getPathToChest() {{
    console.log("getting path to chest")
    const path: Path = await this.pathHandler.getPathTo(this.nearestChest.x,  this.nearestChest.y);
    return path;
  }}

  async findNearestFirTreePath() {
    await this.mapHandler.scanMapDirect();
    const path: PathInformation = await this.pathHandler.findNearestObjectPath(this.mapHandler.currentMap, 'Pinheiro');
    
    return path;
  }
}