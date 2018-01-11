import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import WebUploader from 'webuploader';
import WebUploaderFlash from 'webuploader/dist/Uploader.swf';
import 'webuploader/dist/webuploader.css';
import { inArray, noop } from '../../utils/utils';
import uid from '../../utils/uid';

function returnTrue() {
  return true;
}

const MIME_TYPES = {
  excel: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  image: 'image/*',
  word: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
};

const getMime = (_extends) => {
  const mime = [];
  _extends.forEach(extend => {
    if (extend.match(/png|jpg|jpeg|webp|gif$/)) {
      if (!inArray(mime, MIME_TYPES.image)) mime.push(MIME_TYPES.image);
    } else if (extend.match(/xls(x)?$/)) {
      if (!inArray(mime, MIME_TYPES.excel)) mime.push(MIME_TYPES.excel);
    } else if (extend.match(/doc(x)?$/)) {
      if (inArray(mime, MIME_TYPES.word)) mime.push(MIME_TYPES.word);
    } else if (extend.math(/pdf$/)) {
      if (inArray(mime, MIME_TYPES.pdf)) mime.push(MIME_TYPES.pdf);
    }
  });
  return mime.join(',');
};

function fileEx(file, key, value) {
  if (file.self === '@upload/file') {
    return { ...file, [key]: value };
  }
  return {
    file,
    [key]: value,
    id: file.id || uid(),
    self: '@upload/file',
  };
}
// 去重, 后添加的覆盖前面的
function unique(fileList) {
  const res = [];
  const json = {};
  for (let i = fileList.length - 1; i >= 0; i--) {
    if (!json[fileList[i].id]) {
      res.push(fileList[i].id);
      json[fileList[i].id] = 1;
    }
  }
  return res;
}

function format(fileList) {
  const arr = [];
  fileList.forEach(file => arr.push(fileEx({}, 'url', file)));
  return arr;
}
class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: format(props.fileList || []),
      file: null,
    };
  }
  componentDidMount() {
    const {
      url,
      fileType,
      fileSizeLimit,
      fileSingleSizeLimit,
      beforeUpload,
      onSuccess,
      onBeforeUploadSend,
      type,
    } = this.props;
    const options = {
      swf: WebUploaderFlash,
      pick: {
        id: this.node,
        multiple: false,
      },
      server: url,
      duplicate: true,
      accept: {
        mimeTypes: getMime(fileType),
        extensions: fileType.join(','),
      },
    };
    if (fileSingleSizeLimit) {
      // 单个文件大小限制
      options.fileSingleSizeLimit = fileSingleSizeLimit;
    }
    if (fileSizeLimit) {
      // 总文件大小
      options.fileSizeLimit = fileSizeLimit;
    }
    if (type !== 'picture-card') {
      options.threads = 1;
    }
    this.uploader = WebUploader.create(options);
    this.uploader.reset();
    // 文件上传前回调
    this.uploader.on('beforeFileQueued', (file) => beforeUpload(file));
    // 文件上传开始
    this.uploader.on('startUpload', (file) => {
      if (this.isPictureCad()) {
        const { fileList } = this.state;
        this.setState({ fileList: unique([...fileList, fileEx(file, 'progress', -1)]) });
      } else {
        this.setState({ file: fileEx(file, 'progress', -1) })
      }
    });
    // 文件上传前额外参数回调
    this.uploader.on('uploadBeforeSend', (object, data, headers) => {
      onBeforeUploadSend(object, data, headers);
      Object.assign(headers, { Accept: '*/*' });
    });
    // 文件上传进度
    this.uploader.on('uploadProgress', (file, percentage) => {
      if (this.isPictureCad()) {
        const { fileList } = this.state;
        this.setState({ fileList: unique([...fileList, fileEx(file, 'progress', percentage)]) });
      } else {
        this.setState({ file: fileEx(file, 'progress', percentage) })
      }
    });
    // 文件上传成功
    this.uploader.on('uploadSuccess', (file, res) => {
      if (res.code === '0') {
        this.setState({filename: `成功上传：${file.name}`})
        onSuccess(file)
      } else {
        this.setState({failed: true, filename: `上传失败：${file.name}`})
        onError(res)
      }
    })
    // 文件上传失败
    this.uploader.on('uploadError', (file, status) => {
      this.setState({failed: true, filename: `上传失败：${file.name}`})
      onError({code: status, msg: `上传失败，错误代码：${status}`})
    })
    // 文件上传完成
    this.uploader.on('uploadComplete', (file) => {
      this.setState({progress: -1})
    })
  }
  componentWillUnmount() {
    if (this.uploader) this.uploader.destroy();
  }
  _uploadeBegin = () => {
    const { failed } = this.state;
    if (!this.uploader) return;
    if (failed) {
      this.uploader.retry(this.uploader.getFiles()[0]);
    } else {
      this.uploader.upload();
    }
  }
  _uploadeCancel = () => {
    if (this.uploader) this.uploader.stop(true);
  }
  isPictureCad() {
    const { type } = this.props;
    return type === 'picture-card';
  }
  render() {
    const { type, children, className } = this.props;
    const { fileList } = this.state;
    if (type === 'picture-card') {
      return (
        <div className="upload-picture">
          <div
            className="upload-picture-uploader"
            ref={(ref) => { this.node = ref; }}
          >
            { className }
          </div>
        </div>
      );
    } else if (type === 'drag') {
      return (
        <div
          className={classNames('upload-drag', className)}
          ref={(ref) => { this.node = ref; }}
        >
          <span className="upload-drag-inner">
            {
              children
            }
          </span>
        </div>
      );
    }
    return cloneElement(children, { ...children.props, ref: (ref) => { this.node = ref; } });
  }
}

Upload.propTypes = {
  type: PropTypes.oneOf(['drag', 'picture-card', 'button']),
  auto: PropTypes.bool,
  children: PropTypes.node,
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  fileType: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileSizeLimit: PropTypes.number,
  fileSingleSizeLimit: PropTypes.number,
  beforeUpload: PropTypes.func,
  onBeforeUploadSend: PropTypes.func,
  onSuccess: PropTypes.func,
  fileList: PropTypes.arrayOf(PropTypes.string),
  max: PropTypes.number,
};

Upload.defaultProps = {
  type: 'button',
  auto: true,
  children: null,
  className: '',
  fileSizeLimit: 0,
  fileSingleSizeLimit: 0,
  max: 1,
  beforeUpload: returnTrue,
  onBeforeUploadSend: noop,
  onSuccess: noop,
  fileList: [],
};

export default Upload;
