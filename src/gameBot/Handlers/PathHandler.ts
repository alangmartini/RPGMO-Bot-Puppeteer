import BrowserClient from '../../browserClient/BrowserClient.client';
import { MapObject } from './Map.handler';


const players: any = [];
const findPathFromTo = (a: any, b: any, c: any) => {}

export interface SquareLocale {
  "x": number,
  "y": number,
}

export interface RawSquareLocale {
  "i": number,
  "j": number,
}

export type RawPath = RawSquareLocale[];
export type Path = SquareLocale[];

export interface PathInformation {
  path: Path,
  object: MapObject,
  location: SquareLocale,
}


export default class PathHandler {
  private browserClient: BrowserClient;

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
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

    let indexShortestPath = 0;
    const shortestPath = allPaths.reduce((shortestPath: any, currentPath: any, index: number) => {
      if (currentPath.length < shortestPath.length) {
        indexShortestPath = index;
        return currentPath;
      }

      return shortestPath;
    }, allPaths[0]);

    const object = objectsToFind[indexShortestPath];
    
    return { path: shortestPath, object: object, location: { x: object.i, y: object.j } };
  }
}