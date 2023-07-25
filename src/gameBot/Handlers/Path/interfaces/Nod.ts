import Coordinate from './Coordinate';

export default class Nod implements Coordinate {
    x: number;
    y: number;
    f: number;
    g: number;
    h: number;
    parent: Nod | null;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parent = null;
    }
}
