export interface MicrobeAnnotation {
    human_commensal: string;
    antimicrobial_susceptibility: string;
    optimal_temperature: string;
    extreme_environment: string;
    optimal_ph: string;
    animal_pathogen: string;
    spore_forming: string;
    pathogenicity: string;
    plant_pathogen: string;
    salinity_concentration_range_w_v?: string;
    biofilm_forming?: string;
    halotolerance?: string;
    low_ph?: string;
    high_ph?: string;
    drylands?: string;
    low_productivity?: string;
    gram_stain?: string;
    psychrophilic?: string;
    radiophilic?: string;
    virus_name?: string;
    virus_lineage?: string;
    kegg_genome?: string;
    kegg_disease?: string;
    disease?: string;
    host_name?: string;
    host_lineage?: string;
}
