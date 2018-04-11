import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, NULL } from '../../utils/utils';

export default class Form extends React.Component {
  getChildContext() {
    return { form: this };
  }
  onChange = (name, value) => {
    const { onChange } = this.props;
    onChange(name, value);
  };
  getFieldsDefaultValue(names) {
    const cache = {};
    if (Array.isArray(names)) {
      this.fields.filter(field => names.indexOf(field.props.name) >= 0).forEach(field => {
        cache[field.props.name] = field.getDefaultValue() || '';
      });
    } else {
      this.fields.forEach(field => {
        cache[field.props.name] = field.getDefaultValue() || '';
      });
    }
    return cache;
  }
  getFiledValue(name) {
    if (name) {
      const field = this.fields.filter(item => item.props.name === name)[0];
      return field && field.getValue();
    }
    return this.getFieldsValue();
  }
  getFieldsValue(names) {
    const cache = {};
    if (Array.isArray(names)) {
      this.fields.filter(field => names.indexOf(field.props.name) >= 0).forEach(field => {
        cache[field.props.name] = field.getValue();
      });
    } else {
      this.fields.forEach(field => {
        cache[field.props.name] = field.getValue();
      });
    }
    return cache;
  }
  fields = [];
  addField(field) {
    this.fields.push(field);
  }
  removeField(field) {
    if (field.props.name) {
      this.fields.splice(this.fields.indexOf(field), 1);
    }
  }
  resetFields() {
    this.fields.forEach(field => {
      field.resetField();
    });
  }
  validate(cd) {
    return new Promise((resolve, reject) => {
      let valid = true;
      let count = 0;
      if (this.fields.length === 0 && cd) {
        cd(true);
        resolve(true);
      }
      this.fields.forEach(field => {
        field.validate('', errors => {
          if (errors) {
            valid = false;
          }
          if (++count === this.fields.length) {
            if (typeof cd === 'function') {
              cd(valid);
            }
            if (valid) {
              resolve(true);
            } else {
              reject(new Error(`${field.props.name} validating false`));
            }
          }
        });
      });
    });
  }
  validateField(name, cd) {
    const field = this.fields.filter(item => item.props.name === name)[0];
    if (field) field.validate('', cd);
  }
  render() {
    const { component, className, children } = this.props;
    const classes = classNames(
      'form',
      className,
      `label-text-${this.props.labelAlign}`,
      `label-${this.props.labelPosition}`,
    );
    return React.createElement(component, { className: classes }, children);
  }
}
Form.propTypes = {
  labelPosition: PropTypes.oneOf(['left', 'top', 'inline']),
  labelAlign: PropTypes.oneOf(['left', 'center', 'right']),
  component: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
};
Form.defaultProps = {
  labelPosition: 'left',
  labelAlign: 'left',
  component: 'form',
  className: '',
  children: NULL,
  onChange: noop,
};
Form.childContextTypes = {
  form: PropTypes.any,
};
