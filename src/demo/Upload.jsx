import React from 'react';
import {
  Row,
  Col,
} from '../components/Layout';
import Button from '../components/Button';
import Upload from '../components/Upload';
import Icon from '../components/Icon';

export default class UploadDemo extends React.Component {
  url = 'https://secjc.zsteel.cc/cenpur-api/common/fileUpload.do';
  formData = { token: '123123' };
  handleDelete = () => {};

  render() {
    return (
      <Row type="flex">
        <Col>
          <Upload
            url={this.url}
            formData={this.formData}
            type="picture-card"
            fileType={['png', 'jpeg']}
          >
            <Icon type="cloud-upload-o" />
          </Upload>
        </Col>
        <Col>
          <Upload
            url={this.url}
            formData={this.formData}
            fileType={['pdf']}
          >
            <Button type="primary">上传</Button>
          </Upload>
        </Col>
        <Col>
          <Upload
            url={this.url}
            formData={this.formData}
            fileType={['pdf']}
          >
            <div>
              <Icon type="inbox" />
              <p>Click or drag file to this area to upload</p>
            </div>
          </Upload>
        </Col>
      </Row>
    );
  }
}
