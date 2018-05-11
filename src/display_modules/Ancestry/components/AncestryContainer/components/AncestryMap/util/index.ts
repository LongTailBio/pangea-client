import references from './ancestryReferences';
import detailReferences from './detailReference';

/**
 * Parses a LatLngLiteral from a string.
 * @param centroid the text containing the lat/lng pairing
 */
export const parseLatLng = function(centroid: string) {
  const bracketsRemoved = centroid.replace('[', '').replace(']', '').replace(' ', ''),
        components = bracketsRemoved.split(',').map(elem => parseFloat(elem));
  return {
    lat: components[0],
    lng: components[1],
  };
};

/**
 * Determine the appropriate zoom level to show a bounding box.
 *
 * Adapted from: https://stackoverflow.com/a/6055653
 *
 * @param mapWidth The width of the map, in pixels
 * @param bounds The bounds that need to be shown.
 */
export const zoomFromBounds = function(mapWidth: number, bounds: google.maps.LatLngBounds): number {
  const GLOBE_WIDTH = 256; // a constant in Google's map projection
  let angle = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();
  if (angle < 0) {
    angle += 360;
  }
  return Math.floor(Math.log(mapWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
};

export const getAncestry = function(populationId: string) {
  // Try to look up directly
  const referenceById = references.find(elem => elem.ID === populationId);
  if (referenceById !== undefined) {
    return referenceById;
  }

  // Try ambiguous direct look up
  const ambigReferenceById = references.find(elem => elem.ID === `AMBIG_${populationId}`);
  if (ambigReferenceById !== undefined) {
    return ambigReferenceById;
  }

  // Try by subcategory
  const subcategoryId = detailReferences[populationId][0],
        subcategory = references.find(elem => elem.ID === subcategoryId);
  if (subcategory !== undefined) {
    return subcategory;
  }

  // Try by primary category
  const categoryId = detailReferences[populationId][1],
        category = references.find(elem => elem.ID === categoryId);
  if (category !== undefined) {
    return category;
  }

  throw new Error(`Could not find anything for ID: ${populationId}`);
};

export const getAncestryId = function(populationId: string) {
  return getAncestry(populationId).ID;
};
