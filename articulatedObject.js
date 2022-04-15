'use strict';

/**
 * Class Edge.
 * @classdesc Edge is representation of 'rusuk' in articulated object. Remember that edge in articulated object is a
 * 3d line.
 */
class Edge {
    /**
     * @description Constructor of edge class.
     * @param {number[6][4]} topology - List of list of vertices that represent edge faces. 
     * @param {number[][4]} color - List of list of integer that represent edge faces color.
     * @param {number[3]} joints - List of list of integer that represent edge joints (sendi) relative to parent.
     * @param {number} sibling - Index of first sibling edge in list of edge. You can find the list in articulated object.
     * @param {number} child - Index of first child edge in list of edge. You can find the list in articulated object.
     * @param {number} rotationAxis - The axis of rotation, 0 for x, 1 for y, 2 for z, 3 for no rotation.
     * @param {number} rotationAngle - The angle of rotation.
     * @param {number} maxRotateAngle - The maximum angle of rotation.
     * @param {number} minRotateAngle - The minimum angle of rotation.
     * @param {number} startRotateAngle - The start angle of rotation.
     * @param {number} rotateDirection - The direction of rotation, 1 for clockwise, -1 for counterclockwise.
     */
    constructor(topology, color, joints, sibling, child, rotationAxis, rotationAngle, 
        maxRotateAngle, minRotateAngle, startRotateAngle, rotateDirection) {
        /**
         * @description List of list of vertices that represent edge faces.
         * @type {number[6][4]}
         * @public
         * @example [[0, 1, 2, 3]] means there are 1 face with 4 vertices. Vertices index 0, 1, 2, and 3.
         * You can find the corresponding vertices in articulated object class.
         * If possible, the number of vertices in each face should be 4 and the number of faces should be 6.
         */
        this.topology = topology;
        
        /**
         * @description List of list of integer that represent edge faces color.
         * @type {number[][4]}
         * @public
         */
        this.color = color;

        /**
         * @description List of list of integer that represent edge joints (sendi) relative to parent.
         * @type {number[3]}
         * @public
         */
        this.joints = joints;

        /**
         * @description Index of first sibling edge in list of edge. You can find the list in articulated object.
         * @type {number}
         * @public
         */
        this.sibling = sibling;

        /**
         * @description Index of first child edge in list of edge. You can find the list in articulated object.
         * @type {number}
         * @public
         */
        this.child = child;

        /**
         * @description The axis of rotation, 0 for x, 1 for y, 2 for z.
         * @type {number}
         * @public
         */
        this.rotationAxis = rotationAxis;

        /**
         * @description The angle of rotation.
         * @type {number}
         * @public
         */

        this.rotationAngle = rotationAngle;

        /**
         * @description The maximum angle of rotation.
         * @type {number}
         * @public
         */
        this.maxRotateAngle = maxRotateAngle;

        /**
         * @description The minimum angle of rotation.
         * @type {number}
         * @public
         */
        this.minRotateAngle = minRotateAngle;

        /**
         * @description The start angle of rotation.
         * @type {number}
         * @public
         */
        this.startRotateAngle = startRotateAngle;

        /**
         * @description The direction of rotation, 1 for clockwise, -1 for counterclockwise.
         * @type {number}
         * @public
         */
        this.rotateDirection = rotateDirection;
    }
}



/**
 * Class ArticulatedObject.
 * @classdesc ArticulatedObject is representation of articulated object.
 */
class ArticulatedObject {
    /**
     * @description Constructor of articulated object class.
     * @param {number[][3]} vertices - List of list of vertices in articulated object.
     * @param {Edge[]} edges - List of edge in articulated object.
     **/
    constructor(vertices, edges) {
        /**
         * @description List of list of vertices in articulated object.
         * @type {number[][3]}
         * @public
         */
        this.vertices = vertices;

        // console.log(vertices);
        
        /**
         * @description List of edge in articulated object.
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

const loadPerson = () => {
    // Generate random color. Will be used on every face.
    let randomColorHead = randomRGB();
    let randomColorBody = randomRGB();
    let randomColorLegs = randomRGB();
    let randomColorFeet = randomRGB();
    let randomColorArm = randomRGB();
    let randomColorHand = randomRGB();


    // Person properties.
    // HEAD.
    // hl(length), hw(width), hh(height)
    const hl = 0.5;
    const hw = 0.5;
    const hh = 0.5;

    // BODY.
    // bl(length), bw(width), bh(height)
    const bl = 1;
    const bw = 1;
    const bh = 1.4;

    // LEGS (normal and small).
    // ll(length), lw(width), lh(height)
    const ll = 0.3;
    const lw = 0.3;
    const lh = 0.8;
    // sll(length), slw(width), slh(height)
    const sll = 0.3;
    const slw = 0.3;
    const slh = 0.4;

    // ARM (normal and small).
    // al(length), aw(width), ah(height)
    const al = 0.3;
    const aw = 0.3;
    const ah = 1.2;
    // sal(length), saw(width), sah(height)
    const sal = 0.3;
    const saw = 0.3;
    const sah = 0.5;

    // Important points.
    // HEAD.
    // htlcx, htlcy, htlcz (head top left corner x, y, z)
    const htlcx = -1* 0.5 * hl;
    const htlcy = 0 + 0.5* bh + hh ;
    const htlcz = -1* 0.5 * hw ;

    // BODY.
    // btlcx, btlcy, btlcz (body top left corner x, y, z)
    const btlcx = -1* 0.5 * bl;
    const btlcy = 0 + 0.5 * bh;
    const btlcz = -1* 0.5 * bw;

    // RIGHT ARM.
    // ratlcx, ratlcy, ratlcz (right arm top left corner x, y, z)
    const ratlcx = btlcx + bw;
    const ratlcy = btlcy;
    const ratlcz = 0 - 0.5 * aw;
    // sratlcx, sratlcy, sratlcz (small right arm top left corner x, y, z)
    const sratlcx = ratlcx;
    const sratlcy = ratlcy - ah;
    const sratlcz = ratlcz;
    
    // LEFT ARM.
    // latlcx, latlcy, latlcz (left arm top left corner x, y, z)
    const latlcx = ratlcx - bl - al;
    const latlcy = ratlcy;
    const latlcz = ratlcz;
    // satlcx, satlcy, satlcz (small left arm top left corner x, y, z)
    const satlcx = latlcx;
    const satlcy = latlcy - ah;
    const satlcz = latlcz;

    // RIGHT LEG.
    // rltlcx, rltlcy, rltlcz (right leg top left corner x, y, z)
    const rltlcx = btlcx + bl - ll;
    const rltlcy = btlcy - bh;
    const rltlcz = 0 - 0.5 * lw;
    // srtlcx, srtlcy, srtlcz (small right leg top left corner x, y, z)
    const srtlcx = rltlcx;
    const srtlcy = rltlcy - lh;
    const srtlcz = rltlcz;

    // LEFT LEG.
    // lltlcx, lltlcy, lltlcz (left leg top left corner x, y, z)
    const lltlcx = btlcx;
    const lltlcy = btlcy - bh;
    const lltlcz = 0 - 0.5 * lw;
    // slltlcx, slltlcy, slltlcz (small left leg top left corner x, y, z)
    const slltlcx = lltlcx;
    const slltlcy = lltlcy - lh;
    const slltlcz = lltlcz;

    // Animation properties.
    // HEAD.
    const hJoints = [0, bh*0.5, 0];
    const hSibling = 2;
    const hChild = null;
    const hrotationAxis = 1;
    const hrotationAngle = 0;
    const hmaxRotateAngle = 45;
    const hminRotateAngle = -45;
    const hstartRotateAngle = 0;
    const hrotateDirection = 1;

    // BODY.
    const bJoints = [0, 0, 0];
    const bSibling = null;
    const bChild = 0;
    const brotationAxis = 3;
    const brotationAngle = 0;
    const bmaxRotateAngle = 180;
    const bminRotateAngle = 180;
    const bstartRotateAngle = 0;
    const brotateDirection = 1;

    // RIGHT ARM.
    const raJoints = [bl * 0.5, bh*0.5 - ah*0.5, 0];
    const raSibling = null;
    const raChild = 3;
    const raRotationAxis = 0;
    const raRotationAngle = 0;
    const raMaxRotateAngle = 120;
    const raMinRotateAngle = -120;
    const raStartRotateAngle = 0;
    const raRotateDirection = 1;

    // SMALL RIGHT ARM.
    const sraJoints = [bl * 0.5 + al* 0.5, ah , 0];
    const sraSibling = null;
    const sraChild = null;
    const sraRotationAxis = 0;
    const sraRotationAngle = 0;
    const sraMaxRotateAngle = 120;
    const sraMinRotateAngle = -120;
    const sraStartRotateAngle = 0;
    const sraRotateDirection = 1;

    // LEFT ARM.
    const laJoints = [bl * 0.5 - al* 0.5, bh*0.5 - ah*0.5, 0];
    const laSibling = null;
    const laChild = 5;
    const laRotationAxis = 0;
    const laRotationAngle = 0;
    const laMaxRotateAngle = 120;
    const laMinRotateAngle = -120;
    const laStartRotateAngle = 0;
    const laRotateDirection = 1;

    // SMALL LEFT ARM.
    const slaJoints = [bl * 0.5 - al* 0.5, ah , 0];
    const slaSibling = null;
    const slaChild = null;
    const slaRotationAxis = 0;
    const slaRotationAngle = 0;
    const slaMaxRotateAngle = 120;
    const slaMinRotateAngle = -120;
    const slaStartRotateAngle = 0;
    const slaRotateDirection = 1;

    // RIGHT LEG.
    const rlJoints = [bl * 0.5, bh*0.5 - lh*0.5, 0];
    const rlSibling = null;
    const rlChild = 7;
    const rlRotationAxis = 0;
    const rlRotationAngle = 0;
    const rlMaxRotateAngle = 120;
    const rlMinRotateAngle = -120;
    const rlStartRotateAngle = 0;
    const rlRotateDirection = 1;

    // SMALL RIGHT LEG.
    const srlJoints = [bl * 0.5 + ll* 0.5, lh , 0];
    const srlSibling = null;
    const srlChild = null;
    const srlRotationAxis = 0;
    const srlRotationAngle = 0;
    const srlMaxRotateAngle = 120;
    const srlMinRotateAngle = -120;
    const srlStartRotateAngle = 0;
    const srlRotateDirection = 1;

    // LEFT LEG.
    const llJoints = [bl * 0.5, bh*0.5 - lh*0.5, 0];
    const llSibling = null;
    const llChild = 9;
    const llRotationAxis = 0;
    const llRotationAngle = 0;
    const llMaxRotateAngle = 120;
    const llMinRotateAngle = -120;
    const llStartRotateAngle = 0;
    const llRotateDirection = 1;

    // SMALL LEFT LEG.
    const sllJoints = [bl * 0.5 + ll* 0.5, lh , 0];
    const sllSibling = null;
    const sllChild = null;
    const sllRotationAxis = 0;
    const sllRotationAngle = 0;
    const sllMaxRotateAngle = 120;
    const sllMinRotateAngle = -120;
    const sllStartRotateAngle = 0;
    const sllRotateDirection = 1;

    const vertices = [
        // HEAD.
        [htlcx, htlcy-hh, htlcz + hw], // 0
        [htlcx + hl, htlcy-hh, htlcz + hw], // 1
        [htlcx + hl, htlcy, htlcz + hw], // 2
        [htlcx, htlcy, htlcz + hw], // 3
        [htlcx, htlcy-hh, htlcz], // 4
        [htlcx + hl, htlcy-hh, htlcz], // 5
        [htlcx + hl, htlcy, htlcz], // 6
        [htlcx, htlcy, htlcz], // 7

        // BODY.
        [btlcx, btlcy-bh, btlcz + bw], // 8
        [btlcx + bl, btlcy-bh, btlcz + bw], // 9
        [btlcx + bl, btlcy, btlcz + bw], // 10
        [btlcx, btlcy, btlcz + bw], // 11
        [btlcx, btlcy-bh, btlcz], // 12
        [btlcx + bl, btlcy-bh, btlcz], // 13
        [btlcx + bl, btlcy, btlcz], // 14
        [btlcx, btlcy, btlcz], // 15

        // RIGHT ARM.
        [ratlcx, ratlcy-ah, ratlcz + aw], // 16
        [ratlcx + al, ratlcy-ah, ratlcz + aw], // 17
        [ratlcx + al, ratlcy, ratlcz + aw], // 18
        [ratlcx, ratlcy, ratlcz + aw], // 19
        [ratlcx, ratlcy-ah, ratlcz], // 20
        [ratlcx + al, ratlcy-ah, ratlcz], // 21
        [ratlcx + al, ratlcy, ratlcz], // 22
        [ratlcx, ratlcy, ratlcz], // 23

        // SMALL RIGHT ARM.
        [sratlcx, sratlcy-sah, sratlcz + saw], // 24
        [sratlcx + sal, sratlcy-sah, sratlcz + saw], // 25
        [sratlcx + sal, sratlcy, sratlcz + saw], // 26
        [sratlcx, sratlcy, sratlcz + saw], // 27
        [sratlcx, sratlcy-sah, sratlcz], // 28
        [sratlcx + sal, sratlcy-sah, sratlcz], // 29
        [sratlcx + sal, sratlcy, sratlcz], // 30
        [sratlcx, sratlcy, sratlcz], // 31

        // LEFT ARM.
        [latlcx, latlcy-ah, latlcz + aw], // 32
        [latlcx + al, latlcy-ah, latlcz + aw], // 33
        [latlcx + al, latlcy, latlcz + aw], // 34
        [latlcx, latlcy, latlcz + aw], // 35
        [latlcx, latlcy-ah, latlcz], // 36
        [latlcx + al, latlcy-ah, latlcz], // 37
        [latlcx + al, latlcy, latlcz], // 38
        [latlcx, latlcy, latlcz], // 39

        // SMALL LEFT ARM.
        [satlcx, satlcy-sah, satlcz + saw], // 40
        [satlcx + sal, satlcy-sah, satlcz + saw], // 41
        [satlcx + sal, satlcy, satlcz + saw], // 42
        [satlcx, satlcy, satlcz + saw], // 43
        [satlcx, satlcy-sah, satlcz], // 44
        [satlcx + sal, satlcy-sah, satlcz], // 45
        [satlcx + sal, satlcy, satlcz], // 46
        [satlcx, satlcy, satlcz], // 47

        // RIGHT LEG.
        [rltlcx, rltlcy-lh, rltlcz + lw], // 48
        [rltlcx + ll, rltlcy-lh, rltlcz + lw], // 49
        [rltlcx + ll, rltlcy, rltlcz + lw], // 50
        [rltlcx, rltlcy, rltlcz + lw], // 51
        [rltlcx, rltlcy-lh, rltlcz], // 52
        [rltlcx + ll, rltlcy-lh, rltlcz], // 53
        [rltlcx + ll, rltlcy, rltlcz], // 54
        [rltlcx, rltlcy, rltlcz], // 55

        // SMALL RIGHT LEG.
        [srtlcx, srtlcy-slh, srtlcz + slw], // 56
        [srtlcx + sll, srtlcy-slh, srtlcz + slw], // 57
        [srtlcx + sll, srtlcy, srtlcz + slw], // 58
        [srtlcx, srtlcy, srtlcz + slw], // 59
        [srtlcx, srtlcy-slh, srtlcz], // 60
        [srtlcx + sll, srtlcy-slh, srtlcz], // 61
        [srtlcx + sll, srtlcy, srtlcz], // 62
        [srtlcx, srtlcy, srtlcz], // 63

        // LEFT LEG.
        [lltlcx, lltlcy-lh, lltlcz + lw], // 64
        [lltlcx + lw, lltlcy-lh, lltlcz + lw], // 65
        [lltlcx + lw, lltlcy, lltlcz + lw], // 66
        [lltlcx, lltlcy, lltlcz + lw], // 67
        [lltlcx, lltlcy-lh, lltlcz], // 68
        [lltlcx + lw, lltlcy-lh, lltlcz], // 69
        [lltlcx + lw, lltlcy, lltlcz], // 70
        [lltlcx, lltlcy, lltlcz], // 71

        // SMALL LEFT LEG.
        [slltlcx, slltlcy-slh, slltlcz + slw], // 72
        [slltlcx + sll, slltlcy-slh, slltlcz + slw], // 73
        [slltlcx + sll, slltlcy, slltlcz + slw], // 74
        [slltlcx, slltlcy, slltlcz + slw], // 75
        [slltlcx, slltlcy-slh, slltlcz], // 76
        [slltlcx + sll, slltlcy-slh, slltlcz], // 77
        [slltlcx + sll, slltlcy, slltlcz], // 78
        [slltlcx, slltlcy, slltlcz], // 79
    ]

    const edges = [
        // Head.
        new Edge([
            [0, 1, 2, 3], // Front face.
            [4, 5, 6, 7], // Back face.
            [3, 2, 6, 7], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 6, 2], // Right face.
            [0, 4, 7, 3], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorHead,
            randomColorHead,
            randomColorHead,
            randomColorHead,
            randomColorHead,
            randomColorHead
        ],
            hJoints,
            hSibling,
            hChild,
            hrotationAxis,
            hrotationAngle,
            hmaxRotateAngle,
            hminRotateAngle,
            hstartRotateAngle,
            hrotateDirection,
        ),
        // Body.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [12, 13, 14, 15], // Back face.
            [11, 10, 14, 15], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 14, 10], // Right face.
            [8, 12, 15, 11], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorBody,
            randomColorBody,
            randomColorBody,
            randomColorBody,
            randomColorBody,
            randomColorBody
        ],
            bJoints,
            bSibling,
            bChild,
            brotationAxis,
            brotationAngle,
            bmaxRotateAngle,
            bminRotateAngle,
            bstartRotateAngle,
            brotateDirection,
        ),

        // Right arm.
        new Edge([
            [16, 17, 18, 19], // Front face.
            [20, 21, 22, 23], // Back face.
            [19, 18, 22, 23], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 22, 18], // Right face.
            [16, 20, 23, 19], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorArm,
            randomColorArm,
            randomColorArm,
            randomColorArm,
            randomColorArm,
            randomColorArm
        ],
            raJoints,
            raSibling,
            raChild,
            raRotationAxis,
            raRotationAngle,
            raMaxRotateAngle,
            raMinRotateAngle,
            raStartRotateAngle,
            raRotateDirection,
        ),

        // Small right arm.
        new Edge([
            [24, 25, 26, 27], // Front face.
            [28, 29, 30, 31], // Back face.
            [27, 26, 30, 31], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 30, 26], // Right face.
            [24, 28, 31, 27], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorHand,
            randomColorHand,
            randomColorHand,
            randomColorHand,
            randomColorHand,
            randomColorHand
        ],
            sraJoints,
            sraSibling,
            sraChild,
            sraRotationAxis,
            sraRotationAngle,
            sraMaxRotateAngle,
            sraMinRotateAngle,
            sraStartRotateAngle,
            sraRotateDirection,
        ),

        // Left arm.
        new Edge([
            [32, 33, 34, 35], // Front face.
            [36, 37, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [32, 33, 37, 36], // Bottom face.
            [33, 37, 38, 34], // Right face.
            [32, 36, 39, 35], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorArm,
            randomColorArm,
            randomColorArm,
            randomColorArm,
            randomColorArm,
            randomColorArm
        ],
            laJoints,
            laSibling,
            laChild,
            laRotationAxis,
            laRotationAngle,
            laMaxRotateAngle,
            laMinRotateAngle,
            laStartRotateAngle,
            laRotateDirection,
        ),

        // Small left arm.
        new Edge([
            [40, 41, 42, 43], // Front face.
            [44, 45, 46, 47], // Back face.
            [43, 42, 46, 47], // Top face.
            [40, 41, 45, 44], // Bottom face.
            [41, 45, 46, 42], // Right face.
            [40, 44, 47, 43], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorHand,
            randomColorHand,
            randomColorHand,
            randomColorHand,
            randomColorHand,
            randomColorHand
        ], 
            slaJoints,
            slaSibling,
            slaChild,
            slaRotationAxis,
            slaRotationAngle,
            slaMaxRotateAngle,
            slaMinRotateAngle,
            slaStartRotateAngle,
            slaRotateDirection,
        ),

        // Right leg.
        new Edge([
            [48, 49, 50, 51], // Front face.
            [52, 53, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [48, 49, 53, 52], // Bottom face.
            [49, 53, 54, 50], // Right face.
            [48, 52, 55, 51], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs
        ],
            rlJoints,
            rlSibling,
            rlChild,
            rlRotationAxis,
            rlRotationAngle,
            rlMaxRotateAngle,
            rlMinRotateAngle,
            rlStartRotateAngle,
            rlRotateDirection,
        ),

        // Small right leg.
        new Edge([
            [56, 57, 58, 59], // Front face.
            [60, 61, 62, 63], // Back face.
            [59, 58, 62, 63], // Top face.
            [56, 57, 61, 60], // Bottom face.
            [57, 61, 62, 58], // Right face.
            [56, 60, 63, 59], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorFeet,
            randomColorFeet,
            randomColorFeet,
            randomColorFeet,
            randomColorFeet,
            randomColorFeet
        ],
            srlJoints,
            srlSibling,
            srlChild,
            srlRotationAxis,
            srlRotationAngle,
            srlMaxRotateAngle,
            srlMinRotateAngle,
            srlStartRotateAngle,
            srlRotateDirection,
            ),

        // Left leg.
        new Edge([
            [64, 65, 66, 67], // Front face.
            [68, 69, 70, 71], // Back face.
            [67, 66, 70, 71], // Top face.
            [64, 65, 69, 68], // Bottom face.
            [65, 69, 70, 66], // Right face.
            [64, 68, 71, 67], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs
        ],
            llJoints,
            llSibling,
            llChild,
            llRotationAxis,
            llRotationAngle,
            llMaxRotateAngle,
            llMinRotateAngle,
            llStartRotateAngle,
            llRotateDirection,
        ),

        // Small left leg.
        new Edge([
            [72, 73, 74, 75], // Front face.
            [76, 77, 78, 79], // Back face.
            [75, 74, 78, 79], // Top face.
            [72, 73, 77, 76], // Bottom face.
            [73, 77, 78, 74], // Right face.
            [72, 76, 79, 75], // Left face.
        ], [
            // Fill all face with generated color.
            randomColorFeet,
            randomColorFeet,
            randomColorFeet,
            randomColorFeet,
            randomColorFeet,
            randomColorFeet
        ],
            sllJoints,
            sllSibling,
            sllChild,
            sllRotationAxis,
            sllRotationAngle,
            sllMaxRotateAngle,
            sllMinRotateAngle,
            sllStartRotateAngle,
            sllRotateDirection,
        ),
    ];

    return new ArticulatedObject(vertices, edges);
}