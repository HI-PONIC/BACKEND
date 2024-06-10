
const { BigQuery } = require("@google-cloud/bigquery");
async function queryData() {
  const datasetId = process.env.DS_ID;
  const tableId = process.env.TABLE_ID;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  try{
    const bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT
    });
   
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
    console.log('Query results:');
    console.log(rows);
    console.log(typeof(rows));
    
    const data = rows[0];
    return data;
  }catch(error){
    console.error('Original error:', error.message);
    throw new Error("Failed to query data");
  }
  
}
module.exports = queryData;
