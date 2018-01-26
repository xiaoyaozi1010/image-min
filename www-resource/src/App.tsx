import * as React from 'react';
import './App.css';
import Title from './Components/Title/Title';
import UploadComponent from './Components/Upload/UploadComponent';
import { Row, Col } from 'antd';

class App extends React.Component {
  state = {
    title: '',
    subTitle: ''
  };
  constructor(props: string) {
    super(props);
    this.state = {
      title: 'image-min',
      subTitle: 'A smaller image compression for designer.'
    };
  }
  render() {
    return (
      <div className="main">
        <Row align="middle">
          <Col>
            <Title title={this.state.title} subTitle={this.state.subTitle} />
          </Col>
        </Row>
        <Row>
          <Col>
            <UploadComponent />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
