'use strict';

/**
 * Class Edge.
 * @classdesc Edge is representation of 'rusuk' in hollow object. Remember that edge in hollow object is a
 * 3d line.
 */
class Edge {
    /**
     * @description Constructor of edge class.
     * @param {number[6][4]} topology - List of list of vertices that represent edge faces. 
     * @param {number[][4]} color - List of list of integer that represent edge faces color.
     */
    constructor(topology, color) {
        /**
         * @description List of list of vertices that represent edge faces.
         * @type {number[6][4]}
         * @public
         * @example [[0, 1, 2, 3]] means there are 1 face with 4 vertices. Vertices index 0, 1, 2, and 3.
         * You can find the corresponding vertices in hollow object class.
         * If possible, the number of vertices in each face should be 4 and the number of faces should be 6.
         */
        this.topology = topology;
        
        /**
         * @description List of list of integer that represent edge faces color.
         * @type {number[][4]}
         * @public
         */
        this.color = color;
    }
}

/**
 * Class HollowObject.
 * @classdesc HollowObject is representation of hollow object. Hollow object is a 3d object that can be
 * drawn in CAD that contain only edge.
 */
class HollowObject {
    /**
     * @description Constructor of hollow object class.
     * @param {number[][3]} vertices - List of list of vertices in hollow object.
     * @param {Edge[]} edges - List of edge in hollow object.
     **/
    constructor(vertices, edges) {
        /**
         * @description List of list of vertices in hollow object.
         * @type {number[][3]}
         * @public
         */
        this.vertices = vertices;

        // console.log(vertices);
        
        /**
         * @description List of edge in hollow object.
         * @type {Edge[]}
         * @public
         */
        this.edge = edges;
    }

    /**
     * @typedef {Object} WebGLBufferData
     * @property {number[][]} glVertices - Transformed vertices. 
     * @property {number[][]} glFaceColors - Transformed shape color.
     */

    /**
     * @description Transform vertices and shape color so it can be used in WebGL.
     * @return {WebGLBufferData} Flattened vertices and shape color.
     */
    getWebGlBufferData() {
        /**
         * @type {number[][]}
         */
        let glVertices = [];

        /**
         * @type {number[][]}
         */
        let glFaceColors = [];

        // Loop for each edge.
        let NumEdges = this.edge.length;
        for (let i = 0; i < NumEdges; i++) {
            let currentEdge = this.edge[i];
            let currentTopology = currentEdge.topology;
            /**
            * @type {number[]}
            */
            let currentEdgeVertices = []
            /**
            * @type {number[]}
            */
            let currentEdgeColors = []
            let NumFaces = currentTopology.length;

            // Loop for each face.
            for (let j = 0; j < NumFaces; j++) {
                let currentFace = currentTopology[j];
                let NumVertices = currentFace.length;
                
                // For each vertex in face.
                // Add vertex to current edge vertices.
                for (let k = 0; k < NumVertices; k++) {
                    let currentVertex = this.vertices[currentFace[k]];
                    currentEdgeVertices.push(...currentVertex);
                }
                
                // Add face color to current edge colors.
                let currentColor = currentEdge.color[j];
                currentEdgeColors.push(currentColor);
            }

            // Add current edge vertices and colors to global vertices and colors.
            glVertices.push(currentEdgeVertices);
            glFaceColors.push(currentEdgeColors);
        }

        return {
            glVertices: glVertices,
            glFaceColors: glFaceColors
        };
    }
}

/**
 * @description Create basic hollow object with shape like a cube.
 * @returns {HollowObject}
 */
const loadBasicCube = () => {
    // All vertices in hollow object.
    let vertices = [
		[-1.0, -1.0, 1.0], // 0
        [1.0, -1.0, 1.0], // 1
        [1.0, 1.0, 1.0], // 2
        [-1.0, 1.0, 1.0], // 3
        [-1.0, -1.0, -1.0], // 4
        [1.0, -1.0, -1.0], // 5
        [1.0, 1.0, -1.0], // 6
        [-1.0, 1.0, -1.0] // 7
	];

    // All edges in hollow object.
    // Because cube is not hollow then each edge only contain one faces and one color.
    let edges = [
        new Edge([
            [0, 1, 2, 3], // Front Face
            [4, 5, 6, 7], // Back Face
            [2, 3, 7, 6], // Top Face
            [0, 1, 5, 4], // Bottom Face
            [1, 2, 6, 5], // Right Face
            [0, 3, 7, 4], // Left Face
        ], [
            [1.0, 1.0, 1.0, 1.0], // Front Face: white
            [1.0, 0.0, 0.0, 1.0], // Back Face: red
            [0.0, 1.0, 0.0, 1.0], // Top Face: green
            [0.0, 0.0, 1.0, 1.0], // Bottom Face: blue
            [1.0, 1.0, 0.0, 1.0], // Right Face: yellow
            [1.0, 0.0, 1.0, 1.0] // Left Face: purple
        ])
    ];

    return new HollowObject(vertices, edges);
}

const loadHollowCube = () => {
    // Generate random color. Will be used on every face.
    let randomColor = randomRGB();

    // Edge width
    const eW = 0.2;
    // All vertices in hollow object.
    // Not all vertices are going to be used.
    let vertices = [
        // Block 0
        [-1.0, -1.0, 1.0], // 0
        [-1.0 + eW, -1.0, 1.0], // 1
        [-1.0 + eW, -1.0 + eW, 1.0], // 2
        [-1.0, -1.0 + eW, 1.0], // 3
        [-1.0, -1.0, 1.0 - eW], // 4
        [-1.0 + eW, -1.0, 1.0 - eW], // 5
        [-1.0 + eW, -1.0 + eW, 1.0 - eW], // 6
        [-1.0, -1.0 + eW, 1.0 - eW], // 7

        // Block 1
        [1.0 - eW, -1.0, 1.0], // 8
        [1.0, -1.0, 1.0], // 9
        [1.0, -1.0 + eW, 1.0], // 10
        [1.0 - eW, -1.0 + eW, 1.0], // 11
        [1.0 - eW, -1.0, 1.0 - eW], // 12
        [1.0, -1.0, 1.0 - eW], // 13
        [1.0, -1.0 + eW, 1.0 - eW], // 14
        [1.0 - eW, -1.0 + eW, 1.0 - eW], // 15

        // Block 2
        [1.0 - eW, -1.0, -1.0 + eW], // 16
        [1.0 , -1.0, -1.0 + eW], // 17
        [1.0, -1.0 + eW, -1.0 + eW], // 18
        [1.0 - eW, -1.0 + eW, -1.0 + eW], // 19
        [1.0 - eW, -1.0, -1.0], // 20
        [1.0, -1.0, -1.0], // 21
        [1.0, -1.0 + eW, -1.0], // 22
        [1.0 - eW, -1.0 + eW, -1.0], // 23

        // Block 3
        [-1.0, -1.0, -1.0 + eW], // 24
        [-1.0 + eW, -1.0, -1.0 + eW], // 25
        [-1.0 + eW, -1.0 + eW, -1.0 + eW], // 26
        [-1.0, -1.0 + eW, -1.0 + eW], // 27
        [-1.0, -1.0, -1.0], // 28
        [-1.0 + eW, -1.0, -1.0], // 29
        [-1.0 + eW, -1.0 + eW, -1.0], // 30
        [-1.0, -1.0 + eW, -1.0], // 31

        // Block 4
        [-1.0, 1.0 - eW, 1.0], // 32
        [-1.0 + eW, 1.0 - eW, 1.0], // 33
        [-1.0 + eW, 1.0, 1.0], // 34
        [-1.0, 1.0, 1.0], // 35
        [-1.0, 1.0 - eW, 1.0 - eW], // 36
        [-1.0 + eW, 1.0 - eW, 1.0 - eW], // 37
        [-1.0 + eW, 1.0, 1.0 - eW], // 38
        [-1.0, 1.0, 1.0 - eW], // 39

        // Block 5
        [1.0 - eW, 1.0 - eW, 1.0], // 40
        [1.0, 1.0 - eW, 1.0], // 41
        [1.0, 1.0, 1.0], // 42
        [1.0 - eW, 1.0, 1.0], // 43
        [1.0 - eW, 1.0 - eW, 1.0 - eW], // 44
        [1.0, 1.0 - eW, 1.0 - eW], // 45
        [1.0, 1.0, 1.0 - eW], // 46
        [1.0 - eW, 1.0, 1.0 - eW], // 47
        
        // Block 6
        [1.0 - eW, 1.0 - eW, -1.0 + eW], // 48
        [1.0, 1.0 - eW, -1.0 + eW], // 49
        [1.0, 1.0, -1.0 + eW], // 50
        [1.0 - eW, 1.0, -1.0 + eW], // 51
        [1.0 - eW, 1.0 - eW, -1.0], // 52
        [1.0, 1.0 - eW, -1.0], // 53
        [1.0, 1.0, -1.0], // 54
        [1.0 - eW, 1.0, -1.0], // 55

        // Block 7
        [-1.0, 1.0 - eW, -1.0 + eW], // 56
        [-1.0 + eW, 1.0 - eW, -1.0 + eW], // 57
        [-1.0 + eW, 1.0, -1.0 + eW], // 58
        [-1.0, 1.0, -1.0 + eW], // 59
        [-1.0, 1.0 - eW, -1.0], // 60
        [-1.0 + eW, 1.0 - eW, -1.0], // 61
        [-1.0 + eW, 1.0, -1.0], // 62
        [-1.0, 1.0, -1.0] // 63
    ];

    // All edges in hollow object.
    let edges = [
        // Edges from block 0 to block 1.
        new Edge([
            [0, 9, 10, 3], // Front face.
            [4, 13, 14, 7], // Back face.
            [3, 10, 14, 7], // Top face.
            [0, 9, 13, 4], // Bottom face.
            [9, 13, 10, 14], // Right face.
            [0, 3, 7, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 1 to block 2.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [20, 21, 22, 23], // Back face.
            [11, 10, 22, 23], // Top face.
            [8, 9, 21, 20], // Bottom face.
            [9, 21, 10, 22], // Right face.
            [8, 11, 23, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 3.
        new Edge([
            [24, 17, 18, 27], // Front face.
            [28, 21, 22, 31], // Back face.
            [27, 18, 22, 31], // Top face.
            [24, 17, 21, 28], // Bottom face.
            [17, 21, 18, 22], // Right face.
            [24, 27, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,    
            randomColor
        ]),
        // Edges from block 3 to block 0.
        new Edge([
            [0, 1, 2, 3], // Front face.
            [28, 29, 30, 31], // Back face.
            [3, 2, 30, 31], // Top face.
            [0, 1, 29, 28], // Bottom face.
            [1, 29, 2, 30], // Right face.
            [0, 3, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 4 to block 5.
        new Edge([
            [32, 41, 42, 35], // Front face.
            [36, 45, 46, 39], // Back face.
            [35, 42, 46, 39], // Top face.
            [32, 41, 45, 36], // Bottom face.
            [41, 45, 42, 46], // Right face.
            [32, 35, 39, 36], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 5 to block 6.
        new Edge([
            [40, 41, 42, 43], // Front face.
            [52, 53, 54, 55], // Back face.
            [43, 42, 54, 55], // Top face.
            [40, 41, 53, 52], // Bottom face.
            [41, 53, 42, 54], // Right face.
            [40, 43, 55, 52], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 6 to block 7.
        new Edge([
            [56, 49, 50, 59], // Front face.
            [60, 53, 54, 63], // Back face.
            [59, 50, 54, 63], // Top face.
            [56, 49, 53, 60], // Bottom face.
            [49, 53, 50, 54], // Right face.
            [56, 59, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 7 to block 4.
        new Edge([
            [32, 33, 34, 35], // Front face.
            [60, 61, 62, 63], // Back face.
            [35, 34, 62, 63], // Top face.
            [32, 33, 61, 60], // Bottom face.
            [33, 61, 34, 62], // Right face.
            [32, 35, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 0 to block 4.
        new Edge([
            [0, 1, 34, 35], // Front face.
            [4, 5, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 34, 38], // Right face.
            [0, 35, 39, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 1 to block 5.
        new Edge([
            [8, 9, 42, 43], // Front face.
            [12, 13, 46, 47], // Back face.
            [43, 42, 46, 47], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 42, 46], // Right face.
            [8, 43, 47, 12], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 6.
        new Edge([
            [16, 17, 50, 51], // Front face.
            [20, 21, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 50, 54], // Right face.
            [16, 51, 55, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 3 to block 7.
        new Edge([
            [24, 25, 58, 59], // Front face.
            [28, 29, 62, 63], // Back face.
            [59, 58, 62, 63], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 58, 62], // Right face.
            [24, 59, 63, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ])
    ];

    return new HollowObject(vertices, edges);
}

const loadHollowH = () => {
    // Generate hollow object representing h letter.
    // Generate random color. Will be used on every face.
    let randomColor = randomRGB();

    // Edge width
    const eW = 0.1;

    // Displacement from top/bottom to mid.
    const dm = 0.8;

    // Displacement from 1 edge in left to right.
    const dl = 1.6;

    // All vertices in hollow object.
    // Not all vertices are going to be used.
    let vertices = [
        // Block 0
        [-1.0, -1.0, 0.2], // 0
        [-1.0 + eW, -1.0, 0.2], // 1
        [-1.0 + eW, -1.0 + eW, 0.2], // 2
        [-1.0, -1.0 + eW, 0.2], // 3
        [-1.0, -1.0, 0.2 - eW], // 4
        [-1.0 + eW, -1.0, 0.2 - eW], // 5
        [-1.0 + eW, -1.0 + eW, 0.2 - eW], // 6
        [-1.0, -1.0 + eW, 0.2 - eW], // 7

        // Block 1
        [-0.6 - eW, -1.0, 0.2], // 8
        [-0.6, -1.0, 0.2], // 9
        [-0.6, -1.0 + eW, 0.2], // 10
        [-0.6 - eW, -1.0 + eW, 0.2], // 11
        [-0.6 - eW, -1.0, 0.2 - eW], // 12
        [-0.6, -1.0, 0.2 - eW], // 13
        [-0.6, -1.0 + eW, 0.2 - eW], // 14
        [-0.6 - eW, -1.0 + eW, 0.2 - eW], // 15

        // Block 2
        [-0.6 - eW, -1.0, -0.2 + eW], // 16
        [-0.6 , -1.0, -0.2 + eW], // 17
        [-0.6, -1.0 + eW, -0.2 + eW], // 18
        [-0.6 - eW, -1.0 + eW, -0.2 + eW], // 19
        [-0.6 - eW, -1.0, -0.2], // 20
        [-0.6, -1.0, -0.2], // 21
        [-0.6, -1.0 + eW, -0.2], // 22
        [-0.6 - eW, -1.0 + eW, -0.2], // 23

        // Block 3
        [-1.0, -1.0, -0.2 + eW], // 24
        [-1.0 + eW, -1.0, -0.2 + eW], // 25
        [-1.0 + eW, -1.0 + eW, -0.2 + eW], // 26
        [-1.0, -1.0 + eW, -0.2 + eW], // 27
        [-1.0, -1.0, -0.2], // 28
        [-1.0 + eW, -1.0, -0.2], // 29
        [-1.0 + eW, -1.0 + eW, -0.2], // 30
        [-1.0, -1.0 + eW, -0.2], // 31

        // Block 4
        [-1.0, 1.0 - eW, 0.2], // 32
        [-1.0 + eW, 1.0 - eW, 0.2], // 33
        [-1.0 + eW, 1.0, 0.2], // 34
        [-1.0, 1.0, 0.2], // 35
        [-1.0, 1.0 - eW, 0.2 - eW], // 36
        [-1.0 + eW, 1.0 - eW, 0.2 - eW], // 37
        [-1.0 + eW, 1.0, 0.2 - eW], // 38
        [-1.0, 1.0, 0.2 - eW], // 39

        // Block 5
        [-0.6 - eW, 1.0 - eW, 0.2], // 40
        [-0.6, 1.0 - eW, 0.2], // 41
        [-0.6, 1.0, 0.2], // 42
        [-0.6 - eW, 1.0, 0.2], // 43
        [-0.6 - eW, 1.0 - eW, 0.2 - eW], // 44
        [-0.6, 1.0 - eW, 0.2 - eW], // 45
        [-0.6, 1.0, 0.2 - eW], // 46
        [-0.6 - eW, 1.0, 0.2 - eW], // 47
        
        // Block 6
        [-0.6 - eW, 1.0 - eW, -0.2 + eW], // 48
        [-0.6, 1.0 - eW, -0.2 + eW], // 49
        [-0.6, 1.0, -0.2 + eW], // 50
        [-0.6 - eW, 1.0, -0.2 + eW], // 51
        [-0.6 - eW, 1.0 - eW, -0.2], // 52
        [-0.6, 1.0 - eW, -0.2], // 53
        [-0.6, 1.0, -0.2], // 54
        [-0.6 - eW, 1.0, -0.2], // 55

        // Block 7
        [-1.0, 1.0 - eW, -0.2 + eW], // 56
        [-1.0 + eW, 1.0 - eW, -0.2 + eW], // 57
        [-1.0 + eW, 1.0, -0.2 + eW], // 58
        [-1.0, 1.0, -0.2 + eW], // 59
        [-1.0, 1.0 - eW, -0.2], // 60
        [-1.0 + eW, 1.0 - eW, -0.2], // 61
        [-1.0 + eW, 1.0, -0.2], // 62
        [-1.0, 1.0, -0.2], // 63

        // Block 8.
        // Block 8 is Block 0 with y coordinates are added with dm.
        [-1.0 , -1.0 + dm, 0.2], // 64
        [-1.0 + eW , -1.0 + dm, 0.2], // 65
        [-1.0 + eW , -1.0 + eW + dm, 0.2], // 66
        [-1.0 , -1.0 + eW + dm, 0.2], // 67
        [-1.0 , -1.0 + dm, 0.2 - eW], // 68
        [-1.0 + eW , -1.0 + dm, 0.2 - eW], // 69
        [-1.0 + eW , -1.0 + eW + dm, 0.2 - eW], // 70
        [-1.0 , -1.0 + eW + dm, 0.2 - eW], // 71

        // Block 9.
        // Block 9 is Block 1 with  y coordinates are added with dm.
        [-0.6 -eW , -1.0 + dm, 0.2], // 72
        [-0.6 , -1.0 + dm, 0.2], // 73
        [-0.6 , -1.0 + eW + dm, 0.2], // 74
        [-0.6 -eW , -1.0 + eW + dm, 0.2], // 75
        [-0.6 -eW , -1.0 + dm, 0.2 - eW], // 76
        [-0.6 , -1.0 + dm, 0.2 - eW], // 77
        [-0.6 , -1.0 + eW + dm, 0.2 - eW], // 78
        [-0.6 -eW , -1.0 + eW + dm, 0.2 - eW], // 79

        // Block 10.
        // Block 10 is Block 2 with  y coordinates are added with dm.
        [-0.6 - eW , -1.0 + dm, -0.2 + eW], // 80
        [-0.6 , -1.0 + dm, -0.2 + eW], // 81
        [-0.6 , -1.0 + eW + dm, -0.2 + eW], // 82
        [-0.6 - eW , -1.0 + eW + dm, -0.2 + eW], // 83
        [-0.6 - eW , -1.0 + dm, -0.2 ], // 84
        [-0.6 , -1.0 + dm, -0.2], // 85
        [-0.6 , -1.0 + eW + dm, -0.2], // 86
        [-0.6 - eW , -1.0 + eW + dm, -0.2], // 87
        
        // Block 11.
        // Block 11 is Block 3 with  y coordinates are added with dm.
        [-1.0 , -1.0 + dm, -0.2 + eW], // 88
        [-1.0 + eW , -1.0 + dm, -0.2 + eW], // 89
        [-1.0 + eW , -1.0 + eW + dm, -0.2 + eW], // 90
        [-1.0 , -1.0 + eW + dm, -0.2 + eW], // 91
        [-1.0 , -1.0 + dm, -0.2], // 92
        [-1.0 + eW , -1.0 + dm, -0.2], // 93
        [-1.0 + eW , -1.0 + eW + dm, -0.2], // 94
        [-1.0 , -1.0 + eW + dm, -0.2], // 95

        // Block 12.
        // Block 12 is Block 4 with  y coordinates are minus with dm.
        [-1.0 , 1.0 - eW - dm, 0.2], // 96
        [-1.0 + eW , 1.0 - eW - dm, 0.2], // 97
        [-1.0 + eW , 1.0 - dm, 0.2], // 98
        [-1.0 , 1.0 - dm, 0.2], // 99
        [-1.0 , 1.0 - eW - dm, 0.2 - eW], // 100
        [-1.0 + eW , 1.0 - eW - dm, 0.2 - eW], // 101
        [-1.0 + eW , 1.0 - dm, 0.2 - eW], // 102
        [-1.0 , 1.0 - dm, 0.2 - eW], // 103

        // Block 13.
        // Block 13 is Block 5 with  y coordinates are minus with dm.
        [-0.6 - eW , 1.0 - eW - dm, 0.2], // 104
        [-0.6 , 1.0 - eW - dm, 0.2], // 105
        [-0.6 , 1.0 - dm, 0.2], // 106
        [-0.6 - eW , 1.0 - dm, 0.2], // 107
        [-0.6 - eW , 1.0 - eW - dm, 0.2 - eW], // 108
        [-0.6 , 1.0 - eW - dm, 0.2 - eW], // 109
        [-0.6 , 1.0 - dm, 0.2 - eW], // 110
        [-0.6 - eW , 1.0 - dm, 0.2 - eW], // 111
        
        // Block 14.
        // Block 14 is Block 6 with  y coordinates are minus with dm.
        [-0.6 - eW , 1.0 - eW - dm, -0.2 + eW], // 112
        [-0.6 , 1.0 - eW - dm, -0.2 + eW], // 113
        [-0.6 , 1.0 - dm, -0.2 + eW], // 114
        [-0.6 - eW , 1.0 - dm, -0.2 + eW], // 115
        [-0.6 - eW , 1.0 - eW - dm, -0.2], // 116
        [-0.6 , 1.0 - eW - dm, -0.2], // 117
        [-0.6 , 1.0 - dm, -0.2], // 118
        [-0.6 - eW , 1.0 - dm, -0.2], // 119

        // Block 15.
        // Block 15 is Block 7 with  y coordinates are minus with dm.
        [-1.0, 1.0 - eW -dm, -0.2 + eW], // 120
        [-1.0 + eW , 1.0 - eW - dm, -0.2 + eW], // 121
        [-1.0 + eW , 1.0 - dm, -0.2 + eW], // 122
        [-1.0 , 1.0 - dm, -0.2 + eW], // 123
        [-1.0 , 1.0 - eW - dm, -0.2], // 124
        [-1.0 + eW , 1.0 - eW - dm, -0.2], // 125
        [-1.0 + eW , 1.0 - dm, -0.2], // 126
        [-1.0 , 1.0 - dm, -0.2], // 127

        // Block 16.
        // Block 16 is block 0 with x coordinates are added with dl.
        [-1.0 + dl, -1.0, 0.2], // 128
        [-1.0 + dl + eW, -1.0, 0.2], // 129
        [-1.0 + dl + eW, -1.0 + eW, 0.2], // 130
        [-1.0 + dl, -1.0 + eW, 0.2], // 131
        [-1.0 + dl, -1.0, 0.2 - eW], // 132
        [-1.0 + dl + eW, -1.0, 0.2 - eW], // 133
        [-1.0 + dl + eW, -1.0 + eW, 0.2 - eW], // 134
        [-1.0 + dl, -1.0 + eW, 0.2 - eW], // 135

        // Block 17.
        // Block 17 is block 1 with x coordinates are added with dl.
        [-0.6 - eW + dl, -1.0, 0.2], // 136
        [-0.6 + dl, -1.0, 0.2], // 137
        [-0.6 + dl, -1.0 + eW, 0.2], // 138
        [-0.6 - eW + dl, -1.0 + eW, 0.2], // 139
        [-0.6 - eW + dl, -1.0, 0.2 - eW], // 140
        [-0.6 + dl, -1.0, 0.2 - eW], // 141
        [-0.6 + dl, -1.0 + eW, 0.2 - eW], // 142
        [-0.6 - eW + dl, -1.0 + eW, 0.2 - eW], // 143

        // Block 18.
        // Block 18 is block 2 with x coordinates are added with dl.
        [-0.6 - eW + dl, -1.0, -0.2 + eW], // 144
        [-0.6 + dl, -1.0, -0.2 + eW], // 145
        [-0.6 + dl, -1.0 + eW, -0.2 + eW], // 146
        [-0.6 - eW + dl, -1.0 + eW, -0.2 + eW], // 147
        [-0.6 - eW + dl, -1.0, -0.2], // 148
        [-0.6 + dl, -1.0, -0.2], // 149
        [-0.6 + dl, -1.0 + eW, -0.2], // 150
        [-0.6 - eW + dl, -1.0 + eW, -0.2], // 151
        
        // Block 19.
        // Block 19 is block 3 with x coordinates are added with dl.
        [-1.0 + dl, -1.0, -0.2 + eW], // 152
        [-1.0 + dl + eW, -1.0, -0.2 + eW], // 153
        [-1.0 + dl + eW, -1.0 + eW, -0.2 + eW], // 154
        [-1.0 + dl, -1.0 + eW, -0.2 + eW], // 155
        [-1.0 + dl, -1.0, -0.2], // 156
        [-1.0 + dl + eW, -1.0, -0.2], // 157
        [-1.0 + dl + eW, -1.0 + eW, -0.2], // 158
        [-1.0 + dl, -1.0 + eW, -0.2], // 159

        // Block 20.
        // Block 20 is block 4 with x coordinates are added with dl.
        [-1.0 + dl, 1.0 - eW, 0.2], // 160
        [-1.0 + dl + eW, 1.0 - eW, 0.2], // 161
        [-1.0 + dl + eW, 1.0, 0.2], // 162
        [-1.0 + dl, 1.0, 0.2], // 163
        [-1.0 + dl, 1.0 - eW, 0.2 - eW], // 164
        [-1.0 + dl + eW, 1.0 - eW, 0.2 - eW], // 165
        [-1.0 + dl + eW, 1.0, 0.2 - eW], // 166
        [-1.0 + dl, 1.0, 0.2 - eW], // 167

        // Block 21.
        // Block 21 is block 5 with x coordinates are added with dl.
        [-0.6 - eW + dl, 1.0 - eW, 0.2], // 168
        [-0.6 + dl, 1.0 - eW, 0.2], // 169
        [-0.6 + dl, 1.0, 0.2], // 170
        [-0.6 - eW + dl, 1.0, 0.2], // 171
        [-0.6 - eW + dl, 1.0 - eW, 0.2 - eW], // 172
        [-0.6 + dl, 1.0 - eW, 0.2 - eW], // 173
        [-0.6 + dl, 1.0, 0.2 - eW], // 174
        [-0.6 - eW + dl, 1.0, 0.2 - eW], // 175

        // Block 22.
        // Block 22 is block 6 with x coordinates are added with dl.
        [-0.6 - eW + dl, 1.0 - eW, -0.2 + eW], // 176
        [-0.6 + dl, 1.0 - eW, -0.2 + eW], // 177
        [-0.6 + dl, 1.0, -0.2 + eW], // 178
        [-0.6 - eW + dl, 1.0, -0.2 + eW], // 179
        [-0.6 - eW + dl, 1.0 - eW, -0.2], // 180
        [-0.6 + dl, 1.0 - eW, -0.2], // 181
        [-0.6 + dl, 1.0, -0.2], // 182
        [-0.6 - eW + dl, 1.0, -0.2], // 183

        // Block 23.
        // Block 23 is block 7 with x coordinates are added with dl.
        [-1.0 + dl, 1.0 - eW, -0.2 + eW], // 184
        [-1.0 + dl + eW, 1.0 - eW, -0.2 + eW], // 185
        [-1.0 + dl + eW, 1.0, -0.2 + eW], // 186
        [-1.0 + dl, 1.0, -0.2 + eW], // 187
        [-1.0 + dl, 1.0 - eW, -0.2], // 188
        [-1.0 + dl + eW, 1.0 - eW, -0.2], // 189
        [-1.0 + dl + eW, 1.0, -0.2], // 190
        [-1.0 + dl, 1.0, -0.2], // 191

        // Block 24.
        // Block 24 is block 8 with x coordinates are added with dl.
        [-1.0 + dl, -1.0 + dm, 0.2], // 192
        [-1.0 + dl + eW, -1.0 + dm, 0.2], // 193
        [-1.0 + dl + eW, -1.0 + dm + eW, 0.2], // 194
        [-1.0 + dl, -1.0 + dm + eW, 0.2], // 195
        [-1.0 + dl, -1.0 + dm, 0.2 - eW], // 196
        [-1.0 + dl + eW, -1.0 + dm, 0.2 - eW], // 197
        [-1.0 + dl + eW, -1.0 + dm + eW, 0.2 - eW], // 198
        [-1.0 + dl, -1.0 + dm + eW, 0.2 - eW], // 199

        // Block 25.
        // Block 25 is block 9 with x coordinates are added with dl.
        [-0.6 - eW + dl, -1.0 + dm, 0.2], // 200
        [-0.6 + dl, -1.0 + dm, 0.2], // 201
        [-0.6 + dl, -1.0 + dm + eW, 0.2], // 202
        [-0.6 - eW + dl, -1.0 + dm + eW, 0.2], // 203
        [-0.6 - eW + dl, -1.0 + dm, 0.2 - eW], // 204
        [-0.6 + dl, -1.0 + dm, 0.2 - eW], // 205
        [-0.6 + dl, -1.0 + dm + eW, 0.2 - eW], // 206
        [-0.6 - eW + dl, -1.0 + dm + eW, 0.2 - eW], // 207

        // Block 26.
        // Block 26 is block 10 with x coordinates are added with dl.
        [-0.6 - eW + dl , -1.0 + dm, 0.2], // 208
        [-0.6 + dl, -1.0 + dm, 0.2], // 209
        [-0.6 + dl, -1.0 + dm + eW, 0.2], // 210
        [-0.6 - eW + dl, -1.0 + dm + eW, 0.2], // 211
        [-0.6 - eW + dl, -1.0 + dm, 0.2 - eW], // 212
        [-0.6 + dl, -1.0 + dm, 0.2 - eW], // 213
        [-0.6 + dl, -1.0 + dm + eW, 0.2 - eW], // 214
        [-0.6 - eW + dl, -1.0 + dm + eW, 0.2 - eW], // 215

        // Block 27.
        // Block 27 is block 11 with x coordinates are added with dl.
        [-1.0 + dl, -1.0 + dm, -0.2 + eW], // 216
        [-1.0 + dl + eW, -1.0 + dm, -0.2 + eW], // 217
        [-1.0 + dl + eW, -1.0 + dm + eW, -0.2 + eW], // 218
        [-1.0 + dl, -1.0 + dm + eW, -0.2 + eW], // 219
        [-1.0 + dl, -1.0 + dm, -0.2], // 220
        [-1.0 + dl + eW, -1.0 + dm, -0.2], // 221
        [-1.0 + dl + eW, -1.0 + dm + eW, -0.2], // 222
        [-1.0 + dl, -1.0 + dm + eW, -0.2], // 223

        // Block 28.
        // Block 28 is block 12 with x coordinates are added with dl.
        [-1.0 + dl , 1.0 - eW - dm, 0.2], // 224
        [-1.0 + dl + eW, 1.0 - eW - dm, 0.2], // 225
        [-1.0 + dl + eW, 1.0 - eW - dm + eW, 0.2], // 226
        [-1.0 + dl, 1.0 - eW - dm + eW, 0.2], // 227
        [-1.0 + dl, 1.0 - eW - dm, 0.2 - eW], // 228
        [-1.0 + dl + eW, 1.0 - eW - dm, 0.2 - eW], // 229
        [-1.0 + dl + eW, 1.0 - eW - dm + eW, 0.2 - eW], // 230
        [-1.0 + dl, 1.0 - eW - dm + eW, 0.2 - eW], // 231

        // Block 29.
        // Block 29 is block 13 with x coordinates are added with dl.
        [-0.6 - eW + dl, 1.0 - eW - dm, 0.2], // 232
        [-0.6 + dl, 1.0 - eW - dm, 0.2], // 233
        [-0.6 + dl, 1.0 - eW - dm + eW, 0.2], // 234
        [-0.6 - eW + dl, 1.0 - eW - dm + eW, 0.2], // 235
        [-0.6 - eW + dl, 1.0 - eW - dm, 0.2 - eW], // 236
        [-0.6 + dl, 1.0 - eW - dm, 0.2 - eW], // 237
        [-0.6 + dl, 1.0 - eW - dm + eW, 0.2 - eW], // 238
        [-0.6 - eW + dl, 1.0 - eW - dm + eW, 0.2 - eW], // 239

        // Block 30.
        // Block 30 is block 14 with x coordinates are added with dl.
        [-0.6 - eW + dl , 1.0 - eW - dm, 0.2], // 240
        [-0.6 + dl, 1.0 - eW - dm, 0.2], // 241
        [-0.6 + dl, 1.0 - dm, 0.2], // 242
        [-0.6 - eW + dl, 1.0 - dm, 0.2], // 243
        [-0.6 - eW + dl, 1.0 - eW - dm, 0.2 - eW], // 244
        [-0.6 + dl, 1.0 - eW - dm, 0.2 - eW], // 245
        [-0.6 + dl, 1.0 - dm, 0.2 - eW], // 246
        [-0.6 - eW + dl, 1.0 - dm, 0.2 - eW], // 247

        // Block 31.
        // Block 31 is block 15 with x coordinates are added with dl.
        [-1.0 + dl, 1.0 - eW -dm, -0.2 + eW], // 120
        [-1.0 + eW + dl, 1.0 - eW - dm, -0.2 + eW], // 121
        [-1.0 + eW + dl, 1.0 - dm, -0.2 + eW], // 122
        [-1.0 + dl, 1.0 - dm, -0.2 + eW], // 123
        [-1.0 + dl, 1.0 - eW - dm, -0.2], // 124
        [-1.0 + eW + dl , 1.0 - eW - dm, -0.2], // 125
        [-1.0 + eW + dl , 1.0 - dm, -0.2], // 126
        [-1.0 + dl, 1.0 - dm, -0.2], // 127
    ];

    // Index displacement
    var idd = 128;

    // All edges in hollow object.
    let edges = [
        // LEFT SIDE.
        // Edges from block 0 to block 1.
        new Edge([
            [0, 9, 10, 3], // Front face.
            [4, 13, 14, 7], // Back face.
            [3, 10, 14, 7], // Top face.
            [0, 9, 13, 4], // Bottom face.
            [9, 13, 10, 14], // Right face.
            [0, 3, 7, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 1 to block 2.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [20, 21, 22, 23], // Back face.
            [11, 10, 22, 23], // Top face.
            [8, 9, 21, 20], // Bottom face.
            [9, 21, 10, 22], // Right face.
            [8, 11, 23, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 3.
        new Edge([
            [24, 17, 18, 27], // Front face.
            [28, 21, 22, 31], // Back face.
            [27, 18, 22, 31], // Top face.
            [24, 17, 21, 28], // Bottom face.
            [17, 21, 18, 22], // Right face.
            [24, 27, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,    
            randomColor
        ]),
        // Edges from block 3 to block 0.
        new Edge([
            [0, 1, 2, 3], // Front face.
            [28, 29, 30, 31], // Back face.
            [3, 2, 30, 31], // Top face.
            [0, 1, 29, 28], // Bottom face.
            [1, 29, 2, 30], // Right face.
            [0, 3, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 4 to block 5.
        new Edge([
            [32, 41, 42, 35], // Front face.
            [36, 45, 46, 39], // Back face.
            [35, 42, 46, 39], // Top face.
            [32, 41, 45, 36], // Bottom face.
            [41, 45, 42, 46], // Right face.
            [32, 35, 39, 36], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 5 to block 6.
        new Edge([
            [40, 41, 42, 43], // Front face.
            [52, 53, 54, 55], // Back face.
            [43, 42, 54, 55], // Top face.
            [40, 41, 53, 52], // Bottom face.
            [41, 53, 42, 54], // Right face.
            [40, 43, 55, 52], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 6 to block 7.
        new Edge([
            [56, 49, 50, 59], // Front face.
            [60, 53, 54, 63], // Back face.
            [59, 50, 54, 63], // Top face.
            [56, 49, 53, 60], // Bottom face.
            [49, 53, 50, 54], // Right face.
            [56, 59, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 7 to block 4.
        new Edge([
            [32, 33, 34, 35], // Front face.
            [60, 61, 62, 63], // Back face.
            [35, 34, 62, 63], // Top face.
            [32, 33, 61, 60], // Bottom face.
            [33, 61, 34, 62], // Right face.
            [32, 35, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 0 to block 4.
        new Edge([
            [0, 1, 34, 35], // Front face.
            [4, 5, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 34, 38], // Right face.
            [0, 35, 39, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 1 to block 9.
        new Edge([
            [8, 9, 74, 75], // Front face.
            [12, 13, 78, 79], // Back face.
            [75, 74, 78, 79], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 74, 78], // Right face.
            [8, 75, 79, 12], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        new Edge([
            [8 +idd-8, 9 +idd-8, 74 + 120, 75 + 120], // Front face.
            [12 +idd-8, 13 +idd-8, 78 + 120, 79 +120], // Back face.
            [75 +120, 74 +120, 78 + 120, 79 +120], // Top face.
            [8 +idd-8, 9 +idd-8, 13 + idd, 12 + idd-8], // Bottom face.
            [9 +idd-8, 13 +idd-8, 74 + 120, 78 + 120], // Right face.
            [8 +idd-8, 75 +120, 79 + 120, 12 + idd-8], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 13 to block 5.
        new Edge([
            [105 + 120, 104 + 120, 43 + idd - 8, 42 + idd - 8], // Front face.
            [108 + 120, 109 + 120, 47 + idd - 8, 46 + idd - 8], // Back face.
            [42 + idd - 8, 43 + idd - 8, 47 + idd - 8, 46 + idd - 8], // Top face.
            [104 + 120, 105 + 120, 109 + 120, 108 + 120], // Bottom face.
            [105 + 120, 109 + 120, 42 + idd - 8, 46 + idd - 8], // Right face.
            [104 + 120, 43 + idd - 8, 47 + idd - 8, 108 + 120], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        new Edge([
            [105, 104, 43, 42], // Front face.
            [108, 109, 47, 46], // Back face.
            [42, 43, 47, 46], // Top face.
            [104, 105, 109, 108], // Bottom face.
            [105, 109, 42, 46], // Right face.
            [104, 43, 47, 108], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 2 to block 10.
        new Edge([
            [16, 17, 82, 83], // Front face.
            [20, 21, 86, 87], // Back face.
            [82, 83, 87, 86], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 82, 86], // Right face.
            [16, 83, 87, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        new Edge([
            [16 + idd +8, 17 + idd +8, 82 + 136, 83 + 136], // Front face.
            [20 + idd +8, 21 + idd +8, 86 + 136, 87 + 136], // Back face.
            [82 + 136, 83 + 136, 87 + 136, 86 + 136], // Top face.
            [16 + idd +8, 17 + idd +8, 21 + idd +8, 20 + idd +8], // Bottom face.
            [17 + idd +8, 21 + idd + 8, 82 + 136, 86 + 136], // Right face.
            [16 + idd +8, 83 + 136, 87 + 136, 20 + idd +8], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 14 to block 6.
        new Edge([
            [112, 113, 50, 51], // Front face.
            [116, 117, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [112, 113, 117, 116], // Bottom face.
            [113, 117, 50, 54], // Right face.
            [112, 51, 55, 116], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        new Edge([
            [112 + 136, 113 + 136, 50 + idd +8, 51 + idd +8], // Front face.
            [116 + 136, 117 + 136, 54 + idd +8, 55 + idd +8], // Back face.
            [51 + idd +8, 50 + idd +8, 54 + idd +8, 55 + idd +8], // Top face.
            [112 + 136, 113 + 136, 117 + 136, 116 + 136], // Bottom face.
            [113 + 136, 117 + 136, 50 + idd +8, 54 + idd +8], // Right face.
            [112 + 136, 51 + idd +8, 55 + idd +8, 116 + 136], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 3 to block 7.
        new Edge([
            [24, 25, 58, 59], // Front face.
            [28, 29, 62, 63], // Back face.
            [59, 58, 62, 63], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 58, 62], // Right face.
            [24, 59, 63, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        

        // MIDDLE SIDE
        // Edges from block 14 to 31
        new Edge([
            [112, 249, 253, 116], // Front face.
            [115, 250, 254, 119], // Back face.
            [116, 253, 254, 119], // Top face.
            [112, 249, 250, 115], // Bottom face.
            [249, 250, 253, 254], // Right face.
            [112, 116, 119, 115], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 10 to 27
        new Edge([
            [80, 217, 221, 84], // Front face.
            [83, 218, 222, 87], // Back face.
            [84, 221, 222, 87], // Top face.
            [80, 217, 218, 83], // Bottom face.
            [217, 218, 221, 222], // Right face.
            [80, 83, 87, 84], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 13 to 28
        new Edge([
            [104, 225, 229, 108], // Front face.
            [107, 226, 230, 111], // Back face.
            [108, 229, 230, 111], // Top face.
            [104, 225, 226, 107], // Bottom face.
            [225, 226, 229, 230], // Right face.
            [104, 108, 111, 107], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // // Edges from block 9 to 24
        new Edge([
            [72, 193, 194, 75], // Front face.
            [76, 197, 198, 79], // Back face.
            [75, 194, 198, 79], // Top face.
            [72, 193, 197, 76], // Bottom face.
            [193, 198, 197, 194], // Right face.
            [72, 76, 79, 75], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        
        // RIGHT SIDE
        // Edges from block 16 to 17.
        new Edge([
            [0 + idd, 9 + idd, 10 + idd, 3 + idd], // Front face.
            [4 + idd, 13 + idd, 14 + idd, 7 + idd], // Back face.
            [3 + idd, 10 + idd, 14 + idd, 7 + idd], // Top face.
            [0 + idd, 9 + idd, 13 + idd, 4 + idd], // Bottom face.
            [9 + idd, 13 + idd, 10 + idd, 14 + idd], // Right face.
            [0 + idd, 3 + idd, 7 + idd, 4 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 17 to 18.
        new Edge([
            [8 + idd, 9 + idd, 10 + idd, 11 + idd], // Front face.
            [20 + idd, 21 + idd, 22 + idd, 23 + idd], // Back face.
            [11 + idd, 10 + idd, 22 + idd, 23 + idd], // Top face.
            [8 + idd, 9 + idd, 21 + idd, 20 + idd], // Bottom face.
            [9 + idd, 21 + idd, 10 + idd, 22 + idd], // Right face.
            [8 + idd, 11 + idd, 23 + idd, 20 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 18 to 19.
        new Edge([
            [24 + idd, 17 + idd, 18 + idd, 27 + idd], // Front face.
            [28 + idd, 21 + idd, 22 + idd, 31 + idd], // Back face.
            [27 + idd, 18 + idd, 22 + idd, 31 + idd], // Top face.
            [24 + idd, 17 + idd, 21 + idd, 28 + idd], // Bottom face.
            [17 + idd, 21 + idd, 18 + idd, 22 + idd], // Right face.
            [24 + idd, 27 + idd, 31 + idd, 28 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 19 to 16.
        new Edge([
            [0 + idd, 1 + idd, 2 + idd, 3 + idd], // Front face.
            [28 + idd, 29 + idd, 30 + idd, 31 + idd], // Back face.
            [3 + idd, 2 + idd, 30 + idd, 31 + idd], // Top face.
            [0 + idd, 1 + idd, 29 + idd, 28 + idd], // Bottom face.
            [1 + idd, 29 + idd, 2 + idd, 30 + idd], // Right face.
            [0 + idd, 3 + idd, 31 + idd, 28 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 20 to 21.
        new Edge([
            [32 + idd, 41 + idd, 42 + idd, 35 + idd], // Front face.
            [36 + idd, 45 + idd, 46 + idd, 39 + idd], // Back face.
            [35 + idd, 42 + idd, 46 + idd, 39 + idd], // Top face.
            [32 + idd, 41 + idd, 45 + idd, 36 + idd], // Bottom face.
            [41 + idd, 45 + idd, 42 + idd, 46 + idd], // Right face.
            [32 + idd, 35 + idd, 39 + idd, 36 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 21 to 22.
        new Edge([
            [40 + idd, 41 + idd, 42 + idd, 43 + idd], // Front face.
            [52 + idd, 53 + idd, 54 + idd, 55 + idd], // Back face.
            [43 + idd, 42 + idd, 54 + idd, 55 + idd], // Top face.
            [40 + idd, 41 + idd, 53 + idd, 52 + idd], // Bottom face.
            [41 + idd, 53 + idd, 42 + idd, 54 + idd], // Right face.
            [40 + idd, 43 + idd, 55 + idd, 52 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 22 to 23.
        new Edge([
            [56 + idd, 49 + idd, 50 + idd, 59 + idd], // Front face.
            [60 + idd, 53 + idd, 54 + idd, 63 + idd], // Back face.
            [59 + idd, 50 + idd, 54 + idd, 63 + idd], // Top face.
            [56 + idd, 49 + idd, 53 + idd, 60 + idd], // Bottom face.
            [49 + idd, 53 + idd, 50 + idd, 54 + idd], // Right face.
            [56 + idd, 59 + idd, 63 + idd, 60 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 23 to 20.
        new Edge([
            [32 + idd, 33 + idd, 34 + idd, 35 + idd], // Front face.
            [60 + idd, 61 + idd, 62 + idd, 63 + idd], // Back face.
            [35 + idd, 34 + idd, 62 + idd, 63 + idd], // Top face.
            [32 + idd, 33 + idd, 61 + idd, 60 + idd], // Bottom face.
            [33 + idd, 61 + idd, 34 + idd, 62 + idd], // Right face.
            [32 + idd, 35 + idd, 63 + idd, 60 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 17 to 21.
        new Edge([
            [8 + idd, 9 + idd, 42 + idd, 43 + idd], // Front face.
            [12 + idd, 13 + idd, 46 + idd, 47 + idd], // Back face.
            [43 + idd, 42 + idd, 46 + idd, 47 + idd], // Top face.
            [8 + idd, 9 + idd, 13 + idd, 12 + idd], // Bottom face.
            [9 + idd, 13 + idd, 42 + idd, 46 + idd], // Right face.
            [8 + idd, 43 + idd, 47 + idd, 12 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 18 to 22.
        new Edge([
            [16 + idd, 17 + idd, 50 + idd, 51 + idd], // Front face.
            [20 + idd, 21 + idd, 54 + idd, 55 + idd], // Back face.
            [51 + idd, 50 + idd, 54 + idd, 55 + idd], // Top face.
            [16 + idd, 17 + idd, 21 + idd, 20 + idd], // Bottom face.
            [17 + idd, 21 + idd, 50 + idd, 54 + idd], // Right face.
            [16 + idd, 51 + idd, 55 + idd, 20 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

    ];

    return new HollowObject(vertices, edges);
}

const loadHollowN = () => {
    // Generate hollow object representing h letter.
    // Generate random color. Will be used on every face.
    let randomColor = randomRGB();

    // Edge width
    const eW = 0.1;

    // Displacement from top/bottom to mid.
    const dm = 1.5;
    

    // Displacement from 1 edge in left to right.
    const dl = 1.6;

    // All vertices in hollow object.
    // Not all vertices are going to be used.
    let vertices = [
        // Block 0
        [-1.0, -1.0, 0.2], // 0
        [-1.0 + eW, -1.0, 0.2], // 1
        [-1.0 + eW, -1.0 + eW, 0.2], // 2
        [-1.0, -1.0 + eW, 0.2], // 3
        [-1.0, -1.0, 0.2 - eW], // 4
        [-1.0 + eW, -1.0, 0.2 - eW], // 5
        [-1.0 + eW, -1.0 + eW, 0.2 - eW], // 6
        [-1.0, -1.0 + eW, 0.2 - eW], // 7

        // Block 1
        [-0.6 - eW, -1.0, 0.2], // 8
        [-0.6, -1.0, 0.2], // 9
        [-0.6, -1.0 + eW, 0.2], // 10
        [-0.6 - eW, -1.0 + eW, 0.2], // 11
        [-0.6 - eW, -1.0, 0.2 - eW], // 12
        [-0.6, -1.0, 0.2 - eW], // 13
        [-0.6, -1.0 + eW, 0.2 - eW], // 14
        [-0.6 - eW, -1.0 + eW, 0.2 - eW], // 15

        // Block 2
        [-0.6 - eW, -1.0, -0.2 + eW], // 16
        [-0.6 , -1.0, -0.2 + eW], // 17
        [-0.6, -1.0 + eW, -0.2 + eW], // 18
        [-0.6 - eW, -1.0 + eW, -0.2 + eW], // 19
        [-0.6 - eW, -1.0, -0.2], // 20
        [-0.6, -1.0, -0.2], // 21
        [-0.6, -1.0 + eW, -0.2], // 22
        [-0.6 - eW, -1.0 + eW, -0.2], // 23

        // Block 3
        [-1.0, -1.0, -0.2 + eW], // 24
        [-1.0 + eW, -1.0, -0.2 + eW], // 25
        [-1.0 + eW, -1.0 + eW, -0.2 + eW], // 26
        [-1.0, -1.0 + eW, -0.2 + eW], // 27
        [-1.0, -1.0, -0.2], // 28
        [-1.0 + eW, -1.0, -0.2], // 29
        [-1.0 + eW, -1.0 + eW, -0.2], // 30
        [-1.0, -1.0 + eW, -0.2], // 31

        // Block 4
        [-1.0, 1.0 - eW, 0.2], // 32
        [-1.0 + eW, 1.0 - eW, 0.2], // 33
        [-1.0 + eW, 1.0, 0.2], // 34
        [-1.0, 1.0, 0.2], // 35
        [-1.0, 1.0 - eW, 0.2 - eW], // 36
        [-1.0 + eW, 1.0 - eW, 0.2 - eW], // 37
        [-1.0 + eW, 1.0, 0.2 - eW], // 38
        [-1.0, 1.0, 0.2 - eW], // 39

        // Block 5
        [-0.6 - eW, 1.0 - eW, 0.2], // 40
        [-0.6, 1.0 - eW, 0.2], // 41
        [-0.6, 1.0, 0.2], // 42
        [-0.6 - eW, 1.0, 0.2], // 43
        [-0.6 - eW, 1.0 - eW, 0.2 - eW], // 44
        [-0.6, 1.0 - eW, 0.2 - eW], // 45
        [-0.6, 1.0, 0.2 - eW], // 46
        [-0.6 - eW, 1.0, 0.2 - eW], // 47
        
        // Block 6
        [-0.6 - eW, 1.0 - eW, -0.2 + eW], // 48
        [-0.6, 1.0 - eW, -0.2 + eW], // 49
        [-0.6, 1.0, -0.2 + eW], // 50
        [-0.6 - eW, 1.0, -0.2 + eW], // 51
        [-0.6 - eW, 1.0 - eW, -0.2], // 52
        [-0.6, 1.0 - eW, -0.2], // 53
        [-0.6, 1.0, -0.2], // 54
        [-0.6 - eW, 1.0, -0.2], // 55

        // Block 7
        [-1.0, 1.0 - eW, -0.2 + eW], // 56
        [-1.0 + eW, 1.0 - eW, -0.2 + eW], // 57
        [-1.0 + eW, 1.0, -0.2 + eW], // 58
        [-1.0, 1.0, -0.2 + eW], // 59
        [-1.0, 1.0 - eW, -0.2], // 60
        [-1.0 + eW, 1.0 - eW, -0.2], // 61
        [-1.0 + eW, 1.0, -0.2], // 62
        [-1.0, 1.0, -0.2], // 63

        // Block 8.
        // Block 8 is Block 0 with y coordinates are added with dm.
        [-1.0 , -1.0 + dm, 0.2], // 64
        [-1.0 + eW , -1.0 + dm, 0.2], // 65
        [-1.0 + eW , -1.0 + eW + dm, 0.2], // 66
        [-1.0 , -1.0 + eW + dm, 0.2], // 67
        [-1.0 , -1.0 + dm, 0.2 - eW], // 68
        [-1.0 + eW , -1.0 + dm, 0.2 - eW], // 69
        [-1.0 + eW , -1.0 + eW + dm, 0.2 - eW], // 70
        [-1.0 , -1.0 + eW + dm, 0.2 - eW], // 71

        // Block 9.
        // Block 9 is Block 1 with  y coordinates are added with dm.
        [-0.6 -eW , -1.0 + dm, 0.2], // 72
        [-0.6 , -1.0 + dm, 0.2], // 73
        [-0.6 , -1.0 + eW + dm, 0.2], // 74
        [-0.6 -eW , -1.0 + eW + dm, 0.2], // 75
        [-0.6 -eW , -1.0 + dm, 0.2 - eW], // 76
        [-0.6 , -1.0 + dm, 0.2 - eW], // 77
        [-0.6 , -1.0 + eW + dm, 0.2 - eW], // 78
        [-0.6 -eW , -1.0 + eW + dm, 0.2 - eW], // 79

        // Block 10.
        // Block 10 is Block 2 with  y coordinates are added with dm.
        [-0.6 - eW , -1.0 + dm, -0.2 + eW], // 80
        [-0.6 , -1.0 + dm, -0.2 + eW], // 81
        [-0.6 , -1.0 + eW + dm, -0.2 + eW], // 82
        [-0.6 - eW , -1.0 + eW + dm, -0.2 + eW], // 83
        [-0.6 - eW , -1.0 + dm, -0.2 ], // 84
        [-0.6 , -1.0 + dm, -0.2], // 85
        [-0.6 , -1.0 + eW + dm, -0.2], // 86
        [-0.6 - eW , -1.0 + eW + dm, -0.2], // 87
        
        // Block 11.
        // Block 11 is Block 3 with  y coordinates are added with dm.
        [-1.0 , -1.0 + dm, -0.2 + eW], // 88
        [-1.0 + eW , -1.0 + dm, -0.2 + eW], // 89
        [-1.0 + eW , -1.0 + eW + dm, -0.2 + eW], // 90
        [-1.0 , -1.0 + eW + dm, -0.2 + eW], // 91
        [-1.0 , -1.0 + dm, -0.2], // 92
        [-1.0 + eW , -1.0 + dm, -0.2], // 93
        [-1.0 + eW , -1.0 + eW + dm, -0.2], // 94
        [-1.0 , -1.0 + eW + dm, -0.2], // 95

        // Block 12.
        // Block 12 is Block 4 with  y coordinates are minus with dm.
        [-1.0 , 1.0 - eW , 0.2], // 96
        [-1.0 + eW , 1.0 - eW , 0.2], // 97
        [-1.0 + eW , 1.0 , 0.2], // 98
        [-1.0 , 1.0 , 0.2], // 99
        [-1.0 , 1.0 - eW , 0.2 - eW], // 100
        [-1.0 + eW , 1.0 - eW , 0.2 - eW], // 101
        [-1.0 + eW , 1.0 , 0.2 - eW], // 102
        [-1.0 , 1.0 , 0.2 - eW], // 103

        // Block 13.
        // Block 13 is Block 5 with  y coordinates are minus with dm.
        [-0.6 - eW , 1.0 - eW , 0.2], // 104
        [-0.6 , 1.0 - eW , 0.2], // 105
        [-0.6 , 1.0 , 0.2], // 106
        [-0.6 - eW , 1.0 , 0.2], // 107
        [-0.6 - eW , 1.0 - eW , 0.2 - eW], // 108
        [-0.6 , 1.0 - eW , 0.2 - eW], // 109
        [-0.6 , 1.0 , 0.2 - eW], // 110
        [-0.6 - eW , 1.0 , 0.2 - eW], // 111
        
        // Block 14.
        // Block 14 is Block 6 with  y coordinates are minus with dm.
        [-0.6 - eW , 1.0 - eW , -0.2 + eW], // 112
        [-0.6 , 1.0 - eW , -0.2 + eW], // 113
        [-0.6 , 1.0 , -0.2 + eW], // 114
        [-0.6 - eW , 1.0, -0.2 + eW], // 115
        [-0.6 - eW , 1.0 - eW , -0.2], // 116
        [-0.6 , 1.0 - eW , -0.2], // 117
        [-0.6 , 1.0 , -0.2], // 118
        [-0.6 - eW , 1.0 , -0.2], // 119

        // Block 15.
        // Block 15 is Block 7 with  y coordinates are minus with dm.
        [-1.0, 1.0 - eW, -0.2 + eW], // 120
        [-1.0 + eW , 1.0 - eW , -0.2 + eW], // 121
        [-1.0 + eW , 1.0 , -0.2 + eW], // 122
        [-1.0 , 1.0 , -0.2 + eW], // 123
        [-1.0 , 1.0 - eW , -0.2], // 124
        [-1.0 + eW , 1.0 - eW , -0.2], // 125
        [-1.0 + eW , 1.0 , -0.2], // 126
        [-1.0 , 1.0 , -0.2], // 127

        // Block 16.
        // Block 16 is block 0 with x coordinates are added with dl.
        [-1.0 + dl, -1.0, 0.2], // 128
        [-1.0 + dl + eW, -1.0, 0.2], // 129
        [-1.0 + dl + eW, -1.0 + eW, 0.2], // 130
        [-1.0 + dl, -1.0 + eW, 0.2], // 131
        [-1.0 + dl, -1.0, 0.2 - eW], // 132
        [-1.0 + dl + eW, -1.0, 0.2 - eW], // 133
        [-1.0 + dl + eW, -1.0 + eW, 0.2 - eW], // 134
        [-1.0 + dl, -1.0 + eW, 0.2 - eW], // 135

        // Block 17.
        // Block 17 is block 1 with x coordinates are added with dl.
        [-0.6 - eW + dl, -1.0, 0.2], // 136
        [-0.6 + dl, -1.0, 0.2], // 137
        [-0.6 + dl, -1.0 + eW, 0.2], // 138
        [-0.6 - eW + dl, -1.0 + eW, 0.2], // 139
        [-0.6 - eW + dl, -1.0, 0.2 - eW], // 140
        [-0.6 + dl, -1.0, 0.2 - eW], // 141
        [-0.6 + dl, -1.0 + eW, 0.2 - eW], // 142
        [-0.6 - eW + dl, -1.0 + eW, 0.2 - eW], // 143

        // Block 18.
        // Block 18 is block 2 with x coordinates are added with dl.
        [-0.6 - eW + dl, -1.0, -0.2 + eW], // 144
        [-0.6 + dl, -1.0, -0.2 + eW], // 145
        [-0.6 + dl, -1.0 + eW, -0.2 + eW], // 146
        [-0.6 - eW + dl, -1.0 + eW, -0.2 + eW], // 147
        [-0.6 - eW + dl, -1.0, -0.2], // 148
        [-0.6 + dl, -1.0, -0.2], // 149
        [-0.6 + dl, -1.0 + eW, -0.2], // 150
        [-0.6 - eW + dl, -1.0 + eW, -0.2], // 151
        
        // Block 19.
        // Block 19 is block 3 with x coordinates are added with dl.
        [-1.0 + dl, -1.0, -0.2 + eW], // 152
        [-1.0 + dl + eW, -1.0, -0.2 + eW], // 153
        [-1.0 + dl + eW, -1.0 + eW, -0.2 + eW], // 154
        [-1.0 + dl, -1.0 + eW, -0.2 + eW], // 155
        [-1.0 + dl, -1.0, -0.2], // 156
        [-1.0 + dl + eW, -1.0, -0.2], // 157
        [-1.0 + dl + eW, -1.0 + eW, -0.2], // 158
        [-1.0 + dl, -1.0 + eW, -0.2], // 159

        // Block 20.
        // Block 20 is block 4 with x coordinates are added with dl.
        [-1.0 + dl, 1.0 - eW, 0.2], // 160
        [-1.0 + dl + eW, 1.0 - eW, 0.2], // 161
        [-1.0 + dl + eW, 1.0, 0.2], // 162
        [-1.0 + dl, 1.0, 0.2], // 163
        [-1.0 + dl, 1.0 - eW, 0.2 - eW], // 164
        [-1.0 + dl + eW, 1.0 - eW, 0.2 - eW], // 165
        [-1.0 + dl + eW, 1.0, 0.2 - eW], // 166
        [-1.0 + dl, 1.0, 0.2 - eW], // 167

        // Block 21.
        // Block 21 is block 5 with x coordinates are added with dl.
        [-0.6 - eW + dl, 1.0 - eW, 0.2], // 168
        [-0.6 + dl, 1.0 - eW, 0.2], // 169
        [-0.6 + dl, 1.0, 0.2], // 170
        [-0.6 - eW + dl, 1.0, 0.2], // 171
        [-0.6 - eW + dl, 1.0 - eW, 0.2 - eW], // 172
        [-0.6 + dl, 1.0 - eW, 0.2 - eW], // 173
        [-0.6 + dl, 1.0, 0.2 - eW], // 174
        [-0.6 - eW + dl, 1.0, 0.2 - eW], // 175

        // Block 22.
        // Block 22 is block 6 with x coordinates are added with dl.
        [-0.6 - eW + dl, 1.0 - eW, -0.2 + eW], // 176
        [-0.6 + dl, 1.0 - eW, -0.2 + eW], // 177
        [-0.6 + dl, 1.0, -0.2 + eW], // 178
        [-0.6 - eW + dl, 1.0, -0.2 + eW], // 179
        [-0.6 - eW + dl, 1.0 - eW, -0.2], // 180
        [-0.6 + dl, 1.0 - eW, -0.2], // 181
        [-0.6 + dl, 1.0, -0.2], // 182
        [-0.6 - eW + dl, 1.0, -0.2], // 183

        // Block 23.
        // Block 23 is block 7 with x coordinates are added with dl.
        [-1.0 + dl, 1.0 - eW, -0.2 + eW], // 184
        [-1.0 + dl + eW, 1.0 - eW, -0.2 + eW], // 185
        [-1.0 + dl + eW, 1.0, -0.2 + eW], // 186
        [-1.0 + dl, 1.0, -0.2 + eW], // 187
        [-1.0 + dl, 1.0 - eW, -0.2], // 188
        [-1.0 + dl + eW, 1.0 - eW, -0.2], // 189
        [-1.0 + dl + eW, 1.0, -0.2], // 190
        [-1.0 + dl, 1.0, -0.2], // 191

        // Block 24.
        // Block 24 is block 8 with x coordinates are added with dl.
        [-1.0 + dl, -1.0 + dm - 1.5, 0.2], // 192
        [-1.0 + dl + eW, -1.0 + dm - 1.5, 0.2], // 193
        [-1.0 + dl + eW, -1.0 + dm - 1.5 + eW, 0.2], // 194
        [-1.0 + dl, -1.0 + dm - 1.5 + eW, 0.2], // 195
        [-1.0 + dl, -1.0 + dm - 1.5, 0.2 - eW], // 196
        [-1.0 + dl + eW, -1.0 + dm - 1.5, 0.2 - eW], // 197
        [-1.0 + dl + eW, -1.0 + dm - 1.5 + eW, 0.2 - eW], // 198
        [-1.0 + dl, -1.0 + dm - 1.5 + eW, 0.2 - eW], // 199

        // Block 25.
        // Block 25 is block 9 with x coordinates are added with dl.
        [-0.6 - eW + dl, -1.0 + dm - 1.6, 0.2], // 200
        [-0.6 + dl, -1.0 + dm - 1.6, 0.2], // 201
        [-0.6 + dl, -1.0 + dm - 1.6 + eW, 0.2], // 202
        [-0.6 - eW + dl, -1.0 + dm - 1.6 + eW, 0.2], // 203
        [-0.6 - eW + dl, -1.0 + dm - 1.6, 0.2 - eW], // 204
        [-0.6 + dl, -1.0 + dm - 1.6, 0.2 - eW], // 205
        [-0.6 + dl, -1.0 + dm - 1.6 + eW, 0.2 - eW], // 206
        [-0.6 - eW + dl, -1.0 + dm - 1.6 + eW, 0.2 - eW], // 207

        // Block 26.
        // Block 26 is block 10 with x coordinates are added with dl.
        [-0.6 - eW + dl , -1.0 + dm - 1.6, 0.2], // 208
        [-0.6 + dl, -1.0 + dm - 1.6, 0.2], // 209
        [-0.6 + dl, -1.0 + dm - 1.6 + eW, 0.2], // 210
        [-0.6 - eW + dl, -1.0 + dm - 1.6 + eW, 0.2], // 211
        [-0.6 - eW + dl, -1.0 + dm - 1.6, 0.2 - eW], // 212
        [-0.6 + dl, -1.0 + dm - 1.6, 0.2 - eW], // 213
        [-0.6 + dl, -1.0 + dm - 1.6 + eW, 0.2 - eW], // 214
        [-0.6 - eW + dl, -1.0 + dm - 1.6 + eW, 0.2 - eW], // 215

        // Block 27.
        // Block 27 is block 11 with x coordinates are added with dl.
        [-1.0 + dl, -1.0 + dm - 1.5, -0.2 + eW], // 216
        [-1.0 + dl + eW, -1.0 + dm - 1.5, -0.2 + eW], // 217
        [-1.0 + dl + eW, -1.0 + dm - 1.5 + eW, -0.2 + eW], // 218
        [-1.0 + dl, -1.0 + dm - 1.5 + eW, -0.2 + eW], // 219
        [-1.0 + dl, -1.0 + dm - 1.5, -0.2], // 220
        [-1.0 + dl + eW, -1.0 + dm - 1.5, -0.2], // 221
        [-1.0 + dl + eW, -1.0 + dm - 1.5 + eW, -0.2], // 222
        [-1.0 + dl, -1.0 + dm - 1.5 + eW, -0.2], // 223

        // Block 28.
        // Block 28 is block 12 with x coordinates are added with dl.
        [-1.0 + dl , 1.0 - eW - dm, 0.2], // 224
        [-1.0 + dl + eW, 1.0 - eW - dm, 0.2], // 225
        [-1.0 + dl + eW, 1.0 - eW - dm + eW, 0.2], // 226
        [-1.0 + dl, 1.0 - eW - dm + eW, 0.2], // 227
        [-1.0 + dl, 1.0 - eW - dm, 0.2 - eW], // 228
        [-1.0 + dl + eW, 1.0 - eW - dm, 0.2 - eW], // 229
        [-1.0 + dl + eW, 1.0 - eW - dm + eW, 0.2 - eW], // 230
        [-1.0 + dl, 1.0 - eW - dm + eW, 0.2 - eW], // 231

        // Block 29.
        // Block 29 is block 13 with x coordinates are added with dl.
        [-0.6 - eW + dl, 1.0 - eW - dm, 0.2], // 232
        [-0.6 + dl, 1.0 - eW - dm, 0.2], // 233
        [-0.6 + dl, 1.0 - eW - dm + eW, 0.2], // 234
        [-0.6 - eW + dl, 1.0 - eW - dm + eW, 0.2], // 235
        [-0.6 - eW + dl, 1.0 - eW - dm, 0.2 - eW], // 236
        [-0.6 + dl, 1.0 - eW - dm, 0.2 - eW], // 237
        [-0.6 + dl, 1.0 - eW - dm + eW, 0.2 - eW], // 238
        [-0.6 - eW + dl, 1.0 - eW - dm + eW, 0.2 - eW], // 239

        // Block 30.
        // Block 30 is block 14 with x coordinates are added with dl.
        [-0.6 - eW + dl , 1.0 - eW - dm, 0.2], // 240
        [-0.6 + dl, 1.0 - eW - dm, 0.2], // 241
        [-0.6 + dl, 1.0 - dm, 0.2], // 242
        [-0.6 - eW + dl, 1.0 - dm, 0.2], // 243
        [-0.6 - eW + dl, 1.0 - eW - dm, 0.2 - eW], // 244
        [-0.6 + dl, 1.0 - eW - dm, 0.2 - eW], // 245
        [-0.6 + dl, 1.0 - dm, 0.2 - eW], // 246
        [-0.6 - eW + dl, 1.0 - dm, 0.2 - eW], // 247

        // Block 31.
        // Block 31 is block 15 with x coordinates are added with dl.
        [-1.0 + dl, 1.0 - eW -dm, -0.2 + eW], // 120
        [-1.0 + eW + dl, 1.0 - eW - dm, -0.2 + eW], // 121
        [-1.0 + eW + dl, 1.0 - dm, -0.2 + eW], // 122
        [-1.0 + dl, 1.0 - dm, -0.2 + eW], // 123
        [-1.0 + dl, 1.0 - eW - dm, -0.2], // 124
        [-1.0 + eW + dl , 1.0 - eW - dm, -0.2], // 125
        [-1.0 + eW + dl , 1.0 - dm, -0.2], // 126
        [-1.0 + dl, 1.0 - dm, -0.2], // 127
    ];

    // Index displacement
    var idd = 128;

    // All edges in hollow object.
    let edges = [
        // LEFT SIDE.
        // Edges from block 0 to block 1.
        new Edge([
            [0, 9, 10, 3], // Front face.
            [4, 13, 14, 7], // Back face.
            [3, 10, 14, 7], // Top face.
            [0, 9, 13, 4], // Bottom face.
            [9, 13, 10, 14], // Right face.
            [0, 3, 7, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 1 to block 2.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [20, 21, 22, 23], // Back face.
            [11, 10, 22, 23], // Top face.
            [8, 9, 21, 20], // Bottom face.
            [9, 21, 10, 22], // Right face.
            [8, 11, 23, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 3.
        new Edge([
            [24, 17, 18, 27], // Front face.
            [28, 21, 22, 31], // Back face.
            [27, 18, 22, 31], // Top face.
            [24, 17, 21, 28], // Bottom face.
            [17, 21, 18, 22], // Right face.
            [24, 27, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,    
            randomColor
        ]),
        // Edges from block 3 to block 0.
        new Edge([
            [0, 1, 2, 3], // Front face.
            [28, 29, 30, 31], // Back face.
            [3, 2, 30, 31], // Top face.
            [0, 1, 29, 28], // Bottom face.
            [1, 29, 2, 30], // Right face.
            [0, 3, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 4 to block 5.
        new Edge([
            [32, 41, 42, 35], // Front face.
            [36, 45, 46, 39], // Back face.
            [35, 42, 46, 39], // Top face.
            [32, 41, 45, 36], // Bottom face.
            [41, 45, 42, 46], // Right face.
            [32, 35, 39, 36], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 5 to block 6.
        new Edge([
            [40, 41, 42, 43], // Front face.
            [52, 53, 54, 55], // Back face.
            [43, 42, 54, 55], // Top face.
            [40, 41, 53, 52], // Bottom face.
            [41, 53, 42, 54], // Right face.
            [40, 43, 55, 52], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 6 to block 7.
        new Edge([
            [56, 49, 50, 59], // Front face.
            [60, 53, 54, 63], // Back face.
            [59, 50, 54, 63], // Top face.
            [56, 49, 53, 60], // Bottom face.
            [49, 53, 50, 54], // Right face.
            [56, 59, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 7 to block 4.
        new Edge([
            [32, 33, 34, 35], // Front face.
            [60, 61, 62, 63], // Back face.
            [35, 34, 62, 63], // Top face.
            [32, 33, 61, 60], // Bottom face.
            [33, 61, 34, 62], // Right face.
            [32, 35, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 0 to block 4.
        new Edge([
            [0, 1, 34, 35], // Front face.
            [4, 5, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 34, 38], // Right face.
            [0, 35, 39, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 1 to block 9.
        new Edge([
            [8, 9, 74, 75], // Front face.
            [12, 13, 78, 79], // Back face.
            [75, 74, 78, 79], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 74, 78], // Right face.
            [8, 75, 79, 12], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        new Edge([
            [8 +idd-8, 9 +idd-8, 74 + 120, 75 + 120], // Front face.
            [12 +idd-8, 13 +idd-8, 78 + 120, 79 +120], // Back face.
            [75 +120, 74 +120, 78 + 120, 79 +120], // Top face.
            [8 +idd-8, 9 +idd-8, 13 + idd, 12 + idd-8], // Bottom face.
            [9 +idd-8, 13 +idd-8, 74 + 120, 78 + 120], // Right face.
            [8 +idd-8, 75 +120, 79 + 120, 12 + idd-8], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 13 to block 5.
        new Edge([
            [105 + 120, 104 + 120, 43 + idd - 8, 42 + idd - 8], // Front face.
            [108 + 120, 109 + 120, 47 + idd - 8, 46 + idd - 8], // Back face.
            [42 + idd - 8, 43 + idd - 8, 47 + idd - 8, 46 + idd - 8], // Top face.
            [104 + 120, 105 + 120, 109 + 120, 108 + 120], // Bottom face.
            [105 + 120, 109 + 120, 42 + idd - 8, 46 + idd - 8], // Right face.
            [104 + 120, 43 + idd - 8, 47 + idd - 8, 108 + 120], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        new Edge([
            [105, 104, 43, 42], // Front face.
            [108, 109, 47, 46], // Back face.
            [42, 43, 47, 46], // Top face.
            [104, 105, 109, 108], // Bottom face.
            [105, 109, 42, 46], // Right face.
            [104, 43, 47, 108], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 2 to block 10.
        new Edge([
            [16, 17, 82, 83], // Front face.
            [20, 21, 86, 87], // Back face.
            [82, 83, 87, 86], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 82, 86], // Right face.
            [16, 83, 87, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        new Edge([
            [16 + idd +8, 17 + idd +8, 82 + 136, 83 + 136], // Front face.
            [20 + idd +8, 21 + idd +8, 86 + 136, 87 + 136], // Back face.
            [82 + 136, 83 + 136, 87 + 136, 86 + 136], // Top face.
            [16 + idd +8, 17 + idd +8, 21 + idd +8, 20 + idd +8], // Bottom face.
            [17 + idd +8, 21 + idd + 8, 82 + 136, 86 + 136], // Right face.
            [16 + idd +8, 83 + 136, 87 + 136, 20 + idd +8], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 14 to block 6.
        new Edge([
            [112, 113, 50, 51], // Front face.
            [116, 117, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [112, 113, 117, 116], // Bottom face.
            [113, 117, 50, 54], // Right face.
            [112, 51, 55, 116], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        new Edge([
            [112 + 136, 113 + 136, 50 + idd +8, 51 + idd +8], // Front face.
            [116 + 136, 117 + 136, 54 + idd +8, 55 + idd +8], // Back face.
            [51 + idd +8, 50 + idd +8, 54 + idd +8, 55 + idd +8], // Top face.
            [112 + 136, 113 + 136, 117 + 136, 116 + 136], // Bottom face.
            [113 + 136, 117 + 136, 50 + idd +8, 54 + idd +8], // Right face.
            [112 + 136, 51 + idd +8, 55 + idd +8, 116 + 136], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 3 to block 7.
        new Edge([
            [24, 25, 58, 59], // Front face.
            [28, 29, 62, 63], // Back face.
            [59, 58, 62, 63], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 58, 62], // Right face.
            [24, 59, 63, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        

        // MIDDLE SIDE
        // Edges from block 14 to 31
        new Edge([
            [115, 114, 248, 249], // Front face.
            [118, 119, 252, 253], // Back face.
            [114, 251, 252, 118], // Top face.
            [113, 248, 252, 117], // Bottom face.
            [248, 251, 252, 255], // Right face.
            [113, 117, 118, 114], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 10 to 27
        new Edge([
            [83, 216, 217, 82], // Front face.
            [86, 220, 221, 87], // Back face.
            [82, 219, 220, 86], // Top face.
            [81, 216, 220, 85], // Bottom face.
            [216, 219, 220, 223], // Right face.
            [80, 84, 87, 83] // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 13 to 28
        new Edge([
            [107, 225, 224, 106], // Front face.
            [111, 229, 228, 110], // Back face.
            [106, 110, 231, 227], // Top face.
            [105, 109, 228, 224], // Bottom face.
            [225, 226, 229, 230], // Right face.
            [104, 108, 111, 107], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // // Edges from block 9 to 24
        new Edge([
            [75, 192, 193, 74], // Front face.
            [79, 78, 196, 197], // Back face.
            [74, 78, 199, 195], // Top face.
            [73, 77, 192, 196], // Bottom face.
            [193, 194, 197, 198], // Right face.
            [72, 76, 79, 75], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        
        // RIGHT SIDE
        // Edges from block 16 to 17.
        new Edge([
            [0 + idd, 9 + idd, 10 + idd, 3 + idd], // Front face.
            [4 + idd, 13 + idd, 14 + idd, 7 + idd], // Back face.
            [3 + idd, 10 + idd, 14 + idd, 7 + idd], // Top face.
            [0 + idd, 9 + idd, 13 + idd, 4 + idd], // Bottom face.
            [9 + idd, 13 + idd, 10 + idd, 14 + idd], // Right face.
            [0 + idd, 3 + idd, 7 + idd, 4 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 17 to 18.
        new Edge([
            [8 + idd, 9 + idd, 10 + idd, 11 + idd], // Front face.
            [20 + idd, 21 + idd, 22 + idd, 23 + idd], // Back face.
            [11 + idd, 10 + idd, 22 + idd, 23 + idd], // Top face.
            [8 + idd, 9 + idd, 21 + idd, 20 + idd], // Bottom face.
            [9 + idd, 21 + idd, 10 + idd, 22 + idd], // Right face.
            [8 + idd, 11 + idd, 23 + idd, 20 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 18 to 19.
        new Edge([
            [24 + idd, 17 + idd, 18 + idd, 27 + idd], // Front face.
            [28 + idd, 21 + idd, 22 + idd, 31 + idd], // Back face.
            [27 + idd, 18 + idd, 22 + idd, 31 + idd], // Top face.
            [24 + idd, 17 + idd, 21 + idd, 28 + idd], // Bottom face.
            [17 + idd, 21 + idd, 18 + idd, 22 + idd], // Right face.
            [24 + idd, 27 + idd, 31 + idd, 28 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 19 to 16.
        new Edge([
            [0 + idd, 1 + idd, 2 + idd, 3 + idd], // Front face.
            [28 + idd, 29 + idd, 30 + idd, 31 + idd], // Back face.
            [3 + idd, 2 + idd, 30 + idd, 31 + idd], // Top face.
            [0 + idd, 1 + idd, 29 + idd, 28 + idd], // Bottom face.
            [1 + idd, 29 + idd, 2 + idd, 30 + idd], // Right face.
            [0 + idd, 3 + idd, 31 + idd, 28 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 20 to 21.
        new Edge([
            [32 + idd, 41 + idd, 42 + idd, 35 + idd], // Front face.
            [36 + idd, 45 + idd, 46 + idd, 39 + idd], // Back face.
            [35 + idd, 42 + idd, 46 + idd, 39 + idd], // Top face.
            [32 + idd, 41 + idd, 45 + idd, 36 + idd], // Bottom face.
            [41 + idd, 45 + idd, 42 + idd, 46 + idd], // Right face.
            [32 + idd, 35 + idd, 39 + idd, 36 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 21 to 22.
        new Edge([
            [40 + idd, 41 + idd, 42 + idd, 43 + idd], // Front face.
            [52 + idd, 53 + idd, 54 + idd, 55 + idd], // Back face.
            [43 + idd, 42 + idd, 54 + idd, 55 + idd], // Top face.
            [40 + idd, 41 + idd, 53 + idd, 52 + idd], // Bottom face.
            [41 + idd, 53 + idd, 42 + idd, 54 + idd], // Right face.
            [40 + idd, 43 + idd, 55 + idd, 52 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 22 to 23.
        new Edge([
            [56 + idd, 49 + idd, 50 + idd, 59 + idd], // Front face.
            [60 + idd, 53 + idd, 54 + idd, 63 + idd], // Back face.
            [59 + idd, 50 + idd, 54 + idd, 63 + idd], // Top face.
            [56 + idd, 49 + idd, 53 + idd, 60 + idd], // Bottom face.
            [49 + idd, 53 + idd, 50 + idd, 54 + idd], // Right face.
            [56 + idd, 59 + idd, 63 + idd, 60 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 23 to 20.
        new Edge([
            [32 + idd, 33 + idd, 34 + idd, 35 + idd], // Front face.
            [60 + idd, 61 + idd, 62 + idd, 63 + idd], // Back face.
            [35 + idd, 34 + idd, 62 + idd, 63 + idd], // Top face.
            [32 + idd, 33 + idd, 61 + idd, 60 + idd], // Bottom face.
            [33 + idd, 61 + idd, 34 + idd, 62 + idd], // Right face.
            [32 + idd, 35 + idd, 63 + idd, 60 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 17 to 21.
        new Edge([
            [8 + idd, 9 + idd, 42 + idd, 43 + idd], // Front face.
            [12 + idd, 13 + idd, 46 + idd, 47 + idd], // Back face.
            [43 + idd, 42 + idd, 46 + idd, 47 + idd], // Top face.
            [8 + idd, 9 + idd, 13 + idd, 12 + idd], // Bottom face.
            [9 + idd, 13 + idd, 42 + idd, 46 + idd], // Right face.
            [8 + idd, 43 + idd, 47 + idd, 12 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

        // Edges from block 18 to 22.
        new Edge([
            [16 + idd, 17 + idd, 50 + idd, 51 + idd], // Front face.
            [20 + idd, 21 + idd, 54 + idd, 55 + idd], // Back face.
            [51 + idd, 50 + idd, 54 + idd, 55 + idd], // Top face.
            [16 + idd, 17 + idd, 21 + idd, 20 + idd], // Bottom face.
            [17 + idd, 21 + idd, 50 + idd, 54 + idd], // Right face.
            [16 + idd, 51 + idd, 55 + idd, 20 + idd], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),

    ];

    return new HollowObject(vertices, edges);
}

const loadBasicTrapezoidalPrism = () => {
    // All vertices in hollow object.
    let vertices = [
        [-1.0, -1.0, 1.0], // 0
        [1.0, -1.0, 1.0], // 1
        [0.5, 1.0, 0.5], // 2
        [-0.5, 1.0, 0.5], // 3
        [-1.0, -1.0, -1.0], // 4
        [1.0, -1.0, -1.0], // 5
        [0.5, 1.0, -0.5], // 6
        [-0.5, 1.0, -0.5] // 7
	];

    // All edges in hollow object.
    // Because cube is not hollow then each edge only contain one faces and one color.
    let edges = [
        new Edge([
            [0, 1, 2, 3], // Front Face
            [4, 5, 6, 7], // Back Face
            [2, 3, 7, 6], // Top Face
            [0, 1, 5, 4], // Bottom Face
            [1, 2, 6, 5], // Right Face
            [0, 3, 7, 4], // Left Face
        ], [
            [1.0, 1.0, 1.0, 1.0], // Front Face: white
            [1.0, 0.0, 0.0, 1.0], // Back Face: red
            [0.0, 1.0, 0.0, 1.0], // Top Face: green
            [0.0, 0.0, 1.0, 1.0], // Bottom Face: blue
            [1.0, 1.0, 0.0, 1.0], // Right Face: yellow
            [1.0, 0.0, 1.0, 1.0] // Left Face: purple
        ])
    ];

    return new HollowObject(vertices, edges);
}

const loadHollowTrapezoidalPrism = () => {
    // Generate random color. Will be used on every face.
    let randomColor = randomRGB();

    // Edge width
    const eW = 0.2;
    // All vertices in hollow object.
    // Not all vertices are going to be used.
    let vertices = [
        // Block 0
        [-1.0, -1.0, 1.0], // 0
        [-1.0 + eW, -1.0, 1.0], // 1
        [-1.0 + eW, -1.0 + eW, 1.0], // 2
        [-1.0, -1.0 + eW, 1.0], // 3
        [-1.0, -1.0, 1.0 - eW], // 4
        [-1.0 + eW, -1.0, 1.0 - eW], // 5
        [-1.0 + eW, -1.0 + eW, 1.0 - eW], // 6
        [-1.0, -1.0 + eW, 1.0 - eW], // 7

        // Block 1
        [1.0 - eW, -1.0, 1.0], // 8
        [1.0, -1.0, 1.0], // 9
        [1.0, -1.0 + eW, 1.0], // 10
        [1.0 - eW, -1.0 + eW, 1.0], // 11
        [1.0 - eW, -1.0, 1.0 - eW], // 12
        [1.0, -1.0, 1.0 - eW], // 13
        [1.0, -1.0 + eW, 1.0 - eW], // 14
        [1.0 - eW, -1.0 + eW, 1.0 - eW], // 15

        // Block 2
        [1.0 - eW, -1.0, -1.0 + eW], // 16
        [1.0 , -1.0, -1.0 + eW], // 17
        [1.0, -1.0 + eW, -1.0 + eW], // 18
        [1.0 - eW, -1.0 + eW, -1.0 + eW], // 19
        [1.0 - eW, -1.0, -1.0], // 20
        [1.0, -1.0, -1.0], // 21
        [1.0, -1.0 + eW, -1.0], // 22
        [1.0 - eW, -1.0 + eW, -1.0], // 23

        // Block 3
        [-1.0, -1.0, -1.0 + eW], // 24
        [-1.0 + eW, -1.0, -1.0 + eW], // 25
        [-1.0 + eW, -1.0 + eW, -1.0 + eW], // 26
        [-1.0, -1.0 + eW, -1.0 + eW], // 27
        [-1.0, -1.0, -1.0], // 28
        [-1.0 + eW, -1.0, -1.0], // 29
        [-1.0 + eW, -1.0 + eW, -1.0], // 30
        [-1.0, -1.0 + eW, -1.0], // 31

        // Block 4
        [-0.5, 1.0 - eW, 0.5], // 32
        [-0.5 + eW, 1.0 - eW, 0.5], // 33
        [-0.5 + eW, 1.0, 0.5], // 34
        [-0.5, 1.0, 0.5], // 35
        [-0.5, 1.0 - eW, 0.5 - eW], // 36
        [-0.5 + eW, 1.0 - eW, 0.5 - eW], // 37
        [-0.5 + eW, 1.0, 0.5 - eW], // 38
        [-0.5, 1.0, 0.5 - eW], // 39

        // Block 5
        [0.5 - eW, 1.0 - eW, 0.5], // 40
        [0.5, 1.0 - eW, 0.5], // 41
        [0.5, 1.0, 0.5], // 42
        [0.5 - eW, 1.0, 0.5], // 43
        [0.5 - eW, 1.0 - eW, 0.5 - eW], // 44
        [0.5, 1.0 - eW, 0.5 - eW], // 45
        [0.5, 1.0, 0.5 - eW], // 46
        [0.5 - eW, 1.0, 0.5 - eW], // 47
        
        // Block 6
        [0.5 - eW, 1.0 - eW, -0.5 + eW], // 48
        [0.5, 1.0 - eW, -0.5 + eW], // 49
        [0.5, 1.0, -0.5 + eW], // 50
        [0.5 - eW, 1.0, -0.5 + eW], // 51
        [0.5 - eW, 1.0 - eW, -0.5], // 52
        [0.5, 1.0 - eW, -0.5], // 53
        [0.5, 1.0, -0.5], // 54
        [0.5 - eW, 1.0, -0.5], // 55

        // Block 7
        [-0.5, 1.0 - eW, -0.5 + eW], // 56
        [-0.5 + eW, 1.0 - eW, -0.5 + eW], // 57
        [-0.5 + eW, 1.0, -0.5 + eW], // 58
        [-0.5, 1.0, -0.5 + eW], // 59
        [-0.5, 1.0 - eW, -0.5], // 60
        [-0.5 + eW, 1.0 - eW, -0.5], // 61
        [-0.5 + eW, 1.0, -0.5], // 62
        [-0.5, 1.0, -0.5] // 63
    ];

    // All edges in hollow object.
    let edges = [
        // Edges from block 0 to block 1.
        new Edge([
            [0, 9, 10, 3], // Front face.
            [4, 13, 14, 7], // Back face.
            [3, 10, 14, 7], // Top face.
            [0, 9, 13, 4], // Bottom face.
            [9, 13, 10, 14], // Right face.
            [0, 3, 7, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 1 to block 2.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [20, 21, 22, 23], // Back face.
            [11, 10, 22, 23], // Top face.
            [8, 9, 21, 20], // Bottom face.
            [9, 21, 10, 22], // Right face.
            [8, 11, 23, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 3.
        new Edge([
            [24, 17, 18, 27], // Front face.
            [28, 21, 22, 31], // Back face.
            [27, 18, 22, 31], // Top face.
            [24, 17, 21, 28], // Bottom face.
            [17, 21, 18, 22], // Right face.
            [24, 27, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,    
            randomColor
        ]),
        // Edges from block 3 to block 0.
        new Edge([
            [0, 1, 2, 3], // Front face.
            [28, 29, 30, 31], // Back face.
            [3, 2, 30, 31], // Top face.
            [0, 1, 29, 28], // Bottom face.
            [1, 29, 2, 30], // Right face.
            [0, 3, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 4 to block 5.
        new Edge([
            [32, 41, 42, 35], // Front face.
            [36, 45, 46, 39], // Back face.
            [35, 42, 46, 39], // Top face.
            [32, 41, 45, 36], // Bottom face.
            [41, 45, 42, 46], // Right face.
            [32, 35, 39, 36], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 5 to block 6.
        new Edge([
            [40, 41, 42, 43], // Front face.
            [52, 53, 54, 55], // Back face.
            [43, 42, 54, 55], // Top face.
            [40, 41, 53, 52], // Bottom face.
            [41, 53, 42, 54], // Right face.
            [40, 43, 55, 52], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 6 to block 7.
        new Edge([
            [56, 49, 50, 59], // Front face.
            [60, 53, 54, 63], // Back face.
            [59, 50, 54, 63], // Top face.
            [56, 49, 53, 60], // Bottom face.
            [49, 53, 50, 54], // Right face.
            [56, 59, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 7 to block 4.
        new Edge([
            [32, 33, 34, 35], // Front face.
            [60, 61, 62, 63], // Back face.
            [35, 34, 62, 63], // Top face.
            [32, 33, 61, 60], // Bottom face.
            [33, 61, 34, 62], // Right face.
            [32, 35, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 0 to block 4.
        new Edge([
            [0, 1, 34, 35], // Front face.
            [4, 5, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 34, 38], // Right face.
            [0, 35, 39, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 1 to block 5.
        new Edge([
            [8, 9, 42, 43], // Front face.
            [12, 13, 46, 47], // Back face.
            [43, 42, 46, 47], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 42, 46], // Right face.
            [8, 43, 47, 12], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 6.
        new Edge([
            [16, 17, 50, 51], // Front face.
            [20, 21, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 50, 54], // Right face.
            [16, 51, 55, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 3 to block 7.
        new Edge([
            [24, 25, 58, 59], // Front face.
            [28, 29, 62, 63], // Back face.
            [59, 58, 62, 63], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 58, 62], // Right face.
            [24, 59, 63, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ])
    ];

    return new HollowObject(vertices, edges);
}

const LoadPyramid = () => {
    // All vertices in hollow object.
    let vertices = [
		[-1.0, -1.0, 1.0], // 0
        [1.0, -1.0, 1.0], // 1
        [0, 0, 0], // 2
        [0, 0, 0], // 3
        [-1.0, -1.0, -1.0], // 4
        [1.0, -1.0, -1.0], // 5
        [0, 0, 0], // 6
        [0, 0, 0] // 7
	];

    // All edges in hollow object.
    // Because cube is not hollow then each edge only contain one faces and one color.
    let edges = [
        new Edge([
            [0, 1, 2, 3], // Front Face
            [4, 5, 6, 7], // Back Face
            [2, 3, 7, 6], // Top Face
            [0, 1, 5, 4], // Bottom Face
            [1, 2, 6, 5], // Right Face
            [0, 3, 7, 4], // Left Face
        ], [
            [1.0, 1.0, 1.0, 1.0], // Front Face: white
            [1.0, 0.0, 0.0, 1.0], // Back Face: red
            [0.0, 1.0, 0.0, 1.0], // Top Face: green
            [0.0, 0.0, 1.0, 1.0], // Bottom Face: blue
            [1.0, 1.0, 0.0, 1.0], // Right Face: yellow
            [1.0, 0.0, 1.0, 1.0] // Left Face: purple
        ])
    ];

    return new HollowObject(vertices, edges);
}

const LoadHollowPyramid = () => {
    // Generate random color. Will be used on every face.
    let randomColor = randomRGB();

    // Edge width
    const eW = 0.2;
    // All vertices in hollow object.
    // Not all vertices are going to be used.
    let vertices = [
        // Block 0
        [-1.0, -1.0, 1.0], // 0
        [-1.0 + eW, -1.0, 1.0], // 1
        [-1.0 + eW, -1.0 + eW, 1.0], // 2
        [-1.0, -1.0 + eW, 1.0], // 3
        [-1.0, -1.0, 1.0 - eW], // 4
        [-1.0 + eW, -1.0, 1.0 - eW], // 5
        [-1.0 + eW, -1.0 + eW, 1.0 - eW], // 6
        [-1.0, -1.0 + eW, 1.0 - eW], // 7

        // Block 1
        [1.0 - eW, -1.0, 1.0], // 8
        [1.0, -1.0, 1.0], // 9
        [1.0, -1.0 + eW, 1.0], // 10
        [1.0 - eW, -1.0 + eW, 1.0], // 11
        [1.0 - eW, -1.0, 1.0 - eW], // 12
        [1.0, -1.0, 1.0 - eW], // 13
        [1.0, -1.0 + eW, 1.0 - eW], // 14
        [1.0 - eW, -1.0 + eW, 1.0 - eW], // 15

        // Block 2
        [0 - eW, 0, 0 + eW], // 16
        [0 , 0, 0 + eW], // 17
        [0, 0 + eW, 0 + eW], // 18
        [0 - eW, 0 + eW, 0 + eW], // 19
        [0 - eW, 0, 0], // 20
        [0, 0, 0], // 21
        [0, 0 + eW, 0], // 22
        [0 - eW, 0 + eW, 0], // 23

        // Block 3
        [0, 0, 0 + eW], // 24
        [0 + eW, 0, 0 + eW], // 25
        [0 + eW, 0 + eW, 0 + eW], // 26
        [0, 0 + eW, 0 + eW], // 27
        [0, 0, 0], // 28
        [0 + eW, 0, 0], // 29
        [0 + eW, 0 + eW, 0], // 30
        [0, 0 + eW, 0], // 31

        // Block 4
        [-1.0, 1.0 - eW, 1.0], // 32
        [-1.0 + eW, 1.0 - eW, 1.0], // 33
        [-1.0 + eW, 1.0, 1.0], // 34
        [-1.0, 1.0, 1.0], // 35
        [-1.0, 1.0 - eW, 1.0 - eW], // 36
        [-1.0 + eW, 1.0 - eW, 1.0 - eW], // 37
        [-1.0 + eW, 1.0, 1.0 - eW], // 38
        [-1.0, 1.0, 1.0 - eW], // 39

        // Block 5
        [1.0 - eW, 1.0 - eW, 1.0], // 40
        [1.0, 1.0 - eW, 1.0], // 41
        [1.0, 1.0, 1.0], // 42
        [1.0 - eW, 1.0, 1.0], // 43
        [1.0 - eW, 1.0 - eW, 1.0 - eW], // 44
        [1.0, 1.0 - eW, 1.0 - eW], // 45
        [1.0, 1.0, 1.0 - eW], // 46
        [1.0 - eW, 1.0, 1.0 - eW], // 47
        
        // Block 6
        [0 - eW, 0 - eW, 0 + eW], // 48
        [0, 0 - eW, 0 + eW], // 49
        [0, 0, 0 + eW], // 50
        [0 - eW, 0, 0 + eW], // 51
        [0 - eW, 0 - eW, 0], // 52
        [0, 0 - eW, 0], // 53
        [0, 0, 0], // 54
        [0 - eW, 0, 0], // 55

        // Block 7
        [0, 0 - eW, 0 + eW], // 56
        [0 + eW, 0 - eW, 0 + eW], // 57
        [0 + eW, 0, 0 + eW], // 58
        [0, 0, 0 + eW], // 59
        [0, 0 - eW, 0], // 60
        [0 + eW, 0 - eW, 0], // 61
        [0 + eW, 0, 0], // 62
        [0, 0, 0] // 63
    ];

    // All edges in hollow object.
    let edges = [
        // Edges from block 0 to block 1.
        new Edge([
            [0, 9, 10, 3], // Front face.
            [4, 13, 14, 7], // Back face.
            [3, 10, 14, 7], // Top face.
            [0, 9, 13, 4], // Bottom face.
            [9, 13, 10, 14], // Right face.
            [0, 3, 7, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 1 to block 2.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [20, 21, 22, 23], // Back face.
            [11, 10, 22, 23], // Top face.
            [8, 9, 21, 20], // Bottom face.
            [9, 21, 10, 22], // Right face.
            [8, 11, 23, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 3.
        new Edge([
            [24, 17, 18, 27], // Front face.
            [28, 21, 22, 31], // Back face.
            [27, 18, 22, 31], // Top face.
            [24, 17, 21, 28], // Bottom face.
            [17, 21, 18, 22], // Right face.
            [24, 27, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,    
            randomColor
        ]),
        // Edges from block 3 to block 0.
        new Edge([
            [0, 1, 2, 3], // Front face.
            [28, 29, 30, 31], // Back face.
            [3, 2, 30, 31], // Top face.
            [0, 1, 29, 28], // Bottom face.
            [1, 29, 2, 30], // Right face.
            [0, 3, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 4 to block 5.
        new Edge([
            [32, 41, 42, 35], // Front face.
            [36, 45, 46, 39], // Back face.
            [35, 42, 46, 39], // Top face.
            [32, 41, 45, 36], // Bottom face.
            [41, 45, 42, 46], // Right face.
            [32, 35, 39, 36], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 5 to block 6.
        new Edge([
            [40, 41, 42, 43], // Front face.
            [52, 53, 54, 55], // Back face.
            [43, 42, 54, 55], // Top face.
            [40, 41, 53, 52], // Bottom face.
            [41, 53, 42, 54], // Right face.
            [40, 43, 55, 52], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 6 to block 7.
        new Edge([
            [56, 49, 50, 59], // Front face.
            [60, 53, 54, 63], // Back face.
            [59, 50, 54, 63], // Top face.
            [56, 49, 53, 60], // Bottom face.
            [49, 53, 50, 54], // Right face.
            [56, 59, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 7 to block 4.
        new Edge([
            [32, 33, 34, 35], // Front face.
            [60, 61, 62, 63], // Back face.
            [35, 34, 62, 63], // Top face.
            [32, 33, 61, 60], // Bottom face.
            [33, 61, 34, 62], // Right face.
            [32, 35, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 0 to block 4.
        new Edge([
            [0, 1, 34, 35], // Front face.
            [4, 5, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 34, 38], // Right face.
            [0, 35, 39, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 1 to block 5.
        new Edge([
            [8, 9, 42, 43], // Front face.
            [12, 13, 46, 47], // Back face.
            [43, 42, 46, 47], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 42, 46], // Right face.
            [8, 43, 47, 12], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 6.
        new Edge([
            [16, 17, 50, 51], // Front face.
            [20, 21, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 50, 54], // Right face.
            [16, 51, 55, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 3 to block 7.
        new Edge([
            [24, 25, 58, 59], // Front face.
            [28, 29, 62, 63], // Back face.
            [59, 58, 62, 63], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 58, 62], // Right face.
            [24, 59, 63, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ])
    ];

    return new HollowObject(vertices, edges);
}
