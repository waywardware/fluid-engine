import { animationFrameScheduler, interval } from "rxjs";
import { map, scan } from "rxjs/operators";
import { ITimeObject } from "./Models";

export const ticker$ = interval(1000 / 60, animationFrameScheduler)
    .pipe(
        map<number, ITimeObject>(() => ({
            deltaTime: 0,
            time: Date.now(),
        })),
        scan<ITimeObject>((previous: ITimeObject, current: ITimeObject) => ({
            deltaTime: (current.time - previous.time) / 1000,
            time: current.time,
        })),
    );
