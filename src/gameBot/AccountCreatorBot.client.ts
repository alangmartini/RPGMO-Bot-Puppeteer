// import BrowserClient from '../browserClient/BrowserClient.client';
// import sleep from '../utils/sleep';
// import GameBot from './GameBot.client';
// import Path from './Handlers/Path/interfaces/Path';
// import PathInformation from './Handlers/Path/interfaces/PathInformation';
// import SquareLocale from './Handlers/Path/interfaces/SquareLocale';

// const players: any = [];
// const current_map: any = 0;

// const COORDINATES = {
//   DUNGEON_LADDER: { x: 66, y: 29 },
//   DORPAT_DUNGEON_LADDER: {x: 66, y: 29 }
// }

// const TUTORIAL_POINTS = [
//   { x: 31, y: 19 }, // makeover guy
//   { x: 32, y: 22 },  // 1 gate
//   { x: 31, y: 28 } // combat guy
//   { x: 32, y: 33 } // 2 gate
//   { x: 28, y: 44} // 3 gate
//   { x: 33, y, 43} // 4 gate
//   { x: 36, y: 41} //fish guy
//   {x: 36, y: 45} // fishing spot
//   {x: 39, y: 40} //fire camp
//   { x: 42, y: 44} // 5 gate
//   { x: 43, y: 42} //minig guy
//   { x: 53, y: 41} // 6 gate
//   { x: 64, y: 41 } // 7 gate
//   { x: 70, y: 51} //woodcuting guy
//   { x: 75, y: 46 } // 8 gate
//   { x: 81, y: 49} // 9 gate
//   { x: 90, y: 45} // 10 gate
//   { x: 85, y: 40} // 11 gate
//   { x: 79, y: 37 } // ship

// ];


// const PROMPT_POPUP_CONFIRM = "#popup_prompt_confirm";

// const PROMPT_DIALOG_CLOSE  = "#dialog_prompt_close";
// const MAKEOVER_GUY_DIALOG_AMOUNT  = 5;
// const SELECT_YELLOW_HAIR = "#makeover_head > div:nth-child(2) > div";
// const SAVE_MAKEOVER_BUTTON = document.querySelector("#vTZP4jluON");
// const COMBAT_GUY_DIALOG_AMOUNT  = 4;
// // kill two rats
// const FISH_GUY_DIALOG_AMOUNT = 5;
// // equip fishing rod
// // find nearest fishing spot
// //equip fish
// // cook
// const MINIG_GUY_DIALOG_AMOUNT = 3;
//  /// EQUIP MINE TOOL
//  //find neares clay
//  //mine 3
//  // equip clay
//  // find neares furnace
//  // melt 
//  const woodcuting_GUY_DIALOG_AMOUNT = 2;
//  // equip axe
//  // cut neares tree
//  // walk to close stuff
//  // walk to nearest chest
//  // deposit all



// export default class CombatBot extends GameBot {
//   private nearestChest: SquareLocale = { x: 83, y: 38 };
//   private pause: boolean = false;

//   constructor(browserClient: BrowserClient) {
//     super(browserClient);
//     this.eventEmitter.on('pause', () => this.pause = true);
//     this.eventEmitter.on('resume', () => this.pause = false);
//   }

//   async run () {
//     await this.login();

//     if (!this.browserClient.configs.act) return;

//     // Start several subroutines
//     this.runWatchers();

//     while (true) {
//       if (this.pause) {
//         await sleep(15000);
//       }

//       try {
//         sleep(250);
//         let isBusy = await this.checkIsBusy();
//         // Trying the event emitter pausing first;
//         // let isCaptcha = await this.captchaHandler.isCaptchaActive();

//         // if (isBusy || isCaptcha) {
//         if (isBusy) {
//           continue;
//         }

//         let isFull = await this.inventoryHandler.checkInventoryIsFull();
  
//         const currentMap = await this.browserClient.getPage()!.evaluate(() => current_map);
//         if (isFull) {
//           if (currentMap === 1 && isMobInDungeonI) {
//             const ladderPathInfo: PathInformation = await this.getPathToChest(COORDINATES.DUNGEON_LADDER);
//             await this.movementHandler.moveToDestination(ladderPathInfo.path);
//             await this.movementHandler.interactWithObject(ladderPathInfo.location, 'Chest');  
//             await sleep(2000);
//           }

//           const chestPathInfo: PathInformation = await this.getPathToChest(this.nearestChest);
//           await this.movementHandler.moveToDestination(chestPathInfo.path);
//           await this.movementHandler.interactWithObject(chestPathInfo.location, 'Chest');
//           await this.inventoryHandler.stashChest();
//         } 

//         if (currentMap === 0 && isMobInDungeonI) {
//           const downLadderPathInfo: PathInformation = await this.getPathToChest(COORDINATES.DORPAT_DUNGEON_LADDER);
//           await this.movementHandler.moveToDestination(downLadderPathInfo.path);
//           await this.movementHandler.interactWithObject(downLadderPathInfo.location, 'Chest');  
//           await sleep(2000);
//         } 

//         console.time('pathj');         
//         const pathj = await this.pathHandler.findNearestObjectPath(MOB_TO_FIGHT);
//         console.timeEnd('pathj');
//         await this.movementHandler.moveToDestination(pathj.path);
//         await this.movementHandler.interactWithObject(pathj.location, MOB_TO_FIGHT);
        
        
//       } catch (e){
//         console.log("error on main loop", e)
//       }
//     } 
//   }
 
//   evalCheckIsBusy() {
//     return players[0].temp.busy;
//   }

//   async checkIsBusy() {
//     const isBusy: boolean = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalCheckIsBusy);

//     return isBusy;
//   }

// }