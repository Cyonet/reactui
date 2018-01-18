import React from 'react';
import {
  Row,
  Col,
} from '../components/Layout';
import Button from '../components/Button';
import Upload from '../components/Upload';
import Icon from '../components/Icon';

export default class UploadDemo extends React.Component {
  url = 'http://2betop.net/fileupload.php';
  formData = { token: 'c71f49f5a7644087b97ccb63165bfbe3' };
  handleDelete = () => {};

  render() {
    return (
      <Row type="flex">
        <Col style={{ padding: 12 }}>
          <Upload
            url={this.url}
            formData={this.formData}
            fileType={['pdf']}
            type="drag"
          >
            <div className="demo-upload-drag">
              <Icon type="inbox" className="demo-upload-icon" />
              <p>Click or drag file to this area to upload</p>
            </div>
          </Upload>
        </Col>
        <Col style={{ padding: 12 }}>
          <Upload
            url={this.url}
            formData={this.formData}
            fileType={['pdf']}
          >
            <Button width={100} type="primary">上传</Button>
          </Upload>
        </Col>
        <Col style={{ padding: 12 }}>
          <Upload
            url={this.url}
            formData={this.formData}
            type="picture-card"
            fileType={['png', 'jpeg']}
          >
            <Icon type="plus" className="demo-upload-icon" />
          </Upload>
        </Col>
      </Row>
    );
  }
}
