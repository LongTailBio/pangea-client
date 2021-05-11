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
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { WikiPageType } from '../../../../../services/api/models/wiki';
import { EditableTextPanel } from '../../../../../components/EditableText';
import { pangeaFetch } from '../../../../../services/api/coreApi';


interface WikiPageProps {
	page: WikiPageType;
	grp_uuid: string;
}

const editWikiPage = (grp_uuid: string, page: WikiPageType) => {
	const data = {
		uuid: page.uuid,
		title: page.title,
		text: page.text,
	} 
	return pangeaFetch(`/sample_groups/${grp_uuid}/wiki`, 'POST', JSON.stringify(data))
		.then(response => response.json())
        .then(data => window.location.reload(false))
}


export const WikiPagePanel = (props: WikiPageProps) => {

	const editWikiTitle = (new_title: string) =>{
		props.page.title = new_title
		return editWikiPage(props.grp_uuid, props.page)
	}
	const editWikiText = (new_text: string) =>{
		props.page.text = new_text
		return editWikiPage(props.grp_uuid, props.page)
	}
	return (
		<>
		    <Row>
		      <Col lg={12}>
		        <EditableTextPanel
		        	onSubmit={editWikiTitle}
		        	initialText={props.page.title}
		        	inputType={"inline"}
		        	title={"title"}
		        	textType={"h1"}
		        />
		      </Col>
		    </Row>
		    <br/>
		    <Row>
		      <Col lg={12}>
		        <EditableTextPanel
		        	onSubmit={editWikiText}
		        	initialText={props.page.text}
		        	inputType={"area"}
		        	title={"Body"}
		        />
		      </Col>
		    </Row>
	    </>	    
	)
}