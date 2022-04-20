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
     * @param {string} name - Name of edge.
     * @param {number} sibling - Index of first sibling edge in list of edge. You can find the list in articulated object.
     * @param {number} child - Index of first child edge in list of edge. You can find the list in articulated object.
     * @param {number} rotationAxis - The axis of rotation, 0 for x, 1 for y, 2 for z, 3 for no rotation.
     * @param {number} maxRotateAngle - The maximum angle of rotation.
     * @param {number} minRotateAngle - The minimum angle of rotation.
     * @param {number} rotateDirection - The direction of rotation, 1 for clockwise, -1 for counterclockwise.
     */
    constructor(topology, color, joints, name, sibling, child, rotationAxis, maxRotateAngle, 
        minRotateAngle, rotateDirection) {
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
         * @description Name of edge.
         * @type {string}
         * @public
         */
        this.name = name;

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
     * @param {number} bumpType - Type of bump. 0 for environment mapping, 1 for image mapping, 2 for bump mapping, 3 for using normal color.
     * @param {number} rootNode - Index of root node in list of node.
     **/
    constructor(vertices, edges, bumpType = 3, rootNode = 0) {
        /**
         * @description List of list of vertices in articulated object.
         * @type {number[][3]}
         * @public
         */
        this.vertices = vertices;

        
        /**
         * @description List of edge in articulated object.
         * @type {Edge[]}
         * @public
         */
        this.edge = edges;

        /**
         * @description Type of bump. 0 for environment mapping, 1 for image mapping, 2 for bump mapping.
         * @type {number}
         * @public
         * @default 0
         */
        this.bumpType = bumpType;

        /**
         * @description Index of root node in list of node.
         * @type {number}
         * @public
         * @default 0
         */
        this.rootNode = rootNode;
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
    const hName = "Head";
    const hSibling = 2;
    const hChild = null;
    const hrotationAxis = 1;
    const hmaxRotateAngle = 45;
    const hminRotateAngle = -45;
    const hrotateDirection = 1;

    // BODY.
    const bJoints = [0, 0, 0];
    const bName = "Body";
    const bSibling = null;
    const bChild = 1;
    const brotationAxis = 3;
    const bmaxRotateAngle = 180;
    const bminRotateAngle = 180;
    const brotateDirection = 1;

    // RIGHT ARM.
    const raJoints = [bl * 0.5, bh*0.5 - aw*0.5, 0];
    const raName = "Right Arm";
    const raSibling = 4;
    const raChild = 3;
    const raRotationAxis = 0;
    const raMaxRotateAngle = 90;
    const raMinRotateAngle = -90;
    const raRotateDirection = 1;

    // SMALL RIGHT ARM.
    const sraJoints = [al* 0.5, -1*ah + sah , 0];
    const sraName = "Right Hand";
    const sraSibling = null;
    const sraChild = null;
    const sraRotationAxis = 0;
    const sraMaxRotateAngle = 40;
    const sraMinRotateAngle = -40;
    const sraRotateDirection = 1;

    // LEFT ARM.
    const laJoints = [bl * 0.5 - al* 0.5, bh*0.5 - aw*0.5, 0];
    const laName = "Left Arm";
    const laSibling = 6;
    const laChild = 5;
    const laRotationAxis = 0;
    const laMaxRotateAngle = 90;
    const laMinRotateAngle = -90;
    const laRotateDirection = -1;

    // SMALL LEFT ARM.
    const slaJoints = [-1 * al* 0.5, -1*ah + sah , 0];
    const slaName = "Left Hand";
    const slaSibling = null;
    const slaChild = null;
    const slaRotationAxis = 0;
    const slaMaxRotateAngle = 40;
    const slaMinRotateAngle = -40;
    const slaRotateDirection = -1;

    // RIGHT LEG.
    const rlJoints = [bl * 0.5 - ll*0.5, -1*bh*0.5, 0];
    const rlName = "Right Leg";
    const rlSibling = 8;
    const rlChild = 7;
    const rlRotationAxis = 0;
    const rlMaxRotateAngle = 60;
    const rlMinRotateAngle = -60;
    const rlRotateDirection = -1;

    // SMALL RIGHT LEG.
    const srlJoints = [0, -1*lh + -0.5*bh , 0];
    const srlName = "Right Foot";
    const srlSibling = null;
    const srlChild = null;
    const srlRotationAxis = 0;
    const srlMaxRotateAngle = 40;
    const srlMinRotateAngle = -40;
    const srlRotateDirection = -1;

    // LEFT LEG.
    const llJoints = [-1*(bl * 0.5 - ll*0.5), -1*bh*0.5, 0];
    const llName = "Left Leg";
    const llSibling = null;
    const llChild = 9;
    const llRotationAxis = 0;
    const llMaxRotateAngle = 60;
    const llMinRotateAngle = -60;
    const llRotateDirection = 1;

    // SMALL LEFT LEG.
    const sllJoints = [0, -1*lh + -0.5*bh , 0];
    const sllName = "Left Foot";
    const sllSibling = null;
    const sllChild = null;
    const sllRotationAxis = 0;
    const sllMaxRotateAngle = 40;
    const sllMinRotateAngle = -40;
    const sllRotateDirection = 1;

    const vertices = [
        // BODY.
        [btlcx, btlcy-bh, btlcz + bw], // 0
        [btlcx + bl, btlcy-bh, btlcz + bw], // 1
        [btlcx + bl, btlcy, btlcz + bw], // 2
        [btlcx, btlcy, btlcz + bw], // 3
        [btlcx, btlcy-bh, btlcz], // 4
        [btlcx + bl, btlcy-bh, btlcz], // 5
        [btlcx + bl, btlcy, btlcz], // 6
        [btlcx, btlcy, btlcz], // 7

        // HEAD.
        [htlcx, htlcy-hh, htlcz + hw], // 8
        [htlcx + hl, htlcy-hh, htlcz + hw], // 9
        [htlcx + hl, htlcy, htlcz + hw], // 10
        [htlcx, htlcy, htlcz + hw], // 11
        [htlcx, htlcy-hh, htlcz], // 12
        [htlcx + hl, htlcy-hh, htlcz], // 13
        [htlcx + hl, htlcy, htlcz], // 14
        [htlcx, htlcy, htlcz], // 15

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
         // Body.
         new Edge([
            [0, 1, 2, 3], // Front face.
            [4, 5, 6, 7], // Back face.
            [3, 2, 6, 7], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 6, 2], // Right face.
            [0, 4, 7, 3], // Left face.
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
            bName,
            bSibling,
            bChild,
            brotationAxis,
            bmaxRotateAngle,
            bminRotateAngle,
            brotateDirection,
        ),

        // Head.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [12, 13, 14, 15], // Back face.
            [11, 10, 14, 15], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 14, 10], // Right face.
            [8, 12, 15, 11], // Left face.
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
            hName,
            hSibling,
            hChild,
            hrotationAxis,
            hmaxRotateAngle,
            hminRotateAngle,
            hrotateDirection,
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
            raName,
            raSibling,
            raChild,
            raRotationAxis,
            raMaxRotateAngle,
            raMinRotateAngle,
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
            sraName,
            sraSibling,
            sraChild,
            sraRotationAxis,
            sraMaxRotateAngle,
            sraMinRotateAngle,
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
            laName,
            laSibling,
            laChild,
            laRotationAxis,
            laMaxRotateAngle,
            laMinRotateAngle,
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
            slaName,
            slaSibling,
            slaChild,
            slaRotationAxis,
            slaMaxRotateAngle,
            slaMinRotateAngle,
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
            rlName,
            rlSibling,
            rlChild,
            rlRotationAxis,
            rlMaxRotateAngle,
            rlMinRotateAngle,
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
            srlName,
            srlSibling,
            srlChild,
            srlRotationAxis,
            srlMaxRotateAngle,
            srlMinRotateAngle,
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
            llName,
            llSibling,
            llChild,
            llRotationAxis,
            llMaxRotateAngle,
            llMinRotateAngle,
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
            sllName,
            sllSibling,
            sllChild,
            sllRotationAxis,
            sllMaxRotateAngle,
            sllMinRotateAngle,
            sllRotateDirection,
        ),
    ];

    const bumpType = 0;
    const rootNode = 0;
    return new ArticulatedObject(vertices, edges, bumpType, rootNode);
}

function loadDog() {
    // Generate random color. Will be used on every face.
    let randomColorHead = randomRGB();
    let randomColorBody = randomRGB();
    let randomColorLegs = randomRGB();
    let randomColorNeck = randomRGB();

    // Dog properties
    const bodyWidth = 1.2;
    const bodyHeight = 0.3;
    const bodyLength = 0.7;

    const legLength = 0.3;
    const legWidth = 0.3;
    const legHeight = 0.8;


    const neckHeight = 1.2;
    const neckWidth = 0.3;
    const neckLength = 0.3;

    const headWidth = 0.8;
    const headLength = 0.3;
    const headHeight = 0.3;


    // Important Points
    const bodyTopLeftX = -1 * 0.5 * bodyLength;
    const bodyTopLeftY = 0.5 * bodyHeight;
    const bodyTopLeftZ = -1 * 0.5 * bodyWidth;
    
    const neckBottomLeftX = -1 * 0.5 * neckLength;
    const neckBottomLeftY = -1 * 0.5 * bodyHeight;
    const neckBottomLeftZ = 0.5 * bodyWidth + 0.5 * neckWidth;

    const headTopLeftX = -1 * 0.5 * headLength;
    const headTopLeftY = neckBottomLeftY + neckHeight;
    const headTopLeftZ = neckBottomLeftZ + neckWidth;

    const legTop = bodyTopLeftY - bodyHeight
    const legBottom = legTop - legHeight;
    const vertices = [
        // BODY
        ...createBlockVertices(bodyTopLeftX, bodyTopLeftX + bodyLength, bodyTopLeftY, bodyTopLeftY - bodyHeight, bodyTopLeftZ + bodyWidth, bodyTopLeftZ),
        // LEFT BACK LEG
        ...createBlockVertices(bodyTopLeftX, bodyTopLeftX + legLength, legTop, legBottom, bodyTopLeftZ + legWidth, bodyTopLeftZ),
        // LEFT FRONT LEG
        ...createBlockVertices(bodyTopLeftX, bodyTopLeftX + legLength, legTop, legBottom, bodyTopLeftZ + bodyWidth, bodyTopLeftZ + bodyWidth - legWidth),
        // RIGHT FRONT LEG
        ...createBlockVertices(bodyTopLeftX + bodyLength - legLength, bodyTopLeftX + bodyLength, legTop, legBottom, bodyTopLeftZ + bodyWidth, bodyTopLeftZ + bodyWidth - legWidth),
        // RIGHT BACK LEG
        ...createBlockVertices(bodyTopLeftX + bodyLength - legLength, bodyTopLeftX + bodyLength, legTop, legBottom, bodyTopLeftZ + legWidth, bodyTopLeftZ),
        // NECK
        ...createBlockVertices(neckBottomLeftX, neckBottomLeftX + neckLength, neckBottomLeftY + neckHeight, neckBottomLeftY, neckBottomLeftZ, neckBottomLeftZ - neckWidth),
        // HEAD
        ...createBlockVertices(headTopLeftX, headTopLeftX + headLength, headTopLeftY, headTopLeftY - headHeight, headTopLeftZ, headTopLeftZ - headWidth)
    ]

    const bJoints = [0, 0, 0]
    const bName = "Body"
    const bSibling = null
    const bChild = 1;
    const bRotationAxis = 3
    const bmaxRotateAngle = 180
    const bminRotateAngle = -180
    const brotateDirection = -1;

    const lbJoints = [-1 * bodyLength * 0.5 + 0.5 * legLength, -1 * 0.5 * bodyHeight, -1 * bodyWidth * 0.5 + 0.5 * legWidth]
    const lbName = "Left Back Leg"
    const lbSibling = 2
    const lbChild = null;
    const lbRotationAxis = 0
    const lbmaxRotateAngle = 45
    const lbminRotateAngle = -45
    const lbrotateDirection = -1;

    const lfJoints = [-1 * bodyLength * 0.5 + 0.5 * legLength, -1 * 0.5 * bodyHeight, bodyWidth * 0.5 - 0.5 * legWidth]
    const lfName = "Left Front Leg"
    const lfSibling = 3
    const lfChild = null;
    const lfRotationAxis = 0
    const lfmaxRotateAngle = 45
    const lfminRotateAngle = -45
    const lfrotateDirection = 1;

    const rfJoints = [bodyLength * 0.5 - 0.5 * legLength, -1 * 0.5 * bodyHeight, bodyWidth * 0.5 - 0.5 * legWidth]
    const rfName = "Right Front Leg"
    const rfSibling = 4
    const rfChild = null;
    const rfRotationAxis = 0
    const rfmaxRotateAngle = 45
    const rfminRotateAngle = -45
    const rfrotateDirection = -1;

    const rbJoints = [bodyLength * 0.5 - 0.5 * legLength, -1 * 0.5 * bodyHeight, -1 * bodyWidth * 0.5 + 0.5 * legWidth]
    const rbName = "Right Back Leg"
    const rbSibling = 5
    const rbChild = null;
    const rbRotationAxis = 0
    const rbmaxRotateAngle = 45
    const rbminRotateAngle = -45
    const rbrotateDirection = 1;

    const neckJoints = [0, 0, bodyWidth * 0.5 + 0.5 * neckWidth]
    const neckName = "Neck"
    const neckSibling = null;
    const neckChild = 6;
    const neckRotationAxis = 0
    const neckmaxRotateAngle = 45
    const neckminRotateAngle = -45
    const neckrotateDirection = 1;

    const headJoints = [0, neckHeight - 0.5 * headHeight, headWidth * 0.5]
    const headName = "Head"
    const headSibling = null
    const headChild = null;
    const headRotationAxis = 0
    const headmaxRotateAngle = 45
    const headminRotateAngle = -45
    const headrotateDirection = 1;

    const edges = [
        // BODY
        new Edge([
            [0, 1, 2, 3], // Front face.
            [4, 5, 6, 7], // Back face.
            [3, 2, 6, 7], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 6, 2], // Right face.
            [0, 4, 7, 3], // Left face.
        ], [
            randomColorBody,
            randomColorBody,
            randomColorBody,
            randomColorBody,
            randomColorBody,
            randomColorBody,
        ],
            bJoints,
            bName,
            bSibling,
            bChild,
            bRotationAxis,
            bmaxRotateAngle,
            bminRotateAngle,
            brotateDirection,
        ),

        // LEFT BACK LEG
        new Edge([
            [8, 9, 10, 11], // Front face.
            [12, 13, 14, 15], // Back face.
            [11, 10, 14, 15], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 14, 10], // Right face.
            [8, 12, 15, 11], // Left face.
        ], [
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
        ],
            lbJoints,
            lbName,
            lbSibling,
            lbChild,
            lbRotationAxis,
            lbmaxRotateAngle,
            lbminRotateAngle,
            lbrotateDirection,
        ),

        // LEFT FRONT LEG
        new Edge([
            [16, 17, 18, 19], // Front face.
            [20, 21, 22, 23], // Back face.
            [19, 18, 22, 23], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 22, 18], // Right face.
            [16, 20, 23, 19], // Left face.
        ], [
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
        ],
            lfJoints,
            lfName,
            lfSibling,
            lfChild,
            lfRotationAxis,
            lfmaxRotateAngle,
            lfminRotateAngle,
            lfrotateDirection,
        ),

        // RIGHT FRONT LEG
        new Edge([
            [24, 25, 26, 27], // Front face.
            [28, 29, 30, 31], // Back face.
            [27, 26, 30, 31], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 30, 26], // Right face.
            [24, 28, 31, 27], // Left face.
        ], [
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
        ],
            rfJoints,
            rfName,
            rfSibling,
            rfChild,
            rfRotationAxis,
            rfmaxRotateAngle,
            rfminRotateAngle,
            rfrotateDirection,
        ),

        // RIGHT BACK LEG
        new Edge([
            [32, 33, 34, 35], // Front face.
            [36, 37, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [32, 33, 37, 36], // Bottom face.
            [33, 37, 38, 34], // Right face.
            [32, 36, 39, 35], // Left face.
        ], [
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
            randomColorLegs,
        ],
            rbJoints,
            rbName,
            rbSibling,
            rbChild,
            rbRotationAxis,
            rbmaxRotateAngle,
            rbminRotateAngle,
            rbrotateDirection,
        ),

        // NECK
        new Edge([
            [40, 41, 42, 43], // Front face.
            [44, 45, 46, 47], // Back face.
            [43, 42, 46, 47], // Top face.
            [40, 41, 45, 44], // Bottom face.
            [41, 45, 46, 42], // Right face.
            [40, 44, 47, 43], // Left face.
        ], [
            randomColorNeck,
            randomColorNeck,
            randomColorNeck,
            randomColorNeck,
            randomColorNeck,
            randomColorNeck,
        ],
            neckJoints,
            neckName,
            neckSibling,
            neckChild,
            neckRotationAxis,
            neckmaxRotateAngle,
            neckminRotateAngle,
            neckrotateDirection,
        ),

        // HEAD
        new Edge([
            [48, 49, 50, 51], // Front face.
            [52, 53, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [48, 49, 53, 52], // Bottom face.
            [49, 53, 54, 50], // Right face.
            [48, 52, 55, 51], // Left face.
        ], [
            randomColorHead,
            randomColorHead,
            randomColorHead,
            randomColorHead,
            randomColorHead,
            randomColorHead,
        ],
            headJoints,
            headName,
            headSibling,
            headChild,
            headRotationAxis,
            headmaxRotateAngle,
            headminRotateAngle,
            headrotateDirection,
        ),

    ]

    const bumpType = 0
    const rootNode = 0

    return new ArticulatedObject(vertices, edges, bumpType, rootNode)
}

const createBlockVertices = (left, right, top, bottom, front, back) => {
    return [
        [left, bottom, front],
        [right, bottom, front],
        [right, top, front],
        [left, top, front],
        [left, bottom, back],
        [right, bottom, back],
        [right, top, back],
        [left, top, back],
    ]
}