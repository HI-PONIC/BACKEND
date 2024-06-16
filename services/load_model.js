const tf = require('@tensorflow/tfjs-node');
const path = require('path');
require('dotenv').config();

async function loadModel(){
    //for local model
    const modelPath = path.resolve(__dirname, '../mlModel/model.json');
    return tf.loadLayersModel(`file://${modelPath}`);
    //return tf.loadLayersModel(process.env.MODEL_URL);
}

module.exports = loadModel;