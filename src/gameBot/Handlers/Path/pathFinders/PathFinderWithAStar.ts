import MapHandler from '../../Map.handler';
import MapObject from '../../MapObject';
import { PathUtils } from '../PathUtils';
import { aStar } from '../AStar';
import Coordinate from '../interfaces/Coordinate';
import Path from '../interfaces/Path';
import Nod from '../interfaces/Nod';
import GetPath from './GetPath';

export default class PathFinderWithAStar extends GetPath {
  private mapHandler: MapHandler;

  constructor(mapHandler: MapHandler) {
    super();
    this.mapHandler = mapHandler;
  }

  async getPathTo(start: Coordinate, final: Coordinate): Promise<Path> {
    const grid = await this.mapHandler.getMapAsGrid();
    const booleanGrid = grid.map((row) => row.map((square) => square ? true : false));

    return aStar(start, final, booleanGrid) as Nod[];
  }

  async getAllPathsMultiThread(objectsToFind: MapObject[], currentLocation: Coordinate): Promise<Path[]> {
    const grid = await this.mapHandler.getMapAsGrid();
    const booleanGrid = grid.map((row) => row.map((square) => square ? true : false));

    return PathUtils.getAllPathsMultiThread(objectsToFind, this.getPathTo.bind(this), currentLocation, booleanGrid);
  }

}
