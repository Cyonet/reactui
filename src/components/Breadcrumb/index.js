import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import styles from './index.less';

class ItemRenderer extends React.Component {
    render() {
        const {enabled, data, className, style, path, itemProps, ...others} = this.props;
        const classes = classNames(className, styles.item, {[styles.link]: enabled});
        return <Link className={classes} style={style} to={enabled ? path : null} {...others}>{data.name}</Link>;
    }
}

export default class Breadcrumb extends React.Component {
    calcPropValue(data, index, arr, propName){
        if(this.props.hasOwnProperty(`${propName}Function`))
            return this.props[`${propName}Function`](data, index, arr);
        return this.props[propName];
    }
    render() {
        let {
            className,
            style,
            routes,
            params,
            itemProps,
            itemRenderer,
            itemRendererFunction,
            itemClassName,
            itemClassNameFunction,
            itemStyle,
            itemStyleFunction,
            separator,
            separatorFunction,
            header,
            footer,
            width,
            ...other} = this.props;

        let children = [];
        let numRoute = routes.length;
        routes.forEach((data, itemIndex, arr)=>{
            let paths = [];
            //fixed sometime no path
            if (!data.name) {
                return;
            }
            // fixed home path
            let path = data.path && data.path.replace(/^\/(?=\w)/, '');
            // params not be must
            params && Object.keys(params).forEach(key => {
                path = path.replace(`:${key}`, params[key]);
            });
            if (path) {
                paths.push(path);
            }
            let renderProps = {
                key: itemIndex,
                data,
                // onClick:this.onItemClick.bind(this, itemIndex),
                path: paths.join('/'),
                className:this.calcPropValue(data, itemIndex, arr, 'itemClassName'),
                style:this.calcPropValue(data, itemIndex, arr, 'itemStyle')
            };

            let ItemRendererClass = this.calcPropValue(data, itemIndex, arr, 'itemRenderer') || ItemRenderer;
            children.push(<ItemRendererClass itemProps={{...itemProps, itemIndex}} enabled={itemIndex !== numRoute -1} {...renderProps}/>);
            children.push(<span key={`separator-${itemIndex}`}>{this.calcPropValue(data, itemIndex, arr, 'separator')}</span>);
        });
        children.pop();
        return (
            <div className={classNames(styles.breadcrumb, className)} style={style} {...other}>
                {header}
                {children}
                {footer}
            </div>
        );
    }
}
Breadcrumb.defaultProps = {
  header:(<span>您的位置：</span>),
  separator: <Icon className={styles.separator} type="right"/>,
};
Breadcrumb.propTypes = {
  width: PropTypes.number
};
