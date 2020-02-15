import * as d3 from 'd3';

import { Node } from './sunburst';
import { displayTaxaName } from './util';
import { microbeDatabase } from './microbeDatabase';

/**
 * Still unclear what this does/did. Leaving it here for posterity.
 * @param nodeArray Array of hierarchy nodes
 */
export const updateBreadcrumbs = function(nodeArray: Node[]) {
  // Clear current values
  d3.select('#sunburstAnnColumn').html('');

  if (nodeArray.length !== 7) {
    return;
  }

  const curSpecies = nodeArray[6];
  const speciesName = displayTaxaName(curSpecies.data.name);
  let curRectCount = 0;
  const marLeft = 0,
        marTop = 30,
        rectWidth = 180,
        rectHeight = 40;

  function addAnnotation(boxText: string, boxColor: string) {
    d3.select('#sunburstAnnColumn').append('svg:rect')
        .attr('x', marLeft)
        .attr('y', marTop + (curRectCount * (rectHeight + 10)))
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', boxColor);
    d3.select('#sunburstAnnColumn').append('text')
        .attr('x', marLeft + rectWidth / 2)
        .attr('y', marTop + rectHeight / 2 + (curRectCount * (rectHeight + 10)))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(boxText);
    curRectCount++;
  }

  function annotationBinary(data: number, boxText1: string, boxText0: string, boxColor1: string, boxColor0: string) {
    if (data !== undefined) {
      if (data === 0) {
        addAnnotation(boxText0, boxColor0);
      }
      if (data === 1) {
        addAnnotation(boxText1, boxColor1);
      }
    }
  }

  // const curMic = microbeDatabase[speciesName];
  if (microbeDatabase[speciesName] !== undefined) {
    const curMic = microbeDatabase[speciesName];

    if (curMic.HMP_airways !== undefined && curMic.HMP_airways === 1) {
      addAnnotation('Human Airways microbiome', '#bebada');
    }
    if (curMic.HMP_blood !== undefined && curMic.HMP_blood === 1) {
      addAnnotation('Human Blood Microbiome', '#bebada');
    }
    if (curMic.HMP_gastrointestinalTract !== undefined && curMic.HMP_gastrointestinalTract === 1) {
      addAnnotation('Human Gastrointestinal tract', '#bebada');
    }
    if (curMic.HMP_oral !== undefined && curMic.HMP_oral === 1) {
      addAnnotation('Human Oral microbiome', '#bebada');
    }
    if (curMic.HMP_skin !== undefined && curMic.HMP_skin === 1) {
      addAnnotation('Human Skin microbiome', '#bebada');
    }
    if (curMic.HMP_urogenitalTract !== undefined && curMic.HMP_urogenitalTract === 1) {
      addAnnotation('Human Urogenital tract', '#bebada');
    }
    if (curMic.HMP_unknown !== undefined && curMic.HMP_unknown === 1) {
      addAnnotation('Other Human microbiome', '#bebada');
    }

    if (curMic.pathogenicity !== undefined) {
      const cogem = curMic.pathogenicity;
      if (cogem === 1) {
        addAnnotation('COGEM risk class 1', '#9BB899');
      }
      if (cogem === 2) {
        addAnnotation('COGEM risk class 2', '#FCCEAA');
      }
      if (cogem === 3) {
        addAnnotation('COGEM risk class 3', '#F5827D');
      }
      if (cogem === 4) {
        addAnnotation('COGEM risk class 4', '#EA4961');
      }
    }

    annotationBinary(
      curMic.animal_pathogen,
      'Potential Animal Pathogen',
      'Non-pathogenic to animals',
      '#F08A5D',
      '#495664'
    );
    annotationBinary(
      curMic.plant_pathogen,
      'Potential Plant Pathogen',
      'Non-pathogenic to plants',
      '#F08A5D',
      '#495664'
    );

    if (curMic.gram_stain !== undefined) {
      const gram_stain = curMic.gram_stain;
      if (gram_stain === 0) {
        addAnnotation('Gram-stain negative', '#ffffb3');
      }
      if (gram_stain === 1) {
        addAnnotation('Gram-stain positive', '#8dd3c7');
      }
    }

    if (curMic.optimal_temperature !== undefined) {
      addAnnotation(`Optimal Temperature: ${curMic.optimal_temperature}`, '#b3de69');
    }
    if (curMic.optimal_pH !== undefined) {
      addAnnotation(`Optimal pH: ${curMic.optimal_pH}`, '#b3de69');
    }
    annotationBinary(curMic.biofilm_forming, 'Biofilm forming', 'Doesn\'t form biofilm', '#fccde5', '#495664');
    annotationBinary(curMic.spore_forming, 'Spore forming', 'Doesn\'t form spores', '#fccde5', '#495664');
    annotationBinary(curMic.extreme_environment, 'Extremophilic', 'Non-extremophilic', '#fccde5', '#495664');
    annotationBinary(
      curMic.antimicrobial_susceptibility,
      'Anti-microbial susceptible',
      'Anti-microbial non-susceptible',
      '#495664',
      '#fb8072'
    );
  }
  if (curRectCount === 0) {
    addAnnotation('No annotations found', '#BBBBBB');
  }
};
