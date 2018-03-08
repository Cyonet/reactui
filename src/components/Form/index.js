import Form from './Form';
import FormItem from './FormItem';
import Warpper from './Warpper';
import Input from './Input';
import InputNumber from './InputNumber';
import Select from './Select';
import { Radio, RadioGroup } from './Radio';
import { Checkbox, CheckboxGroup } from './Checkbox';

Form.Input = Warpper(Input);
Form.InputNumber = Warpper(InputNumber);
Form.Select = Warpper(Select);
Form.Radio = Warpper(Radio);
Form.RadioGroup = Warpper(RadioGroup);
Form.Checkbox = Warpper(Checkbox);
Form.CheckboxGroup = Warpper(CheckboxGroup);
Form.Item = FormItem;
export default Form;
