// components/TopCoursesProgress.jsx
import { Box, LinearProgress, Typography } from "@mui/material";

const COLORS = ["#3b82f6", "#34d399", "#fbbf24", "#f87171"];

export default function TopCoursesProgress({ data = [] }) {
  if (!data.length) return null;
console.log("the data for the progress bar woulld be ",data)
  const max = Math.max(
    ...data.map((item) => item.totalEnrollments),
    1
  );
  if (!max) return null;
  return (
    <Box>
        
      {data.map((item, index) => {
        const percent = (item.totalEnrollments / max) * 100;

        return (
          <Box key={item.categoryId} sx={{ mb: 2 }}>
            {/* Label Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="body2">
                {item.categoryName}
              </Typography>
              <Typography variant="body2">
                {item.totalEnrollments}
              </Typography>
            </Box>

            {/* Progress */}
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "#1f2937",
                  transition: "width 0.8s ease-in-out",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  backgroundColor: COLORS[index % COLORS.length],
                },
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
