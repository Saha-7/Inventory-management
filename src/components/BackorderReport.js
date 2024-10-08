import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
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

const BackorderReport =()=>{
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const chartRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };


const calculateBackorders = () => {
    return data
      .filter((item) => !selectedCategory || item.CategoryName === selectedCategory)
      .map((item) => {
        const backorderQuantity =
          item.OrderItemQuantity > item.AvaliableQuantity
            ? item.OrderItemQuantity - item.AvaliableQuantity
            : 0;
        return {
          ...item,
          backorderQuantity,
        };
      })
      .filter((item) => item.backorderQuantity > 0);
  };


  const categories = useMemo(() => [...new Set(data.map((item) => item.CategoryName))], [data]);

  const backorderData = calculateBackorders();


  const generateGraphData = () => {
    return {
      labels: backorderData.map((item) => item.ProductName),
      datasets: [
        {
          label: 'Backorder Quantity',
          data: backorderData.map((item) => item.backorderQuantity),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };


  useEffect(() => {
    const currentChartRef = chartRef.current;
    return () => {
      if (currentChartRef) {
        currentChartRef.destroy();
      }
    };
  }, [data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Backorder Report</h1>


      <input type="file" onChange={handleFileUpload} className="block mb-4" />


      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Select Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {backorderData.length === 0 ? (
        <p>No backorders available.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ordered Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Backorder Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {backorderData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ProductName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.OrderItemQuantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.AvaliableQuantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.backorderQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {backorderData.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Backorder Quantities</h2>
          <Bar ref={chartRef} data={generateGraphData()} />
        </div>
      )}
    </div>
  );
};

export default BackorderReport;