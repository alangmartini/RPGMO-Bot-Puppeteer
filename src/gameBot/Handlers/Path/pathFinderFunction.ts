import Coordinate from './interfaces/Coordinate';
import Path from './interfaces/Path';

export type nonGridPathFinderFunction = (start: Coordinate, final: Coordinate) => Promise<Path>;
export type gridPathFinderFunction = (start: Coordinate, final: Coordinate, grid: any) => Promise<Path>;

type pathFinderFunction = nonGridPathFinderFunction | gridPathFinderFunction;

export default pathFinderFunction;