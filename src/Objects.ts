import { merge, Subject } from "rxjs";
import { filter, map, scan, share } from "rxjs/operators";
import uuid from "uuid";
import { EventType, IEvent, IGameObject, IInitialGameObjectData, IPoints } from "./Models";

export function addGameObject(gameObjectData: IInitialGameObjectData): void {
    addObject$.next(gameObjectData);
}

export function removeGameObject(id: string): void {
    removeObject$.next(id);
}

const addObject$ = new Subject<IInitialGameObjectData>();
const removeObject$ = new Subject<string>();

export const onAddObjectEvent$ = addObject$.pipe(
    filter<IInitialGameObjectData>(() => true), // TODO sanitize
    map<IInitialGameObjectData, IGameObject>((obj) => {
        const gameObject: IGameObject = obj as IGameObject;
        gameObject.id = uuid();
        if (!gameObject.velocity) {
            gameObject.velocity = { x: 0, y: 0 };
        }
        return gameObject;
    }),
    map<IGameObject, IEvent<IGameObject>>((obj: IGameObject) => ({
        data: obj,
        type: EventType.ADD,
    }))
);

export const onRemoveObjectEvent$ = removeObject$.pipe(
    filter((id) => true), // TODO sanitize
    map<string, IEvent<string>>((id) => ({
        data: id,
        type: EventType.REMOVE,
    })),
);

export const objects$ = merge(
    onAddObjectEvent$,
    onRemoveObjectEvent$,
).pipe(
    scan<IEvent<IGameObject | string>, Map<string, IGameObject>>((store: Map<string, IGameObject>, item: IEvent<IGameObject | string>) => {
        switch (item.type) {
            case EventType.ADD:
                const obj: IGameObject = item.data as IGameObject;
                return store.set(obj.id, obj);
            case EventType.REMOVE:
                const id: string = item.data as string;
                if (id) {
                    store.delete(id);
                }
                break;
        }
        return store;
    }, new Map()),
    share(),
);
