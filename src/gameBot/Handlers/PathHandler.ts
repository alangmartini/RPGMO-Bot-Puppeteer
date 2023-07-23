import BrowserClient from '../../browserClient/BrowserClient.client';
import { MapObject } from './Map.handler';


const players: any = [];
const findPathFromTo = (a: any, b: any, c: any) => {}

export default class PathHandler {
  private browserClient: BrowserClient;

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  evalGetPathTo(x: number, y: number) {
    return findPathFromTo(players[0], { i: x, j: y }, players[0]);
  }

  async getPathTo(x: number, y: number) {
    const path = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetPathTo, x, y);

    return path;
  }

  async findNearestObjectPath(objects: MapObject[], objectName: string) {
    const objectsToFind = objects.filter((object) => object.name === objectName);

    const allPathsPromises = objectsToFind.map((object) => {
      return this.getPathTo(object.i, object.j);
    });

    const allPaths = await Promise.all(allPathsPromises);

    const shortestPath = allPaths.reduce((shortestPath: any, currentPath: any) => {
      if (currentPath.length < shortestPath.length) {
        return currentPath;
      }

      return shortestPath;
    }, allPaths[0]);

    return shortestPath;
  }
}