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

    webglManager.drawHollowObjectScene();
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
        let hollowObj = null;
        try {
            hollowObj = JSON.parse(e.target.result);
            if (!hollowObj) return;
            
        } catch (e) {
            // Alert error message.
            alert(e.message);
            return;
        }

        // Construct new egde object from parsed json.
        let edges = [];
        for (let i = 0; i < hollowObj.edge.length; i++) {
            let currentEdge = hollowObj.edge[i];
            let newEdge = new Edge(currentEdge.topology, currentEdge.color);
            edges.push(newEdge);
        }

        // Construct new vertex object from parsed json.
        let vertices = hollowObj.vertices;

        // Construct new articulated object from parsed json.
        hollowObject = null;
        hollowObject = new ArticulatedObject(vertices, edges);
        webglManager.clearScreen();
        webglManager.initBuffersHollow(hollowObject);
        webglManager.drawHollowObjectScene();
    };
    reader.readAsText(data);
};

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
    webglManager.drawHollowObjectScene();
});
// Slider translate y.
translateYSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.translateValue[1] =
        translateYSlider.value/ (webglManager.gl.canvas.clientHeight/4);
    translateYValue.innerHTML = translateYSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});
// Slider translate z.
translateZslider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.translateValue[2] = translateZslider.value / 50;
    translateZValue.innerHTML = translateZslider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});

// Rotate slider.
// Slider rotate x.
rotateXSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.rotateAngle[0] = rotateXSlider.value;
    rotateXValue.innerHTML = rotateXSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});
// Slider rotate y.
rotateYSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.rotateAngle[1] = rotateYSlider.value;
    rotateYValue.innerHTML = rotateYSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});
// Slider rotate z.
rotateZSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.rotateAngle[2] = rotateZSlider.value;
    rotateZValue.innerHTML = rotateZSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});

// Scale slider.
// Slider scale x.
scaleXSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object. 
    webglManager.scaleValue[0] = scaleXSlider.value;
    scaleXValue.innerHTML = scaleXSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});
// Slider scale y.
scaleYSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.scaleValue[1] = scaleYSlider.value;
    scaleYValue.innerHTML = scaleYSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});
// Slider scale z.
scaleZSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.scaleValue[2] = scaleZSlider.value;
    scaleZValue.innerHTML = scaleZSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});

// Camera slider.
// Slider camera radius.
cameraRadiusSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.cameraRadius = cameraRadiusSlider.value;
    cameraRadiusValue.innerHTML = cameraRadiusSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});
// Slider camera rotation.
cameraRotateSlider.addEventListener('input', () => {
    // Change displayed value in UI and in articulated object.
    webglManager.cameraRotation = cameraRotateSlider.value;
    cameraRotateValue.innerHTML = cameraRotateSlider.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});

// Projection View
projectionView.addEventListener('change', () => {
    // Change displayed in articulated object.
    webglManager.projectionType = projectionView.value;
    // Re-draw articulated object.
    webglManager.drawHollowObjectScene();
});

// Default View.
defaultViewButton.addEventListener('click', () => {
    resetDefault();
});

shaderBtn.addEventListener('click', () => {
    webglManager.changeShaders();
    webglManager.drawHollowObjectScene();
});