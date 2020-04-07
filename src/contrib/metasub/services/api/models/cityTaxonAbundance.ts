export interface CityTaxonAbundance {
    mean_relative_abundance: number;
    max_relative_abundance: number;
    all_relative_abundances: [number];
    latitude: number;
    longitude: number;
    city_name: string;
}

export interface CitiesTaxonResult {
    [key: string]: {  // Taxon Name
        [key: string]: CityTaxonAbundance  // City Name
    }
}