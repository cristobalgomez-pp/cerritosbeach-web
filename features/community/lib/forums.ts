import {
  IconBriefcase,
  IconSearch,
  IconCalendarEvent,
  IconAlertTriangle,
  type Icon,
} from "@tabler/icons-react";

export type ForumKey =
  | "trabajos"
  | "objetos-perdidos"
  | "eventos"
  | "reportes";

export interface ForumDefinition {
  key: ForumKey;
  slug: string;
  icon: Icon;
}

export const FORUMS: readonly ForumDefinition[] = [
  { key: "trabajos", slug: "trabajos", icon: IconBriefcase },
  { key: "objetos-perdidos", slug: "objetos-perdidos", icon: IconSearch },
  { key: "eventos", slug: "eventos", icon: IconCalendarEvent },
  { key: "reportes", slug: "reportes", icon: IconAlertTriangle },
] as const;
