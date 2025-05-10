import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { BrowserRouter } from "react-router";
import Route from "./hoc/routes/Route";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const MOBILE_WIDTH = 1024;

const App = () => {
  // Set body background for web
  useEffect(() => {
    document.body.style.background = "#b2d8c5"; // match your logo bg or use #f3f3f4
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "none", // body handles bg
      }}
    >
      <div
        style={{
          width: MOBILE_WIDTH,
          minHeight: "100vh",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <Route />
            </SnackbarProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
