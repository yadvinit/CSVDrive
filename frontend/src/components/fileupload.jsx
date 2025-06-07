import React, { useState } from 'react';
import { uploadCSV } from '../api';

function FileUpload({ onUploadSuccess ,setDownloadKey}) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setStatus(selectedFile ? `📄 Selected: ${selectedFile.name}` : '');
  };

  const handleUpload = async () => {
    if (!file) return alert('Select a CSV file first!');
    //using MMIME type
    
    const allowedTypes = ['text/csv'];
    const isCSVType = allowedTypes.includes(file.type);

    //using split for file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isCSVExt = fileExtension === 'csv';

    if (!isCSVType && !isCSVExt) {
      alert('Please select a valid CSV file');
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB limit');
      return;
    }

    setStatus('Uploading...');
    try {
      const res = await uploadCSV(file);
      setDownloadKey(res.s3Key);
      setStatus('✅ Upload successful');
      onUploadSuccess();
    } catch (err) {
      setStatus('❌ Upload failed');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3 mb-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full max-w-xs text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-gray-100 file:text-gray-600
                   hover:file:bg-blue-100
                   file:cursor-pointer
                   border border-dashed border-gray-400 p-2 rounded-md"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Upload CSV
      </button>
      <span className="text-sm text-gray-600">{status}</span>
    </div>
  );
}

export default FileUpload;
