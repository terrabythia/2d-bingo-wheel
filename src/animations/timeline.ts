/**
 * Super simple animation timeline with some manipulation options
 */

type TimelineProps = {
    paused?: boolean;
    timeScale?: number;
    reversed?: boolean;
}

type UpdateCallback = (progress: number) => void;

const defaultTimelineProps = {
    paused: false,
    timeScale: 1,
    reversed: false,
};

/**
 * Returns a timeline object that 'animates' progress from 0 to 100 in the given time,
 * optionally manipulated by other factors like timeScale
 * 
 * @param durationMs duration in miliseconds 
 * @param updateCallback
 * @param props 
 */
export const Timeline = (durationMs: number, updateCallback: UpdateCallback, props: TimelineProps = {}) => {

    const p = {
        ...defaultTimelineProps,
        props,
    };

    let isPaused = p.paused;
    let isReversed = p.reversed;
    let timeScale = p.timeScale;

    let timeStart = performance.now();
    let timeElapsed = 0;
    let prevDelta = timeStart;

    const update = (now: number) => {

        const delta = now - prevDelta;
        prevDelta = now;
        
        if (!isPaused) {
            
            timeElapsed += (delta / timeScale) * (isReversed ? -1 : 1);
            if (timeElapsed > durationMs) {
                timeElapsed = 0;
            }
            const progress = timeElapsed / durationMs;
    
            updateCallback(progress);

        }       

        requestAnimationFrame(update);

    };

    requestAnimationFrame(update);
   
    return {
        reset() {
            timeElapsed = 0;
            timeStart = performance.now();
        },
        pause() {
            isPaused = true;
        },
        play() {
            isPaused = false;
        },
        reverse() {
            isReversed = !isReversed;
        },
        get reversed() {
            return isReversed;
        },
        get paused() {
            return isPaused;
        },
        set timeScale(t: number) {
            timeScale = t;
            // update!
        },
        get timeScale() {
            return timeScale;
        },
    
    };

};