"use client";

import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { format } from "date-fns";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (field: string, value: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    onChange("date", { ...value, startDate: newStart });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    onChange("date", { ...value, endDate: newEnd });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Label className="w-24 text-sm">Início:</Label>
        <Input
          type="datetime-local"
          value={format(value.startDate, "yyyy-MM-dd'T'HH:mm")}
          onChange={handleStartChange}
        />
      </div>
      <div className="flex gap-2 items-center">
        <Label className="w-24 text-sm">Fim:</Label>
        <Input
          type="datetime-local"
          value={format(value.endDate, "yyyy-MM-dd'T'HH:mm")}
          onChange={handleEndChange}
        />
      </div>
    </div>
  );
}
