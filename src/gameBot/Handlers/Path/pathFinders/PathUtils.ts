import MapObject from '../../MapObject';
import Coordinate from '../interfaces/Coordinate';
import Path from '../interfaces/Path';
import PathInformation from '../interfaces/PathInformation';
import pathFinderFunction from '../pathFinderFunction';

export class PathUtils {
  static async getAllPathsMultiThread(objectsToFind: MapObject[], pathFinderFn: pathFinderFunction, start: Coordinate, grid?: boolean[][]) {

  }

  static filterEmptyPaths(allPaths: PathInformation[], objectsToFind: MapObject[]) {
    const notFilteredObjects: MapObject[] = [];

    let nonEmptyPaths = allPaths.filter((pathInfo, index) => {
      if (pathInfo.path.length > 0) {
        notFilteredObjects.push(objectsToFind[index]);
        return true;
      }

      return false;
    });

    return { nonEmptyPaths, notFilteredObjects };
  }

  static findSmallestPath(nonEmptyPaths: PathInformation[]) {
    let indexShortestPathInfo = 0;

    const shortestPathInfo = nonEmptyPaths.reduce((shortestPath, currentPath, index: number) => {
      if (currentPath.path.length < shortestPath.path.length) {
        indexShortestPathInfo = index;
        return currentPath;
      }

      return shortestPath;
    }, nonEmptyPaths[0]);

    return { shortestPathInfo, indexShortestPathInfo };
  }
}
