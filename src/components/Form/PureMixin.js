/**
 * R91 2017/5/15
 * PureRenderMixin
 */
import pureDecorator from 'utils/pureDecorator';
export default function(component) {
  pureDecorator(component);
  component.prototype.hasValue= function(){
    return ('value' in this.props);
  };
  return component;
}

