import * as React from 'react';
import { HtmlRenderer, Parser } from 'commonmark';

const faqs: Array<[string, string]> = [
  [
    'Can I upload my own data to MetaGenScope?',
    'Not yet. In most cases we would be happy to process your data and ' +
      'upload it for you.',
  ],
  ['Who can use MetaGenScope?', 'Currently everyone can use MetaGenScope.'],
  [
    'How does MetaGenScope get its results?',
    'MetaGenScope relies on standard metagenomics tools assembled into the ' +
      'MetaUltra pipeline. More details can be found ' +
      '[here](/docs).',
  ],
  [
    'How are tools chosen for MetaGenScope?',
    'Currently tools are added based on their popularity and their ability ' +
      'to add a new perspective to the data.<br />We are always ' +
      'looking to add new tools. If you have a tool that you think ' +
      'should be part of MetaGenScope let us know!',
  ],
  [
    'When will v1.0 of MetaGenScope be released?',
    'Version 1.0 of MetaGenScope will be released by the end of May 2016. ' +
      'v0.9 is feature complete but may have bugs.',
  ],
  [
    'How did you choose the projects on MetaGenScope?',
    'MetaGenScope was originally developed to rapidly process data for the ' +
      'StuckOnU projects. We will be consistently be adding new ' +
      'projects.',
  ],
  [
    'Can you add a new feature?',
    "Probably, we're always open to new ideas! Get in touch with " +
      'dcd3001@med.cornell.edu',
  ],
  [
    'How do I cite MetaGenScope?',
    'Information about citing MetaGenScope and the tools it uses can be ' +
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
        <h4>{this.state.question}</h4>
        <span dangerouslySetInnerHTML={{ __html: this.state.answer }} />
      </div>
    );
  }
}

class FAQ extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => {
          return <Question key={index} question={faq[0]} rawAnswer={faq[1]} />;
        })}
      </div>
    );
  }
}

export default FAQ;
