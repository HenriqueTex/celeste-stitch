import { Loader2Icon } from "lucide-react";
import { Button } from "../button";

export function LoaderButton() {
  return (
    <Button size="sm" disabled>
      <Loader2Icon className="animate-spin" />
      Carregando
    </Button>
  );
}
