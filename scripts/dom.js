/// <reference path="./state.js" />
/// <reference path="./utility.js" />
/// <reference path="./mat4.js" />
/// <reference path="./articulatedObject.js" />
/// <reference path="./webgl.js" />
/// <reference path="./main.js" />

'use strict';

/**
 * @description reset all data in articulated object and in user interface.
 */
const resetDefault = () => {
    // Reset translate.
    translateXSlider.value = 0;
    translateXValue.innerHTML = 0;
    webglManager.translateValue[0] = 0;
    translateYSlider.value = 0;
    translateYValue.innerHTML = 0;
    webglManager.translateValue[1] = 0;
    translateZslider.value = 0;
    translateZValue.innerHTML = 0;
    webglManager.translateValue[2] = 0;
    
    // Reset rotate
    rotateXSlider.value = 0;
    rotateXValue.innerHTML = 0;
    webglManager.rotateAngle[0] = 0;
    rotateYSlider.value = 0;
    rotateYValue.innerHTML = 0;
    webglManager.rotateAngle[1] = 0;
    rotateZSlider.value = 0;
    rotateZValue.innerHTML = 0;
    webglManager.rotateAngle[2] = 0;

    // Reset scale
    scaleXSlider.value = 1;
    scaleXValue.innerHTML = 1;
    webglManager.scaleValue[0] = 1;
    scaleYSlider.value = 1;
    scaleYValue.innerHTML = 1;
    webglManager.scaleValue[1] = 1;
    scaleZSlider.value = 1;
    scaleZValue.innerHTML = 1;
    webglManager.scaleValue[2] = 1;

    // Reset camera
    cameraRadiusSlider.value = 5;
    cameraRadiusValue.innerHTML = 5;
    webglManager.cameraRadius = 5;
    cameraRotateSlider.value = 0;
    cameraRotateValue.innerHTML = 0;
    webglManager.cameraRotation = 0;

    // Reset projection type.
    projectionView.value = 2;
    webglManager.projectionType = 2;

    webglManager.drawArticulatedObjectScene();
}

/**
 * @description imports json file to render as an articulated object.
 */
 const importData = () => {
    // Get file input.
    var fileInput = document.getElementById('fileinput');
    var data = fileInput.files[0];

    // Validate input file.
    if (!data) {
        alert('File gagal di-import');
        return;
    }

    // Read file.
    var reader = new FileReader();
    reader.onload = (e) => {
        let articulatedObj = null;
        try {
            articulatedObj = JSON.parse(e.target.result);
            if (!articulatedObj) return;
            
        } catch (e) {
            // Alert error message.
            alert(e.message);
            return;
        }

        // Construct new egde object from parsed json.
        let edges = [];
        for (let i = 0; i < articulatedObj.edge.length; i++) {
            let currentEdge = articulatedObj.edge[i];
            let newEdge = new Edge(currentEdge.topology, currentEdge.color);
            edges.push(newEdge);
        }

        // Construct new vertex object from parsed json.
        let vertices = articulatedObj.vertices;

        // Construct new articulated object from parsed json.
        articulatedObject = null;
        articulatedObject = new ArticulatedObject(vertices, edges);
        webglManager.clearScreen();
        webglManager.initBuffersArticulated(articulatedObject);
        webglManager.drawArticulatedObjectScene();
    };
    reader.readAsText(data);
};

const moveBodyPart = (index, ratio) => {
    // Check if body part with current index is exist.
    if (!webglManager.articulatedModel.edge[index]) {
        return
    };

    // Get current body part.
    let currentBodyPart = webglManager.articulatedModel.edge[index];

    // Calculate current angle.
    const interval = currentBodyPart.maxRotateAngle - currentBodyPart.minRotateAngle;
    const currentAngle = currentBodyPart.minRotateAngle + interval * ratio;

    // Modify nodesRad for current body part.
    webglManager.nodesRad[index] = degToRad(currentAngle);

    // Draw the object.
    webglManager.drawArticulatedObjectScene();
}

/**
 * Event listener
 */

// Translate slider.
// Slider translate x.
translateXSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    translateXValue.innerHTML = translateXSlider.value;
    webglManager.translateValue[0] = 
        translateXSlider.value/ (webglManager.gl.canvas.clientWidth/4);
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});
// Slider translate y.
translateYSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.translateValue[1] =
        translateYSlider.value/ (webglManager.gl.canvas.clientHeight/4);
    translateYValue.innerHTML = translateYSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});
// Slider translate z.
translateZslider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.translateValue[2] = translateZslider.value / 50;
    translateZValue.innerHTML = translateZslider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});

// Rotate slider.
// Slider rotate x.
rotateXSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.rotateAngle[0] = rotateXSlider.value;
    rotateXValue.innerHTML = rotateXSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});
// Slider rotate y.
rotateYSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.rotateAngle[1] = rotateYSlider.value;
    rotateYValue.innerHTML = rotateYSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});
// Slider rotate z.
rotateZSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.rotateAngle[2] = rotateZSlider.value;
    rotateZValue.innerHTML = rotateZSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});

// Scale slider.
// Slider scale x.
scaleXSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object. 
    webglManager.scaleValue[0] = scaleXSlider.value;
    scaleXValue.innerHTML = scaleXSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});
// Slider scale y.
scaleYSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.scaleValue[1] = scaleYSlider.value;
    scaleYValue.innerHTML = scaleYSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});
// Slider scale z.
scaleZSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.scaleValue[2] = scaleZSlider.value;
    scaleZValue.innerHTML = scaleZSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});

// Camera slider.
// Slider camera radius.
cameraRadiusSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.cameraRadius = cameraRadiusSlider.value;
    cameraRadiusValue.innerHTML = cameraRadiusSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});
// Slider camera rotation.
cameraRotateSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.cameraRotation = cameraRotateSlider.value;
    cameraRotateValue.innerHTML = cameraRotateSlider.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});

// Projection View
projectionView.addEventListener('change', () => {
    // Change displayed in articulated object.
    webglManager.projectionType = projectionView.value;
    // Re-draw articulated object.
    webglManager.drawArticulatedObjectScene();
});

// Default View.
defaultViewButton.addEventListener('click', () => {
    resetDefault();
});

shaderBtn.addEventListener('click', () => {
    webglManager.changeShaders();
    webglManager.drawArticulatedObjectScene();
});

// Loop for each input body.
for (let i = 0; i < arrInputBody.length; i++) {
    arrInputBody[i].addEventListener('input', () => {
        const ratio = arrInputBody[i].value;
        moveBodyPart(i, ratio); 
    });
}

