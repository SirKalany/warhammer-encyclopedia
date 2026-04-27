"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { GameVersionDTO } from "./types";

interface VersionContextType {
  versionId: number;
  version: GameVersionDTO | null;
  setVersion: (version: GameVersionDTO) => void;
}

const VersionContext = createContext<VersionContextType>({
  versionId: 1,
  version: null,
  setVersion: () => {},
});

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<GameVersionDTO | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedVersion");
    if (stored) {
      try {
        setVersionState(JSON.parse(stored));
      } catch {
        localStorage.removeItem("selectedVersion");
      }
    }
  }, []);

  const setVersion = (v: GameVersionDTO) => {
    setVersionState(v);
    localStorage.setItem("selectedVersion", JSON.stringify(v));
  };

  return (
    <VersionContext.Provider
      value={{
        versionId: version?.id ?? 1,
        version,
        setVersion,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  return useContext(VersionContext);
}
