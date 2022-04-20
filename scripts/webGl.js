// References: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
// Github: https://github.com/mdn/webgl-examples/tree/gh-pages/tutorial/sample5
/// <reference path="./state.js" />
/// <reference path="./utility.js" />
/// <reference path="./mat4.js" />
/// <reference path="./articulatedObject.js" />

'use strict';

// ==================================================================================================
class Buffers {
    /**
     * Constructor
     * @param {WebGLBuffer} position 
     * @param {WebGLBuffer} color 
     * @param {WebGLBuffer} indices 
     */
    constructor(position, color, indices, normal, texture) {
        /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of position.
         * @public
         */
        this.position = position;
        
        /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of color.
         * @public
         */
        this.color = color;
        
        /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of indices.
         * @public
         */
        this.indices = indices;

        /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of normal.
         * @public
         */
         this.normal = normal;

         /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of texture.
         * @public
         */
          this.texture = texture;
    }
}

/**
 * Class programInfo.
 * @classdesc hold the information of program.
 */
class programInfo {
    /**
     * @description Create programInfo object.
     * @param {WebGLProgram} program 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(program, gl) {
        /**
         * @description WebGLProgram object.
         * @type {WebGLProgram}
         * @public
         */
        this.program = program;
        this.gl = gl;
        
        /**
         * @description WebGL attribute location.
         * @namespace
         * @property {number} vertexPosition - Attribute location of vertex position.
         * @property {number} vertexColor - Attribute location of vertex color.
         * @public
         */
        this.attribLocations = {
            vertexPosition: this.gl.getAttribLocation(program, 'aVertexPosition'),
            vertexColor: this.gl.getAttribLocation(program, 'aVertexColor'),
            vertexNormal: this.gl.getAttribLocation(program, 'aVertexNormal'),
            texture: this.gl.getAttribLocation(program, "aTextureCoord")
        };

        /**
         * @description WebGL uniform location.
         * @namespace
         * @property {number} modelViewMatrix - Uniform location of model view matrix.
         * @property {number} projectionMatrix - Uniform location of projection matrix.
         * @public
         */
        this.uniformLocations = {
            projectionMatrix: this.gl.getUniformLocation(program, 'uProjectionMatrix'),
            modelViewMatrix: this.gl.getUniformLocation(program, 'uModelViewMatrix'),
            normalMatrix: this.gl.getUniformLocation(program, 'uNormalMatrix'),
            shadingBool: this.gl.getUniformLocation(program, 'uShading'),
            textureType: this.gl.getUniformLocation(program, 'textureType'),
            textureType1: this.gl.getUniformLocation(program, 'textureType1'),
            worldCameraPosition: this.gl.getUniformLocation(program, 'u_worldCameraPosition'),
            textureLocation: this.gl.getUniformLocation(program, 'u_texture'),
            sampler: this.gl.getUniformLocation(program, "uSampler")
        };
    }
}

/**
 * Class Node Articulated.
 * @classdesc hold the information of node in articulated model.
 */
class NodeArticulated {
    /**
     * @description Create node object.
     * @param {number[]} transform - Transformation matrix of current node.
     * @param {number} sibling - Sibling of current node.
     * @param {number} child - Child of current node.
     */
    constructor(transform, sibling, child) {
        /**
         * @description Transformation matrix of current node.
         * @type {number[]}
         * @public
         */
        this.transform = transform;

        /**
         * @description Sibling of current node.
         * @type {number}
         * @public
         */
        this.sibling = sibling;

        /**
         * @description Child of current node.
         * @type {number}
         * @public
         */
        this.child = child;
    }
}

/**
 * Class WebGLManager
 * @classdesc Manage WebGL context.
 */
class WebGlManager {
    /**
     * @description Constructor of webgl manager.
     * @param {WebGL2RenderingContext} gl - WebGL context
     * @param {WebGLShader} vertexShader - Vertex shader source code.
     * @param {WebGLShader} fragmentShader - Fragment shader source code.
     * @param {WebGLProgram} program - WebGLProgram object. 
     */
    constructor(gl, vertexShader, fragmentShader, program) {
        
        /**
         * gl - WebGL context.
         * @type {WebGLRenderingContext}
         * @public
         */
        // Init WebGL context.
        this.useShading = false;
        this.gl = gl

        // Set webgl viewport.
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Initialize a shader program; this is where all the lighting
        // for the vertices and so forth is established.
        /**
         * vertexShader - Vertex shader.
         * @type {WebGLShader}
         * @public
         **/
        this.vertexShader = vertexShader;
        /**
         * fragmentShader - Fragment shader.
         * @type {WebGLShader}
         * @public
         */
        this.fragmentShader = fragmentShader;
        /**
         * shaderProgram - Shader program.
         * @type {WebGLProgram}
         * @public
         */
        this.program = program

        /**
         * programInfo - Program info.
         * @type {programInfo}
         * @public
         */
        this.programInfo = new programInfo(this.program, this.gl);
        
        // Buffer for rendering articulated object
        /**
         * buffers - buffer for rendering articulated object.
         * @type {Buffers[]}
         * @public
         */
        this.buffers = []

        /**
         * vertices - list of vertices that ready to be drawn.
         * @type {number[][]}
         * @public
         */
        this.vertices = []
        
        /**
         * colors - list of colors that ready to be drawn.
         * @type {number[][]}
         * @public
         */
        this.faceColors = []

        // Attribute for all transformation matrix.
        /**
         * translateValue - Translation for each axis.
         * @type {number[]}
         * @public
         */
        this.translateValue = [0, 0, 0];
        
        /**
         * rotateAngle - Rotation angle for each axis.
         * @type {number[]}
         * @public
         */
        this.rotateAngle = [0, 0, 0];
        
        /**
         * scaleValue - Scale for each axis.
         * @type {number[]}
         * @public
         */
        this.scaleValue = [1, 1, 1];
        
        /**
         * cameraRadius - Radius of camera.
         * @type {number}
         * @public
         */
        this.cameraRadius = 5;

        /**
         * cameraRotation - Rotation of camera.
         * @type {number}
         * @public
         */
        this.cameraRotation = 0;

        /**
         * shaderState - State of shader.
         * 0 - non-active
         * 1 - active
         * @type {number}
         * @public
         */
        this.shaderState = 0;

        /**
         * projectionType - Type of projection.
         * 1 - Orthographic
         * 2 - Perspective
         * 3 - Oblique
         * @type {number}
         * @public
         */
        this.projectionType = 2;

        /**
         * fov - Field of view.
         * @type {number}
         * @public
         */
        this.fov = 45;

        /**
         * articulatedModel - Articulated model.
         * @type {ArticulatedObject}
         * @public
         */
        this.articulatedModel = null;

        /**
         * nodes - Nodes of articulated model.
         * @type {Node[]}
         * @public
         */
        this.nodes = []

        /**
         * nodesRad - Rotation angle of each node ni radian.
         * @type {number[]}
         * @public
         */
        this.nodesRad = []

        /**
         * modelViewMatrix - Model view matrix.
         * @type {number[]}
         * @public
         */
        this.modelViewMatrix = []

        /**
         * projectionMatrix - Projection matrix.
         * @type {number[]}
         * @public
         */
        this.projectionMatrix = []

        /**
         * parentMatrix - Parent model view matrix history used to calculate child model view matrix.
         * @type {number[][]}
         * @public
         */
        this.parentMatrix = []

        this.bumpTypeChoosen = 0;

        this.generateTexture();

    }

    /**
     * @description Initialize buffers in GPU before drawing the object.
     * @param {number[]} vertices - vertices of shape.
     * @param {number[]} faceColors - colors of each face.
     * @param {number[]} indices - vertices topology.
     * @returns {Buffers} program buffer.
     */
    initBuffers(vertices, faceColors){
        // Binding data
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        // Convert the array of colors into a table for all the vertices.
        let colors = [];
        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }
        // Create the color buffer.
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
        // Now send the element array to GL
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        const normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,normalBuffer);

        const vertexNormal = getVectorNormal(vertices);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexNormal),this.gl.STATIC_DRAW);

        const textureCoordinates = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
        ];

        const textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                        this.gl.STATIC_DRAW);
        
        
        return new Buffers(positionBuffer, colorBuffer, indexBuffer, normalBuffer, textureCoordBuffer);
    };

    /**
     * @description Init buffer from given articulated object.
     * @param {ArticulatedObject} articulatedObject 
     */
    initBuffersArticulated(articulatedObject){
        this.clearScreen();
        const webGlBufferData = articulatedObject.getWebGlBufferData();
        const vertices = webGlBufferData.glVertices;
        const faceColors = webGlBufferData.glFaceColors;
    
        // Save vertex positions and colors.
        this.vertices = vertices;
        this.faceColors = faceColors;
        this.bumpTypeChoosen = articulatedObject.bumpType;

        // Save articulated object.
        this.articulatedModel = articulatedObject;

        // Init nodes for all edges(object).
        this.nodes = [];
        for(let i = 0; i < articulatedObject.edge.length; i++){
            this.initNodeArticulated(i, true);
        }
        
        // Init buffer for all edges.
        this.buffers = [];
        for (let i = 0; i < vertices.length; i ++) {
            const buffer = this.initBuffers(vertices[i], faceColors[i]);
            this.buffers.push(buffer);
        }

        // Generate texture for current articulated object.
        this.generateTexture();
    }

    /**
     * @description Init node for given index of articulated object edge.
     * @param {number} index 
     * @param {boolean} is_init 
     */
    initNodeArticulated(index, is_init){
        // Calculate the transformation matrix of current node.
        // Transformation matrix initialization.
        let transform = m4.identity();

        // Get the current node data from articulated model.
        const currentEdge = this.articulatedModel.edge[index];
        const jointX = currentEdge.joints[0];
        const jointY = currentEdge.joints[1];
        const jointZ = currentEdge.joints[2];
        const rotationAxis = currentEdge.rotationAxis;
        const sibling = currentEdge.sibling;
        const child = currentEdge.child;

        // If first time rendering the node then set the anggle
        if (is_init) {
            this.nodesRad[index] = degToRad(0);
        }

        // Process the transformation matrix.
        transform = m4.translate(transform, jointX, jointY, jointZ);
        if (rotationAxis == 0){
            transform = m4.xRotate(transform, this.nodesRad[index]);
        } else if (rotationAxis == 1){
            transform = m4.yRotate(transform, this.nodesRad[index]);
        } else if (rotationAxis == 2){
            transform = m4.zRotate(transform, this.nodesRad[index]);
        } 
        transform = m4.translate(transform, -1 * jointX, -1 * jointY, -1 * jointZ);

        // Fill the nodes array.
        this.nodes[index] = new NodeArticulated(transform, sibling, child );
    }

    /**
     * @description clear all buffers and clear screen.
     */
    clearScreen() {
        this.gl.clearColor(0.8, 0.8, 0.8, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /**
     * @description Draw all buffers.
     */
    drawArticulatedObjectScene(is_first = false) {
        // Clear the screen
        this.clearScreen();

        // Process the root model view matrix and projection matrix for all node.
        this.modelViewMatrix = this.calculateModelViewMatrix();
        this.projectionMatrix = this.calculateProjectionMatrix();

        // Draw all buffers using dfs algorithm.
        this.parentMatrix = [];

        if (!is_first) {
            // Init nodes for all edges(object).
            for (let i = 0; i < this.articulatedModel.edge.length; i++){
                this.initNodeArticulated(i, false);
            }
        }
        this.drawSceneDfs(this.articulatedModel.rootNode);
    }

    /**
     * @description Draw each node in the articulated model tree using dfs algorithm.
     * @param {number} index - index of node that are processed.
     */
    drawSceneDfs(index){
        // Get current node.
        const currentNode = this.nodes[index];

        // Push current model view matrix to parent matrix list.
        this.parentMatrix.push(this.modelViewMatrix);

        // Calculate the model view matrix for current node.
        this.modelViewMatrix = m4.multiply(this.modelViewMatrix, currentNode.transform);

        // Draw current node.
        this.drawScene(this.buffers[index], this.vertices[index].length / 2);

        // Draw child node.
        if (currentNode.child != null) {
            this.drawSceneDfs(currentNode.child);
        }

        // Draw sibling node.
        // Pop the parent matrix node (the top of parent matrix node now are sibling model 
        // view matrix, not parent) because sibling are using parent model view matrix.
        this.modelViewMatrix = this.parentMatrix.pop();
        if (currentNode.sibling != null) {
            this.drawSceneDfs(currentNode.sibling);
        }
    }

    /**
     * @description calculate projection matrix.
     * @returns {number[][]} projection matrix.
     */
    calculateProjectionMatrix() {
        // Initialize variable for projection matrix.
        const left = -2;
        const right = 2;
        const bottom = -2;
        const top = 2;
        const zNear = 0.1;
        const zFar = 100.0;
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const fieldOfViewInRadians = degToRad(this.fov) 
        let projectionMatrix = m4.identity();

        // Orthographic projection.
        if (this.projectionType == 1){
            projectionMatrix = m4.orthographic(left, right, bottom, top, zNear, zFar);
            // console.log(projectionMatrix);
        } 
        // Perspective projection.
        if (this.projectionType == 2){
            projectionMatrix = m4.perspective(fieldOfViewInRadians, aspect, zNear, zFar);
            // console.log(projectionMatrix);
        }
        
        if (this.projectionType == 3){
            let orto = m4.orthographic(left, right, bottom, top, zNear, zFar);
            let oblique = m4.oblique(45,45);
            projectionMatrix = m4.multiply(oblique, orto);
            // console.log("here");
            // console.log(projectionMatrix);
        }
        // Oblique projection
        return projectionMatrix;
    }

    /**
     * @description calculate model view matrix.
     * @returns {number[][]} model view matrix.
     * @public
     */
    calculateModelViewMatrix(){
        // Generate camera matrix.
        let radius = this.cameraRadius;
        let cameraAngleRadian = degToRad(this.cameraRotation);

        // Compute a matrix for the camera.
        let cameraMatrix = m4.yRotation(cameraAngleRadian);
        cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius);

        // Make view matrix.
        // View matrix is the inverse of camera matrix * rotation matrix.
        let viewMatrix = m4.inverse(cameraMatrix);

        // Make model view matrix.
        // Model view matrix is initialized by translate and scaling matrix
        // Model view matrix is the product of view matrix and model matrix.
        let modelViewMatrix = m4.identity();
        modelViewMatrix = m4.translate(modelViewMatrix, this.translateValue[0], 
            this.translateValue[1], this.translateValue[2]);
        modelViewMatrix = m4.xRotate(modelViewMatrix, degToRad(this.rotateAngle[0]));
        modelViewMatrix = m4.yRotate(modelViewMatrix, degToRad(this.rotateAngle[1]));
        modelViewMatrix = m4.zRotate(modelViewMatrix, degToRad(this.rotateAngle[2]));
        modelViewMatrix = m4.scale(modelViewMatrix, this.scaleValue[0],
            this.scaleValue[1], this.scaleValue[2]);
        modelViewMatrix = m4.multiply(viewMatrix, modelViewMatrix);
        
        return modelViewMatrix;
    }

    /**
     * @description Draw scenarion.
     * @param {Buffers} buffers - buffers.
     * @param {number} vertexCount - the number of vertext to draw.
     * @param {number} cubeRotation - cube rotation.
     */
    drawScene(buffers, vertexCount) {
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); 

        // Calculate projection matrix.
        let normalMatrix = m4.inverse(this.modelViewMatrix);
        normalMatrix = m4.transpose(normalMatrix);


        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            3, // The number of elements per iteration
            this.gl.FLOAT, // The type of the data
            false, // Specify if the data needs to be normalized
            0, // The space in bytes between elements
            0); // Offset from the beginning of the buffer
        this.gl.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexPosition);
        
      
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexColor,
            4, // The number of elements per iteration
            this.gl.FLOAT, // The type of the data
            false, // Whether to normalize the data (usually false)
            0, // The space in bytes between elements
            0); // The offset, in bytes, to the first element
        this.gl.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexColor);
      
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.normal);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexNormal,
            3,
            this.gl.FLOAT,
            false,
            0,
            0);
        this.gl.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexNormal);
        // Tell WebGL which indices to use to index the vertices
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.texture,
            2,
            this.gl.FLOAT,
            false,
            0,
            0);
        this.gl.enableVertexAttribArray(
            this.programInfo.attribLocations.texture);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.texture);
      
        // Tell WebGL to use our program when drawing
        this.gl.useProgram(this.programInfo.program);
      
        // Set the shader uniforms
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);
        this.gl.uniform1i(
            this.programInfo.uniformLocations.shadingBool,
            this.useShading);

        // Buffer processing based on the bump type.
        if (this.bumpTypeChoosen == 0){
            this.gl.uniform1i(
                this.programInfo.uniformLocations.textureType, 0);
            this.gl.uniform1i(
                this.programInfo.uniformLocations.textureType1, 0);

            const cameraPosition = [0, 0, 2];
            this.gl.uniform3fv(this.programInfo.uniformLocations.worldCameraPosition, 
                    cameraPosition);
            // Tell the shader to use texture unit 0 for u_texture
            this.gl.uniform1i(this.programInfo.uniformLocations.textureLocation, 0);
            this.gl.uniform1i(this.programInfo.uniformLocations.sampler, 1);
            
        } else if (this.bumpTypeChoosen == 1) {
            this.gl.uniform1i(this.programInfo.uniformLocations.textureLocation, 1);
            this.gl.uniform1i(this.programInfo.uniformLocations.textureType, 1);
            this.gl.uniform1i(this.programInfo.uniformLocations.textureType1, 1);
            this.gl.uniform1i(this.programInfo.uniformLocations.sampler, 0);
        } else if (this.bumpTypeChoosen == 2) {
            this.gl.uniform1i(
                this.programInfo.uniformLocations.textureLocation, 1);
            this.gl.uniform1i(
                this.programInfo.uniformLocations.textureType, 2);
            this.gl.uniform1i(
                this.programInfo.uniformLocations.textureType1, 2);
            this.gl.uniform1i(
                this.programInfo.uniformLocations.samplerLocation, 0);

        } else {
            // Set the mapping type.
            this.gl.uniform1i(
                this.programInfo.uniformLocations.textureType, 3);
            this.gl.uniform1i(
                this.programInfo.uniformLocations.textureType1, 3);
           
        }

        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, this.gl.UNSIGNED_SHORT, 0);

    }

    /**
     * @description Use shading or not.
     */
    changeShaders(){
        this.useShading = !this.useShading;
    }

    revertBumpType(){
        if (this.bumpTypeChoosen == this.articulatedModel.bumpType){
            this.bumpTypeChoosen = 3;
        } else {
            this.bumpTypeChoosen = this.articulatedModel.bumpType;
        }
    }

    /**
     * @description Set up texture based on the bump type.
     */
    generateTexture() {
        // Default texture.
        if (!this.articulatedModel) {
            this.setupEnvironmentMapping();
            return;
        } 
        
        if (this.bumpTypeChoosen == 0){
            this.setupEnvironmentMapping();
        } else if (this.bumpTypeChoosen == 1) {
            this.setupImageMapping();
        } else if (this.bumpTypeChoosen == 2) {
            this.setupBumpMapping();
        }
    }

    /**
     * @description Load name of each bodypart to input label.
     */
    loadName(){

        // Reset the name for each label.
        for (let i = 0; i < arrLabelBody.length; i++){
            console.log(arrLabelBody[i]);
            arrLabelBody[i].innerHTML = "None";
        }

        // Loop for each edge.
        for (let i = 0; i < this.articulatedModel.edge.length; i++){
            // Get the name of the body part.
            const name = this.articulatedModel.edge[i].name;
            
            // Get the label of the body part and set the name.
            const label = arrLabelBody[i];
            label.innerHTML = name;
        }
    }

    /**
     * @description Setup the environment mapping.
     * @ref https://webglfundamentals.org/webgl/lessons/webgl-environment-maps.html
     * THE CODES ARE COPY PASTE WITH LITTLE MODIFICATION
     * THE IMAGES ARE ALSO FROM WEBGL FUNDAMENTALS
     */
    setupEnvironmentMapping(){
        // Create a texture.
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture);
        
        const faceInfos = [
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
                url: '../mapping/pos-x.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                url: '../mapping/neg-x.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
                url: '../mapping/pos-y.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                url: '../mapping/neg-y.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
                url: '../mapping/pos-z.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
                url: '../mapping/neg-z.jpg',
            },
        ];
        faceInfos.forEach((faceInfo) => {
            const { target, url } = faceInfo;
            
            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = this.gl.RGBA;
            const width = 512;
            const height = 512;
            const format = this.gl.RGBA;
            const type = this.gl.UNSIGNED_BYTE;
            
            // setup each face so it's immediately renderable
            this.gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
        
            // Asynchronously load an image
            const image = new Image();
            // Wait for the image to load
            image.onload = () => {
                // Now that the image has loaded upload it to the texture.
                this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture);
                this.gl.texImage2D(target, level, internalFormat, format, type, image);
                this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
            };
            image.src = url;
        });
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
    }

    /**
     * @description Setup the image mapping.
     * @ref https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
     * THE CODES ARE COPY PASTE WITH LITTLE MODIFICATION
     * THE IMAGES ARE ALSO FROM WEBGL MDN
     */
    setupImageMapping() {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    
        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = this.gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
                    width, height, border, srcFormat, srcType,
                    pixel);
    
        const image = new Image();
        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
                            srcFormat, srcType, image);
        
            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                // Yes, it's a power of 2. Generate mips.
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn of mips and set
                // wrapping to clamp to edge
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            }
        };
        image.src = "../mapping/fur.jpeg";
    
        return texture;
    }
    /**
     * @description Setup the bump mapping.
     * @ref https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
     * THE CODES ARE COPY PASTE WITH LITTLE MODIFICATION
     * THE IMAGE IS FROM https://apoorvaj.io/exploring-bump-mapping-with-webgl/
     */
    setupBumpMapping(){
        // Create a texture
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        // Fill the texture with a 1x1 blue pixel
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
                           new Uint8Array([0, 0, 255, 255]));

        // Asynchronously load an image
        const image = new Image();
        image.src = '../mapping/bump_normal.png'
        image.onload = () => {
            // Now that the image has loaded make copy it to the texture.
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }
    }
}

// ==================================================================================================

// ==================================================================================================
/**
 * @description Create shader.
 * @param {WebGLRenderingContext} gl - WebGL context.
 * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {string} source - shader source code
 * @returns {WebGLShader} shader or null if failed
 */
 const initShader = (gl, type, source) => {
    // Create and compile the shader.
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check compile status.
    // If success then return the created shader.
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    // If there is an error, log it and delete the shader.
    console.error(gl.getShaderInfoLog(shader));
    alert('Failed to initialize the shader.');
    gl.deleteShader(shader);
};

/**
 * @description Create shader program.
 * @param {WebGLRenderingContext} gl - WebGL context.
 * @param {WebGLShader} vertexShader - Vertex shader.
 * @param {WebGLShader} fragmentShader - Fragment shader.
 * @returns
 */
const createProgram = (gl, vertexShader, fragmentShader) => {
    // Create program.
    let program = gl.createProgram();

    // Attach shader to program.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link program.
    gl.linkProgram(program);

    // Check link status.
    // If success then return the created program.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    // If there is an error, log it and delete the program.
    console.error(gl.getProgramInfoLog(program));
    alert('Failed to initialize the shader program.');
    gl.deleteProgram(program);
};

// ==================================================================================================