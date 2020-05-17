import Matter from 'matter-js';

export const DebugInterface = ({
    wheel,
}) => {

    const {
        world,
        engine,
        render
    } = wheel._internals;

    Matter.World.add(world, createBall());

};