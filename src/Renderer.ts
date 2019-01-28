import { combineLatest, fromEvent, Subject } from "rxjs";
import { filter, map, sample } from "rxjs/operators";
import { ticker$ } from "./Core";
import { IGameObject } from "./Models";
import { objects$ } from "./Objects";

const setCanvas$ = new Subject<string>();
const onSetCanvasEvent$ = setCanvas$.pipe(
    map((id: string) => document.getElementById(id) as HTMLCanvasElement),
    filter((canvas) => !!canvas),
    map((canvas: HTMLCanvasElement) => ({
        canvas,
        context: canvas.getContext("2d"),
    })),
);

const renderer$ = combineLatest(ticker$, onSetCanvasEvent$, objects$)
    .pipe(
        filter(([ticker, { canvas, context }]) => (!!canvas && !!context)),
        sample(ticker$),
        map(([ticker, {canvas, context}, objects]) => ({canvas, context, objects})),
    );

export function DEFAULT_DRAW_SPRITE({canvas, context, objects}: {canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D, objects: Map<string, IGameObject>}) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((element: IGameObject) => {
        if (element.draw) {
            element.draw(element, canvas, context);
        } else {
            const position = element.location;
            const size = element.size;
            context.fillStyle = element.fill || "#000";
            context.beginPath();
            context.rect(
                position.x,
                position.y,
                size.x,
                size.y,
            );
            context.fill();
            context.closePath();
        }
    });
}

export function initRenderer(canvasId: string) {
    fromEvent(window, "load").subscribe(() => setCanvas$.next(canvasId));
    return renderer$;
}
