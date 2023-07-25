import MapObject from '../MapObject';
import Coordinate from './interfaces/Coordinate';
import Path from './interfaces/Path';
import pathFinderFunction from './pathFinderFunction';

export class PathUtils {
  static async getAllPathsMultiThread(objectsToFind: MapObject[], pathFinderFn: pathFinderFunction, start: Coordinate, grid?: boolean[][]) {
    const allPathsPromises: Promise<Path>[] = objectsToFind.map((object) => {
      return pathFinderFn(start, { x: object.i, y: object.j }, grid);
    });

    const allPaths: Path[] = await Promise.all(allPathsPromises);

    return allPaths;
  }

  static filterEmptyPaths(allPaths: Path[], objectsToFind: MapObject[]) {
    const notFilteredObjects: MapObject[] = [];

    let nonEmptyPaths = allPaths.filter((path, index) => {
      if (path.length > 0) {
        notFilteredObjects.push(objectsToFind[index]);
        return true;
      }

      return false;
    });

    return { nonEmptyPaths, notFilteredObjects };
  }

  static findSmallestPath(nonEmptyPaths: Path[]) {
    let indexShortestPath = 0;

    const shortestPath = nonEmptyPaths.reduce((shortestPath: any, currentPath: any, index: number) => {
      if (currentPath.length < shortestPath.length) {
        indexShortestPath = index;
        return currentPath;
      }

      return shortestPath;
    }, nonEmptyPaths[0]);

    return { shortestPath, indexShortestPath };
  }
}
