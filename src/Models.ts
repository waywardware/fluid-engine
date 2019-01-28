export interface IPoints {
    x: number;
    y: number;
}

export interface ITimeObject {
    deltaTime: number,
    time: number,
}

export enum EventType {
    ADD,
    REMOVE,
    COLLISION,
}

export interface IEvent<T> {
    type: EventType;
    data: T;
}

export interface IInitialGameObjectData {
    name: string;
    location: IPoints;
    size: IPoints;
    fill?: string | CanvasGradient | CanvasPattern;
    draw?: (gameObject: IGameObject, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
    isGhost?: boolean;
    velocity?: IPoints;
}
export interface IGameObject extends IInitialGameObjectData {
    id: string;
    velocity: IPoints;
}
