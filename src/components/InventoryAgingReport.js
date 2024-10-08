import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

const InventoryAgingReport = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

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
    reader.readAsArrayBuffer(file);
  };

  const calculateAgingData = (categoryOrProduct) => {
    const agingCategories = { '0-30 Days': 0, '31-60 Days': 0, '61-90 Days': 0, '91-120 Days': 0, 'Others': 0 };

    data
      .filter((item) => item.CategoryName === categoryOrProduct || item.ProductName === categoryOrProduct)
      .forEach((item) => {
        const orderDate = new Date(item.OrderDate);
        const today = new Date();
        const diffDays = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24)); // Difference in days

        if (diffDays <= 30) {
          agingCategories['0-30 Days'] += item.AvaliableQuantity;
        } else if (diffDays <= 60) {
          agingCategories['31-60 Days'] += item.AvaliableQuantity;
        } else if (diffDays <= 90) {
          agingCategories['61-90 Days'] += item.AvaliableQuantity;
        } else if (diffDays <= 120) {
          agingCategories['91-120 Days'] += item.AvaliableQuantity;
        } else {
          agingCategories['Others'] += item.AvaliableQuantity;
        }
      });

    return agingCategories;
  };


  const generateGraphData = (categoryOrProduct) => {
    const agingData = calculateAgingData(categoryOrProduct);

    return {
      labels: Object.keys(agingData),
      datasets: [
        {
          label: 'Stock Quantity',
          data: Object.values(agingData),
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };


  const categories = useMemo(() => [...new Set(data.map((item) => item.CategoryName))], [data]);
  const products = useMemo(() => [...new Set(data.map((item) => item.ProductName))], [data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Aging Report</h1>

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

      <div className="mb-4">
        <label htmlFor="product" className="block text-sm font-medium text-gray-700">
          Select Product:
        </label>
        <select
          id="product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Products</option>
          {products.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Stock by Aging Category for "{selectedCategory}"</h2>
          <Bar data={generateGraphData(selectedCategory)} />
        </div>
      )}

      {selectedProduct && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Stock by Aging Category for "{selectedProduct}"</h2>
          <Bar data={generateGraphData(selectedProduct)} />
        </div>
      )}
    </div>
  );
};

export default InventoryAgingReport;