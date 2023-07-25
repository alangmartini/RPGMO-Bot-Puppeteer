import MapHandler from '../../Map.handler';
import MapObject from '../../MapObject';
import { PathUtils } from './PathUtils';
import { aStar } from './AStar';
import Coordinate from '../interfaces/Coordinate';
import Path from '../interfaces/Path';
import Nod from '../interfaces/Nod';
import GetPath from './GetPath';
import PathInformation from '../interfaces/PathInformation';

export default class PathFinderWithAStar extends GetPath {
  private mapHandler: MapHandler;

  constructor(mapHandler: MapHandler) {
    super();
    this.mapHandler = mapHandler;
  }

  getClosestWalkablePoint(x: number, y: number, grid: boolean[][]): Coordinate | null {
    // Define the possible directions to check
    let directions = [
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 },  // right
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 }   // down
    ];
  
    // Check each direction
    for(let dir of directions) {
        let newX = x + dir.dx;
        let newY = y + dir.dy;
        
        // If the point is within the grid and walkable, return it
        if(newX >= 0 && newY >= 0 && newX < grid.length && newY < grid[0].length && grid[newX][newY] === false) {
            return { x: newX, y: newY };
        }
    }
  
    // If none of the surrounding points are walkable, return null
    return null;
  }

  async getPathTo(start: Coordinate, final: Coordinate): Promise<PathInformation> {
    const grid = await this.mapHandler.getMapAsGrid();
    const booleanGrid = grid.map((row) => row.map((square) => square ? true : false));

    const finalAjusted = this.getClosestWalkablePoint(final.x, final.y, booleanGrid) as Coordinate;
    return { path: aStar(start, finalAjusted, booleanGrid) as Nod[], location: final };
  }

  async getAllPathsMultiThread(objectsToFind: MapObject[], currentLocation: Coordinate): Promise<PathInformation[]> {
    const grid = await this.mapHandler.getMapAsGrid();
    const booleanGrid = grid.map((row) => row.map((square) => square ? true : false));

    const objectsToFindOneCoordinateDeslocated = objectsToFind
      .map((object) => this.getClosestWalkablePoint(object.i, object.j, booleanGrid) as any);

    const allPathsPromises: Promise<Path>[] = (objectsToFindOneCoordinateDeslocated as any).map((object: any) => {
      return aStar(currentLocation, { x: object.i, y: object.j }, booleanGrid);
    });

    const allPaths: Path[] = await Promise.all(allPathsPromises);
    const allPathsWithLocations = allPaths.map((path, index) => ({ path, location: { x: objectsToFind[index].i, y: objectsToFind[index].j } }));
    
    return allPathsWithLocations;
  }
}