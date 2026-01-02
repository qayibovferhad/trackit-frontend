import { BrowserRouter } from "react-router-dom";
import RouteConfig from "./routes/RoutesConfig";
import { Suspense, useEffect } from "react";
import { useUserStore } from "./stores/userStore";
import { SocketProvider } from "./providers/SocketProvider";

function App() {
  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration((state) => {
      if (!state?.user) {
        useUserStore.getState().fetchUser();
      }
    });
    if (useUserStore.persist.hasHydrated() && !useUserStore.getState().user) {
      useUserStore.getState().fetchUser();
    }
    return unsub;
  }, []);
  return (
    <SocketProvider>
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <RouteConfig />
      </Suspense>
    </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
