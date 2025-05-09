import { Suspense } from "react";
import useBoilerPlateStore from "../../store/store";
import Layout from "../layout";
import ProtectedRoutes from "./protectedRoute";
import PublicRoutes from "./publicRoutes";
import CustomLoader from "../../shared/components/Loader/loader";

const Route = () => {
  const isLoggedIn = useBoilerPlateStore((state) => state.loggedIn);

  if (isLoggedIn) {
    return (
      <Layout sideBarOpen={true}>
        <Suspense fallback={<CustomLoader />}>
          <ProtectedRoutes />
        </Suspense>
      </Layout>
    );
  }
  return <PublicRoutes />;
};

export default Route;
