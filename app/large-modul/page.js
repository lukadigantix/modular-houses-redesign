import { notFound } from "next/navigation";
import { getModel } from "@/lib/models";
import Configurator from "@/components/Configurator";

const SLUG = "large-modul";

export function generateMetadata() {
  const model = getModel(SLUG);
  return {
    title: model ? `${model.name} - Konfigurator` : "Konfigurator",
  };
}

export default function LargeModulPage() {
  const model = getModel(SLUG);
  if (!model) notFound();
  return <Configurator model={model} />;
}
