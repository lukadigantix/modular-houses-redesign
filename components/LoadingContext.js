"use client";

import { createContext, useContext, useState, useCallback } from "react";

// Global loading state shared between the Menu (which triggers it on the
// "Modul" link) and the LoadingScreen (which renders the pill). It lives in the
// root layout so it survives client-side navigation to /large-modul.
const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const showLoader = useCallback(() => setLoading(true), []);
  const hideLoader = useCallback(() => setLoading(false), []);
  return (
    <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  // safe no-op default if used outside the provider
  return (
    useContext(LoadingContext) || {
      loading: false,
      showLoader: () => {},
      hideLoader: () => {},
    }
  );
}
