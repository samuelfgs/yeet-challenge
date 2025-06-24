import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routers } from "./routes";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <RouterProvider router={routers} />
      </Layout>
    </QueryClientProvider>
  );
};

export default App;
