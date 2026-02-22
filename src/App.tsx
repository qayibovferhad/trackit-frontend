import { BrowserRouter } from "react-router-dom";
import RouteConfig from "./routes/RoutesConfig";
import { useEffect, useState } from "react";
import { useUserStore } from "./stores/userStore";
import { SocketProvider } from "./providers/SocketProvider";
import Spinner from "./shared/components/Spinner";
import NetworkStatus from "./shared/components/NetworkStatus";
import NavigationProgress from "./shared/components/NavigationProgress";

function App() {
  const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) {
      if (!useUserStore.getState().user) {
        useUserStore.getState().fetchUser();
      }
      return;
    }

    const unsub = useUserStore.persist.onFinishHydration((state) => {
      if (!state?.user) {
        useUserStore.getState().fetchUser();
      }
      setHydrated(true);
    });

    return unsub;
  }, []);

  if (!hydrated) return <Spinner />;

  return (
    <SocketProvider>
      <NetworkStatus />
      <BrowserRouter>
        <NavigationProgress />
        <RouteConfig />
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
