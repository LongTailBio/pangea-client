import * as React from 'react';
import { Link } from 'react-router-dom';

import { usePangeaAxios } from '../../../../services/api';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';

interface Prop {
  groupUUID: string;
}

export const SampleGroupListItem = (props: Prop) => {
  const [{ data }] = usePangeaAxios<SampleGroupType>(
    `/sample_groups/${props.groupUUID}`,
  );

  if (!data) return null;

  return (
    <li className="analysis-group-list-item">
      <Link to={`/sample-groups/${props.groupUUID}`}>
        <h4>{data.name}</h4>
      </Link>
      <p>{data.description}</p>
    </li>
  );
};

export default SampleGroupListItem;
