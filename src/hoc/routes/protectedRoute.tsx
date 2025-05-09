import { lazy } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { ROUTE } from "../../shared/constants/constants";
import useBoilerPlateStore from "../../store/store";

const Dashboard = lazy(() => import("../../features/dashboard"));
const ProductListPage = lazy(() => import("../../features/productsList"));

const PostIdPage = lazy(() => import("../../features/postIdPage"));

const ProtectedRoutes = () => {
  const isLoggedIn = useBoilerPlateStore((state) => state.loggedIn);
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<h1>About us</h1>} />
      <Route path="/contact" element={<h1>Contact</h1>} />
      <Route path="/product" element={<ProductListPage />} />
      <Route path="/product/:id" element={<PostIdPage />} />
      <Route path="*" element={<Navigate replace to={ROUTE.DASHBOARD} />} />
    </Routes>
  );
};

export default ProtectedRoutes;
