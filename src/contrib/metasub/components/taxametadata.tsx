import * as React from 'react';
import { usePangeaAxios } from '../../services/api';

function BinaryAnnotation(props){
  var displayVals = (
    <span className="taxa-legend-key" style="background-color: #b39a7f; highlighted">{props.keys[0]}</span>
    <span className="taxa-legend-key" style="background-color: #7fb399;">{props.keys[1]}</span>
  )
  if(props.value == 1){
    displayVals = (
      <span className="taxa-legend-key" style="background-color: #b39a7f;">{props.keys[0]}</span>
      <span className="taxa-legend-key" style="background-color: #7fb399; highlighted">{props.keys[1]}</span>
    )
  }
  return (
    <td class="td_meta_key">{props.name}</td><td class="td_meta_val">
      {displayVals}
    </td>
  )
}

function TernaryAnnotation(props){
  var displayVals = (
    <span className="taxa-legend-key" style="background-color: #d9ef8b;color:black; highlighted">{props.keys[0]}</span>
    <span className="taxa-legend-key" style="background-color: #fee08b;color:black;">{props.keys[1]}</span>
    <span className="taxa-legend-key" style="background-color: #f46d43;color:black;">{props.keys[2]}</span>
  )
  if(props.value == 1){
    displayVals = (
      <span className="taxa-legend-key" style="background-color: #d9ef8b;color:black;">{props.keys[0]}</span>
      <span className="taxa-legend-key" style="background-color: #fee08b;color:black; highlighted">{props.keys[1]}</span>
      <span className="taxa-legend-key" style="background-color: #f46d43;color:black;">{props.keys[2]}</span>
    )
  }
  if(props.value == 2){
    displayVals = (
      <span className="taxa-legend-key" style="background-color: #d9ef8b;color:black;">{props.keys[0]}</span>
      <span className="taxa-legend-key" style="background-color: #fee08b;color:black;">{props.keys[1]}</span>
      <span className="taxa-legend-key" style="background-color: #f46d43;color:black; highlighted">{props.keys[2]}</span>
    )
  }
  return (
    <td class="td_meta_key">{props.name}</td><td colspan="3">
      {displayVals}
    </td>
  )
}


interface TaxaMetadataPanelProps {
  taxonName: str;
  taxonAbundance: float;
}


const TaxaMetadataPanel: React.FC = (props: TaxaMetadataPanelProps) => {

  const [{ data, loading, error }, execute] = usePangeaAxios<{
    task_hash: string;
  }>({ url: '/contrib/treeoflife/annotation/' + props.taxonName, method: 'GET' }, { manual: true });

  return (
    <div class="col-lg-3 card_scroll" style="height:100%;">
      <div class="row h-100">
        <div class="card card-chart">
          <div class="card-header">
            <h5 class="card-category">Taxa Metadata{' '}{props.taxonName}</h5>
          </div>
          <div class="card-body" style="padding-top:1px;">
            <div class="" id="taxaMetadata">
              <h5 id="sunburst_taxon_name_header" style="padding-left:10px; margin-bottom:1px;">&nbsp;</h5>
              <div class="table-responsive ps" id="sunburst_taxa_metadata_div" style="display:block;">
                <table class="table" id="sunburst_taxa_metadata_table" style="font-size:x-small; width:100%;">
                  <tbody>
                    <tr class="sunburts_abundance_row"></tr>
                    <tr id="sunburst_taxon_gram_row" class="sunburts_taxon_row">
                      <td class="td_meta_key">Abundance{': '}{100 * props.taxonAbundance}</td>
                      <BinaryAnnotation name="Gram-stain" keys="-+" value={data['gram_stain']} />
                    </tr>
                    <tr id="sunburst_taxon_biofilm_row" class="sunburts_taxon_row">
                      <BinaryAnnotation name="Biofilm forming" keys="NY" value={data['biofilm_forming']} />
                      <BinaryAnnotation name="Spore forming" keys="NY" value={data['spore_forming']} />
                    </tr>
                    <tr id="sunburst_taxon_extremophile_row" class="sunburts_taxon_row">
                      <BinaryAnnotation name="Extremophile" keys="NY" value={data['extreme_environment']} />
                      <BinaryAnnotation name="Anti-microbial susceptible" keys="NY" value={data['antimicrobial_susceptibility']} />
                    </tr>
                    <tr id="sunburst_taxon_animal_pathogen_row" class="sunburts_taxon_row">
                      <BinaryAnnotation name="Animal pathogen" keys="NY" value={data['animal_pathogen']} />
                      <BinaryAnnotation name="Plant pathogen" keys="NY" value={data['plant_pathogen']} />
                    </tr>
                    <tr id="sunburst_taxon_pathogenicity_row" class="sunburts_taxon_row">
                      <TernaryAnnotation name="Pathogenicity" keys="123" value={data['pathogenicity']} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default TaxaMetadataPanel;
