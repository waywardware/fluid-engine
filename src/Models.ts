export interface IPoints {
    x: number;
    y: number;
}

export enum EventType {
    ADD,
    REMOVE,
    COLLISION,
}

export interface IEvent {
    type: EventType;
    data: any;
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
