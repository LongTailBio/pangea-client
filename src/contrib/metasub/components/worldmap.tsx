import * as React from 'react';
import { Row, Col, } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import Plot from 'react-plotly.js';
import { OneTaxonResult, TaxaSearchResults } from '../services/api/models/taxaSearchResult'

interface WorldMapPanelProps {
  taxonName: string;
  onClickAction: (sampleName: string) => void;
}

const WorldMapPanel = (props: WorldMapPanelProps) => {
  console.log(props)
  const url = '/contrib/metasub/search_samples?format=json&query=' + props.taxonName;
  const [{ data, loading, error }] = usePangeaAxios<TaxaSearchResults>(
    { url: url, method: 'GET' }, {useCache: false}
  );
  if (loading) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2> MetaSUB Map</h2>
        </Row>
      </>
    );
  }
  const lats: number[] = data['results'][props.taxonName].map((sample: OneTaxonResult) => (
    sample.sample_metadata['city_latitude']
  ))
  const lons: number[] = data['results'][props.taxonName].map((sample: OneTaxonResult) => (
    sample.sample_metadata['city_longitude']
  ))
  const sizes: number[] = data['results'][props.taxonName].map((sample: OneTaxonResult) => (
    (10000 * sample.relative_abundance) ** (1 / 2)
  ))
  const labels: string[] = data['results'][props.taxonName].map((sample: OneTaxonResult) => (
    sample.sample_name + ': '
    + Math.round(1000 * 1000 * sample.relative_abundance).toLocaleString() + ' ppm'
  ))
  const nameMap : {[key: string]: string} = {'': ''}
  data['results'][props.taxonName].map((sample: OneTaxonResult) => (
    nameMap[sample.sample_name] = sample.sample_uuid
  ))

  const plotData: Partial<Plotly.PlotData>[] = [{
      type: 'scattergeo',
      mode: 'markers',
      lon: lons,
      lat: lats,
      text: labels,
      hoverinfo: 'text',
      marker: {
          size: sizes,
      },
  }];

  const layout = {
      title: '<i>' + props.taxonName + '</i>',
      font: {
          size: 6
      },
      titlefont: {
          size: 16
      },
      geo: {
          resolution: 50,
      },
      margin: {l: 0, r: 0, b: 0, t: 30},
      width: 700,
      height: 400
  };

  return (
    <Plot data={plotData} layout={layout} onClick={
      (e) => (
        props.onClickAction(
          nameMap[e.points[0]?.text ? e.points[0]?.text.split(':')[0] : '']
        )
      )
    }/>
  )
}

export default WorldMapPanel;


// function PlotHeatmapTaxaMapbox(taxaData)
// {
//   $("#taxa_name_placeholder").text(taxaData.taxa_name);
  
  
//   // need to remove layers before we can remove the source  
//   removeMapboxLayer('taxaBySample-heat');
//   removeMapboxLayer('taxaBySample-pointHeat');
//   removeMapboxLayer('taxaBySample-point');
  
//   // remove the source
//   removeMapboxSource('taxaBySample');
  
//   // Add a geojson source.
//   map.addSource('taxaBySample', {
//     'type': 'geojson',
//     'generateId': true,
//     'data': TaxaJsonToGeojson(taxaData.taxa_data)
//   });
  
//   // log-scaling
//   abVals = taxaData.taxa_data.map(x=> { return ConvertRelAb(x.relative_abundance); })

//   // Percentile scaling for colors since data range is pretty wide even with log-scaling
//   var quantVals = [0, Quartile(abVals, 0.15), Quartile(abVals, 0.30), Quartile(abVals, 0.45), Quartile(abVals, 0.60), Quartile(abVals, 0.75), Quartile(abVals, 0.90), Quartile(abVals, 1)];

//   // Add colors into legend
//   mapLegend.innerHTML = "";
//   for (i = 0; i < quantVals.length; i++) 
//   {
//     var curVal = (ConvertRelAbInverse(quantVals[i]) * 100).toPrecision(3) + "%";
//     var curColor = colorList[i];
//     var item = document.createElement('div');
//     var key = document.createElement('span');
//     key.className = 'legend-key';
//     key.style.backgroundColor = curColor;
//     key.style.borderColor = "black";

//     var value = document.createElement('span');
//     value.innerHTML = curVal;
//     item.appendChild(key);
//     item.appendChild(value);
//     mapLegend.appendChild(item);
//   }

//   // Color & circle size weights
//   // TODO: finetune for visuals
//   var heatmapWeight = ['interpolate', ['linear'], ['get', 'ab'], 0, 0, quantVals[6], 1];
//   var heatmapColor = ['interpolate',
//         ['linear'],
//         ['heatmap-density'],
//         0.0, convertHex(colorList[0], 0.0),
//         0.1, convertHex(colorList[1], 0.5), 
//         0.2, convertHex(colorList[2], 1.0),
//         0.4, convertHex(colorList[3], 1.0),
//         0.6, convertHex(colorList[4], 1.0),
//         0.8, convertHex(colorList[5], 1.0),
//         1.0, convertHex(colorList[6], 1.0)
//       ];
        
//   var circleColor = [
//       'interpolate',
//       ['linear'],
//       ['get', 'ab'],
//       quantVals[0], convertHex(colorList[0], 0.0),
//       quantVals[1], convertHex(colorList[1], 0.8), 
//       quantVals[2], convertHex(colorList[2], 0.8),
//       quantVals[3], convertHex(colorList[3], 0.8),
//       quantVals[4], convertHex(colorList[4], 0.8),
//       quantVals[5], convertHex(colorList[5], 0.8),
//       quantVals[6], convertHex(colorList[6], 0.8),
//       quantVals[7], convertHex(colorList[6], 0.8),
//       ];
  
//   // Heatmap layer
//   // Note that heatmap is affected both by magnitude of the point relAbundance, but also frequency of points. 
//   // So for now we'll use a 2-layer approach
//   map.addLayer(
//   {
//     'id': 'taxaBySample-heat',
//     'type': 'heatmap',
//     'source': 'taxaBySample',
//     'maxzoom': 20,
//     'paint': {
//       // Increase the heatmap weight based on frequency and property magnitude
//       'heatmap-weight': heatmapWeight,
//       // Increase the heatmap color weight weight by zoom level
//       // heatmap-intensity is a multiplier on top of heatmap-weight
//       'heatmap-intensity': [
//         'interpolate',
//         ['linear'],
//         ['zoom'],
//         0,
//         1,
//         14,
//         4
//       ],
//       // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
//       // Begin color ramp at 0-stop with a 0-transparancy color
//       // to create a blur-like effect.
//       'heatmap-color': heatmapColor,
//       // Adjust the heatmap radius by zoom level
//       'heatmap-radius': [
//         'interpolate',
//         ['linear'],
//         ['zoom'],
//         0,
//         6,
//         15,
//         40
//       ],
//       // Transition from heatmap to circle layer by zoom level
//       'heatmap-opacity': [
//         'interpolate',
//         ['linear'],
//         ['zoom'],
//         7,
//         1,
//         18,
//         0.7
//       ]
//     }
//   });

//   // Show blurred circles as a pseudo-heatmap
//   map.addLayer(
//   {
//     'id': 'taxaBySample-pointHeat',
//     'type': 'circle',
//     'source': 'taxaBySample',
//     'paint': 
//     {
//       'circle-radius': [
//       'interpolate',
//       ['linear'],
//       ['zoom'],
//       0,
//       8,//['case',['boolean', ['feature-state', 'hover'], false],  8,  8],
//       15,
//       50 //['case',['boolean', ['feature-state', 'hover'], false],  50, 50]
//       ],
//       'circle-color': circleColor,
//       'circle-blur': [
//       'interpolate',
//       ['linear'],
//       ['zoom'],
//       0,
//       ['case',['boolean', ['feature-state', 'hover'], false],  0,  3],
//       15,
//       ['case',['boolean', ['feature-state', 'hover'], false],  0,  1]
//       ],
//       'circle-opacity': 1,
//       'circle-stroke-color': '#fad400',
//       'circle-stroke-width': ['case',['boolean', ['feature-state', 'hover'], false], 3,  0],
//     }
//   });
  
//   // Show actual sample points on the map when zoomed in enough
//   map.addLayer(
//     {
//       'id': 'taxaBySample-point',
//       'type': 'circle',
//       'source': 'taxaBySample',
//       'minzoom': 8,
//       'paint': {
//         'circle-radius': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           10,
//           ['interpolate', ['linear'], ['get', 'ab'], 1, 5, 10, 30],
//           16,
//           ['interpolate', ['linear'], ['get', 'ab'], 1, 10, 10, 100]
//         ],
//         'circle-color': circleColor,
//         'circle-stroke-color': '#000000',
//         'circle-stroke-width': 2,
//         'circle-opacity': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           7,
//           0,
//           8,
//           1
//         ]
//       }
//     }
//   );

  
//   map.on('click', 'taxaBySample-pointHeat', function(e) 
//   {
//     map.flyTo({ center: e.features[0].geometry.coordinates, zoom: Math.max(map.getZoom(), 9) });
//     ShowCityMetadata(e.features[0]);
    
//     var el = document.createElement('div');
//     el.className = 'marker';
    
//     if(mapSampleMarker != null) mapSampleMarker.remove();
    
//     mapSampleMarker = new mapboxgl.Marker(el, 
//       {offset: [0, -25]})
//       .setLngLat(e.features[0].geometry.coordinates)
//       .addTo(map);
//     mapSampleMarkerPresent = true;
//     mapCurrentSampleGeojson = e.features[0];
//   });
   
//   map.on('mouseenter', 'taxaBySample-pointHeat', function(e) 
//   {
//     map.getCanvas().style.cursor = 'pointer';  
//   });
  
//   map.on('mousemove', 'taxaBySample-pointHeat', function(e) 
//   {
//     if (e.features.length > 0) 
//     {
//       // Show metadata
//       ShowCityMetadata(e.features[0]);
      
//       if (hoveredStateId) 
//       {
//         map.setFeatureState(
//           { source: 'taxaBySample', id: hoveredStateId },
//           { hover: false }
//         );
//       }
//       hoveredStateId = e.features[0].id;
//       map.setFeatureState(
//         { source: 'taxaBySample', id: hoveredStateId },
//         { hover: true }
//       );
//     }
//   });
  
//   map.on('mouseleave', 'taxaBySample-pointHeat', function() 
//   {
//     map.getCanvas().style.cursor = '';
    
//     if( mapCurrentSampleGeojson == null) // No sample are "clicked", revert the hover table for city metadata.
//     {
//       // TODO: is it better to keep showing metadata for the last sample?
      
//       //$('#city_name_header').text("");
//       //$('#city_name_header_msg').css("display", "block");
//       //$('#city_metadata_div').css("display", "none");
//       //$('#taxon_relative_abundance').text("");      
//     }else  // A sample is being shown. Revert to its metadata instead.
//     {
//       ShowCityMetadata(mapCurrentSampleGeojson);
//     }
    
//     if (hoveredStateId) 
//     {
//       map.setFeatureState(
//         { source: 'taxaBySample', id: hoveredStateId },
//         { hover: false }
//       );
//     }
//     hoveredStateId = null;
    
//   });
//   map.resize();
// }
