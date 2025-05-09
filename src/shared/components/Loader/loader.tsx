import { Box, CircularProgress, Typography } from "@mui/material";

interface ILoaderProps {
  message?: string;
}
const CustomLoader = ({ message = "" }: ILoaderProps) => {
  return (
    <Box
      className="flex justify-content--center align-items--center gap-2"
      flexDirection={message ? "column" : "row"}
      sx={{
        width: "calc(100vw - 270px)",
        height: "calc(100vh - 80px)",
      }}
    >
      <CircularProgress size={50} thickness={5.6} />
      {message && (
        <Typography
          sx={{
            marginTop: "10px",
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default CustomLoader;
