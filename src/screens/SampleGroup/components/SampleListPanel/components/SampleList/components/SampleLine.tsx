import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { SampleLinkType } from '../../../../../../../services/api/models/sample';
import { Field } from 'formik';


const metadataToStr = (sampleLink: SampleLinkType): string => {
  if(! sampleLink?.metadata){
    return "No metadata";
  }
  var out = "";
  Object.keys(sampleLink.metadata).map(key => {
    out += key
    out += ": "
    out += sampleLink.metadata[key]
    out += ", "
  })
  if(out.length > 100){
    out = out.slice(0, 97) + '...'
  } else if(out.length == 0){
    return "No metadata"
  }
  return out
}


interface SampleLineProps {
	sample: SampleLinkType;
}


export const SampleLine = (props: SampleLineProps) => {
	const sample = props.sample
	return (
	    <ul key={sample.uuid} className="analysis-group-list">
	      <li className="analysis-group-list-item">
	      	<Field type="checkbox" name={`checked.${sample.uuid}`} />
	      	{" "}
	        <Link to={`/samples/${sample.uuid}`}>
	          {sample.name}
	        </Link>
	        <>
	          <br/>
	          <p>{metadataToStr(sample)}</p>
	        </>
	      </li>
	    </ul>
	)
}