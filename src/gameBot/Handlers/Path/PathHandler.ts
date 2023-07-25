import BrowserClient from '../../../browserClient/BrowserClient.client';
import MapHandler, { MapObject } from '../Map.handler';
import Path from './interfaces/Path';
import { PathInformation } from './interfaces/PathInformation';
import RawPath from './interfaces/RawPath';

const players: any = [];
const findPathFromTo = (a: any, b: any, c: any) => {}

export default class PathHandler {
  private browserClient: BrowserClient;
  mapHandler: MapHandler;

  constructor(browserClient: BrowserClient, mapHandler: MapHandler) {
    this.browserClient = browserClient;
    this.mapHandler = mapHandler;
  }

  evalGetPathTo(x: number, y: number) {
    return findPathFromTo(players[0], { i: x, j: y }, players[0]);
  }

  async getPathTo(x: number, y: number): Promise<Path> {
    const path: RawPath = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetPathTo, x, y);

    return path.map((square) => ({ x: square.i, y: square.j }));
  }

  async findNearestObjectPath(objects: MapObject[], objectName: string): Promise<PathInformation> {
    const objectsToFind: MapObject[] = objects.filter((object) => object.name === objectName);

    const allPathsPromises: Promise<Path>[] = objectsToFind.map((object) => {
      return this.getPathTo(object.i, object.j);
    });
    const allPaths: Path[] = await Promise.all(allPathsPromises);
    
    const notFilteredObjects: MapObject[] = [];
    let nonEmptyPath = allPaths.filter((path, index) => {
      if (path.length > 0) {
        notFilteredObjects.push(objectsToFind[index]);
        return true;
      }

      return false;
    });
    
    let indexShortestPath = 0;
    const shortestPath = nonEmptyPath.reduce((shortestPath: any, currentPath: any, index: number) => {
      if (currentPath.length < shortestPath.length) {
        indexShortestPath = index;
        return currentPath;
      }
      
      return shortestPath;
    }, nonEmptyPath[0]);
    
    const object = notFilteredObjects[indexShortestPath];
    
    return { path: shortestPath, object: object, location: { x: object.i, y: object.j } };
  }
  
  async getPathToNearestMob(name: string) {
    await this.mapHandler.scanMapDirect();
    const path: PathInformation = await this.findNearestObjectPath(this.mapHandler.currentMap, name);
    
    return path;
  }
}