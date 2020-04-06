
import TaxaMetadataPanel from './components/taxametadata'
import SampleMetadataPanel from './components/samplemetadata'

interface MetasubMapProps {

}

export const MetasubMap = (props: MetasubMapProps) => {
    return (
        <SampleMetadataPanel sampleName="bb81df30-50ab-442b-b799-3322e48bf740" />
        <TaxaMetadataPanel taxonName="Escherichia coli" taxonAbundance={0.123} />
    )
}