// import BrowserClient from '../../../../browserClient/BrowserClient.client';
// import MapObject from '../../MapObject';
// import { PathEvals } from '../Path.handler';
// import { PathUtils } from './PathUtils';
// import Coordinate from '../interfaces/Coordinate';
// import Path from '../interfaces/Path';
// import RawPath from '../interfaces/RawPath';
// import GetPath from './GetPath';


// export default class PathFinderWithEval extends GetPath {
//   private browserClient: BrowserClient;

//   constructor(browserClient: BrowserClient) {
//     super();
//     this.browserClient = browserClient;
//   }

//   async getPathTo(start: Coordinate, final: Coordinate): Promise<Path> {
//     const path: RawPath = await this.browserClient.evaluateFunctionWithArgsAndReturn(PathEvals.getPathTo, final.x, final.y);

//     return path.map((square) => ({ x: square.i, y: square.j }));
//   }

//   async getAllPathsMultiThread(objectsToFind: MapObject[], currentLocation: Coordinate): Promise<Path[]> {
//     return PathUtils.getAllPathsMultiThread(objectsToFind, this.getPathTo.bind(this), currentLocation);
//   }
// }
