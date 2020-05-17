
const ballSvgAssets = [
    require('../../assets/svg/blue-ball.svg'),
    require('../../assets/svg/green-ball.svg'),
    require('../../assets/svg/greenish-ball.svg'),
    require('../../assets/svg/orange-ball.svg'),
    require('../../assets/svg/pink-ball.svg'),
    require('../../assets/svg/purple-ball.svg'),
    require('../../assets/svg/red-ball.svg'),
    require('../../assets/svg/yellow-ball.svg'),
];

type BaseBallTextureProps = {
    radius?: number;
    fontSize?: null | number;
    fontFamily?: string;
    fontFillStyle?: string;
    fontXOffset?: number;
    fontYOffset?: number;
};
// TODO: create fn to create single ballTexture (for debugging)

type BallTextureProps = {
    textContent: string;
} & BaseBallTextureProps;

const defaultBallTextureProps: Partial<BallTextureProps> = {
    radius: 25,
    fontSize: null,
    fontFamily: 'Arial, sans-serif',
    fontFillStyle: '#000000',
    fontXOffset: 0,
    fontYOffset: 0,
};

let canvas: HTMLCanvasElement | null = null;
export const BallTexture = async (props: BallTextureProps): Promise<string> => {

    const p: BallTextureProps = {
        ...defaultBallTextureProps,
        ...props,
    }

    const canvasSize = p.radius * 2;

    let fontSize = p.fontSize || p.radius;

    if (!canvas || canvas.getAttribute('width') !== canvasSize.toString()) {
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasSize.toString());
        canvas.setAttribute('height', canvasSize.toString());
    }

    const context = canvas.getContext('2d');

    const dataUrl: string = await new Promise((resolve, reject) => {

        context.clearRect(0, 0, canvasSize, canvasSize);

        const img = document.createElement('img');
        img.src = ballSvgAssets[Math.floor(Math.random() * ballSvgAssets.length)];

        const onImageLoad = (event) => {
            event.target.removeEventListener('load', onImageLoad);
            context.drawImage(event.target, 0, 0, canvasSize, canvasSize);
            context.font = `${fontSize}px ${p.fontFamily}`;
            context.textBaseline = 'middle';
            context.textAlign = "center";
            context.fillStyle = p.fontFillStyle;
            context.fillText(`${p.textContent}`, p.radius + p.fontXOffset, p.radius + p.fontYOffset);
            resolve(canvas.toDataURL());
        };

        img.addEventListener('load', onImageLoad);

    });

    return dataUrl;

};

// create multiple textures helper
export const createBallTextures = async (nrOfBalls: number, config?: Partial<BaseBallTextureProps>) => {

    const ballTextures: string[] = [];

    for (let i = 0; i < nrOfBalls; i++) {

        ballTextures.push(
            await BallTexture({
                textContent: `${i + 1}`,
                ...config
            })
        );

    }

    // clear up canvas for now:
    canvas = null;

    // for debug:
    // document.body.appendChild(canvas);

    return ballTextures.sort(function () { return 0.5 - Math.random() });

};