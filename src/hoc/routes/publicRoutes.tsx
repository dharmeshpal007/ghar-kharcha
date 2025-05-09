import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import CustomLoader from "../../shared/components/Loader/loader";
import { ROUTE } from "../../shared/constants/constants";

const LoginPage = lazy(() => import("../../features/login"));

const PublicRoutes = () => {
  return (
    <Suspense fallback={<CustomLoader />}>
      <Routes>
        <Route path={ROUTE.LOGIN} element={<LoginPage />} />
        <Route path="*" element={<Navigate replace to={ROUTE.LOGIN} />} />
      </Routes>
    </Suspense>
  );
};

export default PublicRoutes;
