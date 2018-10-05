/**
 * Copyright © 2018 - Baptiste Crespy <baptiste.crespy@gmail.com>
 * under the MIT license 
 * [https://github.com/bcrespy/creenv-core]
 */


/**
 * The Creenv class provides a strong structure behind the rendering logic. 
 * Any class inerhiting this one can use its rendering logic: one call to the bootstrap 
 * method and the render starts
 * 
 * @abstract
 */
class Creenv {

  /**
   * The Creenv class is abstract and therefore must be inherited
   */
  constructor() {
    /**
     * To keep track of the frames, this will be incremented on each update call
     * @type {number}
     * @protected
     */
    this.frames = 0;

    /**
     * The framerate is defined by the duration of each frame, in ms
     * @type {number}
     * @protected
     */
    this.framerate = 1000 / 60;

    /**
     * The timer initialized within the init method 
     * @type {Date} 
     * @protected
     */
    this.startTimer = null;

    /**
     * The timer of the last registered call to update method (cf: current frame)
     * @type {Date}
     * @protected
     */
    this.currentTimer = null;

    /**
     * The recorded timer of the last frame 
     * Used to compute the delta time between each frame
     * @type {Date}
     * @protected
     */
    this.lastFrameTimer = null;

    /**
     * The elapsed time between currentTimer and lastFrameTimer, in ms 
     * Is computed by computeDeltaT during the update call
     * @type {number} 
     * @protected
     */
    this.deltaT = 0;


    this.update = this.update.bind(this);
  }

  /**
   * Initialize the values before the render is called 
   * You can either return a promise if you need to fetch data for instance, 
   * or leave it as it if no special treatment is required 
   * 
   * @return {*}
   */
  init() {
    this.lastFrameTimer = Date.now();
    this.deltaT = 0;
  }
  
  /**
   * Generic method for errors handling 
   * 
   * @param {*} error generic data that can be displayed 
   */
  error( error ) {
    console.error( error );
  }

  /**
   * This method should not be overwritten. 
   * If the return of the init method is a Promise, the bootstrap method will wait 
   * until its resolve to start the rendering. Otherwise, the rendering will be 
   * start after the needed values are initialized
   * 
   * @final 
   */
  bootstrap() {
    let initialization = this.init();

    if( initialization instanceof Promise ) {
      initialization.then(this.update).catch(this.error);
    } else {
      this.update();
    }
  }

  /**
   * Specifies the framerate at which the render method will be called, in frames per second
   * 
   * @param {number} framesPerSecond the number of frames per second, integer
   */
  framerate( framesPerSecond ) {
    this.framerate = 1000 / framesPerSecond;
  }

  /**
   * This method fills the gap between the desired framerate and what requestAnimationFrame 
   * provides. The render() method will only be called if the elapsed time between the last
   * frame and this one is greater than the framerate.
   * 
   * @final
   */
  update() {
    requestAnimationFrame( this.update );
    // we compute delta time 
    this.currentTimer = Date.now();
    this.deltaT = this.computeDeltaT();

    // we check if the framerate since is elapsed, if it is we call the render method 
    if( this.deltaT > this.framerate ) {
      this.lastFrameTimer = this.currentTimer;
      this.frames++;
      this.render();
    }
  }

  /**
   * This is the method that needs to be overwritten by inerhitance to display stuff
   * It will be called regarding on the default (60fps) or specified framerate 
   * 
   * @abstract
   */
  render() {
  }

  /**
   * @return {number} the elpased time since last frame
   * @private
   */
  computeDeltaT() {
    return this.currentTimer - this.lastFrameTimer;
  }
}


export default Creenv;