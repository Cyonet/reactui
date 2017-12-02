# Modal 弹出层 #

## Modal ##
  props

  |参数|说明|类型|默认值|
  |:--|:--|:--|:--|
  |title|标题|any|无|
  |closeClass|关闭按钮className|string|无|
  |bodyClass|wapper的className|string|无|
  |headClass|头部的className|string|无|
  |contentClass|主体内容className|string|无|
  |footerClass|底部className|string|无|
  |closable|是否显示关闭按钮|bool|true|
  |footer|底部内容|any|无|
  |cancelText|取消按钮文案|any|取消|
  |okText|确定按钮文案|any|确定|
  |onClose|关闭回调|function||
  |onCancel|点击取消回调|function||
  |onOk|点击确定回调|function||
  |maskClosable|模态层是否可关闭|bool|true|
  |visible|控制显示隐藏,必传项|bool|false|
  |top|控制显示位置|center or number|center|



  method
  

     warning(option) 警告弹窗

  option

  |参数|说明|类型|默认值|
  |:--|:--|:--|:--|
  |contentClass|主体样式|string|styles.waring|
  |footerClass|底部样式|string|styles.waringFooter|
  |top|弹窗位置|string or number|center|
  |okType|确认按钮类型参考Button组件|string|primaryRed|
  |onOk|确定回调|function|——|
  |content|内容|string, node, number||
  |cancelText|取消按钮文本|any|'取消'|
  |okText|确定按钮文本|any|'确定'|


     error(option) 错误弹窗,单例模式

  option

  |参数|说明|类型|默认值|
  |:--|:--|:--|:--|
  |contentClass|主体样式|string|styles.waring|
  |footerClass|底部样式|string|styles.waringFooter|
  |top|弹窗位置|string or number|center|
  |onOk|确定回调|function|——|
  |content|内容|string, node, number||
  |onCancel|取消回调|function|---|


    alert(option) 提示弹窗

  option

  |参数|说明|类型|默认值|
  |:--|:--|:--|:--|
  |contentClass|主体样式|string|styles.waring|
  |top|弹窗位置|string or number|center|
  |content|内容|string, node, number||


    method方法参考`Confirm`类


## Confirm ##

    Confirm是无状态组件,内部应用Modal组件，其props参考Modal

props

|参数|说明|类型|默认值|
|:--|:--|:--|:--|
|getContainer|挂载节点|function||
|top|弹窗位置|string or number|center|
|content|内容|string, node, number||


## WrapDialog ##

    WrapDialog 组件功能主要负责挂载组件到react root域之外。


## Dialog ##

    Dialog 弹窗核心，遮罩、内容盒子

props

|参数|说明|类型|默认值|
|:--|:--|:--|:--|
|visible|控制弹窗是否显示|bool|false|
|animate|css动画名称|fade, zoom, slideDown, slideLeft, slideRight, slideUp, flip, rotate,''|fade|
|timeout|动画延迟时间|number|500|
|top|弹窗位置|string or number|center|
|bodyClass|wapper的className|string|无|