// resources/js/components/charts/BarChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    data: unknown;
    labels: string[];
    datasets: {  // Requires datasets array
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  color?: string;
  label?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, color = "#10b981", label = "Revenue ($)" }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: label,
        data: data.data,
        backgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};