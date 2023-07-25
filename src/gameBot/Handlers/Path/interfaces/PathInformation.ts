import MapObject from '../../MapObject';
import Path from './Path';
import SquareLocale from './SquareLocale';

export interface PathInformation {
  path: Path;
  object: MapObject;
  location: SquareLocale;
}
