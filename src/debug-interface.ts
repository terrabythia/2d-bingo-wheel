
import Matter from 'matter-js';

const Bodies = Matter.Bodies;
const World = Matter.World;

export const DebugInterface = ({
    ballTextures,
    ballSpawnPositionX,
    ballSpawnPositionY,
    ballRadius,
    world,
    balls,
    createBall,
}) => {
    return {
        get nrOfBalls() {
            return balls.length;
        },
        set nrOfBalls(n: number) {
            console.log('update N', n);
            n = Math.max(1, Math.ceil(n));
            if (n > balls.length) {
                const referenceBall = balls[0];
                const addcount = n - balls.length;
                const newBalls = [];
                for (var i = 0; i < addcount; i++) {
                    // TODO: create a function to create a single (or multiple) balls! 
                    const ball = Bodies.circle(ballSpawnPositionX, ballSpawnPositionY, ballRadius,
                        {
                            restitution: referenceBall.restitution,
                            mass: referenceBall.mass,
                            friction: referenceBall.friction,
                            render: {
                                sprite: {
                                    texture: ballTextures[balls.length + i]
                                }
                            }
                        }
                    );
                    newBalls.push(
                        createBall(balls.length + i, {
                            xPosition: ballSpawnPositionX,
                            yPosition: ballSpawnPositionY
                        })
                    );
                }
                balls.push(...newBalls);
                World.add(world, newBalls);
            }
            else if (n < balls.length) {
                const removeCount = balls.length - n;
                for (var i = 0; i < removeCount; i++) {
                    const circle = balls.pop();
                    World.remove(world, circle);
                }
            }
        },
        get ballMass() {
            return balls[0].mass;
        },
        set ballMass(m: number) {
            balls.forEach(c => Matter.Body.setMass(c, m));
        },
        get ballDensity() {
            return balls[0].density;
        },
        set ballDensity(d: number) {
            balls.forEach(c => Matter.Body.setDensity(c, d));
        },
        get ballInertia() {
            return balls[0].inertia;
        },
        set ballInertia(i: number) {
            balls.forEach(c => Matter.Body.setInertia(c, i));
        }

    }
};

export default DebugInterface;