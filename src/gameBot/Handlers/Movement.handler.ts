import BrowserClient from '../../browserClient/BrowserClient.client';
import sleep from '../../utils/sleep';
import ArrowKeys from '../enums/ArrowKeys.enum';
import { Path, SquareLocale } from './PathHandler';

const players: any = [];
const movementInProgress = (player: any) => {}



export default class MovementHandler {
  private browserClient: BrowserClient;
  currentLocation: SquareLocale = { x: 0, y: 0 };

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
    
  }

  evalGetCurrentLocation() {
    return { x: players[0].i, y: players[0].j };
  }

  evalIsMoving() {
    return movementInProgress(players[0]);
  }

  async waitStopMoving() {
    let isMoving = true;
    while (isMoving) {
      await new Promise(r => setTimeout(r, 10));
      isMoving = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalIsMoving);
    }
  }

  async updateCurrentLocation() {
    this.currentLocation = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetCurrentLocation);
  }

  async moveToDestination(path: Path) {
    console.log("starting to move");
    const pathLength = path.length;

    for (let i = 0; i < pathLength; i++) {
      console.log("Updating current position");
      await this.updateCurrentLocation();

      // In Path, the last SquareLocale is the nearest.
      const nextSquare = path[pathLength - 1 -i];

      // console.log("next square is", nextSquare);
      // console.log("current pos is", this.currentLocation);

      while (nextSquare.x !== this.currentLocation.x || nextSquare.y !== this.currentLocation.y) {
        console.log("deciding direction to move");
        await this.decideDirectionToMove(nextSquare, this.currentLocation);
        await this.updateCurrentLocation();
      }
    }

    console.log("finished moving");
    await sleep(500);
  }

  async decideDirectionToMove(nextSquare: SquareLocale, currentSquare: SquareLocale) {
    if (nextSquare.x > currentSquare.x) {
      console.log("moving right");
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowRight);
      // await sleep(moveDelay);
      await this.waitStopMoving();

      return;
    }

    if (nextSquare.x < currentSquare.x) {
      console.log("moving left");
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowLeft);
      // await sleep(moveDelay);

      await this.waitStopMoving();
      return;
    }

    if (nextSquare.y > currentSquare.y) {
      console.log("moving up");        
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowUp);
      // await sleep(moveDelay);

      await this.waitStopMoving();
      return;
    }

    if (nextSquare.y < currentSquare.y) {
      console.log("moving down");
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowDown);
      // await sleep(moveDelay);

      await this.waitStopMoving();
      return;
    }
  }

  async interactWithObject(objectPosition: SquareLocale, object: string) {
    console.log("interacting with", object)

    await this.updateCurrentLocation();
    const currentLocation = this.currentLocation;

    if (currentLocation.x > objectPosition.x) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowLeft);
      await sleep(1000);
    }

    if (currentLocation.x < objectPosition.x) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowRight);
      await sleep(1000);
    }

    if (currentLocation.y > objectPosition.y) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowDown);
      await sleep(1000);
    }

    if (currentLocation.y < objectPosition.y) {
      await this.browserClient.sendKeyPress(ArrowKeys.ArrowUp);
      await sleep(1000);
    }
  }

}
