import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { EventType, IEvent, IGameObject } from "./Models";

const collisionEvent$ = new Subject<IGameObject[]>();
export const onCollisionEvent$ = collisionEvent$.pipe(
    map<IGameObject[], IEvent<IGameObject[]>>((collidingObjs: IGameObject[]) => ({
        type: EventType.COLLISION,
        data: collidingObjs,
    })),
);

export function isColliding(obj1: IGameObject, obj2: IGameObject): boolean {
    return obj1.location.x < obj2.location.x + obj2.size.x &&
        obj1.location.x + obj1.size.x > obj2.location.x &&
        obj1.location.y < obj2.location.y + obj2.size.y &&
        obj1.location.y + obj1.size.y > obj2.location.y;
}

export function checkForCollision(...gameObjects: IGameObject[]): void {
    for (let i = 0; i < gameObjects.length; i++) {
        for (let j = i + 1; j < gameObjects.length; j++) {
            const obj1: IGameObject = gameObjects[i];
            const obj2: IGameObject = gameObjects[j];
            if (!obj1.isGhost && !obj2.isGhost && isColliding(obj1, obj2)) {
                fireCollisionEvent(obj1, obj2);
            }
        }
    }
}

export function checkAndFireCollisionEvent(obj1: IGameObject, obj2: IGameObject): void {
    if (isColliding(obj1, obj2)) {
        fireCollisionEvent(obj1, obj2);
    }
}

export function fireCollisionEvent(obj1: IGameObject, obj2: IGameObject): void {
    collisionEvent$.next([obj1, obj2]);
}
