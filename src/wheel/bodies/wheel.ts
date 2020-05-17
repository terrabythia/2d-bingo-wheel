import Matter from 'matter-js';

type WheelBodyProps = {
    radius: number;
    offsetX: number;
    offsetY: number;
    nrOfVertices: number;
    verticyWidth: number;
    verticyLength: number;
}

const defaultWheelBodyProps: Partial<WheelBodyProps> = {
    radius: 250,
    offsetX: 0,
    offsetY: 0,
    nrOfVertices: 80,
    verticyWidth: 5,
    verticyLength: 36
};

export const WheelBodyArr = (props: Partial<WheelBodyProps>): Matter.Body[] => {

    const p = {
        ...defaultWheelBodyProps,
        ...props
    };

    /* THETA is the angle of separation between each elemtents */
    const theta = 2 * Math.PI / p.nrOfVertices;
    const verts = [];

    for (let i = 0; i < p.nrOfVertices; i++) {

        let xPosition: number, yPosition: number;

        let currentAngle = i * theta;// calculate the current angle
        /* Get the positions */
        xPosition = p.radius * Math.cos(currentAngle);
        yPosition = p.radius * Math.sin(currentAngle);

        const vert = Matter.Bodies.rectangle(
            p.radius + xPosition + p.offsetX,
            p.radius + yPosition + p.offsetY,
            p.verticyWidth,
            p.verticyLength,
            {
                angle: (currentAngle * 15.91549) * (2 * Math.PI / 100),
                density: 1,
                isStatic: true
            });

        verts.push(vert);

    }

    return verts;

};