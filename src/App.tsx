import React, { Suspense } from "react";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";

const Landing = React.lazy(() => import("./pages/Landing"));

function App() {
  useSafariMobileFix();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <Landing />
    </Suspense>
  );
}

export default App;