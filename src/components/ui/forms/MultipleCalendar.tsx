import React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../calendar";
import { ptBR } from "date-fns/locale";

type selectedDayFormatType = "ppp" | "dd/MM/yyyy";
type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  descriptions?: string;
  col?: number;
  selectedDayFormat: selectedDayFormatType;
  numberOfMonths?: number;
};

export default function MultipleCalendar<T extends FieldValues>({
  control,
  label,
  name,
  descriptions,
  numberOfMonths = 2,
  col = 12,
  selectedDayFormat,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`col-span-${col}`}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, selectedDayFormat, {
                          locale: ptBR,
                        })}
                        -{" "}
                        {format(field.value.to, selectedDayFormat, {
                          locale: ptBR,
                        })}
                      </>
                    ) : (
                      format(field.value.from, selectedDayFormat, {
                        locale: ptBR,
                      })
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={field.value?.from}
                selected={field.value}
                onSelect={field.onChange}
                numberOfMonths={numberOfMonths}
                locale={ptBR}
                captionLayout="dropdown"
                formatters={{
                  formatMonthDropdown: (month) =>
                    format(month, "LLLL", { locale: ptBR }),
                }}
              />
            </PopoverContent>
          </Popover>
          {descriptions && <FormDescription>{descriptions}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
