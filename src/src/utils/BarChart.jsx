import { Bar } from "react-chartjs-2";
const generateSoftBlueColors = (count) => {
  return Array.from({ length: count }, () => {
    const lightness = Math.floor(Math.random() * 20) + 55; // 55–75
    return `hsl(217, 91%, ${lightness}%)`; // blue hue
  });
};

const EnrollmentBarChart = ({
  labels = [],
  values = [],
  height = 260,
  title = "Enrollments",
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,

        // visual styling
        backgroundColor: generateSoftBlueColors (values.length),
        hoverBackgroundColor: "rgba(96,165,250,1)",
        borderColor: "rgba(147,197,253,1)",
        borderWidth: 1,

        barThickness: 28,
        maxBarThickness: 40,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#020617",
        titleColor: "#e5e7eb",
        bodyColor: "#e5e7eb",
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
          font: { size: 12, weight: "500" },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div
      className="w-full rounded-xl bg-[#0f172a] border border-white/10 p-4"
      style={{ height }}
    >
      <Bar data={data} options={options} />
    </div>
  );
};

export default EnrollmentBarChart;
