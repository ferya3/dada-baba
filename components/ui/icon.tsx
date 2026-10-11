import {
  Building2,
  ChartLine,
  Compass,
  Cpu,
  Factory,
  Handshake,
  Layers,
  Leaf,
  Lightbulb,
  Network,
  ShieldCheck,
  Ship,
  Target,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { IconKey } from "@/lib/content/types";

const icons = {
  building: Building2,
  zap: Zap,
  cpu: Cpu,
  ship: Ship,
  chart: ChartLine,
  factory: Factory,
  network: Network,
  leaf: Leaf,
  shield: ShieldCheck,
  lightbulb: Lightbulb,
  handshake: Handshake,
  target: Target,
  compass: Compass,
  layers: Layers,
} satisfies Record<IconKey, React.ComponentType<LucideProps>>;

/** Renders a content icon key (as stored in the CMS) as a Lucide icon. */
export function Icon({ name, ...props }: { name: IconKey } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden {...props} />;
}
