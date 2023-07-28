import BrowserClient from '../browserClient/BrowserClient.client';
import sleep from '../utils/sleep';
import GameBot from './GameBot.client';
import Path from './Handlers/Path/interfaces/Path';
import PathInformation from './Handlers/Path/interfaces/PathInformation';
import SquareLocale from './Handlers/Path/interfaces/SquareLocale';

const players: any = [];
const current_map: any = 0;

const COORDINATES = {
  DUNGEON_LADDER: { x: 66, y: 29 },
  DORPAT_DUNGEON_LADDER: {x: 66, y: 29 }
}
export default class CombatBot extends GameBot {
  private nearestChest: SquareLocale = this.browserClient.configs.chest.coordinates;
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

    let MOB_TO_FIGHT = this.browserClient.configs['enemy-to-fight'];

    const isMobInDungeonI = false;

    while (true) {
      if (this.pause) {
        await sleep(15000);
      }

      try {
        sleep(250);
        let isBusy = await this.checkIsBusy();
        // Trying the event emitter pausing first;
        // let isCaptcha = await this.captchaHandler.isCaptchaActive();

        // if (isBusy || isCaptcha) {
        if (isBusy) {
          continue;
        }

        let isFull = await this.inventoryHandler.checkInventoryIsFull();
  
        const currentMap = await this.browserClient.getPage()!.evaluate(() => current_map);
        if (isFull) {
          if (currentMap === 1 && isMobInDungeonI) {
            const ladderPathInfo: PathInformation = await this.getPathToChest(COORDINATES.DUNGEON_LADDER);
            await this.movementHandler.moveToDestination(ladderPathInfo.path);
            await this.movementHandler.interactWithObject(ladderPathInfo.location, 'Chest');  
            await sleep(2000);
          }

          const chestPathInfo: PathInformation = await this.getPathToChest(this.nearestChest);
          await this.movementHandler.moveToDestination(chestPathInfo.path);
          await this.movementHandler.interactWithObject(chestPathInfo.location, 'Chest');
          await this.inventoryHandler.stashChest();
        } 

        if (currentMap === 0 && isMobInDungeonI) {
          const downLadderPathInfo: PathInformation = await this.getPathToChest(COORDINATES.DORPAT_DUNGEON_LADDER);
          await this.movementHandler.moveToDestination(downLadderPathInfo.path);
          await this.movementHandler.interactWithObject(downLadderPathInfo.location, 'Chest');  
          await sleep(2000);
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