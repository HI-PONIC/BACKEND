const { BigQuery } = require("@google-cloud/bigquery");
const path = require('path');
const serviceKey = path.join(__dirname, '../bq-cred.json');
require('dotenv').config();

async function querySingleData(device_id) {
  const datasetId = process.env.DS_ID;
  const tableId = process.env.TABLE_ID;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;

  try {
    const bigquery = new BigQuery({
      keyFilename: serviceKey,
      projectId: process.env.GOOGLE_CLOUD_PROJECT
    });

    const query = `
      SELECT * 
      FROM \`${projectId}.${datasetId}.${tableId}\`
      WHERE device_id = '${device_id}'
      ORDER BY date DESC
      LIMIT 1;
    `;

    console.log('Executing query:', query); // Log the query

    const options = { query };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    
    console.log('Query results:', rows); // Log the retrieved rows

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

async function queryAverageData(device_id) {
  const datasetId = process.env.DS_ID;
  const tableId = process.env.TABLE_ID;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;

  try {
    const bigquery = new BigQuery({
      keyFilename: serviceKey,
      projectId: process.env.GOOGLE_CLOUD_PROJECT
    });

    const query = `
      SELECT date, ROUND(AVG(ph), 1) AS avg_ph, ROUND(AVG(humidity), 1) AS avg_humidity, ROUND(AVG(temp), 1) AS avg_temp, ROUND(AVG(tds), 1) AS avg_tds
      FROM \`${projectId}.${datasetId}.${tableId}\`
      WHERE device_id = '${device_id}'
      GROUP BY date
      ORDER BY date DESC;
    `;

    console.log('Executing query:', query); // Log the query

    const options = { query };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    console.log('Query results:', rows); // Log the retrieved rows

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

module.exports = { querySingleData, queryAverageData };
