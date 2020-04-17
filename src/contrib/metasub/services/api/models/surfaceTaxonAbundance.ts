export interface SurfaceTaxonAbundance {
  mean_relative_abundance: number;
  max_relative_abundance: number;
  all_relative_abundances: [number];
  material_name: string;
}

export interface SurfacesTaxonResult {
  [key: string]: {
    // Taxon Name
    [key: string]: SurfaceTaxonAbundance; // City Name
  };
}
