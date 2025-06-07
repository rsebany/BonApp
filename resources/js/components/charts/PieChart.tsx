// resources/js/components/charts/PieChart.tsx
import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  colors?: string[];
}

export const PieChart: React.FC<PieChartProps> = ({ data, colors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"] }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: colors,
        borderWidth: 1,
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

  return <Pie data={chartData} options={options} />;
};