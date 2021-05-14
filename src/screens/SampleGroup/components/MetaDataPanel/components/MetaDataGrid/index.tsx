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
  Collapse,
  Panel,
} from 'react-bootstrap';
import { usePangeaAxios, LinkList } from '../../../../../../services/api';
import { SampleGroupType } from '../../../../../../services/api/models/sampleGroup';
import { SampleLinkType } from '../../../../../../services/api/models/sample';
import { InfoButton } from '../../../../../../components/CreateForm' 
import {FilterStringMetadataForm} from './components/FilterStringForm'
import {FilterNumberMetadataForm} from './components/FilterNumberForm'


interface MetaDataGridProps {
  samples: LinkList<SampleLinkType>;
  group: SampleGroupType;
  validation: MetadataValidationReport;
}


interface MetaDataGridState {
	samplesInCurrentFilter: SampleLinkType[];
	filter: string;
	showFilter: {[key: string]: boolean};
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
	protected metadataTypes: {[key: string]: "string"|"number"}
	protected valErrors: {[key: string]: string};

	constructor(props: MetaDataGridProps){
		super(props);
		const showFilt: {[key:string]: boolean} = {};
	    this.metadataKeys = [];
	    this.metadataTypes = {};
	    props.samples.links.map(sample => {
	      if(sample?.metadata){
	        Object.keys(sample.metadata).map(key => {
	          if(this.metadataKeys.indexOf(key) === -1){
	            this.metadataKeys.push(key);
	         	showFilt[key] = false;
	         	this.metadataTypes[key] = "string";
	          }
	        })
	      } 
	    });

	    const schema: any = props.group.sample_metadata_schema;
	    if(schema?.fields){
	    	schema.fields.map((field: any) => {
	    		if(field?.name && field?.type === "number"){
	    			this.metadataTypes[field.name] = "number";
	    		}
	    	})
	    }
		this.state = {
			samplesInCurrentFilter: props.samples.links,
			filter: '',
			showFilter: showFilt,
		}	    
	    this.valErrors = {};
	    props.validation.errors.map(error => {
	    	const rowName = error[0] as string;
	    	const colName = error[1] as string;
	    	const errKey = rowName + colName;
	    	this.valErrors[errKey] = error[3]
	    })
	    this.setMetadataStringFilter = this.setMetadataStringFilter.bind(this);
	    this.setMetadataNumberFilter = this.setMetadataNumberFilter.bind(this);
    	this.handleFilterChange = this.handleFilterChange.bind(this);
    	this.filterSamples = this.filterSamples.bind(this);
    	this.flipFilter = this.flipFilter.bind(this);
	}

	  setMetadataStringFilter(key: string, value: string){
	    var filterStr = '';
	    if(this.state.filter.trim().length === 0){
	      filterStr = key + '=' + value;
	    } else if(this.state.filter.indexOf(key) === -1){
	      filterStr = this.state.filter + '; ' + key + '=' + value;
	    } else {
	      const tkns = this.state.filter.split(';');
	      var newTkns: string[] = [];
	      tkns.map(tkn => {
	        if(tkn.indexOf(key) === -1){
	          newTkns.push(tkn);
	        } else {
	          newTkns.push(' ' + key + '=' + value)
	        }
	      })
	      filterStr = newTkns.join(';')
	    }
	    this.filterSamples(filterStr);
	  }

	  setMetadataNumberFilter(key: string, minVal: number|undefined, maxVal: number|undefined) {
	    var keyStr = ''
	    if(minVal !== undefined && maxVal !== undefined){
	    	keyStr += minVal + '<' + key + '<' + maxVal;
	    } else if(minVal !== undefined){
	    	keyStr += minVal + '<' + key;
	    } else if(maxVal !== undefined){
	    	keyStr += key + '<' + maxVal;
	    }

	    var filterStr = '';	   
	    if(this.state.filter.trim().length === 0){
	      filterStr = keyStr;
	    } else if(this.state.filter.indexOf(key) === -1){
	      filterStr = this.state.filter + '; ' + keyStr;
	    } else {
	      const tkns = this.state.filter.split(';');
	      var newTkns: string[] = [];
	      tkns.map(tkn => {
	        if(tkn.indexOf(key) === -1){
	          newTkns.push(tkn);
	        } else {
	          newTkns.push(keyStr);
	        }
	      })
	      filterStr = newTkns.join(';')
	    }
	    this.filterSamples(filterStr);
	  }

	  handleFilterChange = (event: React.FormEvent<HTMLInputElement>) => {
	    const filterStr = event.currentTarget.value;
	    this.filterSamples(filterStr);
	  }

	  flipFilter = (key: string) => {
	  	this.state.showFilter[key] = !this.state.showFilter[key];
	  	this.setState({showFilter: this.state.showFilter})
	  }

	  filterSamples = (filterStr: string) => {
	    var filteredSamples = this.props.samples.links;
	    const tkns = filterStr.split(';');
	    tkns.map((tkn) => {
	      if(tkn.indexOf('=') > -1){
	      	const subtkns = tkn.trim().split('=');
	        const key = subtkns[0];
	        const val = subtkns[1].toLowerCase();
	        filteredSamples = filteredSamples.filter(
	          sample => {
	            if(!sample?.metadata){
	              return false
	            } else if(!sample.metadata[key]){
	              return false
	            }
	            return sample.metadata[key].toLowerCase().indexOf(val) > -1
	          }
	        )	      	
	      } else if(tkn.indexOf('<') > -1){
      		
      		const handlePair = (sub1: string, sub2: string) => {
				if(Number(sub1)){
      				const key = sub2
      				const val = Number(sub1)
			        filteredSamples = filteredSamples.filter(
			          sample => {
			            if(!sample?.metadata){
			              return false
			            } else if(!sample.metadata[key]){
			              return false
			            }
			            return Number(sample.metadata[key]) >= val
			          }
			        )      				
      			} else {
      				const key = sub1
      				const val = Number(sub2)
			        filteredSamples = filteredSamples.filter(
			          sample => {
			            if(!sample?.metadata){
			              return false
			            } else if(!sample.metadata[key]){
			              return false
			            }
			            return Number(sample.metadata[key]) <= val
			          }
			        )       				
      			}      			
      		}
      		const subtkns = tkn.trim().split('<');
      		for(let i = 0; i < subtkns.length - 1; i++){
			    handlePair(subtkns[i], subtkns[i + 1]);
			}

	      } else {
	        filteredSamples = filteredSamples.filter(
	          sample =>
	            sample.name.toLowerCase().indexOf(tkn.toLowerCase()) > -1
	        )	      	
	      }
	    })

	    this.setState({
	      filter: filterStr,
	      samplesInCurrentFilter: filteredSamples,
	    });
	  };

	render() {
		return (
			<>
				<Col lg={10}>
		            <Row>
		              <br/>
		              <form>
		                <input
		                  name="filter"
		                  className="form-control input-lg"
		                  type="text"
		                  placeholder="Filter samples"
		                  required={true}
		                  value={this.state.filter}
		                  onChange={this.handleFilterChange}
		                />
		              </form>
		            </Row>
					<Table responsive className="table-sm table-hover">
						<thead>
							<tr>
								<th>Sample Name</th>
								{this.metadataKeys.map(key => (<th>{key}</th>))}
							</tr>
						</thead>
						<tbody>
							{this.state.samplesInCurrentFilter.map(sample => sampleToHtml(sample, this.metadataKeys, this.valErrors))}
						</tbody>
					</Table>
				</Col>
				<Col lg={2}>
				  <h3>Filter Metadata</h3>
	              {this.metadataKeys.map(key =>
	                <>
	                  <Row>
		                <Col lg={3}>
			              <Button
			                onClick={() => this.flipFilter(key)}
			                aria-controls="example-collapse-text"
			                aria-expanded={this.state.showFilter[key]}
			              >
			              	{this.state.showFilter[key] ? <Glyphicon glyph="chevron-down" /> : <Glyphicon glyph="chevron-right" />}
			              </Button>	
			            </Col>	                  
	                  	<Col lg={9}>
		                  <h4>{key}</h4>{}
		                </Col>
		              </Row>                  
	                  <Collapse in={this.state.showFilter[key]}>
	                  	<Panel>
	                  		{this.metadataTypes[key] === "number" && 
	                  			<FilterNumberMetadataForm metadataKey={key} callback={this.setMetadataNumberFilter} />
	                  		}
	                  		{this.metadataTypes[key] === "string" && 
	                  			<FilterStringMetadataForm metadataKey={key} callback={this.setMetadataStringFilter} />
	                  		}
	                	</Panel>
	                  </Collapse>


	                </>
	              )}
				</Col>
			</>
		)
	}
}

export default MetaDataGrid;