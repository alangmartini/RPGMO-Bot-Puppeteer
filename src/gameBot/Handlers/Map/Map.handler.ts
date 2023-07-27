import BrowserClient from '../../../browserClient/BrowserClient.client';
import MapObject from '../MapObject';
import { MapDataJSON } from './MapDataJSON';
import { MapScanner } from './MapScanner';

export default class MapHandler {
  public browserClient: BrowserClient;
  private mapScanner: MapScanner;

  public currentMapObjects: MapObject[] = [];
  public mapAsGrid = [[]];
  public walkableMap: boolean[][] = [[]];

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
    this.mapScanner = new MapScanner(this.browserClient);
  }

  async getMapAsGrid(): Promise<MapObject[][]> {
    this.mapAsGrid = await this.mapScanner.scanMapGrid();

    return this.mapAsGrid;
  }

  async getWalkableMapAsGrid(): Promise<boolean[][]> {
    const currentMap = await this.mapScanner.getCurrentMap();

    const walkableMap: boolean[][] = await this.mapScanner.getWalkableMap();

    return walkableMap;
  }

  async getObjectsByName(objectName: string): Promise<MapObject[]> {
    // Updates current map
    this.currentMapObjects = await this.mapScanner.scanMapObjects();
    // Returns all objects with the same name
    return this.currentMapObjects.filter((object) => object.name === objectName);
  }
}
