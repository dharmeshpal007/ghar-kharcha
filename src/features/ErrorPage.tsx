import { Box } from "@mui/material";
import CustomButton from "../shared/components/Button/customButton";
import { useNavigate } from "react-router";
import useBoilerPlateStore from "../store/store";

interface IProps {
  error: { message: string };
}

const ErrorPage = ({ error }: IProps) => {
  const navigate = useNavigate();
  const { setLoggedIn, setUserData } = useBoilerPlateStore((state) => state);

  const errorsState = JSON.parse(error.message);
  let errorChildren = <></>;

  if (errorsState.status === 401) {
    errorChildren = (
      <Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          Your authentication could not be completed. Please check your credentials
          <CustomButton
            variant="contained"
            onClick={() => {
              localStorage.clear();
              setLoggedIn(false);
              setUserData({});
              navigate("/login");
            }}
            text="Go to Login"
          />
        </Box>
      </Box>
    );
  } else if (errorsState.status === 403) {
    errorChildren = <Box>Forbidden</Box>;
  } else if (errorsState.status === 404) {
    errorChildren = <Box>Not Found</Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 80px)",
        backgroundColor: "transparent",
        color: "#333",
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {errorChildren}
    </Box>
  );
};

export default ErrorPage;
