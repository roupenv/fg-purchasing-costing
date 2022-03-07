export interface allVendors {
  name: string;
  id: number;
  type: string | null;
}

export interface vendor {
  id?: number;
  name: string;
  type: string | null;
}

export interface contextLink {
  value: string;
  label: string;
}

export interface vendorRecord {
  id: number;
}