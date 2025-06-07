import React, { useState } from 'react';
import FileUpload from '../components/fileupload';
import DataTable from '../components/datatable';
import { fetchData, downloadCSV } from '../api';

function App() {
  const [data, setData] = useState([]);
  const [downloadKey, setDownloadKey] = useState('');
  const [showTable, setShowTable] = useState(false);


  // const handlekey = async() =>{
  //   const response = await uploadCSV();
  //   setDownloadKey(response.s3Key)

  // }
  const loadData = async () => {
    try {
      const res = await fetchData();
      
      setData(res);
      
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadCSV(downloadKey);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">CSV Drive</h1>

        {/* Upload CSV */}
        <FileUpload onUploadSuccess={loadData} setDownloadKey={setDownloadKey}/>

        {/* Toggle Show/Hide Table Button */}
        {data.length > 0 && (
          <button
            onClick={() => setShowTable((prev) => !prev)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {showTable ? 'Hide Data Table' : 'Show Data Table'}
          </button>
        )}

        {/* Conditionally Render Table */}
        {showTable && <DataTable data={data} />}

        {/* Download Button */}
        {downloadKey && (
          <button
            onClick={handleDownload}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Download Original CSV
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
