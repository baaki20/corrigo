"use client";

import { useEffect, useState } from "react";

export function LocalDate({ date }: { date: Date | string }) {
  const [value, setValue] = useState("");
  useEffect(() => setValue(new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))), [date]);
  return <span className="scheduled-date" title="Displayed in your browser's local timezone">{value || "Scheduled time"}</span>;
}
