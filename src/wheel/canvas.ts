import Matter from 'matter-js';

const ballSvgAssets = [
    require('../assets/svg/blue-ball.svg'),
    require('../assets/svg/green-ball.svg'),
    require('../assets/svg/greenish-ball.svg'),  
    require('../assets/svg/orange-ball.svg'),  
    require('../assets/svg/pink-ball.svg'),  
    require('../assets/svg/purple-ball.svg'),  
    require('../assets/svg/red-ball.svg'),  
    require('../assets/svg/yellow-ball.svg'),
];

interface CanvasProps {
   element: string | HTMLCanvasElement; 
}

const createBallTextures = async (nrOfBalls: number, radius: number = 25) => {

    const canvasSize = radius * 2;

    // create the canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasSize.toString());
    canvas.setAttribute('height', canvasSize.toString());

    const context = canvas.getContext('2d');

    const ballTextures: string[] = [];

    for (let i = 0; i < nrOfBalls; i++) {

        const dataUrl: string = await new Promise((resolve, reject) => {
            context.clearRect(0, 0, canvasSize, canvasSize);
        
            const img = document.createElement('img');
            img.src = ballSvgAssets[Math.floor(Math.random() * ballSvgAssets.length)];

            const onImageLoad = (event) => {
                event.target.removeEventListener('load', onImageLoad);
                context.drawImage(event.target, 0, 0, canvasSize, canvasSize);
                context.font = "16px Arial";
                context.fillText(`${i}`, 5, 22);
                resolve(canvas.toDataURL());
            };

            img.addEventListener('load', onImageLoad);
        });

        ballTextures.push(dataUrl);
        
    }

    // for debug"
    // document.body.appendChild(canvas);

    return ballTextures.sort(function() { return 0.5 - Math.random() });

};

const NR_OF_BALLS = 60;
const BALL_RADIUS = 16;

export const Wheel = 
async ({ element }: CanvasProps) => {

    const ballTextures: ReadonlyArray<string> = await createBallTextures(NR_OF_BALLS, BALL_RADIUS);

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
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    const width = 800;
    const height = 600;

    // now create a canvas

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
        element: el,
        engine: engine,
        options: {
            width,
            height,
            showAngleIndicator: false,
            wireframes: false,
        }
    });

    Render.run(render);

    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    World.add(world, [
        // stack,
        ground
    ]);

    // create a static circle from x rectangles

    const NR_OF_POINTS = 50;
    const radius = 250;// the radius as a constant
    /* THETA is the angle of separation between each elemtents */
    const theta = 2 * Math.PI / NR_OF_POINTS;

    for(let i=0; i < NR_OF_POINTS; i++){
        let xPosition, yPosition;

        let currentAngle = i * theta;// calculate the current angle
        /* Get the positions */
        xPosition = radius * Math.cos(currentAngle); 
        yPosition = radius * Math.sin(currentAngle);

        const rock = Bodies.rectangle(
            width / 2 + xPosition, 
            height / 2 + yPosition, 
            3, 
            35, 
            { 
                angle: (currentAngle * 15.91549) * (2 * Math.PI / 100),
                isStatic: true
            });

            // setInterval(() => {
            //     Matter.Body.setAngle(rock, Math.random() * 6);
            //     // rock.angle = rock.currentAngle + 1;
            // }, 1000);

        World.add(world, [ rock ]);

    }

    const radius2 = radius * 0.5;
    const theta2 = 2 * Math.PI / NR_OF_BALLS;

     // todo: also draw the circles in a circle but with a smaller radius..  
     const circles = [];
     for (let i = 0; i < NR_OF_BALLS; i++) {

        let xPosition, yPosition;

        let currentAngle = i * theta2;// calculate the current angle
        /* Get the positions */
        xPosition = radius2 * Math.cos(currentAngle) + (width / 2); 
        yPosition = radius2 * Math.sin(currentAngle) + (height / 2);

        const circle = Bodies.circle(xPosition, yPosition, BALL_RADIUS, 
             { 
                 restitution: 1,
                 mass: 0.3, 
                 friction: 0.2,
                 render: {
                     sprite: { 
                         texture: ballTextures[i] 
                     }
                 } 
             }
         ); 
         circles.push(circle);
     }
     World.add(world, circles);

    // create 'stirrer' (for animation)

    const stir = Bodies.rectangle(
        width / 2, 
        height * 0.6, 
        10,
        height * 0.8,
        {
            angle: 0,
            isStatic: true,
            isVisible: false,
        }
    );

    World.add(world, [ stir ]);

    let stirAngle = 0;

    setInterval(() => {
        stirAngle += 0.03;
        Matter.Body.setAngle(stir, stirAngle );
        // Matter.Body.setHeight(stir, Math.random() * 300);
    }, 10);

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // Wrapping??

    Engine.run(engine);
    Render.run(render);

    // after render event: draw images
    Matter.Events.on(render, 'afterRender', (event) => {
        const {
            canvas, 
            context
        } = event.source;
        // draw image of the 'wheel' ?
    });

    return {
        randomBall() {
            // get ball and remove it from the world!
            if (circles.length === 0) {
                return null;
            }
            const randomIndex = Math.floor(Math.random() * circles.length);
            const randomCircle = circles.splice(randomIndex, 1)[0];
            World.remove(world, randomCircle);
            return randomCircle;
        }
    };

};