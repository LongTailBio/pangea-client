import * as React from 'react';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
  Pagination,
  Button,
  Table,
} from 'react-bootstrap';
import { usePangeaAxios, LinkList } from '../../../../../../services/api';
import { SampleGroupType } from '../../../../../../services/api/models/sampleGroup';
import { SampleLinkType } from '../../../../../../services/api/models/sample';
import { InfoButton } from '../../../../../../components/CreateForm' 


interface MetaDataGridProps {
  samples: LinkList<SampleLinkType>;
  group: SampleGroupType;
  validation: MetadataValidationReport;
}


interface MetaDataGridState {

}




export interface MetadataValidationReport {
	errors: [string, string, string, string];
	stats: any;
}


const metadatatoHtml = (sample: SampleLinkType, key: string, valErrors: {[key: string]: string}) => {

	if(!sample?.metadata){
		return (<td className="table-danger"></td>)
	}
	const errKey = sample.name + key;
	if(errKey in valErrors){
		const msg = valErrors[errKey];
		if(sample.metadata[key]){
			return (<td className={"danger"}>
				{sample.metadata[key]} <InfoButton desc={msg}/>
			</td>)
		}
		return (<td className={"danger"}><InfoButton desc={msg}/></td>)
	}
	if(sample.metadata[key]){
		return (<td>
			{sample.metadata[key]}
		</td>)
	}
	return (<td></td>)
}



const sampleToHtml = (sample: SampleLinkType, keys: string[], valErrors: {[key: string]: string}) => {
	return (
		<tr>
			<td>{sample.name}</td>
			{keys.map(key => metadatatoHtml(sample, key, valErrors))}
		</tr>
	)
}


export class MetaDataGrid extends React.Component<MetaDataGridProps, MetaDataGridState> {
	protected metadataKeys: string[];
	protected valErrors: {[key: string]: string};

	constructor(props: MetaDataGridProps){
		super(props);
		this.state = {}
	    this.metadataKeys = [];
	    props.samples.links.map(sample => {
	      if(sample?.metadata){
	        Object.keys(sample.metadata).map(key => {
	          if(this.metadataKeys.indexOf(key) === -1){
	            this.metadataKeys.push(key);
	          }
	        })
	      } 
	    })
	    console.log(props.validation)
	    this.valErrors = {};
	    props.validation.errors.map(error => {
	    	const rowName = error[0] as string;
	    	const colName = error[1] as string;
	    	const errKey = rowName + colName;
	    	this.valErrors[errKey] = error[3]
	    })
	    console.log(this.valErrors)
	}

	render() {
		return (
			<>
				<Table responsive className="table-sm table-hover">
					<thead>
						<tr>
							<th>Sample Name</th>
							{this.metadataKeys.map(key => (<th>{key}</th>))}
						</tr>
					</thead>
					<tbody>
						{this.props.samples.links.map(sample => sampleToHtml(sample, this.metadataKeys, this.valErrors))}
					</tbody>
				</Table>
			</>
		)
	}
}

export default MetaDataGrid;