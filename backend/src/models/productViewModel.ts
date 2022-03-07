export interface allProducts {
  id: number;
  product_name: string;
  bottom: string | null;
  collection: string | null;
  season: string | null;
  tarrif_code: string | undefined | null;
}
export interface product {
  id?: number | undefined;
  product_name: string | undefined;
  bottom: string | null | undefined;
  collection: string | null | undefined;
  season: string | null | undefined;
  tarrif_code: string | null;
}

export interface productRecord {
  id: number;
}

export interface contextLink {
  value: string;
  label: string;
}
