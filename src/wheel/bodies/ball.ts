import Matter from 'matter-js';
import { BALL_BODY_MASS } from '../../constants';

type BallBodyProps = {
    radius: number;
    texture: null | string;
    xPosition: number;
    yPosition: number;
}

const defaultBallBodyProps: Partial<BallBodyProps> = {
    radius: 16,
    texture: null,
    xPosition: 0,
    yPosition: 0,
};


export const BallBody = (props: Partial<BallBodyProps> = {}, matterBodyOpts = {}) => {

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

    const ball = Matter.Bodies.circle(p.xPosition, p.yPosition, p.radius,
        {
            restitution: 1,
            mass: BALL_BODY_MASS,
            friction: 0.2,
            ...renderObj,
            ...matterBodyOpts,
        }
    );

    return ball;

};