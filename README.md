# The core of the creative environment Creenv

Creenv was developed to make the fastidious process of setting up an es6 environment easy.

To setup a Creenv project, please visit [**the create-creenv CLI page**](https://github.com/bcrespy/create-creenv).

This paper goes through the logic behind the Core and behind the creation of the Core. However, [**looking at the examples**]() -**NEEDS TO BE ADDED**- will probably help you more than reading this whole thing.

## The goal of the core module 

The core module provides a structure to start an application without taking care of the underlaying process behind the call to the render method. The best way to explain why it's easier to start your creative project using the @creenv/core is to how the rendering logic would be done without and with @creenv/core.

### Without @creenv/core

``` js 
/**
 * even though having the delta time deltaT between each frame not required
 * for every project, more than often you need it to generate visuals
 **/
let lastFrameTimer,
    currentTimer,
    deltaT;

/**
 * For the demonstration, we will assume that you need to allocate an array 
 * and init a canvas 
 **/
let array,
    canvas,
    context;

function init () {
  lastFrameTimer = Date.now();

  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  array = new Array(500*500);
}

function update () {
  window.requestAnimationFrame(update);

  // we compute the delta time value 
  currentTimer = Date.now();
  deltaT = currentTimer - lastFrameTimer;
}

function render (deltaT) {
  // here comes your rendering stuff
  console.log(deltaT);
}
```

Pros: 
* quick to set up
* easy to understand

Cons:
* not-so-quick if you think about how redundant it becomes to do the same thing on every project. Moreover, if you use this setup it's very likely that you created your project structure by hand, again redundant 
* ugly: with es6 came the possibility to develop with classes, a huge step-up in my opinion. With this set up, your code will quickly become too hard to read, and small improvements will require that you dive into unecessary thinking about what function does what
* hard to split: even when writting creative code, it can be quite useful to split your code in multiple files (a Particle class, a Bubble class...etc). If it's not impossible to do so with this structure, it's ugly. For example here, the init function has 2 objectives: setting up the timer + setting up all the variables our rendering stuff needs = not easily readable

### With @creenv/core

First of all, if you're using @creenv/core, you're most likely using Creenv, which means that this section of code will be all the required setup for your app

```js
import Creenv from '@creenv/core';

class MyProject extends Creenv {
  // we overwrite the parent method, init 
  init () {
    // we can the parent method 
    super.init();

    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.context("2d");
    this.array = new Array(500*500);
  }

  // we overwrite the parent method, init. this method will be called each frame
  render () {
    // here comes your rendering stuff
    console.log(this.deltaT);
  }
}

let myProject = new MyProject();

// this method will call the init method and then will start the rendering logic
myProject.bootstrap();
```

Pros: 
* fast to set up, even more if you consider that this will be the only thing you will have to write since all your project will be set up by create-creenv.
* evolutive: use the power of oriented object programming to encapsulate your files. easier to work with
* looks better
* need to change the framerate ? this.framerate(30). need to get the frame ? this.frame. Simply easier.

Cons:
* harder to understand. But again, this is some time investment you're making here. Once you will get the logic, you will be able to start a good looking project easily

## How does it work ?

When you code to generate visual, there are usually 3 steps in your app logic :
* set up the elements: get the canvas, the context, start threejs... etc
* initialize the data. get data from files, allocate arrays, fetch data from the internet... etc
* create the visual in a rendering loop 

However, the code structure you are using to have this process working is almost all the time the same, and setting up a javascript project can be really boring. I've heard multiple friends telling me they tried to work with js to generate visuals, but stopped right before diving into the code because the javascript ecosystem is scary. And it is. So came to me the idea to put the logic behind the ecosystem away to only play with js and be able to share their work with a link. 

The Core work as following:

* call to the bootstrap() method
* the bootstrap() method calls the init() method. If the init() method returns a Promise, the update() method will only be called once the Promise resolve. Otherwise once init() is done, update() is called
* the update() method computes time data (deltaT), and call itself in a loop given the framerate. Each time the update() method is called, the render() method is also called 
* in the render() method comes your rendering logic.