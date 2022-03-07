export interface allTarrifs {
  id: number;
  tarrif_code: string;
  description: string | null;
  material: string | null;
}

export interface tarrif {
  id?: number;
  tarrif_code: string;
  description: string | null;
  material: string | null;
}
export interface contextLink {
  value: string;
  label: string;
}

export interface tarrifRecord {
  id: number;
}

