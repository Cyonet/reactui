import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import WebUploader from 'webuploader';
import WebUploaderFlash from 'webuploader/dist/Uploader.swf';
import { inArray, noop, isPlainObject } from '../../utils/utils';
import uid from '../../utils/uid';
import UploadList from './UploadList';

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
    if (/png|jpg|jpeg|webp|gif$/.test(extend)) {
      if (!inArray(mime, MIME_TYPES.image)) mime.push(MIME_TYPES.image);
    } else if (/xls(x)?$/.test(extend)) {
      if (!inArray(mime, MIME_TYPES.excel)) mime.push(MIME_TYPES.excel);
    } else if (/doc(x)?$/.test(extend)) {
      if (inArray(mime, MIME_TYPES.word)) mime.push(MIME_TYPES.word);
    } else if (/pdf$/.test(extend)) {
      if (inArray(mime, MIME_TYPES.pdf)) mime.push(MIME_TYPES.pdf);
    }
  });
  return mime.join(',');
};

function fileEx(file, keys, value) {
  const cache = file || {};
  if (typeof keys === 'object') {
    Object.keys(keys).forEach(key => { cache[key] = keys[key]; });
  } else if (keys) {
    cache[keys] = value;
  }
  cache.id = cache.id || uid();
  return cache;
}
// 去重, 后添加的覆盖前面的
function unique(fileList) {
  const res = [];
  const json = {};
  for (let i = fileList.length - 1; i >= 0; i--) {
    if (!json[fileList[i].id]) {
      res.push(fileList[i]);
      json[fileList[i].id] = 1;
    }
  }
  return res;
}

function format(fileList) {
  const arr = [];
  fileList.forEach(file => arr.push(fileEx({}, { url: file, progress: -2 })));
  return arr;
}
class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: format(props.fileList || []),
    };
  }
  componentDidMount() {
    const {
      url,
      fileType,
      fileSizeLimit,
      fileSingleSizeLimit,
      beforeUpload,
      onSelect,
      onSuccess,
      onError,
      auto,
      onValidateError,
      onBeforeUploadSend,
      type,
      formData,
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
      thumb: {
        width: 100,
        height: 100,
        quality: 70,
        allowMagnify: true,
      },
      auto,
      formData,
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
    this.uploader.on('fileQueued', (file) => {
      const { fileList } = this.state;
      const cache = fileEx(file, 'percentage', -1);
      if (this.isPictureCad()) {
        this.uploader.makeThumb(file, (error, src) => {
          if (!error) {
            cache.thumb = src;
          }
          this.setState({ fileList: unique([...fileList, cache]) });
        }, 100, 100);
      } else {
        this.setState({ fileList: unique([...fileList, cache]) });
      }
      onSelect(cache);
    });
    // 文件上传开始
    // this.uploader.on('startUpload', (...other) => {
    //   // const { fileList } = this.state;
    //   console.info('startUpload', other);
    //   // this.setState({ fileList: unique([...fileList, fileEx(file, 'progress', -1)]) });
    // });
    // 文件上传前额外参数回调
    this.uploader.on('uploadBeforeSend', (object, data, headers) => {
      onBeforeUploadSend(object, data, headers);
      Object.assign(headers, { Accept: '*/*' });
    });
    // 文件上传进度
    this.uploader.on('uploadProgress', (file, percentage) => {
      const { fileList } = this.state;
      this.setState({ fileList: unique([...fileList, fileEx(file, 'percentage', percentage)]) });
    });
    // 文件上传成功
    this.uploader.on('uploadSuccess', (file, res) => {
      console.info('uploadSuccess', file);
      const { fileList } = this.state;
      const fileCache = fileEx(file, {
        response: res,
        percentage: 1,
      });
      let list = [];
      if (res.code === '0' || res.responseCode === '0') {
        list = unique([...fileList, fileCache]);
        onSuccess(fileCache, list);
      } else {
        fileCache.error = true;
        list = unique([...fileList, fileCache]);
        onError(fileCache, list);
      }
      this.setState({ fileList: list });
    });
    // 文件上传失败
    this.uploader.on('uploadError', (file, status) => {
      const fileCache = fileEx(file, { error: true, percentage: -1, errMsg: status });
      const { fileList } = this.state;
      const list = unique([...fileList, fileCache]);
      this.setState({ fileList: list });
      onError(fileCache, list);
    });
    // 上传错误, 验证未通过
    this.uploader.on('error', (error, ...other) => {
      switch (error) {
        case 'Q_EXCEED_NUM_LIMIT': // 文件超出个数
        {
          onValidateError(`上传文件最多超过${other[0]}个`, other[1], other[0]);
          break;
        }
        case 'Q_EXCEED_SIZE_LIMIT': // 文件大小超限
        {
          onValidateError(`文件大小超过${(other[0] / 1024).toFixed(2)}M`, other[1], other[0]);
          break;
        }
        case 'Q_TYPE_DENIED':// 文件类型错误
        {
          onValidateError('文件格式错误', other[0]);
          break;
        }
        default:
        {
          onValidateError(error, ...other);
          break;
        }
      }
    });
  }
  componentWillUnmount() {
    if (this.uploader) this.uploader.destroy();
  }
  _uploadeBegin = (f) => {
    const { fileList } = this.state;
    if (!this.uploader) return;
    if (f) {
      this.uploader.upload(f);
    } else {
      fileList.forEach(file => {
        if (file.error) {
          this.uploader.retry(file);
        } else {
          this.uploader.upload();
        }
      });
    }
  }
  _uploadeCancel = () => {
    if (this.uploader) this.uploader.stop(true);
  }
  isPictureCad() {
    const { type } = this.props;
    return type === 'picture-card';
  }
  handleDelete = () => {
    // TOOD
  }
  render() {
    const {
      type,
      children,
      className,
      show,
      onPreview,
    } = this.props;
    const { fileList } = this.state;
    if (type === 'picture-card') {
      return (
        <ul className="upload-picture">
          {
            fileList.map(file => (
              <UploadList
                file={file}
                type={type}
                key={file.id}
                onDelete={this.handleDelete}
                onPreview={onPreview}
              />))
          }
          <li
            className="upload-picture-uploader"
            ref={(ref) => { this.node = ref; }}
          >
            { children }
          </li>
        </ul>
      );
    } else if (type === 'drag') {
      return (
        <div
          className={classNames('upload-drag', className)}
        >
          <div className="upload-drag-uploader" ref={(ref) => { this.node = ref; }}>
            {
              children
            }
          </div>
          {
            (
              show &&
              (
                <ul className="upload-drag-list">
                  {
                    fileList.map(file => (
                      <UploadList
                        file={file}
                        type={type}
                        key={file.id}
                        onDelete={this.handleDelete}
                      />))
                  }
                </ul>
              )) || null
          }
        </div>
      );
    }
    return (
      <div className="upload">
        <div className="upload-normal" ref={(ref) => { this.node = ref; }}>
          { children }
        </div>
        {
          (show &&
            (
              <ul className="upload-normal-list">
                {
                  fileList.map(file => (
                    <UploadList
                      file={file}
                      type={type}
                      key={file.id}
                      onDelete={this.handleDelete}
                    />))
                }
              </ul>
            )
          ) || null
        }
      </div>
    );
  }
}

Upload.propTypes = {
  type: PropTypes.oneOf(['drag', 'picture-card', 'button']),
  auto: PropTypes.bool,
  children: PropTypes.node,
  show: PropTypes.bool,
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  fileType: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileSizeLimit: PropTypes.number,
  fileSingleSizeLimit: PropTypes.number,
  beforeUpload: PropTypes.func,
  onBeforeUploadSend: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onValidateError: PropTypes.func,
  onSelect: PropTypes.func,
  onPreview: PropTypes.func,
  fileList: PropTypes.arrayOf(PropTypes.string),
  formData: (props, propName, componentName) => {
    if (!isPlainObject(props[propName])) {
      return new Error(`Invalid prop${propName}supplied to${componentName}. Validation failed.`);
    }
    return false;
  },
};

Upload.defaultProps = {
  type: 'button',
  auto: true,
  show: true,
  children: null,
  className: '',
  fileSizeLimit: 0,
  fileSingleSizeLimit: 0,
  beforeUpload: returnTrue,
  onBeforeUploadSend: noop,
  onSelect: noop,
  onSuccess: noop,
  onError: noop,
  onValidateError: noop,
  onPreview: noop,
  fileList: [],
  formData: {},
};

export default Upload;
