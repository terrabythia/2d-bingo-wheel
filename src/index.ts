
import {
    Wheel as _Wheel
} from './wheel/wheel';

import {
    DEFAULT_WHEEL_RADIUS,
    DEFAULT_NR_OF_BALLS,
    DEFAULT_BALL_RADIUS,
    DEFAULT_CANVAS_WIDTH,
    DEFAULT_CANVAS_HEIGHT,
    DEFAULT_COLLISION_LAYERS
} from './constants';

// These variables seem to work the best out of the box
// to set your custom config, import the wheel from ./wheel/wheel


const defaultProps = {
    wheelRadius: DEFAULT_WHEEL_RADIUS,
    nrOfBalls: DEFAULT_NR_OF_BALLS,
    ballRadius: DEFAULT_BALL_RADIUS,
    canvasWidth: DEFAULT_CANVAS_WIDTH,
    canvasHeight: DEFAULT_CANVAS_HEIGHT,
    collisionLayers: DEFAULT_COLLISION_LAYERS,
};

export const Wheel = ({
    element
}: { element: string | HTMLElement }) => _Wheel({
    ...defaultProps,
    element,
});