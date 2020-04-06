import * as React from 'react';
import { usePangeaAxios } from '../../services/api';
import { SampleType } from '../../services/api/models/sample';

interface SampleMetadataPanelProps {
  sampleUUID: str;
}


const SampleMetadataPanel: React.FC = (props: SampleMetadataPanelProps) => {
  const [sampleResult] = usePangeaAxios<SampleType>(`/samples/${props.sampleUUID}`);
  const data = sampleResult.metadata;
  return (
    <div class="row perfect-scrollbar-on ps" style="">
      <div class="col-lg-12 col-md-12">
        <div class="" id="taxaMetadata">
          <div class="card card-chart">
            <div class="card-header">
              <h5 class="card-category">Sample View</h5>
            </div>
            <div class="card-body" style="height:50%; padding-top:1px;">
              <div id="city_metadata" class="card-body" style="padding-top:1px;">
                <h4 id="city_name_header" style="padding-bottom:1px;">Hover or click on a sample</h4>
                <div class="table-responsive ps" id="city_metadata_div" style="display:block;">
                  <table class="table " id="city_metadata_table" style="font-size:x-small;">
                    <tbody>
                      <tr><td>Sample Id</td><td id="city_metadata_sample_name">{data.name}</td></tr>
                      <tr><td>Project</td><td id="city_metadata_project">{data.project}</td></tr>
                      <tr><td>Surface</td><td id="city_metadata_surface">{data.surface}</td></tr>
                      <tr><td>Material</td><td id="city_metadata_material">{data.material}</td></tr>
                      <tr><td># of reads</td><td id="city_metadata_numreads">{data.num_reads}</td></tr>
                      <tr><td>City Population</td><td id="city_metadata_citypopulation">{data.city_population}</td></tr>
                      <tr><td>City Elevation</td><td id="city_metadata_cityelevation">{data.city_elevation}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SampleMetadataPanel;
