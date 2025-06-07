import React from 'react';

function DataTable({ data }) {
  if (!data || data.length === 0) return <p className="text-gray-500">No data to display.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto mt-4">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h) => (
              <th key={h} className="border border-gray-300 px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              {headers.map((h) => (
                <td key={h} className="border border-gray-300 px-4 py-2">
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
