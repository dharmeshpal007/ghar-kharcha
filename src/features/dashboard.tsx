import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import useGetUserDetails from "../services/get/useGetUserDetails";
import ErrorPage from "./ErrorPage";
import CustomLoader from "../shared/components/Loader/loader";

interface IAddressInfo {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  postalCode: string;
}
const Dashboard = () => {
  const { data, isLoading, error } = useGetUserDetails();

  const generateAddress = (data: IAddressInfo) => {
    return `${data.address}, ${data.city}, ${data.state}, ${data.stateCode}, ${data.country}, ${data.postalCode}`;
  };

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (isLoading) {
    return <CustomLoader message={"Loading....."} />;
  }

  if (!data) return null;

  return (
    <Box py={5}>
      <Typography variant="h3">Welcome, {data.fullName}</Typography>
      <Card sx={{ maxWidth: 345, marginTop: "15px" }}>
        <CardMedia component="img" alt="green iguana" height="140" image={data.image} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {generateAddress(data.address)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
