import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/csv';

// Upload a CSV file to the backend
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { success, message, s3Key, recordsProcessed }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Fetch all parsed records from the database
export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/records`);
    return response.data; // Array of records
  } catch (error) {
    console.error('Fetching records failed:', error);
    throw error;
  }
};

// Download the original CSV file from S3
export const downloadCSV = async (s3Key) => {
  try {
    const response = await axios({
      url: `${API_BASE}/download/${s3Key}`,
      method: 'GET',
      responseType: 'blob', // Important to download as a file
    });

    // Create a downloadable link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', s3Key);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};
