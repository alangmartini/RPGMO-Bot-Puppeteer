import { MapObject } from '../Map.handler';
import { Path } from './Path';
import { SquareLocale } from './SquareLocale';


export interface PathInformation {
  path: Path;
  object: MapObject;
  location: SquareLocale;
}
