import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

interface TeammateTypeProp {
  teammate: TeammateType;
}

interface TeammateType {
  imageName: string;
  name: string;
  position: string;
  role: string;
  email: string;
 }

const team: Array<TeammateType> = [
  {
    imageName: 'mason.png',
    name: 'Christopher E. Mason, Ph.D.',
    position: 'Principal Investigator',
    role: 'Associate Professor',
    email: 'chm2042@med.cornell.edu'
  },
  {
    imageName: 'danko.jpg',
    name: 'David C. Danko',
    position: 'Lead Developer',
    role: 'Ph.D. Student',
    email: 'dcd3001@med.cornell.edu'
  },
  {
    imageName: 'cem.jpg',
    name: 'Cem Meydan, Ph.D.',
    position: 'Developer',
    role: 'Post-Doctoral Researcher',
    email: ''
  },
];

class Teammate extends React.Component<TeammateTypeProp, {}> {
  private teammate: TeammateType;

  constructor(props: TeammateTypeProp) {
    super(props);

    this.teammate = this.props.teammate;
  }

  render() {
    return (
      <Row>
        <Col lg={4}>
          <img
            src={require(`./images/${this.teammate.imageName}`)}
            style={{height: '200px', borderRadius: '50%'}}
            alt={this.teammate.name}
          />
        </Col>
        <Col lg={6} lgOffset={2}>
          <h4>{this.teammate.name}</h4>
          <h5>{this.teammate.position}</h5>
          <h5>{this.teammate.role}</h5>
          <h5>{this.teammate.email}</h5>
        </Col>
      </Row>
      );
  }
}

class Team extends React.Component {
  render() {
    return (
      <div>
        <h1>The Team</h1>
        {
          team.map((teammate, index) => {
            return (
              <div key={index}>
                {(index !== 0) &&
                  <hr />
                }
                <Teammate teammate={teammate} />
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Team;
