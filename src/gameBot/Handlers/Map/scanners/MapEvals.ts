const players = [{
  map: 0,
}];
const obj_g = (a: any) => { console.log(a) };
const current_map = 0;
const on_map = {
  0: [[]]
}


const map_walkable = (a:any, b:any, c:any) => {}

export class MapEvals {
  static getCurrentMapDirect() {
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

  static getWalkableMap() {
    let isWalkableGrid: any = [];

    let xRepresentation = Array.from({ length: 101 });
    let yRepresentation = Array.from({ length: 101 });

    xRepresentation.forEach((_, indexX) => {
        let columns: any = []
              
        yRepresentation.forEach((_, indexY) => {
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
