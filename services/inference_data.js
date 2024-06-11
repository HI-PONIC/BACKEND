const tf = require('@tensorflow/tfjs-node');
let loadModel = require('./load_model');

async function predictClassification(imageBuffer) {
    try {
        const tensor = tf.node.decodeImage(imageBuffer, 3) // Decode image buffer to a 3-channel image
            .resizeNearestNeighbor([256, 256]) // Resize to 256x256
            .expandDims() // Add batch dimension
            .toFloat(); // Convert to float

        let model = await loadModel();
        // Use the model's predict function
        const prediction = model.predict(tensor);

        // Get the prediction data
        const score = await prediction.data();

        // Compute the confidence score and determine the label
        const confidenceScore = Math.max(...score) * 100;
        const classes = ['Bacterial', 'Deficient', 'Fungal', 'Healthy'];
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        // Generate a message based on the label
        let message;
        switch (label) {
            case 'Bacterial':
                message = "tanaman anda terserang bakteri!";
                break;
            case 'Deficient':
                message = "tanaman anda kurang nutrisi!";
                break;
            case 'Fungal':
                message = "tanaman anda terserang jamur!";
                break;
            case 'Healthy':
                message = "tanaman anda sangat sehat!";
                break;
        }

        return { confidenceScore, label, message };

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = predictClassification;
