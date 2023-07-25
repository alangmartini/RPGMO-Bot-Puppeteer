import Coordinate from '../interfaces/Coordinate';
import Nod from '../interfaces/Nod';

export function aStar(start: Coordinate, end: Coordinate, grid: boolean[][]): Nod[] | null {
    // Create start and end nod
    let startNod = new Nod(start.x, start.y);
    let endNod = new Nod(end.x, end.y);

    // Initialize both open and closed list
    let openList: Nod[] = [];
    let closedList: Nod[] = [];
    openList.push(startNod);

    // Loop until you find the end
    while(openList.length > 0) {
        // Get the current nod
        let currentNod = openList[0];
        let currentIndex = 0;

        for(let i = 0; i < openList.length; i++) {
            if(openList[i].f < currentNod.f) {
                currentNod = openList[i];
                currentIndex = i;
            }
        }

        // Pop current off open list, add to closed list
        openList.splice(currentIndex, 1);
        closedList.push(currentNod);

        // Found the goal
        if(currentNod.x === endNod.x && currentNod.y === endNod.y) {
            let path: Nod[] = [];
            let current: Nod | null = currentNod;

            // Go back from the end to the start following the parent nods
            while(current != null) {
                path.push(current);
                current = current.parent;
            }

            return path;
            // return path.reverse();
        }

        // Generate children
        let children: Nod[] = [];
        for(let newPosition of [ {x: -1, y: 0 }, {x: 1, y: 0 }, {x: 0, y: -1 }, {x: 0, y: 1 }]) {
            // Get nod position
            let nodPosition: Coordinate = { x: currentNod.x + newPosition.x, y: currentNod.y + newPosition.y };

            // Make sure within range
            if(nodPosition.x > grid.length - 1 || nodPosition.x < 0 || nodPosition.y > grid[0].length - 1 || nodPosition.y < 0) {
                continue;
            }

            // Make sure walkable terrain
            if(grid[nodPosition.x][nodPosition.y]) {
                continue;
            }

            // Create new nod
            let newNod = new Nod(nodPosition.x, nodPosition.y);

            // Set parent
            newNod.parent = currentNod;
            
            // Append
            children.push(newNod);
        }

        // Loop through children
        for(let child of children) {
            // Child is on the closedList
            if(closedList.some(nod => nod.x === child.x && nod.y === child.y)) {
                continue;
            }

            // Create the f, g, and h values
            child.g = currentNod.g + 1;
            child.h = Math.pow(child.x - endNod.x, 2) + Math.pow(child.y - endNod.y, 2);
            child.f = child.g + child.h;

            // Child is already in openList
            if(openList.some(nod => nod.x === child.x && nod.y === child.y && child.g >= nod.g)) {
                continue;
            }

            // Add the child to the openList
            openList.push(child);
        }
    }
    return null;
}
