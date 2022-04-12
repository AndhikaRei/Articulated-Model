'use strict';

/** 
 * @type {string} 
 * @description Vertex shader source code.
*/
const vert = `
    // Vertex shader attribute.
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

/** 
 * @type {string} 
 * @description Fragment shader source code.
 * */
const frag = `
    varying lowp vec4 vColor;
    void main(void) {
        gl_FragColor = vColor;
    }
`;

// HTML ELEMENTS.
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvasWebGL');
/** @type {HTMLDivElement} */
const container = document.getElementById('container');
/**@type {HTMLInputElement} */
const translateXSlider = document.getElementById('translate-x');
/**@type {HTMLParagraphElement} */
const translateXValue = document.getElementById('translate-x-value');
/**@type {HTMLInputElement} */
const translateYSlider = document.getElementById('translate-y');
/**@type {HTMLParagraphElement} */
const translateYValue = document.getElementById('translate-y-value');
/**@type {HTMLInputElement} */
const translateZslider = document.getElementById('translate-z');
/**@type {HTMLParagraphElement} */
const translateZValue = document.getElementById('translate-z-value');
/** @type {HTMLInputElement} */
const rotateXSlider = document.getElementById('rotate-x');
/** @type {HTMLParagraphElement} */
const rotateXValue = document.getElementById('rotate-x-value');
/** @type {HTMLInputElement} */
const rotateYSlider = document.getElementById('rotate-y');
/** @type {HTMLParagraphElement} */
const rotateYValue = document.getElementById('rotate-y-value');
/** @type {HTMLInputElement} */
const rotateZSlider = document.getElementById('rotate-z');
/** @type {HTMLParagraphElement} */
const rotateZValue = document.getElementById('rotate-z-value');
/** @type {HTMLInputElement} */
const scaleXSlider = document.getElementById('scale-x');
/** @type {HTMLParagraphElement} */
const scaleXValue = document.getElementById('scale-x-value');
/** @type {HTMLInputElement} */
const scaleYSlider = document.getElementById('scale-y');
/** @type {HTMLParagraphElement} */
const scaleYValue = document.getElementById('scale-y-value');
/** @type {HTMLInputElement} */
const scaleZSlider = document.getElementById('scale-z');
/** @type {HTMLParagraphElement} */
const scaleZValue = document.getElementById('scale-z-value');
/** @type {HTMLInputElement} */
const cameraRadiusSlider = document.getElementById('camera-radius');
/** @type {HTMLParagraphElement} */
const cameraRadiusValue = document.getElementById('camera-radius-value');
/** @type {HTMLInputElement} */
const cameraRotateSlider = document.getElementById('camera-rotate');
/** @type {HTMLParagraphElement} */
const cameraRotateValue = document.getElementById('camera-rotate-value');
/**  @type {HTMLInputElement} */
const shaderBtn = document.getElementById('shader-btn');
/** @type {HTMLInputElement} */
const defaultViewButton = document.getElementById('default-view');
/** @type {HTMLSelectElement} */
const projectionView = document.getElementById('projection-view');
/** @type {HTMLButtonElement} */
const helpBtn = document.getElementById('help-button');
/** @type {HTMLButtonElement} */
const content = document.getElementById('help-content');

// Utility.
/** @type {number} */
const middleX = canvas.width / 2;
/** @type {number} */
const middleY = canvas.height / 2;
/** @type {boolean} */
let isHelpActive = false;

