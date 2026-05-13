import { createContext, useContext, useState, useEffect } from "react";

interface CityContextValue {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const CityContext = createContext<CityContextValue>({
  selectedCity: "",
  setSelectedCity: () => {},
});

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    try {
      return localStorage.getItem("liferoute_city") || "";
    } catch {
      return "";
    }
  });

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem("liferoute_city", city);
    } catch {
      // ignore
    }
  };

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
