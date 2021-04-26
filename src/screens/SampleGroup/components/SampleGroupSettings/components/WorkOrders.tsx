import * as React from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs, ProgressBar, Collapse,
} from 'react-bootstrap';import { Helmet } from 'react-helmet';
import { SampleGroupType } from '../../../../../services/api/models/sampleGroup';
import { GroupWorkOrderProtoType, GroupWorkOrderType, WorkOrderLinkType } from '../../../../../services/api/models/workOrder';
import { usePangeaAxios, PaginatedResult } from '../../../../../services/api';

import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { InfoButton, multilineText } from '../../../../../components/CreateForm'
import { pangeaFetch } from '../../../../../services/api/coreApi';
import { HandleErrorLoading } from '../../../../../components/ErrorLoadingHandler'



interface CreateWorkOrderFormValues {
    workOrderName: string;
}

interface CreateWorkOrderFormProps {
  group: SampleGroupType;
  workOrders: GroupWorkOrderProtoType[];
  history: any;
}


const CreateWorkOrderInnerForm = (props: CreateWorkOrderFormProps & FormikProps<CreateWorkOrderFormValues>) => {
  const { touched, errors, isSubmitting, workOrders } = props;
  return (
    <Form>
      <FormGroup>
        <label htmlFor="workOrderName">Add a Work Order
          <InfoButton desc={"The work order to add to this sample group."} />
        </label>
        <Field name="workOrderName" as="select">
          {workOrders && workOrders.map(el =>
            (<option key={el.name} value={el.name}>{el.name}</option>)
          )}
        </Field>
      </FormGroup>                    
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create</button>
    </Form>
  );
};


const CreateWorkOrderForm = withFormik<CreateWorkOrderFormProps, CreateWorkOrderFormValues>({
  mapPropsToValues: props => {
    return {
      workOrderName: props.workOrders ? props.workOrders[0].name : '',
    };
  },

  handleSubmit: (values, formikBag) => {
    const match = formikBag.props.workOrders.filter(el => {return el.name == values.workOrderName})
    const woUUID = match[0].uuid;
    pangeaFetch(`/sample_groups/${formikBag.props.group.uuid}/work_orders/${woUUID}`, 'POST', JSON.stringify({}))
        .then(response => response.json())
        .then(data => window.location.reload(false))
   },   
})(CreateWorkOrderInnerForm);


const useWorkOrders = (uuid: string) => {
  const [workOrderProtoResult] = usePangeaAxios<PaginatedResult<GroupWorkOrderProtoType>>(`/group_work_order_prototypes`);
  const [groupWorkOrderResult] = usePangeaAxios<PaginatedResult<GroupWorkOrderType>>(`/sample_groups/${uuid}/work_orders`);

  const data = {
    workOrderProtos: workOrderProtoResult.data,
    workOrders: groupWorkOrderResult.data,
  };
  const loading = workOrderProtoResult.loading || groupWorkOrderResult.loading;
  const error = workOrderProtoResult.error || groupWorkOrderResult.error || undefined;
  return [{ data, loading, error }];
};


interface WorkOrderLinkPanelProps {
  workOrderLink: WorkOrderLinkType;
}


const WorkOrderLinkPanel = (props: WorkOrderLinkPanelProps) => {
  var panelType = '';
  if(props.workOrderLink.status === "success"){
    panelType = 'panel-success';
  } else if(props.workOrderLink.status === "working"){
    panelType = 'panel-info';
  } else if(props.workOrderLink.status === "error"){
    panelType = 'panel-danger';
  } 
  return (
    <Panel className={panelType}>
      <div className="panel-heading">
        <Link to={`/samples/${props.workOrderLink.sample_uuid}/settings`}>
          {props.workOrderLink.sample_name}
        </Link>
      </div>
      <div className="panel-body">
        <h5>{props.workOrderLink.name}</h5>
        <h5>Status: {props.workOrderLink.status}</h5>
      </div>
    </Panel>
  )
}

interface GroupWorkOrderPanelProps {
  workOrder: GroupWorkOrderType;
}

const GroupWorkOrderPanel = (props: GroupWorkOrderPanelProps) => {
  const [open, setOpen] = React.useState(false);
  const nJobs = props.workOrder.progress_summary['n_jobs'] ? props.workOrder.progress_summary['n_jobs'] : 0;
  const nSuccess = props.workOrder.progress_summary['success'] ? props.workOrder.progress_summary['success'] : 0;
  const nError = props.workOrder.progress_summary['error'] ? props.workOrder.progress_summary['error'] : 0;
  const nWorking = props.workOrder.progress_summary['working'] ? props.workOrder.progress_summary['working'] : 0;
  return (
    <Panel>
      <div className="panel-heading">{props.workOrder.name}</div>
      <div className="panel-body">
        <h4>{props.workOrder.description}</h4>
        <h5>Status: {props.workOrder.status}</h5>
        <h5>Priority: {props.workOrder.priority}</h5>
        <h5>{(100 * nSuccess / nJobs).toFixed(2)}% Complete</h5>
        <h5>{nJobs} Total Jobs</h5>
        <h5>{nSuccess} Completed</h5>
        <h5>{nError} Errors</h5>
        <h5>{nWorking} Running</h5>
        <ProgressBar>
          <ProgressBar className="progress-bar-success" now={100 * nSuccess / nJobs} key={1} />
          <ProgressBar striped className="progress-bar-info" now={100 * nWorking / nJobs} key={2} />
          <ProgressBar className="progress-bar-danger" now={100 * nError / nJobs} key={3} />
        </ProgressBar>
        <>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            Samples
          </Button>
          <Collapse in={open}>
            <Panel>
            {
              props.workOrder.work_order_links.map(el => (<WorkOrderLinkPanel workOrderLink={el}/>))
            }
            </Panel>
          </Collapse>
        </>
      </div>
    </Panel>
  )
}


interface SampleGroupSettingWorkOrderProps {
  group: SampleGroupType;
}


const SampleGroupSettingWorkOrder = (props: SampleGroupSettingWorkOrderProps) => {
  const [{ data, loading, error }] = useWorkOrders(props.group.uuid);
  let history = useHistory();

  if(loading || error){
    return (<HandleErrorLoading loading={loading} error={error}/>)
  }

  const { workOrderProtos, workOrders } = data;

  return (
    <Row>
      <Col lg={9}>
        {
          workOrders.results.map(el => (<GroupWorkOrderPanel workOrder={el} />))
        }
      </Col>
      <Col lg={3}>
        <CreateWorkOrderForm
          history={history}
          group={props.group}
          workOrders={workOrderProtos.results}
        />
      </Col>
    </Row>
  );
}
export default SampleGroupSettingWorkOrder;