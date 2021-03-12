import React, { useState, ReactElement } from 'react';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs,
} from 'react-bootstrap';

import { SampleGroupType } from '../../services/api/models/sampleGroup';
import { SampleType } from '../../services/api/models/sample';
import { PangeaUserType, OrgLink } from '../../services/api/models/user';
import { InfoButton, multilineText } from '../../components/CreateForm'


export const apilink = "https://github.com/LongTailBio/pangea-django/tree/master/api-client";
export const sampledesc = `
  Samples contain data, results, and metadata.

  Each sample belongs to exactly one sample library \
  but can be added to any number of sample groups. \
  Samples are only public if their library is public, \
  otherwise they are private.
  `;
export const ardesc = `
  Analysis results contain files and data such as reads.

  Analysis Results can have multiple fields \
  this makes it easy to group related files \
  together such as the first and second reads \
  from a sequencing run.
  `;


export const createSampleCmds = (user?: PangeaUserType, grp?: SampleGroupType): ReactElement => {
  const cmd_email = user ? user.email : '<your email>';
  const cmd_grp = grp ? grp.name : '<grp name>';
  var cmd_org = '<org name>';
  if(grp){
    cmd_org = grp.organization_obj.name;
  }
  const shcmd = (
    'pangea-api create samples -e ' +
    cmd_email + ' -p *** "' + cmd_org +
    '" "' + cmd_grp + '" "Your Sample Name"' 
  );
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, ${cmd_email}, '***').login()
    org = Organization(knex, "${cmd_org}")
    org.idem()  # creates the org or fetches it if it already exists
    grp = org.sample_group("${cmd_grp}")
    grp.idem()  # creates the grp or fetches it if it already exists
    sample = grp.sample("Your Sample Name")
    sample.idem()  # creates the sample or fetches it if it already exists
  `;

  return (
      <>
        <Row>
          <h4>From the <a href={apilink}>Command Line</a></h4>
          <code>
            {shcmd}
          </code>
        </Row>
        <br/><br/>
        <Row>
          <h4>Using <a href={apilink}>Python</a></h4>
          <pre>
            <code style={multilineText}>
              {pycmd}
            </code>
          </pre>
        </Row>
      </>
  )
}

export const iCreateSampleCmds = (user?: PangeaUserType, grp?: SampleGroupType): ReactElement => {
  const cmd_email = user ? user.email : '<your email>';
  const cmd_grp = grp ? grp.name : '<grp name>';
  var cmd_org = '<org name>';
  if(grp){
    cmd_org = grp.organization_obj.name;
  }
  const shcmd1 = `pangea-api create samples -m 'raw::paired_short_reads '-e ${cmd_email} -p *** "${cmd_org}"  "${cmd_grp}" "Sample Name" <fastq 1> <fastq 2>`
  const shcmd2 = `pangea-api create samples -m 'raw::single_short_reads '-e ${cmd_email} -p *** "${cmd_org}"  "${cmd_grp}" "Sample Name" <fastq 1>`

  return (
      <>
        <Row>
          <h4>From the <a href={apilink}>Command Line</a></h4>
          <code>
            {shcmd1}
          </code>
          <br/>Or<br/>
          <code>
            {shcmd2}
          </code>          
        </Row>
      </>
  )
}


export const createBulkSampleCmds = (user?: PangeaUserType, grp?: SampleGroupType): ReactElement => {
  const cmd_email = user ? user.email : '<your email>';
  const cmd_grp = grp ? grp.name : '<grp name>';
  var cmd_org = '<org name>';
  if(grp){
    cmd_org = grp.organization_obj.name;
  }
  const shcmd = (
    'pangea-api create samples -e ' +
    cmd_email + ' -p *** "' + cmd_org +
    '" "' + cmd_grp + '" "Sample 1" "Sample 2"' 
  );
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, ${cmd_email}, '***').login()
    org = Organization(knex, "${cmd_org}")
    org.idem()  # creates the org or fetches it if it already exists
    grp = org.sample_group("${cmd_grp}")
    grp.idem()  # creates the grp or fetches it if it already exists
    for name in ['Sample 1', 'Sample 2']:
        sample = grp.sample("Your Sample Name")
        sample.idem()  # creates the sample or fetches it if it already exists
  `;

  const apilink = "https://github.com/LongTailBio/pangea-django/tree/master/api-client";
  return (
      <>
        <Row>
          <h4>From the <a href={apilink}>Command Line</a></h4>
          <code>
            {shcmd}
          </code>
        </Row>
        <br/><br/>
        <Row>
          <h4>Using <a href={apilink}>Python</a></h4>
          <pre>
            <code style={multilineText}>
              {pycmd}
            </code>
          </pre>
        </Row>
      </>
  )
}


export const createSampleAnalysisResultCmds = (user?: PangeaUserType, sample?: SampleType): ReactElement =>  {
  const cmd_sample = sample ? sample.name : '<your sample>'
  const cmd_sample_uuid = sample ? sample.uuid : '<sample uuid>'
  const cmd_email = user ? user.email : '<your email>';
  var cmd_grp = '<grp name>';
  var cmd_org = '<org name>';
  if(sample){
    cmd_grp = sample.library_obj.name;
    cmd_org = sample.library_obj.organization_obj.name;
  }
  const shcmd1 = (
    `pangea-api create sample-ar -e '${cmd_email}' -p *** -r '<replicate id>' '${cmd_org}' '${cmd_grp}' '${cmd_sample}' 'Your Module Name'`

  );
  const shcmd2 = (
    `pangea-api create sample-ar -e '${cmd_email}' -p *** -r '<replicate id>' '${cmd_sample_uuid}'  'Your Module Name'`
  );
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, "${cmd_email}", "***").login()
    org = Organization(knex, "${cmd_org}").idem()
    grp = org.sample_group("${cmd_grp}").idem()
    sample = grp.sample("Your Sample Name").idem()
    ar = sample.analysis_result("Your Module Name", "<replicate id>").idem()
  `;

  return (
    <>
      <Row>
        <h4>From the <a href={apilink}>Command Line</a></h4>
        <code>
          {shcmd1}
        </code>
        <br/>Or<br/>
        <code>
          {shcmd2}
        </code>          
      </Row>
      <br/><br/>
      <Row>
        <h4>Using <a href={apilink}>Python</a></h4>
        <pre>
          <code style={multilineText}>
            {pycmd}
          </code>
        </pre>
      </Row>
    </>
  )
}

export const createSampleGroupAnalysisResultCmds = (user?: PangeaUserType, grp?: SampleGroupType): ReactElement =>  {


  return (
    <>

    </>
  )
}

export const downloadSampleARsFromGroupCmds = (user?: PangeaUserType, grp?: SampleGroupType): ReactElement =>  {
  const cmd_grp = grp ? grp.name : '<your grp>'
  const cmd_grp_uuid = grp ? grp.uuid : '<group uuid>'
  const cmd_email = user ? user.email : '<your email>';
  var cmd_org = '<org name>';
  if(grp){
    cmd_org = grp.organization_obj.name;
  }
  const shcmd1 = (
    `pangea-api download sample-results -e '${cmd_email}' -p *** --module-name '<module name>' '${cmd_org}' '${cmd_grp}'`

  );
  const shcmd2 = (
    `pangea-api download sample-results -e '${cmd_email}' -p *** --module-name '<module name>' '${cmd_grp_uuid}'`
  );
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, "${cmd_email}", "***").login()
    org = Organization(knex, "${cmd_org}").idem()
    grp = org.sample_group("${cmd_grp}").idem()
    for sample in grp.get_samples(cache=False):
        for ar in sample.get_analysis_results(cache=False):
            if ar.module_name != '<module name>':
                continue
            for field in ar.get_fields(cache=False):
                field.download_file(filename=filename)
  `;
  return (
    <>
      <Row>
        <h4>From the <a href={apilink}>Command Line</a></h4>
        <code>
          {shcmd1}
        </code>
        <br/>Or<br/>
        <code>
          {shcmd2}
        </code>          
      </Row>
      <br/><br/>
      <Row>
        <h4>Using <a href={apilink}>Python</a></h4>
        <pre>
          <code style={multilineText}>
            {pycmd}
          </code>
        </pre>
      </Row>
    </>
  )
}

export const downloadMetadataFromGroupCmds = (user?: PangeaUserType, grp?: SampleGroupType): ReactElement =>  {
  const cmd_grp = grp ? grp.name : '<your grp>'
  const cmd_grp_uuid = grp ? grp.uuid : '<group uuid>'
  const cmd_email = user ? user.email : '<your email>';
  var cmd_org = '<org name>';
  if(grp){
    cmd_org = grp.organization_obj.name;
  }
  const shcmd1 = (
    `pangea-api download metadata -e '${cmd_email}' -p *** '${cmd_org}' '${cmd_grp}'`

  );
  const shcmd2 = (
    `pangea-api download metadata -e '${cmd_email}' -p *** '${cmd_grp_uuid}'`
  );
  const pycmd = `
    import pandas as pd
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, "${cmd_email}", "***").login()
    org = Organization(knex, "${cmd_org}").idem()
    grp = org.sample_group("${cmd_grp}").idem()
    metadata = {}
    for sample in grp.get_samples(cache=False):
        if sample_names and sample.name not in sample_names:
            continue
        metadata[sample.name] = sample.metadata
    metadata = pd.DataFrame.from_dict(metadata, orient='index')
    metadata.to_csv("${cmd_grp}_metadata.csv")
  `;
  return (
    <>
      <Row>
        <h4>From the <a href={apilink}>Command Line</a></h4>
        <code>
          {shcmd1}
        </code>
        <br/>Or<br/>
        <code>
          {shcmd2}
        </code>          
      </Row>
      <br/><br/>
      <Row>
        <h4>Using <a href={apilink}>Python</a></h4>
        <pre>
          <code style={multilineText}>
            {pycmd}
          </code>
        </pre>
      </Row>
    </>
  )
}

export const downloadSampleARCmds = (user?: PangeaUserType, sample?: SampleType): ReactElement =>  {
  return (
    <>
    </>
  )
}

