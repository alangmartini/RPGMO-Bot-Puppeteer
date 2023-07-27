import MapHandler from '../../Map/Map.handler';
import MapObject from '../../MapObject';
import { PathUtils } from './PathUtils';
import { aStar, aStarReversed } from './AStar';
import Coordinate from '../interfaces/Coordinate';
import Path from '../interfaces/Path';
import Nod from '../interfaces/Nod';
import GetPath from './GetPath';
import PathInformation from '../interfaces/PathInformation';


const map_walkable = (a:any, b:any, c:any) => {}

export default class PathFinderWithAStar extends GetPath {
  private mapHandler: MapHandler;

  constructor(mapHandler: MapHandler) {
    super();
    this.mapHandler = mapHandler;
  }

  getClosestWalkablePoint(x: number, y: number, grid: boolean[][], currentLocation: Coordinate): Coordinate | null {
    // Define the possible directions to check
    let directions = [
        { x: -1, y: 0 }, // left
        { x: 1, y: 0 },  // right
        { x: 0, y: -1 }, // up
        { x: 0, y: 1 }   // down
    ];

    let sortedDirections = directions.sort((a, b) => this.calculateDistance(b, currentLocation) - this.calculateDistance(a, currentLocation));
  
    // Check each direction
    for(let dir of sortedDirections) {
        let newX = x + dir.x;
        let newY = y + dir.y;
        
        // If the point is within the grid and walkable, return it
        if(newX >= 0 && newY >= 0 && newX < grid.length && newY < grid[0].length && grid[newX][newY] !== false) {
            return { x: newX, y: newY };
        }
    }
  
    // If none of the surrounding points are walkable, return null
    return null;
  }
  
  calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
    const dx = coord2.x - coord1.x;
    const dy = coord2.y - coord1.y;
    return dx * dx + dy * dy;
  }
  
  async getPathTo(start: Coordinate, final: Coordinate): Promise<PathInformation> {
    const grid: boolean[][] = await this.mapHandler.getWalkableMapAsGrid();
    
    // const booleanGrid = grid.map((row) => row.map((square) => square ? true : false));

    const finalAjusted = this.getClosestWalkablePoint(final.x, final.y, grid, start) as Coordinate;
    return { path: aStarReversed(start, finalAjusted, grid) as Nod[], location: final };
  }
}