import Matter from 'matter-js';

type MixerBodyProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
}

export const MixerBody = (props: MixerBodyProps) => {

    const mixerBody = Matter.Bodies.rectangle(
        props.x,
        props.y,
        props.width,
        props.height,
        {
            angle: props.angle,
            isStatic: true,
            density: 1,
        }
    );

    return mixerBody;

};