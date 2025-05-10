import { Suspense } from "react";
import { useAuthStore } from "../../store/authStore";
import ProtectedRoutes from "./protectedRoute";
import PublicRoutes from "./publicRoutes";
import CustomLoader from "../../shared/components/Loader/loader";

const Route = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return (
      <Suspense fallback={<CustomLoader />}>
        <ProtectedRoutes />
      </Suspense>
    );
  }
  return <PublicRoutes />;
};

export default Route;
