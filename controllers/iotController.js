const {querySingleData, queryAverageData }= require('../services/load_bq');
const send_alert = require('../services/send_alert')


exports.getAllSensor = async (req, res) => {

  try{
    const row = await querySingleData();
    const sensorData = {
      ph:row.ph,
      humidity:row.humidity,
      temp: row.temp,
      tds: row.tds
    };
    res.status(200).json({
      status: 'success',
      sensorData: sensorData 
    });
  }catch(error){
    res.status(500).json({
      status: 'error',
      message:error.message
    });
  }
}

exports.getAverage = async (req, res) => {
  try{
    const row = await queryAverageData();
    const data = {
      avg_ph:row.avg_ph,
      avg_humidity:row.avg_humidity,
      avg_temp: row.avg_temp,
      avg_tds: row.avg_tds
    };
    res.status(200).json({
      status: 'success',
      averageData: data 
    });
  }catch(error){
    res.status(500).json({
      status: 'error',
      message:error.message
    });
  }
}

