import { useEffect } from "react";
import { useGeoLocation } from "@bigdatacloudapi/react-reverse-geocode-client";
import { US_STATES } from "@/constants";
import { useGeoStore } from "@/stores/geo.store";

interface GeoStateResult {
  stateCode: string | null;
  stateName: string | null;
  isLoading: boolean;
}

export function useGeoState(): GeoStateResult {
  const {
    detectedStateCode,
    detectedStateName,
    isLoading,
    isDetected,
    setDetected,
    setLoading,
  } = useGeoStore();

  const { data, loading, error } = useGeoLocation();

  useEffect(() => {
    if (isDetected) return;

    if (loading) {
      setLoading(true);
      return;
    }

    if (data) {
      const rawName = data.principalSubdivision || null;

      // Try principalSubdivisionCode first (e.g. "US-NY") — most reliable
      const subCode = data.principalSubdivisionCode;
      if (subCode) {
        const code = subCode.split("-")[1];
        const match = US_STATES.find((s) => s.code === code);
        if (match) {
          setDetected(match.code, rawName);
          return;
        }
      }

      // Fallback to name matching
      if (rawName) {
        const match = US_STATES.find(
          (s) => s.name.toLowerCase() === rawName.toLowerCase(),
        );
        setDetected(match?.code ?? null, rawName);
        return;
      }

      setDetected(null, null);
      return;
    }

    if (error || (!loading && !data)) {
      setDetected(null, null);
    }
  }, [data, loading, error, isDetected, setDetected, setLoading]);

  return {
    stateCode: detectedStateCode,
    stateName: detectedStateName,
    isLoading,
  };
}
