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
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { WikiType, WikiPageType } from '../../../../services/api/models/wiki';
import { usePangeaAxios } from '../../../../services/api';
import { HandleErrorLoading } from '../../../../components/ErrorLoadingHandler';
import { WikiPagePanel } from './components/WikiPage';
import { pangeaFetch } from '../../../../services/api/coreApi';


interface WikiPanelProps {
	grp_uuid: string;
	wiki: WikiType;
}

interface WikiPanelState {
	activePage: WikiPageType;
}

export class WikiPanel extends React.Component<WikiPanelProps, WikiPanelState> {

	constructor(props: WikiPanelProps){
		super(props);
		this.state = {
			activePage: props.wiki.home_page_obj,
		}
		this.selectPage = this.selectPage.bind(this);
		this.newWikiPage = this.newWikiPage.bind(this);
	}

	newWikiPage = () => {
		const data = {
			title: 'New Page',
			text: '',
		} 
		return pangeaFetch(`/sample_groups/${this.props.grp_uuid}/wiki`, 'POST', JSON.stringify(data))
			.then(response => response.json())
	        .then(data => window.location.reload(false))
	}
	
	selectPage = (event: any) => {
		const page = this.props.wiki.page_objs.filter(el => el.title === event)[0]
		this.setState({activePage: page})
	}

	render() {
		return (
			<>
				<Row>
					<Col lg={10}>
						<WikiPagePanel page={this.state.activePage} grp_uuid={this.props.grp_uuid}/>
					</Col>
					<Col lg={2}>
			          <Nav bsStyle="list" activeKey={this.state.activePage.title} onSelect={this.selectPage}>
			            {this.props.wiki.page_objs.map(page => (
			                <NavItem eventKey={page.title}>
			                  {page.title}
			                </NavItem>
			            ))} 
			          </Nav>
			          <br/>
				  	  <Button className="btn-success btn-lg" onClick={this.newWikiPage}>
					  	New Page
					  </Button>			       
					</Col>
				</Row>
			</>
		)		
	}
}


export default WikiPanel;