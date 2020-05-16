import {Wheel} from './wheel/canvas';

Wheel({
    element: '#wheel'
}).then((wheel) => {
    console.log(wheel);
    // setInterval(() => {
    //     if (null === wheel.randomBall()) {
    //         window.location.reload();
    //     }
    // }, 1000);
});