import Matter from 'matter-js';
import { BallTexture } from './textures/ball';
import { BallBody } from './bodies/ball';
import { WheelBodyArr } from './bodies/wheel';
import { Timeline } from '../animations/timeline';
import { MixerBody } from './bodies/mixer';
import { MIXER_360_ANIMATION_DURATION, COLLISION_LAYER_CATEGORIES } from '../constants';

export type BallData = {
    number: number;
    textureImgData: string;
    createTextureOfSize: (size: number) => Promise<string>;
}

export type WheelProps = {
    element: string | HTMLElement;
    canvasWidth: number;
    canvasHeight: number;
    wheelRadius: number;
    nrOfBalls: number;
    ballRadius: number;
    collisionLayers: number;
};

const createBallTexture = (textContent: string) => (radius: number) =>
    BallTexture({ radius, textContent });

export const Wheel =
    async ({ element, ...config }: WheelProps) => {

        const balls = new Map<Matter.Body, BallData>();


        const getRandomCollisionCategory = () => {
            const maxIndex = Math.min(config.collisionLayers, COLLISION_LAYER_CATEGORIES.length);
            return COLLISION_LAYER_CATEGORIES[Math.floor(Math.random() * maxIndex)];
        };

        let el: HTMLElement;
        if ('string' === typeof element) {
            el = document.querySelector(element);
        }
        else {
            el = element;
        }

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            World = Matter.World,
            Bodies = Matter.Bodies;


        const engine = Engine.create();
        const world = engine.world;

        const render = Render.create({
            element: el,
            engine: engine,
            options: {
                width: config.canvasWidth,
                height: config.canvasHeight,
                showAngleIndicator: false,
                wireframes: false,
            }
        });

        // TODO: create dynamic ground based on props
        const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        World.add(world, [
            ground
        ]);

        const wheelBodyParts = WheelBodyArr({
            radius: config.wheelRadius,
            offsetX: (config.canvasWidth - config.wheelRadius * 2) / 2,
            offsetY: (config.canvasHeight - config.wheelRadius * 2) / 2,
        });

        World.add(
            world,
            wheelBodyParts
        );

        // create 'stirrer' (for animation)

        const startAngle = 90 * (Math.PI / 180);
        const mixer = MixerBody({
            angle: startAngle,
            x: config.canvasWidth / 2,
            y: config.canvasHeight * 0.6,
            width: 10,
            height: config.canvasHeight * 0.8
        });

        World.add(
            world,
            [mixer]
        );

        const timeline = Timeline(MIXER_360_ANIMATION_DURATION, (progress) => {

            const angle = startAngle + (progress * 360) * (Math.PI / 180);
            Matter.Body.setAngle(mixer, angle);

        });

        const ballRadius = config.ballRadius;

        if (config.nrOfBalls > 0) {

            for (let i = 0; i < config.nrOfBalls; i++) {

                const texture = await BallTexture({
                    textContent: `${i + 1}`,
                    radius: ballRadius,
                });

                // TODO: arange them in a circle again?
                const ball = BallBody({
                    texture,
                    radius: ballRadius,
                    xPosition: Math.floor(config.canvasWidth / 2),
                    yPosition: Math.floor(config.canvasHeight / 2),
                    ...(config.collisionLayers > 1 ? { collisionCategory: getRandomCollisionCategory() } : {})
                });

                balls.set(ball, {
                    number: i + 1,
                    textureImgData: texture,
                    createTextureOfSize: createBallTexture(`${i + 1}`),
                });

                i++;

            }

            console.log(balls);

            World.add(
                world,
                Array.from(balls.keys())
            );

        }

        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: config.canvasWidth, y: config.canvasHeight }
        });

        Engine.run(engine);
        Render.run(render);

        const runner = Runner.create();
        Runner.run(runner, engine);

        // TODO: after render event: draw images on top?
        // Matter.Events.on(render, 'afterRender', (event) => {
        //     const {
        //         canvas,
        //         context
        //     } = event.source;
        //     // draw image of the 'wheel' ?
        // });

        return {

            randomBall(): BallData | null {
                // get ball and remove it from the world!
                if (balls.size === 0) {
                    return null;
                }
                const randomIndex = Math.floor(Math.random() * balls.size);
                const randomBall = Array.from(balls.keys()).splice(randomIndex, 1)[0];
                const ballMetadata = balls.get(randomBall);
                World.remove(world, randomBall);
                balls.delete(randomBall);
                return ballMetadata;
            },
            mixerTimeline: timeline,
            canvas: render.canvas,
            _internals: {
                engine,
                world,
                render
            }
        };

    };