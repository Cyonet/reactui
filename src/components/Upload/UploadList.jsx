import React from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../utils/utils';
import Icon from '../Icon';

class UploadList extends React.Component {
  handlePreview = () => {
    const { file, onPreview } = this.props;
    onPreview(file);
  };
  handleDelete = () => {
    const { file, onDelete } = this.props;
    onDelete(file);
  }
  render() {
    const { file, type } = this.props;
    if (type === 'picture-card') {
      return (
        <li className="upload-item upload-picture-card">
          <div className="upload-item-picture">
            {
              (
                file.progress === -2 &&
                (<img src={file.url} alt="上传图片" />)
              ) ||
              (
                (
                  file.progress >= 0 && (
                    <div className="upload-item-uploading">
                      <span className="upload-uploading_text">文件上传中</span>
                      <div className="upload-progress">
                        <div
                          className="upload-progress-inline"
                          style={{ width: file.progress <= 0 ? 0 : `${file.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                ) ||
                (
                  file.response &&
                  (<img src={file.url} alt="上传图片" />)
                ) || null
              )
            }
          </div>
          <div className="upload-item-action">
            <Icon type="eye-o" onClick={this.handlePreview} />
            <Icon type="delete" onClick={this.handleDelete} />
          </div>
        </li>
      );
    }
    return (
      <li className="upload-item upload-item-inline">
        <Icon type="link" />
        <span className="upload-item-name">{file.name}</span>
        <Icon type="close" onClick={this.handleDelete} />
        <div className="upload-progress">
          <div
            className="upload-progress-inline"
            style={{ width: file.progress <= 0 ? 0 : `${file.progress * 100}%` }}
          />
        </div>
      </li>);
  }
}

UploadList.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    ilastModifiedDated: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
  onPreview: PropTypes.func,
  onDelete: PropTypes.func,
};

UploadList.defaultProps = {
  onPreview: noop,
  onDelete: noop,
};
export default UploadList;
