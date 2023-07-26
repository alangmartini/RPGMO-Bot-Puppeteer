import { on_map, current_map, obj_g } from './Map.handler';

const players = [{
  map: 0,
}];
const map_walkable = (a:any, b:any, c:any) => {}

export class MapEvals {
  static getCurrentMapDirect(): any {
    let algo: any = [];
    on_map[current_map].forEach((arrayX) => {
      arrayX.forEach((object) => {
        if (object !== false) {
          algo.push(object);
        }
      });
    });

    return algo.map((item: any) => obj_g(item)).filter((item: any) => item.id !== -1);
  }

  static getWalkableMap(): boolean[][] {
    let isWalkableGrid: boolean[][] = [];

    const x = Array.from({ length: 101 });
    const y = Array.from({ length: 101 });

    x.forEach((_, indexX) => {
        let columns: any = []
              
        y.forEach((_, indexY) => {
            columns.push(map_walkable(players[0].map, indexX, indexY));
        });

        isWalkableGrid.push(columns);
    });

    return isWalkableGrid;
  }

  static getMapAsGrid() {
    return on_map[current_map];
  }

  static getCurrentMap() {
    return current_map;
  }
}
