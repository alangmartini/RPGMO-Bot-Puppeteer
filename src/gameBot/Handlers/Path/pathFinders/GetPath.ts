import Coordinate from '../interfaces/Coordinate';
import Path from '../interfaces/Path';


export default abstract class GetPath {
  abstract getPathTo(start: Coordinate, final: Coordinate): Promise<Path>;
  abstract getAllPathsMultiThread(...args: any[]): Promise<Path[]>;
}
