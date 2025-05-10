import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import CustomLoader from "../../shared/components/Loader/loader";
import { ROUTE } from "../../shared/constants/constants";

const AuthPage = lazy(() => import("../../features/auth"));

const PublicRoutes = () => {
  return (
    <Suspense fallback={<CustomLoader />}>
      <Routes>
        <Route path={ROUTE.AUTH} element={<AuthPage />} />
        <Route path="*" element={<Navigate replace to={ROUTE.AUTH} />} />
      </Routes>
    </Suspense>
  );
};

export default PublicRoutes;
