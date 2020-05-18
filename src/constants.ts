
// These are default values that can be changed by passing 
// different props to the Wheel function
export const DEFAULT_COLLISION_LAYERS = 1;
export const DEFAULT_NR_OF_BALLS = 75;
export const DEFAULT_BALL_RADIUS = 16;
export const DEFAULT_WHEEL_RADIUS = 250;
export const DEFAULT_CANVAS_WIDTH = 600;
export const DEFAULT_CANVAS_HEIGHT = 600;

// These are constants that cannot be changed
export const BALL_BODY_RESTITUTION = 0.8;
export const BALL_BODY_MASS = 1;
export const BALL_BODY_DENSITY = 1;
export const BALL_BODY_FRICTION = 0.05;
export const MIXER_360_ANIMATION_DURATION = 2500;

export const COLLISION_LAYER_CATEGORIES = [
    0x0002,
    0x0004,
    0x0008,
    0x0016,
    0x0032,
    0x0064
];