import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTable } from 'react-table';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SummaryPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null); 

  const handleFileUpload = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    if (file && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/vnd.ms-excel') {
      alert('Please upload a valid Excel file.');
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Failed to process the file.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const graphData = {
    labels: ['Shipped', 'Received'],
    datasets: [
      {
        label: 'Quantity',
        data: [
          data.reduce((acc, row) => acc + (row.OrderItemQuantity || 0), 0),
          data.reduce((acc, row) => acc + (row.AvaliableQuantity || 0), 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

 
  useEffect(() => {
    const currentChartRef = chartRef.current; 
    return () => {
      if (currentChartRef) {
        currentChartRef.destroy(); 
      }
    };
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Category',
        accessor: 'CategoryName',
      },
      {
        Header: 'Total Order Qty',
        accessor: 'OrderItemQuantity',
      },
      {
        Header: 'Total Available Qty',
        accessor: 'AvaliableQuantity',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Summary Report</h1>

      <input
        type="file"
        onChange={handleFileUpload}
        className="block mb-4"
      />

      {loading && <p>Loading...</p>}

     
      {data.length > 0 && (
        <Bar ref={chartRef} data={graphData} />
      )}

     
      {data.length === 0 ? (
        <p>No data available. Please upload a file.</p>
      ) : (
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SummaryPage;