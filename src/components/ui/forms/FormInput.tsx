import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Button } from "../button";
import { cn } from "@/lib/utils";
type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  description?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  visibleToggle?: boolean;
};

export function FormInput<T extends FieldValues>({
  name,
  label,
  control,
  type = "text",
  placeholder,
  description,
  containerProps = {},
  visibleToggle = false,
}: Props<T>) {
  const [visible, setVisible] = useState(type !== "password");
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { className, ...rest } = containerProps;
        return (
          <FormItem className={cn("col-span-12", className)} {...rest}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id={name}
                  type={
                    visible ? (type === "password" ? "text" : type) : "password"
                  }
                  placeholder={placeholder}
                  {...field}
                />
                {type === "password" && visibleToggle && (
                  <Button
                    variant="ghost"
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
