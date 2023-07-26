import BrowserClient from '../../../browserClient/BrowserClient.client';
import MapHandler from '../Map/Map.handler';
import MapObject from '../MapObject';
import MovementHandler from '../Movement.handler';
import { PathUtils } from './pathFinders/PathUtils';
import PathFinderWithAStar from './pathFinders/PathFinderWithAStar';
import Coordinate from './interfaces/Coordinate';
import PathInformation from './interfaces/PathInformation';

const players: any = [];
const findPathFromTo = (a: any, b: any, c: any) => {}


export class PathEvals {
  static getPathTo(x: number, y: number) {
    return findPathFromTo(players[0], { i: x, j: y }, players[0]);
  }
}

export default class PathHandler {
  private browserClient: BrowserClient;
  mapHandler: MapHandler;
  private movementHandler: MovementHandler;
  private pathFinder: PathFinderWithAStar;

  constructor(browserClient: BrowserClient, mapHandler: MapHandler, movementHandler: MovementHandler) {
    this.browserClient = browserClient;
    this.mapHandler = mapHandler;
    this.movementHandler = movementHandler;
    this.pathFinder = new PathFinderWithAStar(this.mapHandler);
  }

  async findPathTo(initial: Coordinate, final: Coordinate): Promise<PathInformation> {
    return await this.pathFinder.getPathTo(initial, final);
  }

  async findNearestObjectPath(objectName: string): Promise<PathInformation> {
    const objectsToFind: MapObject[] = await this.mapHandler.getObjectsByName(objectName);
    
    const currentLocation = await this.movementHandler.getCurrentPosition();

    const distances = objectsToFind.map((object) => this
      .pathFinder
      .calculateDistance(currentLocation, { x: object.i, y: object.j }));

    // Get smallest distance
    const indexSmallestDistance = distances.indexOf(Math.min(...distances));
    const closestObject = objectsToFind[indexSmallestDistance];

    const pathInfo = await this.pathFinder.getPathTo(currentLocation, { x: closestObject.i, y: closestObject.j });


    return { path: pathInfo.path, location: { x: closestObject.i, y: closestObject.j } };
  }
}