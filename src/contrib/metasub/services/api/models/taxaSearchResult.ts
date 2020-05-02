export interface OneTaxonResult {
  relative_abundance: number;
  sample_uuid: string;
  sample_name: string;
  sample_library_uuid: string;
  sample_metadata: {
    city_latitude: number;
    city_longitude: number;
  };
}

export interface TaxaSearchResults {
  results: { [key: string]: OneTaxonResult[] };
}
