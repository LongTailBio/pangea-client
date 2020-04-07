import * as React from 'react';
import { usePangeaAxios } from '../../../services/api';


interface TaxaAbundancePanelProps {

}

const TaxaAbundancePanel: React.FC = (props: TaxaAbundancePanelProps) => {
  return (
    <div></div>
    // <div class="row" style="min-height: 300px;">
    //   <div class="col-lg-12 col-md-12">
    //     <div class="card card-chart">
    //       <div class="card-header" style="padding-top:10px;" >
    //         <h5 class="card-category" id="stat_taxa_name">Relative abundance by City</h5>
    //       </div>
    //       <div class="card-body h-100" style="padding-top:0px; padding-bottom:5px;">
    //         <div class="chart-area" id="statDiv">
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

// export default TaxaAbundancePanel;


// function PlotBoxplot(taxaData)
// {
//   // Get data and sort by continent & city
//   boxData = taxaData.taxa_data.map(x => {return {ab:x.relative_abundance, city: x.sample_metadata.city, continent:cityToContinent[x.sample_metadata.city], colorGroup:cityToColorGroup[x.sample_metadata.city]} });
//   boxData = boxData.sort((a, b) => (a.colorGroup > b.colorGroup) ? 1 : (a.colorGroup === b.colorGroup) ? ( (a.city === b.city) ? 1 : -1 )  : -1);

//   // Setup city colors
//   var curCities = getUnique(boxData.map(x => x.city));
//   var curColors = getUnique(cityList.map(x => x.colorGroup));
//   var boxColor = {};
//   var allColors = linspace(0, 360, curColors.length);

//   for( i=0; i < curColors.length; i++)
//   {
//     var result = 'hsl('+ allColors[i] +',70%'+',70%)';
//     boxColor[curColors[i]] = result;
//   }
  
//   var cityX = {};
//   var prevContinent = "";
//   var prevX = 0;
//   for(i=0; i < curCities.length; i++)
//   {
//     var curCity = curCities[i];
//     var curX; prevX + 1;
//     if(prevContinent === cityToContinent[curCity] )
//     {
//       curX = prevX + 1; 
//     }else
//     {
//       curX = prevX + 2;
//     }
//     prevContinent = cityToContinent[curCity];
//     cityX[curCity] = curX;
//     prevX = curX;
//   }

//   // Setup plot.ly data
//   var data = curCities.map( city => { 
//     curCityData = boxData.filter(function (x) { return x.city == city})
    
//     return {
//       y: curCityData.map(x => {return x.ab }),
//       x0: cityX[city],
//       name: city,
//       marker: {color: boxColor[ cityToColorGroup[city] ] },
//       type: 'box'
//     }
//   });



//   var layout = 
//   {
//     boxgap:0.1,
//     boxgroupgap:0.1,
//     height:250,
//     autosize: true,
//     yaxis: {
//     title: 'Relative abundance',
//     zeroline: true,
//     color: "#FFFFFF"
//     },
//     xaxis: {
//       tickvals: curCities.map( city => {return cityX[city]}),
//       ticktext: curCities,
//       color: "#FFFFFF"
//      },
//     boxmode: 'overlay',
//     showlegend:false,
//     margin: {t: 0, r: 10, autoexpand: true },
//     plot_bgcolor: 'rgba(0,0,0,0)',
//     paper_bgcolor: 'rgba(0,0,0,0)',
//   };
//   var config = {responsive: true};
  
//   Plotly.newPlot('statDiv', data, layout, config);
//   $('#stat_taxa_name').text("Relative abundance by City for " + taxaData.taxa_name);
  
// }