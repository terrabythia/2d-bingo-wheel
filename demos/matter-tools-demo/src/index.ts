import * as dat from 'dat.gui';
import Matter from 'matter-js';
import WebFont from 'webfontloader';
import Stats from 'stats.js';

import { Wheel } from '../../../src/wheel/wheel';
import { BallTexture } from '../../../src/wheel/textures/ball';
import { BallBody } from '../../../src/wheel/bodies/ball';
import {
  DEFAULT_BALL_RADIUS,
  DEFAULT_WHEEL_RADIUS,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  BALL_BODY_MASS,
  BALL_BODY_DENSITY,
  DEFAULT_NR_OF_BALLS,
  DEFAULT_COLLISION_LAYERS,
  COLLISION_LAYER_CATEGORIES,
} from '../../../src/constants';

const MAX_NR_OF_BALLS = 200;
const MAX_BALL_RADIUS = 20;
const GOOGLE_FONT_FAMILY = 'Droid Sans';

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Use WebfontLoader to load a font before creating the balls
 */
const loadCustomFont = () =>
  new Promise((resolve) => {
    WebFont.load({
      google: {
        families: [
          GOOGLE_FONT_FAMILY
        ]
      },
      active: resolve,
    });
  });

const onWindowLoad = async () => {

  // TODO: show loader
  const gui = new dat.GUI();

  await loadCustomFont();

  // We will create balls ourself so we can debug them
  const wheel = await Wheel({
    element: '#wheel',
    nrOfBalls: 0,
    canvasWidth: DEFAULT_CANVAS_WIDTH,
    canvasHeight: DEFAULT_CANVAS_HEIGHT,
    wheelRadius: DEFAULT_WHEEL_RADIUS,
    ballRadius: DEFAULT_BALL_RADIUS,
    collisionLayers: DEFAULT_COLLISION_LAYERS,
  });

  // get internals for debug purposes
  const {
    world,
    render,
    engine
  } = wheel._internals;

  const fpsStats = new Stats();
  fpsStats.showPanel(0);
  document.querySelector('#app').appendChild(fpsStats.dom);

  Matter.Events.on(render, "beforeRender", fpsStats.begin);
  Matter.Events.on(render, "afterRender", fpsStats.end);

  const debugInterface = {
    _ballIndex: 1,
    _nrOfBalls: DEFAULT_NR_OF_BALLS,
    _collisionLayers: DEFAULT_COLLISION_LAYERS,
    _ballRadius: DEFAULT_BALL_RADIUS,
    _ballMass: BALL_BODY_MASS,
    _ballDensity: BALL_BODY_DENSITY,
    set nrOfBalls(n: number) {
      this._nrOfBalls = n;
    },
    get nrOfBalls() {
      return this._nrOfBalls;
    },
    set collisionLayers(n: number) {
      this._collisionLayers = Math.ceil(n);
    },
    get collisionLayers() {
      return this._collisionLayers;
    },
    set ballMass(m: number) {
      this._ballMass = m;
    },
    get ballMass() {
      return this._ballMass;
    },
    set ballDensity(d: number) {
      this._ballDensity = d;
    },
    get ballDensity() {
      return this._ballDensity;
    },
    set ballRadius(r: number) {
      this._ballRadius = r;
    },
    get ballRadius() {
      return this._ballRadius;
    }
  };

  const getRandomCollisionCategory = (nrOfCategories: number = DEFAULT_COLLISION_LAYERS) => {
    const maxIndex = Math.min(nrOfCategories, COLLISION_LAYER_CATEGORIES.length);
    return COLLISION_LAYER_CATEGORIES[Math.floor(Math.random() * maxIndex)];
  };

  const createBall = async (index: number) => {

    const texture = await BallTexture({
      textContent: `${index + 1}`,
      radius: debugInterface.ballRadius,
      fontFamily: GOOGLE_FONT_FAMILY,
      fontYOffset: 2,
      fontSize: 15,
      fontFillStyle: 'rgba(0, 0, 0, 0.7)'
    });

    const ball = BallBody({
      radius: debugInterface.ballRadius,
      texture,
      xPosition: render.canvas.clientWidth / 2,
      yPosition: 100,
      collisionCategory: getRandomCollisionCategory(debugInterface.collisionLayers),
    });

    console.log(getRandomCollisionCategory(debugInterface.collisionLayers));

    return ball;

  };

  let balls = [];

  const update = async () => {

    // loop over balls and set props

    if (debugInterface.nrOfBalls !== balls.length) {
      if (debugInterface.nrOfBalls > balls.length) {

        const diff = debugInterface.nrOfBalls - balls.length;

        for (let i = 0; i < diff; i++) {

          const ball = await createBall(
            debugInterface._ballIndex
          );

          Matter.World.add(
            world,
            ball
          );

          balls.push(ball);

          debugInterface._ballIndex++;

          await timeout(50);

        }

      }
      else {

        const diff = balls.length - debugInterface.nrOfBalls;
        const removeBalls = balls.splice(balls.length - diff, diff);

        Matter.World.remove(
          world,
          removeBalls
        );

      }
    }

    let _balls = [];

    for (let i = 0; i < balls.length; i++) {

      let ball = balls[i];

      if (ball.mass !== debugInterface.ballMass) {
        Matter.Body.setMass(ball, debugInterface.ballMass);
      }
      if (ball.density !== debugInterface.ballDensity) {
        Matter.Body.setDensity(ball, debugInterface.ballDensity);
      }

      // if there is a radius update, remove and add new ball with new radius
      if (ball.circleRadius !== debugInterface.ballRadius) {

        Matter.World.remove(world, ball);

        ball = createBall(debugInterface._ballIndex);

        Matter.World.add(world, ball);

        debugInterface._ballIndex++;

        await timeout(50);

      }

      _balls.push(ball);
    }

    balls = _balls;

    // get wheel body and update props?

    // get stir body and update props?

  }

  gui.add(debugInterface, 'nrOfBalls', 1, MAX_NR_OF_BALLS);

  gui.add(debugInterface, 'ballRadius', 5, MAX_BALL_RADIUS);

  gui.add(debugInterface, 'ballMass');

  gui.add(debugInterface, 'ballDensity');

  const mixerTimelineInterface = {
      get mixerPaused(): boolean {
        return wheel.mixerTimeline.paused;
      },
      set mixerPaused(b: boolean) {
        this.mixerPaused ? wheel.mixerTimeline.play() : wheel.mixerTimeline.pause();
      },
      get mixerReversed(): boolean {
        return wheel.mixerTimeline.reversed;
      },
      set mixerReversed(b: boolean) {
        wheel.mixerTimeline.reverse();
      },
      get mixerTimeScale() {
        return wheel.mixerTimeline.timeScale;
      },
      set mixerTimeScale(t: number) {
        wheel.mixerTimeline.timeScale = Math.max(0.1, t);
      }
  };

  gui.add(mixerTimelineInterface, 'mixerPaused');
  gui.add(mixerTimelineInterface, 'mixerReversed');
  gui.add(mixerTimelineInterface, 'mixerTimeScale', 0.1, 3);

  const ballsEl = document.querySelector('#balls');
  const customFnsInterface = {
    pickBall() {

      const randomIndex = Math.floor(Math.random() * balls.length);

      // pull random ball from balls
      const ball = balls.splice(randomIndex, 1)[0];

      // remove from world also
      Matter.World.remove(
        world,
        ball
      );

      // add the texture as an image to the dom
      const img = document.createElement('img');
      img.src = ball.render.sprite.texture;
      ballsEl.appendChild(
        img
      );

      // TODO: add a map with metadata (such as the number of the ball)
      // TODO: in some way create a bingo card overview
      // TODO: randomly generate bingo cards? 

    },
  };

  gui.add(customFnsInterface, 'pickBall');

  const onTimeout = async () => {
    await update();
    setTimeout(onTimeout, 1000);
  };

  onTimeout();

};

window.addEventListener('load', onWindowLoad);
