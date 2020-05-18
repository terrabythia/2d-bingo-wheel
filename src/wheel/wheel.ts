import Matter from 'matter-js';
import { createBallTextures } from './textures/ball';
import { BallBody } from './bodies/ball';
import { WheelBodyArr } from './bodies/wheel';

export type WheelProps = {
    element: string | HTMLElement;
    canvasWidth: number;
    canvasHeight: number;
    wheelRadius: number;
    nrOfBalls: number;
    ballRadius: number;
};

export const Wheel =
    async ({ element, ...config }: WheelProps) => {

        let el: HTMLCanvasElement;
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
        const stir = Bodies.rectangle(
            config.canvasWidth / 2,
            config.canvasHeight * 0.6,
            10,
            config.canvasHeight * 0.8,
            {
                angle: 0,
                isStatic: true,
                isVisible: false,
                density: 1,
            }
        );

        World.add(world, [stir]);

        let stirAngle = 0;

        setInterval(() => {
            stirAngle += 0.03;
            Matter.Body.setAngle(stir, stirAngle);
            // Matter.Body.setHeight(stir, Math.random() * 300);
        }, 10);

        const ballRadius = config.wheelRadius;
        const balls = new Map<Matter.Body, any>();

        if (config.nrOfBalls > 0) {

            const ballTextures = await createBallTextures(
                config.nrOfBalls,
                {
                    radius: ballRadius,
                }
            );
            // textures are ready
            for (let ballTexture of ballTextures) {
                const ball = BallBody({
                    texture: ballTexture,
                    radius: ballRadius,
                    xPosition: Math.floor(config.canvasWidth / 2),
                    yPosition: Math.floor(config.canvasHeight / 2),
                });

                balls.set(ball, {
                    imgData: ballTexture,
                });

            }

            World.add(
                world,
                balls.keys()
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

        // TODO: after render event: draw images on top
        // Matter.Events.on(render, 'afterRender', (event) => {
        //     const {
        //         canvas,
        //         context
        //     } = event.source;
        //     // draw image of the 'wheel' ?
        // });

        return {

            randomBall() {
                // get ball and remove it from the world!
                if (balls.size === 0) {
                    return null;
                }
                const randomIndex = Math.floor(Math.random() * balls.size);
                const randomBall = [...balls.keys()].splice(randomIndex, 1)[0];
                const ballMetadata = balls.get(randomBall);
                World.remove(world, randomBall);
                balls.delete(randomBall);
                return ballMetadata;
            },
            _internals: {
                engine,
                world,
                render
            }
        };

    };