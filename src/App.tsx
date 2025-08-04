import { BrowserRouter, Routes, Route } from "react-router-dom";
import { allRoutes } from "./routes";
import type { RouteConfig } from "./routes/types";
import PrivateRoute from "./components/PrivateRoute";
import { Suspense } from "react";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <Routes>
          {allRoutes.map(
            ({ path, element: Component, isPrivate }: RouteConfig) => (
              <Route
                key={path}
                path={path}
                element={
                  isPrivate ? (
                    <PrivateRoute>
                      <Component />
                    </PrivateRoute>
                  ) : (
                    <Component />
                  )
                }
              />
            )
          )}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
