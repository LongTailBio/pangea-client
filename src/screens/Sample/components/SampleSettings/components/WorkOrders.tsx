import * as React from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs, ProgressBar
} from 'react-bootstrap';import { Helmet } from 'react-helmet';
import { SampleType } from '../../../../../services/api/models/sample';
import { WorkOrderProtoType, WorkOrderType, JobOrderType } from '../../../../../services/api/models/workOrder';
import { usePangeaAxios, PaginatedResult } from '../../../../../services/api';

import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { InfoButton, multilineText } from '../../../../../components/CreateForm'
import { pangeaFetch } from '../../../../../services/api/coreApi';



interface CreateWorkOrderFormValues {
    workOrderName: string;
}

interface CreateWorkOrderFormProps {
  sample: SampleType;
  workOrders: WorkOrderProtoType[];
  history: any;
}


const CreateWorkOrderInnerForm = (props: CreateWorkOrderFormProps & FormikProps<CreateWorkOrderFormValues>) => {
  const { touched, errors, isSubmitting, workOrders } = props;
  return (
    <Form>
      <FormGroup>
        <label htmlFor="workOrderName">Add a Work Order
          <InfoButton desc={"The work order to add to this sample."} />
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
    pangeaFetch(`/samples/${formikBag.props.sample.uuid}/work_orders/${woUUID}`, 'POST', JSON.stringify({}))
        .then(response => response.json())
        .then(data => window.location.reload(false))
   },   
})(CreateWorkOrderInnerForm);


const useWorkOrders = (uuid: string) => {
  const [workOrderProtoResult] = usePangeaAxios<PaginatedResult<WorkOrderProtoType>>(`/work_order_prototypes`);
  const [sampleWorkOrderResult] = usePangeaAxios<PaginatedResult<WorkOrderType>>(`/samples/${uuid}/work_orders`);

  const data = {
    workOrderProtos: workOrderProtoResult.data,
    workOrders: sampleWorkOrderResult.data,
  };
  const loading = workOrderProtoResult.loading || sampleWorkOrderResult.loading;
  const error = workOrderProtoResult.error || sampleWorkOrderResult.error || undefined;
  return [{ data, loading, error }];
};


interface JobOrderPanelProps {
  jobOrder: JobOrderType;
}

const JobOrderPanel = (props: JobOrderPanelProps) => {
  return (
    <Panel>
      <div className="panel-heading">{props.jobOrder.name}</div>
      <div className="panel-body">
        <h5>Status: {props.jobOrder.status}</h5>
      </div>
    </Panel>
  )
}

interface WorkOrderPanelProps {
  workOrder: WorkOrderType;
}

const WorkOrderPanel = (props: WorkOrderPanelProps) => {
  const nJobs = props.workOrder.progress_summary['n_jobs'] ? props.workOrder.progress_summary['n_jobs'] : 0;
  const nSuccess = props.workOrder.progress_summary['success'] ? props.workOrder.progress_summary['success'] : 0;
  const nError = props.workOrder.progress_summary['error'] ? props.workOrder.progress_summary['error'] : 0;
  const nWorking = props.workOrder.progress_summary['working'] ? props.workOrder.progress_summary['working'] : 0;
  return (
    <Panel>
      <div className="panel-heading">{props.workOrder.name}</div>
      <div className="panel-body">
        <h5>Status: {props.workOrder.status}</h5>
        <h5>Priority: {props.workOrder.priority}</h5>
        <h5>{100 * nSuccess / nJobs}% Complete</h5>
        <h5>{nError} Errors</h5>
        <h5>{nWorking} Running</h5>
        <ProgressBar>
          <ProgressBar className="progress-bar-success" now={100 * nSuccess / nJobs} key={1} />
          <ProgressBar striped className="progress-bar-info" now={100 * nWorking / nJobs} key={2} />
          <ProgressBar className="progress-bar-danger" now={100 * nError / nJobs} key={3} />
        </ProgressBar>
        {
          props.workOrder.job_order_objs.map(el => (<JobOrderPanel jobOrder={el}/>))
        }
      </div>
    </Panel>
  )
}


interface SampleSettingWorkOrderProps {
  sample: SampleType;
}


const SampleSettingWorkOrder = (props: SampleSettingWorkOrderProps) => {
  const [{ data, loading, error }] = useWorkOrders(props.sample.uuid);
  let history = useHistory();

  if (loading) {
    return (
        <Row>
          <h1>Loading...</h1>
          <h2>Work Orders</h2>
        </Row>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? 'Not Found' : 'Error';
    return (
        <Row>
          <h1>{title}</h1>
          <h2>Work Orders</h2>
          <p>{error.message}</p>
        </Row>
    );
  }

  const { workOrderProtos, workOrders } = data;

  return (
    <Row>
      <Col lg={9}>
        {
          workOrders.results.map(el => (<WorkOrderPanel workOrder={el} />))
        }
      </Col>
      <Col lg={3}>
        <CreateWorkOrderForm
          history={history}
          sample={props.sample}
          workOrders={workOrderProtos.results}
        />
      </Col>
    </Row>
  );
}
export default SampleSettingWorkOrder;