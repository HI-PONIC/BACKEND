const { BigQuery } = require("@google-cloud/bigquery");

require('dotenv').config();

async function querySingleData() {

  const datasetId = process.env.DS_ID;
  const tableId = process.env.TABLE_ID;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;

  try{
    const bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT
    });
    
    let date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    date = `${year}-${month}-${day}`;
    const query =
    `
    SELECT * 
    FROM \`${projectId}.${datasetId}.${tableId}\`
    WHERE device_id = 'HIPONIC_DEVICE1'
    ORDER BY date DESC
    LIMIT 1;`;

    const options = {
      query: query,
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    if (rows.length === 0) {
      throw new Error("No data found for the given device ID.");
    }  
    const data = rows[0];
    return data;
  }catch(error){
    console.error('Original error:', error.message);
    throw new Error("Failed to query data");
  }

}

async function queryAverageData() {
  try {
    const datasetId = process.env.DS_ID;
    const tableId = process.env.TABLE_ID;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT
    });

    let date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    date = `${year}-${month}-${day}`;
    const query =
      `
    SELECT date, ROUND(AVG(ph),1) AS avg_ph, ROUND(AVG(humidity),1) AS avg_humidity, ROUND(AVG(temp),1) AS avg_temp, ROUND(AVG(tds),1) AS avg_tds
    FROM \`${projectId}.${datasetId}.${tableId}\`
    WHERE device_id = 'HIPONIC_DEVICE1'
    GROUP BY date
    ORDER BY date DESC;`;

    const options = {
      query: query,
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    if (rows.length === 0) {
      throw new Error("No data found for the given device ID.");
    }
    
    const data = rows[0];
    return data;
  } catch (error) {
    console.error('Original error:', error.message);
    throw new Error("Failed to query data");
  }
}

module.exports = {querySingleData, queryAverageData};
