import BrowserClient from '../../../browserClient/BrowserClient.client';
import MapHandler from '../Map.handler';
import MapObject from '../MapObject';
import MovementHandler from '../Movement.handler';
import { PathUtils } from './PathUtils';
import Path from './interfaces/Path';
import { PathInformation } from './interfaces/PathInformation';
import PathFinderWithAStar from './pathFinders/PathFinderWithAStar';
import GetPath from './pathFinders/GetPath';

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
  private pathFinder: GetPath;

  constructor(browserClient: BrowserClient, mapHandler: MapHandler, movementHandler: MovementHandler) {
    this.browserClient = browserClient;
    this.mapHandler = mapHandler;
    this.movementHandler = movementHandler;
    this.pathFinder = new PathFinderWithAStar(this.mapHandler);
  }

  async findNearestObjectPath(objectName: string): Promise<PathInformation> {
    const objectsToFind: MapObject[] = await this.mapHandler.getObjectsByName(objectName);

    const currentLocation = await this.movementHandler.getCurrentPosition();
  
    console.time("getAllPathsMultiThread");
    const allPaths: Path[] = await this.pathFinder.getAllPathsMultiThread(objectsToFind, currentLocation);
    console.timeEnd("getAllPathsMultiThread");

    const { nonEmptyPaths, notFilteredObjects} = PathUtils.filterEmptyPaths(allPaths, objectsToFind);
      
    const { shortestPath, indexShortestPath } = PathUtils.findSmallestPath(nonEmptyPaths);

    const closestObject = notFilteredObjects[indexShortestPath];

    return { path: shortestPath, object: closestObject, location: { x: closestObject.i, y: closestObject.j } };
  }
}