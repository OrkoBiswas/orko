"use client";

import { Gauge, Move } from "lucide-react";
import { useEffect, useState } from "react";

export function SettingsDock() {
  const [lowData, setLowData] = useState(false);
  const [lowMotion, setLowMotion] = useState(false);

  useEffect(() => {
    const data = window.localStorage.getItem("ob-low-data") === "true";
    const motion = window.localStorage.getItem("ob-low-motion") === "true";
    document.documentElement.dataset.data = data ? "low" : "full";
    document.documentElement.dataset.motion = motion ? "reduced" : "full";
    const frame = window.requestAnimationFrame(() => {
      setLowData(data);
      setLowMotion(motion);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleData() {
    const next = !lowData;
    setLowData(next);
    window.localStorage.setItem("ob-low-data", String(next));
    document.documentElement.dataset.data = next ? "low" : "full";
  }

  function toggleMotion() {
    const next = !lowMotion;
    setLowMotion(next);
    window.localStorage.setItem("ob-low-motion", String(next));
    document.documentElement.dataset.motion = next ? "reduced" : "full";
  }

  return (
    <div className="settings-dock" aria-label="Experience settings">
      <button type="button" onClick={toggleMotion} aria-pressed={lowMotion} title="Toggle reduced motion"><Move aria-hidden="true" /> <span>{lowMotion ? "Motion off" : "Motion on"}</span></button>
      <button type="button" onClick={toggleData} aria-pressed={lowData} title="Toggle low-data mode"><Gauge aria-hidden="true" /> <span>{lowData ? "Low data" : "Full media"}</span></button>
    </div>
  );
}
