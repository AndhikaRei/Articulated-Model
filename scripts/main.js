/// <reference path="./state.js" />
/// <reference path="./utility.js" />
/// <reference path="./mat4.js" />
/// <reference path="./articulatedObject.js" />
/// <reference path="./webgl.js" />
'use strict';

main();

/**
 * @description Main function of WebglProgram.
 * 
 */
async function main() {
	// Init webgl.
	// Get gl context.
	/**
	 * @type {WebGLRenderingContext | null}
	 */
	const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	// If we don't have a GL context, give up now
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

  // Set webgl viewport.
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Initialize a shader program; this is where all the lighting
	// for the vertices and so forth is established.
	const vertexShader = initShader(gl, gl.VERTEX_SHADER, vert);
	const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, frag);
	const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

	// Init webglManager.
	webglManager = new WebGlManager(gl, vertexShader, fragmentShader, shaderProgram);
	articulatedObject = loadDog();

	// Console log model.
	console.log(JSON.stringify(articulatedObject));

  	webglManager.initBuffersArticulated(articulatedObject);
	webglManager.loadName();
	await new Promise(r => setTimeout(r, 100));
	webglManager.drawArticulatedObjectScene(true);
}

/**
 * @description draw articulated object scene after period of time.
 * @param {number} ms 
 */
async function delayDraw(ms) {
	await new Promise(r => setTimeout(r, ms));
	webglManager.drawArticulatedObjectScene(true);
}



