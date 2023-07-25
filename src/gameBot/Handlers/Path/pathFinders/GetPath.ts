import Coordinate from '../interfaces/Coordinate';
import Path from '../interfaces/Path';
import PathInformation from '../interfaces/PathInformation';


export default abstract class GetPath {
  abstract getPathTo(start: Coordinate, final: Coordinate): Promise<PathInformation>;
  abstract getAllPathsMultiThread(...args: any[]): Promise<PathInformation[]>;
}
