import { Wheel } from '../../src/index';
import { BallData } from '../../src/wheel/wheel';

const BALL_IMAGE_SIZE = 40;

// Create a wheel with standard properties
Wheel({
    element: '#wheel'
}).then((wheel) => {

    // add an on click to a button and then:
    const pickedBalls: BallData[] = [];

    const pickRandomBall = async () => {

        const ball = wheel.randomBall();

        if (null !== ball) {

            const imgData = await ball.createTextureOfSize(BALL_IMAGE_SIZE);

            const img = document.createElement('img');
            img.src = imgData;

            document.querySelector('#balls')
                .appendChild(
                    img
                );

            pickedBalls.push(
                ball
            );

        }
    };

    document.querySelector('#pick-ball-button')
        .addEventListener('click', (event) => {
            event.preventDefault();
            pickRandomBall();
        });

});