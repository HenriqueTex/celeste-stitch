import type { Control, ControllerProps, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type FormCheckboxProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  ControllerProps<TFieldValues>,
  "render"
> & {
  control: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerProps?: React.ComponentPropsWithRef<"div">;
  checkboxProps?: React.ComponentPropsWithoutRef<typeof Checkbox>;
};

export function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  containerProps,
  checkboxProps,
  ...rest
}: FormCheckboxProps<TFieldValues>) {
  const id = checkboxProps?.id ?? String(name);

  return (
    <RHFFormField
      control={control}
      name={name}
      {...rest}
      render={({ field }) => (
        <FormItem
          {...containerProps}
          className={cn(
            "flex flex-row items-center gap-2 space-y-0",
            containerProps?.className
          )}
        >
          <FormControl>
            <Checkbox
              id={id}
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              ref={field.ref}
              {...checkboxProps}
            />
          </FormControl>

          <div className="space-y-1 leading-none">
            {label && (
              <FormLabel htmlFor={id} className="text-sm font-normal">
                {label}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
