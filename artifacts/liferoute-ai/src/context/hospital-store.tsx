import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Hospital } from "@workspace/api-client-react";

const STORAGE_KEY = "liferoute_hospitals";

async function fetchDefaultHospitals(): Promise<Hospital[]> {
  const res = await fetch("/api/hospitals");
  if (!res.ok) throw new Error("Failed to fetch hospitals");
  return res.json();
}

function loadFromStorage(): Hospital[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function saveToStorage(hospitals: Hospital[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hospitals));
  } catch {
    // ignore storage errors
  }
}

function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface HospitalStoreValue {
  allHospitals: Hospital[];
  isLoading: boolean;
  addHospital: (data: Omit<Hospital, "id" | "lastUpdated">) => void;
  updateHospital: (id: string, data: Partial<Omit<Hospital, "id">>) => void;
  resetToDefaults: () => Promise<void>;
}

const HospitalStoreContext = createContext<HospitalStoreValue>({
  allHospitals: [],
  isLoading: true,
  addHospital: () => {},
  updateHospital: () => {},
  resetToDefaults: async () => {},
});

export function HospitalStoreProvider({ children }: { children: React.ReactNode }) {
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setAllHospitals(saved);
      setIsLoading(false);
    } else {
      fetchDefaultHospitals()
        .then((data) => {
          setAllHospitals(data);
          saveToStorage(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, []);

  const addHospital = useCallback((data: Omit<Hospital, "id" | "lastUpdated">) => {
    const newHospital: Hospital = {
      ...data,
      id: String(Date.now()),
      lastUpdated: new Date().toISOString(),
    };
    setAllHospitals((prev) => {
      const updated = [...prev, newHospital];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateHospital = useCallback((id: string, data: Partial<Omit<Hospital, "id">>) => {
    setAllHospitals((prev) => {
      const updated = prev.map((h) =>
        h.id === id
          ? { ...h, ...data, id: h.id, lastUpdated: new Date().toISOString() }
          : h
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(async () => {
    clearStorage();
    setIsLoading(true);
    try {
      const data = await fetchDefaultHospitals();
      setAllHospitals(data);
      saveToStorage(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <HospitalStoreContext.Provider
      value={{ allHospitals, isLoading, addHospital, updateHospital, resetToDefaults }}
    >
      {children}
    </HospitalStoreContext.Provider>
  );
}

export function useHospitalStore() {
  return useContext(HospitalStoreContext);
}
