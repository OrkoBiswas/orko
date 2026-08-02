"use client";

import { Download } from "lucide-react";

export function ResumeActions() {
  return <button className="button button-light" type="button" onClick={() => window.print()}>Save as PDF / print <Download aria-hidden="true" /></button>;
}
