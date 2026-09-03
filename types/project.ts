export type ProjectStatus = "devam-ediyor" | "tamamlandi";

export type PropertyType =
  | "daire"
  | "villa"
  | "mustakil-ev"
  | "ticari"
  | "arsa"
  | "ofis";

export type PriceCurrency = "TRY" | "USD" | "GBP";

export type RoomConfig =
  | "studyo"
  | "1+1"
  | "2+1"
  | "3+1"
  | "4+1"
  | "5+1"
  | "6+1-uzeri";

export type Furnishing = "esyali" | "esyasiz" | "yari-esyali";

/** "tekil" = single structure (villa/müstakil ev), "coklu" = apartman with multiple unit types. */
export type UnitMode = "tekil" | "coklu";

export interface ProjectUnit {
  id: string;
  project_id: string;
  name: string;
  room_config: RoomConfig | null;
  area_m2: number | null;
  bathroom_count: number | null;
  floor_no: string | null;
  furnishing: Furnishing | null;
  price: number | null;
  price_currency: PriceCurrency | null;
  cover_image: string | null;
  gallery_images: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  status: ProjectStatus;
  cover_image: string | null;
  gallery_images: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;

  unit_mode: UnitMode;
  site_name: string | null;

  property_type: PropertyType | null;
  price: number | null;
  price_currency: PriceCurrency | null;
  area_m2: number | null;
  room_config: RoomConfig | null;
  bathroom_count: number | null;
  building_age: number | null;
  floor_count: number | null;
  floor_no: string | null;
  furnishing: Furnishing | null;
  has_parking: boolean;
  has_pool: boolean;
  has_balcony: boolean;
  mortgage_eligible: boolean;
  swap_eligible: boolean;

  /** Populated via join; only present/non-empty when unit_mode is "coklu". */
  project_units?: ProjectUnit[];
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  daire: "Daire",
  villa: "Villa",
  "mustakil-ev": "Müstakil Ev",
  ticari: "Ticari",
  arsa: "Arsa",
  ofis: "Ofis",
};

export const ROOM_CONFIG_LABELS: Record<RoomConfig, string> = {
  studyo: "Stüdyo",
  "1+1": "1+1",
  "2+1": "2+1",
  "3+1": "3+1",
  "4+1": "4+1",
  "5+1": "5+1",
  "6+1-uzeri": "6+1 ve üzeri",
};

export const FURNISHING_LABELS: Record<Furnishing, string> = {
  esyali: "Eşyalı",
  esyasiz: "Eşyasız",
  "yari-esyali": "Yarı Eşyalı",
};

export const PRICE_CURRENCY_SYMBOLS: Record<PriceCurrency, string> = {
  TRY: "₺",
  USD: "$",
  GBP: "£",
};

/** Housing-specific detail fields are only relevant for these property types. */
export const HOUSING_PROPERTY_TYPES: PropertyType[] = [
  "daire",
  "villa",
  "mustakil-ev",
];

export const UNIT_MODE_LABELS: Record<UnitMode, string> = {
  tekil: "Tekil Yapı (Villa / Müstakil Ev)",
  coklu: "Apartman (Birden Fazla Daire Tipi)",
};
