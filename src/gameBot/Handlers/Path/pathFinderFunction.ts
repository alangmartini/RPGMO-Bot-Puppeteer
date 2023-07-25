import Coordinate from './interfaces/Coordinate';
import Nod from './interfaces/Nod';
import Path from './interfaces/Path';

export type nonGridPathFinderFunction = (start: Coordinate, final: Coordinate) => Promise<Path>;
export type gridPathFinderFunction = (start: Coordinate, end: Coordinate, grid: boolean[][]) => Nod[] | null;

type pathFinderFunction = nonGridPathFinderFunction | gridPathFinderFunction;

export default pathFinderFunction;