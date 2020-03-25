export const displayTaxaName = (rawName: string): string => {
  const components = rawName.split('__');
  let level = components[0];
  const link = components[1];

  if (level === 'root') {
    return 'Root';
  } else if (level === 'd' || level === 'k') {
    level = 'Domain';
  } else if (level === 'p') {
    level = 'Phylum';
  } else if (level === 'c') {
    level = 'Class';
  } else if (level === 'o') {
    level = 'Order';
  } else if (level === 'f') {
    level = 'Family';
  } else if (level === 'g') {
    level = 'Genus';
  } else if (level === 's') {
    level = 'Species';
  } else if (level === 't') {
    level = 'Strain';
  }

  return `${level} ${link}`;
};
