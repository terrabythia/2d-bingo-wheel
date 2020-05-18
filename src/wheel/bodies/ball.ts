import Matter from 'matter-js';
import { BALL_BODY_MASS, BALL_BODY_DENSITY, DEFAULT_BALL_RADIUS, BALL_BODY_FRICTION, BALL_BODY_RESTITUTION } from '../../constants';

type BallBodyProps = {
    radius: number;
    texture: null | string;
    xPosition: number;
    yPosition: number;
    collisionCategory: null | number;
}

const defaultBallBodyProps: Partial<BallBodyProps> = {
    radius: DEFAULT_BALL_RADIUS,
    texture: null,
    xPosition: 0,
    yPosition: 0,
};

export const BallBody = (props: Partial<BallBodyProps> = {}) => {

    const p = {
        ...defaultBallBodyProps,
        ...props
    };

    let renderObj = {};
    if (p.texture) {
        renderObj = {
            render: {
                sprite: {
                    texture: p.texture
                }
            }
        }
    }

    let collisionFilterObj = {};
    if (p.collisionCategory) {
        collisionFilterObj = {
            collisionFilter: {
                category: p.collisionCategory,
                mask: 0x0001 | p.collisionCategory,
            }
        }
    }

    const ball = Matter.Bodies.circle(p.xPosition, p.yPosition, p.radius,
        {
            restitution: BALL_BODY_RESTITUTION,
            mass: BALL_BODY_MASS,
            density: BALL_BODY_DENSITY,
            friction: BALL_BODY_FRICTION,
            ...renderObj,
            ...collisionFilterObj
        }
    );

    return ball;

};