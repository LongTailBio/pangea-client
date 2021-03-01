import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { HtmlRenderer, Parser } from 'commonmark';

const faqs: Array<[string, string]> = [
  [
    'What is Pangea?',
    'Pangea is built to be a central place where biologists can put their data. ' +
    'Pangea is designed for computational analysis allowing jobs to upload and ' +
    'download data from a single central source. Sometimes this is called a "data-mesh". ' +
    'Pangea also supports data browsing, visualization, and search intended to make life ' +
    'sciences data as easy to access as possible.'
  ],
  [
    'Can I upload my own data to Pangea?',
    'Yes, you can upload data to Pangea using the command line tools. ' +
    'Graphical tools to upload data are coming soon. See the ' +
    'documentation pages for more',
  ],
  [
    'How does Pangea store data?',
    'Pangea stores project data and metadata on an SQL server ' +
    'Some small data are stored on the server as well but the bulk ' +
    'of bioinfornatics data is stored in cloud storage services and ' +
    'linked to by Pangea.',
  ],
  [
    'Can you add a new feature?',
    "Probably, we're always open to new ideas! Get in touch with " +
      'dcd3001@med.cornell.edu',
  ],
  [
    'How do I cite Pangea?',
    'Information about citing Pangea and the tools it uses can be ' +
      'found [here](/docs).',
  ],
];

interface QuestionPropType {
  question: string;
  rawAnswer: string;
}

interface QuestionStateType {
  question: string;
  answer: string;
}

class Question extends React.Component<QuestionPropType, QuestionStateType> {
  constructor(props: QuestionPropType) {
    super(props);
    const parser = new Parser();
    const renderer = new HtmlRenderer();
    const rawAnser: string = this.props.rawAnswer;
    const answer: string = renderer.render(parser.parse(rawAnser));
    this.state = { question: this.props.question, answer: answer };
  }

  render() {
    return (
      <div>
        <h3>{this.state.question}</h3>
        <span dangerouslySetInnerHTML={{ __html: this.state.answer }} />
      </div>
    );
  }
}

const DocsFaq: React.FC = () => (
  <Row>
    <h1>Frequently Asked Questions</h1><br/>
    {faqs.map((faq, index) => {
      return <Question key={index} question={faq[0]} rawAnswer={faq[1]} />;
    })}
  </Row>
);

export default DocsFaq;
