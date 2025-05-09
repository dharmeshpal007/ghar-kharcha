import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { FC } from "react";
import { BrowserRouter } from "react-router";
import App from "./App";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const Root: FC = () => {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <ReactQueryDevtools initialIsOpen={false} />
            <App />
          </SnackbarProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
};

export default Root;
