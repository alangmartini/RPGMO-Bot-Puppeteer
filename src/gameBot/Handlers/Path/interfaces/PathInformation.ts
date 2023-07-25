import MapObject from '../../MapObject';
import Coordinate from './Coordinate';
import Path from './Path';

export interface PathObjectAndLocation {
  path: Path;
  object: MapObject;
  location: Coordinate;
}

export interface PathAndLocation {
  path: Path;
  location: Coordinate;
}

type PathInformation = PathObjectAndLocation | PathAndLocation;

export default PathInformation;
