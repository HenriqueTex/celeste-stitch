import type { Control, ControllerProps, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField as FormFieldShadCn,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<
  T extends React.ElementType,
  TFieldValues extends FieldValues = FieldValues
> extends Omit<ControllerProps<TFieldValues>, "render"> {
  label?: string;
  component?: T;
  control: Control<TFieldValues>;
  description?: string;
  // Obtém as propriedades adicionais do componente "component"
  containerProps?: React.ComponentPropsWithRef<"div">;
  componentProps?: React.ComponentPropsWithRef<T>;
}
export const FormField = <
  T extends React.ElementType = typeof Input,
  TFieldValues extends FieldValues = FieldValues
>(
  props: FormFieldProps<T, TFieldValues>
) => {
  const {
    control,
    name,
    component: Component = Input,
    label,
    componentProps,
    description,
    containerProps,
    ...rest
  } = props;
  return (
    <FormFieldShadCn
      control={control}
      name={name}
      {...rest}
      render={({ field }) => (
        <FormItem {...containerProps}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Component {...field} {...componentProps} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
