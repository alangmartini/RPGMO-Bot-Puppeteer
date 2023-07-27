import { EventEmitter } from 'events';
import BrowserClient from '../../browserClient/BrowserClient.client';
import sleep from '../../utils/sleep';
import ArrowKeys from '../enums/ArrowKeys.enum';
import Coordinate from './Path/interfaces/Coordinate';
import Path from './Path/interfaces/Path';
import SquareLocale from './Path/interfaces/SquareLocale';

const players: any = [];
const movementInProgress = (player: any) => {}

class MovementEvals {
  static getCurrentLocation() {
    return { x: players[0].i, y: players[0].j };
  }

  static isMoving() {
    return movementInProgress(players[0]);
  }
}

export default class MovementHandler {
  private browserClient: BrowserClient;
  private eventEmitter: EventEmitter;
  private pause: boolean = false;
  
  currentLocation: Coordinate = { x: 0, y: 0 };

  constructor(browserClient: BrowserClient, eventEmitter: EventEmitter) {
    this.browserClient = browserClient;
    this.eventEmitter = eventEmitter;
    this.eventEmitter.on('pause', () => this.pause = true);
    this.eventEmitter.on('resume', () => this.pause = false);
  }

  async getCurrentPosition(): Promise<Coordinate>  {
    await this.updateCurrentLocation();
    return this.currentLocation;
  }

  async waitStopMoving() {
    let isMoving = true;
    while (isMoving) {
      await new Promise(r => setTimeout(r, 10));
      isMoving = await this.browserClient.evaluateFunctionWithArgsAndReturn(MovementEvals.isMoving);
    }
  }

  async updateCurrentLocation() {
    this.currentLocation = await this.browserClient.evaluateFunctionWithArgsAndReturn(MovementEvals.getCurrentLocation);
  }

  async moveToDestination(path: Path) {
    const pathLength = path.length; 

    for (let i = 0; i < pathLength; i++) {
      await this.updateCurrentLocation();

      // In Path, the last SquareLocale is the nearest.
      const nextSquare = path[pathLength - 1 -i];

      let movingTries = 0;
      while (nextSquare.x !== this.currentLocation.x || nextSquare.y !== this.currentLocation.y && movingTries < 30) {
        await this.decideDirectionToMove(nextSquare, this.currentLocation);
        await this.updateCurrentLocation();
        movingTries++;
      }
    }
  }

  async decideDirectionToMove(nextSquare: SquareLocale, currentSquare: SquareLocale) {
    while (this.pause) {
      console.log("decideDirectionToMove paused, waiting for pause to be turned off");
      await sleep(5000);
    }

    if (nextSquare.x > currentSquare.x) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowRight);
      // console.log("sending key")
      await this.waitStopMoving();

      return;
    }

    if (nextSquare.x < currentSquare.x) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowLeft);
      await this.waitStopMoving();
      return;
    }

    if (nextSquare.y > currentSquare.y) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowUp);
      await this.waitStopMoving();
      return;
    }

    if (nextSquare.y < currentSquare.y) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowDown);
      await this.waitStopMoving();
      return;
    }
  }

  async interactWithObject(objectPosition: SquareLocale, object: string) {
    while (this.pause) {
      console.log("interactWithObject paused, waiting for pause to be turned off");
      await sleep(5000);
    }
    
    await this.updateCurrentLocation();
    const currentLocation = this.currentLocation;

    if (currentLocation.x > objectPosition.x) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowLeft);
      await sleep(250);
    }

    if (currentLocation.x < objectPosition.x) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowRight);
      await sleep(250);
    }

    if (currentLocation.y > objectPosition.y) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowDown);
      await sleep(250);
    }

    if (currentLocation.y < objectPosition.y) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowUp);
      await sleep(250);
    }
  }

}
