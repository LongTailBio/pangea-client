import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
  Tab,
  Tabs,
  Table,
  Button,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { SampleGroupType } from '../../../../../services/api/models/sampleGroup';
import { pangeaFetch } from '../../../../../services/api/coreApi';
import { EditableTextPanel } from '../../../../../components/EditableText' 



interface MetaDataSchemaProps {
  group: SampleGroupType;
}

export const MetaDataSchema = (props: MetaDataSchemaProps) => {
  const group = props.group;

  const editSampleGroupMetadataSchema = (schema: string)=>  {
      const rdata = `{"sample_metadata_schema": ${schema}}` 
      return pangeaFetch(`/sample_groups/${props.group.uuid}`, 'PATCH', rdata)
        .then(response => response.json())
        .then(_ => window.location.reload(false))    
  }

  const generateMetadataSchema = () =>  {
      return pangeaFetch(`/sample_groups/${props.group.uuid}/generate_metadata_schema`, 'POST', '{}')
        .then(response => response.json())
        .then(_ => window.location.reload(false))    
  }

  return (
    <>
      <Row>
        <p>You may optionally specify a metadata schema to validate
        metadata for samples in this project.</p>
        <br/>
        <p>This Schema follows the
        <a href={"https://specs.frictionlessdata.io/table-schema/#language"}> Frictionless Table Schema </a>
        specification</p>

      </Row>
      <Row>
        <EditableTextPanel
          onSubmit={editSampleGroupMetadataSchema}
          initialText={JSON.stringify(group.sample_metadata_schema, null, 4)}
          inputType={"area"}
          textType={"code"}
          title={"Metadata Schema"}            
        />
      </Row>
      <Row>
        {Object.keys(group.sample_metadata_schema).length > 0 ? <></> :
          <Button onClick={generateMetadataSchema}>
            Generate Schema
          </Button>}
      </Row>
    </>
  );
};

export default MetaDataSchema;