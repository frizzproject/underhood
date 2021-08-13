// Dependency: Pixijs 5.0.x

// Particle SYstem
export default class PSY {
  constructor({app, nPtc = 1500}) {
    this.app = app;
    this.nPtc = nPtc;
    this.container = this._createContainer();
  }
  _createContainer() {
    const wrap = new PIXI.Container();
    const pc = new PIXI.ParticleContainer(this.nPtc, {
      vertices:true, position:true, rotation:true, tint:true
    });
    this.app.stage.addChild(wrap);
    wrap.addChild(pc);
    return wrap;
  }
  _addSprites(tex) {
    for (const i of Array(this.nPtc).keys()) {
      const sp = this._makeSprite(tex, i);
      this.container.addChild(sp);
    }
  }
  _makeSprite(tex, i) {
    const sp = new PIXI.Sprite(tex);
    sp.$id = i
    this.recycle(sp, true);
    return sp;
  }
  regen() {
    this.container.removeChildren();
    this.container.filterArea = this.app.screen;
    const g = new PIXI.Graphics();
    this.buildTexture(g);
    this._addSprites(this.app.renderer.generateTexture(g));   
  }
  /*abstract*/ buildTexture(graphic) {throw 'not_impl'}
  /*abstract*/ recycle(sprite, isFirstRun) {throw 'not_impl'}
  /*abstract*/ update() {throw 'not_impl'}
}

// 
export const Psy = PSY;

// App
export class App {
  constructor({pixiOpts}={}) {
    this.app = this._createApp({pixiOpts});
    this.psys = [];
    const instance = this;
    this.Psy = class extends PSY {
      constructor({nPtc}) {
        super({app:instance.app, nPtc})
      }
    }
  }
  get view() {
    return this.app.view;
  }
  _createApp({pixiOpts}) {
    const app = new PIXI.Application({
      transparent: true, 
      antialias: false,
      resizeTo: document.body,
      ...pixiOpts
    });
    app.ticker.add(() => {
      for (const psy of this.psys) {
        psy.update()
      }
    });
    window.addEventListener('resize', () => {
      for (const psy of this.psys) {
        psy.regen();
      }
    });
    document.body.append(app.view)
    return app;
  }
  regPsy(psy/*:PSY*/) {
    if (psy.app !== this.app) {
      throw 'psy.app  must be the same of App.app';
    }
    this.psys.push(psy);
    psy.regen();
  }
  unregPsy(psy) {
    this.psys = this.psys.filter(x => x !== psy);
  }
} 




// ------------- USAGE -------------------
// class Psy0 extends PSY {
//   constructor({app, nPtc}) {
//     super({app, nPtc});
//   }
//   buildTexture(g) {
//     g.beginFill(0, 1);
//     g.drawCircle(50, 50, 50);
//     g.endFill();
//   }
//   recycle(sp, isFirstRun) {
//     const i = sp.$id / (this.nPtc - 1);
//     if (isFirstRun) {
//       sp.position.y = i * innerHeight;
//       sp.position.x = i * innerWidth;
//       sp.anchor.set(0.5, 0.5);
//     }
//     else {
//       sp.position.y = -sp.texture.height/2;
//     }
//     sp.$vy = 1 + i; 
//   }
//   update() {
//     const mxw = innerWidth;
//     const mxh = innerHeight;
//     for (const sp of this.container.children) {
//       const bounds = sp.getBounds();
//       sp.position.y += sp.$vy;
//       if (bounds.y > mxh) {
//         this.recycle(sp);
//       }
//     }
//   }
// }

// // ------------------ app MAIN
// const app = new PIXI.Application({transparent:true});
// document.body.prepend(app.view);
// const psy0 = new Psy0({app, nPtc:10});
// /////////////////// Update
// app.ticker.add(() => {
//   psy0.update();
// });
// ////////////////// resize
// onresize = () => {
//   app.renderer.resize(innerWidth, innerHeight);
//   psy0.regen();
// }
// onresize();