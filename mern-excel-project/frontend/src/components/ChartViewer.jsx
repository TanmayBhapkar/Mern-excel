import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function ChartViewer({ data, xKey, yKey }) {
  const chartRef = useRef();
  const [chartType, setChartType] = useState("line"); // default chart type
  const [title, setTitle] = useState("My Chart"); // default title

  if (!data?.length) return <div>No data</div>;
  if (!xKey || !yKey) return <div>Select X and Y</div>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE", "#FF4567"];

  const handleDownloadPDF = async () => {
    const element = chartRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const imgWidth = 280;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("chart.pdf");
  };

  return (
    <div className="p-4">
      {/* Chart Title Input */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chart Title"
          className="border border-gray-300 rounded px-2 py-1 mb-2 sm:mb-0"
        />
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {/* Chart */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div ref={chartRef} style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yKey} dot={false} stroke="#8884d8" />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#8884d8" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data.slice(0, 10)} // only first 10 entries
                dataKey={yKey}
                nameKey={xKey}
                label
                outerRadius={120}
              >
                {data.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Download as PDF
      </button>
    </div>
  );
}
