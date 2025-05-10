import { lazy } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { Box, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { ROUTE } from "../../shared/constants/constants";
import { useAuthStore } from "../../store/authStore";
import CustomButton from "../../shared/components/Button/customButton";
import logo from "../../assets/logo.png";

const Dashboard = lazy(() => import("../../features/dashboard"));
const ProductListPage = lazy(() => import("../../features/productsList"));
const PostIdPage = lazy(() => import("../../features/postIdPage"));

const Header = () => {
  const { logout } = useAuthStore();
  
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img src={logo} alt="Logo" style={{ height: 40, width: 40, marginRight: 12 }} />
        <Typography variant="h6" fontWeight="bold">Bachat Bandhu</Typography>
      </Box>
      <CustomButton
        variant="outlined"
        onClick={logout}
        startIcon={<Logout />}
      />
    </Box>
  );
};

const ProtectedRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate(ROUTE.AUTH);
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <Box sx={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<h1>About us</h1>} />
          <Route path="/contact" element={<h1>Contact</h1>} />
          <Route path="/product" element={<ProductListPage />} />
          <Route path="/product/:id" element={<PostIdPage />} />
          <Route path="*" element={<Navigate replace to={ROUTE.DASHBOARD} />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ProtectedRoutes;
