'use strict';

/** 
 * @type {string} 
 * @description Vertex shader source code.
*/
const vert = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;

        // Apply lighting effect
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
`;

/** 
 * @type {string} 
 * @description Fragment shader source code.
 * */
const frag = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    uniform bool uShading;

    void main(void) {
        if (uShading) {
            gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
        } else {
            gl_FragColor = vColor;
        }
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
/**  @type {HTMLButtonElement} */
const shaderBtn = document.getElementById('shader-btn');
/** @type {HTMLButtonElement} */
const defaultViewButton = document.getElementById('default-view');
/** @type {HTMLButtonElement} */
const animateViewButton = document.getElementById('animate-view');
/** @type {HTMLSelectElement} */
const projectionView = document.getElementById('projection-view');
/** @type {HTMLButtonElement} */
const helpBtn = document.getElementById('help-button');
/** @type {HTMLButtonElement} */
const content = document.getElementById('help-content');
/** @type {HTMLLabelElement} */
const part0Label = document.getElementById('part-0-label');
/** @type {HTMLInputElement} */
const part0Input = document.getElementById('part-0');
/** @type {HTMLLabelElement} */
const part1Label = document.getElementById('part-1-label');
/** @type {HTMLInputElement} */
const part1Input = document.getElementById('part-1');
/** @type {HTMLLabelElement} */
const part2Label = document.getElementById('part-2-label');
/** @type {HTMLInputElement} */
const part2Input = document.getElementById('part-2');
/** @type {HTMLLabelElement} */
const part3Label = document.getElementById('part-3-label');
/** @type {HTMLInputElement} */
const part3Input = document.getElementById('part-3');
/** @type {HTMLLabelElement} */
const part4Label = document.getElementById('part-4-label');
/** @type {HTMLInputElement} */
const part4Input = document.getElementById('part-4');
/** @type {HTMLLabelElement} */
const part5Label = document.getElementById('part-5-label');
/** @type {HTMLInputElement} */
const part5Input = document.getElementById('part-5');
/** @type {HTMLLabelElement} */
const part6Label = document.getElementById('part-6-label');
/** @type {HTMLInputElement} */
const part6Input = document.getElementById('part-6');
/** @type {HTMLLabelElement} */
const part7Label = document.getElementById('part-7-label');
/** @type {HTMLInputElement} */
const part7Input = document.getElementById('part-7');
/** @type {HTMLLabelElement} */
const part8Label = document.getElementById('part-8-label');
/** @type {HTMLInputElement} */
const part8Input = document.getElementById('part-8');
/** @type {HTMLLabelElement} */
const part9Label = document.getElementById('part-9-label');
/** @type {HTMLInputElement} */
const part9Input = document.getElementById('part-9');
/** @type {HTMLLabelElement} */
const part10Label = document.getElementById('part-10-label');
/** @type {HTMLInputElement} */
const part10Input = document.getElementById('part-10');
/** @type {HTMLLabelElement} */
const part11Label = document.getElementById('part-11-label');
/** @type {HTMLInputElement} */
const part11Input = document.getElementById('part-11');
/** @type {HTMLLabelElement} */
const part12Label = document.getElementById('part-12-label');
/** @type {HTMLInputElement} */
const part12Input = document.getElementById('part-12');
/** @type {HTMLLabelElement} */
const part13Label = document.getElementById('part-13-label');
/** @type {HTMLInputElement} */
const part13Input = document.getElementById('part-13');
/** @type {HTMLLabelElement} */
const part14Label = document.getElementById('part-14-label');
/** @type {HTMLInputElement} */
const part14Input = document.getElementById('part-14');
/** @type {HTMLLabelElement} */
const part15Label = document.getElementById('part-15-label');
/** @type {HTMLInputElement} */
const part15Input = document.getElementById('part-15');
/** @type {HTMLLabelElement} */
const part16Label = document.getElementById('part-16-label');
/** @type {HTMLInputElement} */
const part16Input = document.getElementById('part-16');
/** @type {HTMLLabelElement} */
const part17Label = document.getElementById('part-17-label');
/** @type {HTMLInputElement} */
const part17Input = document.getElementById('part-17');
/** @type {HTMLLabelElement} */
const part18Label = document.getElementById('part-18-label');
/** @type {HTMLInputElement} */
const part18Input = document.getElementById('part-18');
/** @type {HTMLLabelElement} */
const part19Label = document.getElementById('part-19-label');
/** @type {HTMLInputElement} */
const part19Input = document.getElementById('part-19');

/** @type {HTMLLabelElement[]} */
const arrLabelBody = [
    part0Label,
    part1Label,
    part2Label,
    part3Label,
    part4Label,
    part5Label,
    part6Label,
    part7Label,
    part8Label,
    part9Label,
    part10Label,
    part11Label,
    part12Label,
    part13Label,
    part14Label,
    part15Label,
    part16Label,
    part17Label,
    part18Label,
    part19Label,
];

/** @type {HTMLInputElement[]} */
const arrInputBody = [
    part0Input,
    part1Input,
    part2Input,
    part3Input,
    part4Input,
    part5Input,
    part6Input,
    part7Input,
    part8Input,
    part9Input,
    part10Input,
    part11Input,
    part12Input,
    part13Input,
    part14Input,
    part15Input,
    part16Input,
    part17Input,
    part18Input,
    part19Input,
];

// Utility.
/** @type {number} */
const middleX = canvas.width / 2;
/** @type {number} */
const middleY = canvas.height / 2;
/** @type {boolean} */
let isHelpActive = false;

// Main
/**@type {ArticulatedObject} */
let hollowObject = null;
/**@type {WebGlManager} */
let webglManager = null;

