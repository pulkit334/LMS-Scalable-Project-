import { Bar } from "react-chartjs-2";

const EnrollmentBarChart = ({
  labels = [],
  values = [],
  height = 240,
  title = "Enrollments",
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: "rgba(99, 102, 241, 0.72)",
        hoverBackgroundColor: "rgba(129, 140, 248, 0.95)",
        borderColor: "rgba(129, 140, 248, 0.9)",
        borderWidth: 1,
        barPercentage: 0.55,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: "easeOutQuart",
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0d1017",
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { display: false },
        border: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", font: { size: 11 }, precision: 0 },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { color: "rgba(255,255,255,0.08)" },
      },
    },
  };

  return (
    <div className="w-full" style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default EnrollmentBarChart;
