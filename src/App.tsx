import { BrowserRouter } from "react-router-dom";
import RouteConfig from "./routes/RoutesConfig";
import { Suspense } from "react";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <RouteConfig />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
