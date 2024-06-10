
const predictClassification = require('../services/inference_data');

exports.postPredictHandler = async (req, res) => {
    try{
        const image = req.file.buffer;
        const { confidenceScore, label, message } = await predictClassification(image);
        const data = {
        "result": label,
        "message": message,
        }
        res.status(200).json({
            status:"success",
            predictResult: data
        });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
  }
   