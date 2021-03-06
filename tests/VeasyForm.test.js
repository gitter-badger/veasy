/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import Enzyme, { mount, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import renderer from 'react-test-renderer';
import VeasyForm from '../src/VeasyForm';
import * as lib from '../src/helpers/helpers';

Enzyme.configure({ adapter: new Adapter() });

const Input = () => <input type="text" />;
const Email = () => <input type="email" />;

describe('Test the <VeasyForm /> rendering', () => {
  let mockSchema;
  let mockTarget;
  let mockComponent;
  let componentToRender;

  beforeEach(() => {
    mockSchema = {
      title: {
        minLength: 1,
        default: ''
      }
    };
    mockTarget = {
      name: 'title',
      value: 'abc'
    };
    mockComponent = {
      state: {
        isFormOK: false,
        title: {
          status: 'normal',
          errorText: '',
          value: ''
        }
      },
      setState: () => {}
    };
    componentToRender = (
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <div>
          <p>
            <Input name="title" />
          </p>
        </div>
        <input />
        <div>
          <Email super="ok" cool="true" />
        </div>
      </VeasyForm>
    );
  });

  test('should allows to set 3 props', () => {
    const wrapper = mount(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
      </VeasyForm>
    );
    expect(wrapper.find(VeasyForm)).toHaveLength(1);
    expect(wrapper.props().schema).toEqual(mockSchema);
    expect(wrapper.props().allState).toEqual(mockComponent.state);
    expect(wrapper.props().update).toEqual(mockComponent.setState);
  });

  test('should render properly with button', () => {
    const wrapper = renderer.create(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input type="text" />
        <button type='reset' />
      </VeasyForm>
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('Should add onChange function to Input', () => {
    const wrapper = mount(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
    );
    expect(wrapper.find('form')).toHaveLength(1);
    expect(typeof wrapper.find('Input').prop('onChange')).toEqual('function');
    wrapper.find('Input').prop('onChange')({
      preventDefault: () => {},
      persist: () => {},
      target: mockTarget
    });
  });

  test('Should render 3 inputs as children of section', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input />
        <input />
        <input />
      </VeasyForm>
    );
    const children = wrapper.find('form').children();
    expect(children).toHaveLength(3);
    expect(children.find('input')).toHaveLength(3);
  });

  test('The 1st children should have extra props', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
    );
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toEqual('title');
    expect(targetInput.prop('status')).toEqual('normal');
    expect(targetInput.prop('errorText')).toEqual('');
    expect(targetInput.prop('value')).toEqual('');
  });

  test('The 2nd and 3rd children shouldn`t have extra props', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
    );
    const targetInput = wrapper.find('input').at(1);
    expect(targetInput.prop('name')).toBe(undefined);
    expect(targetInput.prop('status')).toBe(undefined);
    expect(targetInput.prop('errorText')).toBe(undefined);
    expect(targetInput.prop('value')).toBe(undefined);

    const targetInput1 = wrapper.find('input').at(2);
    expect(targetInput1.prop('name')).toBe(undefined);
    expect(targetInput1.prop('status')).toBe(undefined);
    expect(targetInput1.prop('errorText')).toBe(undefined);
    expect(targetInput1.prop('value')).toBe(undefined);
  });

  test('Should not bind the html tag', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input name="title" />
      </VeasyForm>
    );
    const targetInput = wrapper.find('input').at(0);
    expect(targetInput.prop('name')).toBe('title');
    expect(targetInput.prop('status')).toBe(undefined);
    expect(targetInput.prop('errorText')).toBe(undefined);
    expect(targetInput.prop('value')).toBe(undefined);
  });

  test('Should not bind element which name is not in the schema', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="super" />
      </VeasyForm>
    );
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toBe('super');
    expect(targetInput.prop('status')).toBe(undefined);
    expect(targetInput.prop('errorText')).toBe(undefined);
    expect(targetInput.prop('value')).toBe(undefined);
  });

  test('Should not crash when dealing with non-react element', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        {true && <Input name="super" />}
        <p>super hero</p>
      </VeasyForm>
    );
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toBe('super');
    expect(targetInput.prop('status')).toBe(undefined);
    expect(targetInput.prop('errorText')).toBe(undefined);
    expect(targetInput.prop('value')).toBe(undefined);
  });

  test('Should bind recursive element', () => {
    const wrapper = shallow(componentToRender);
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toBe('title');
    expect(targetInput.prop('status')).toBe('normal');
    expect(targetInput.prop('errorText')).toBe('');
    expect(targetInput.prop('value')).toBe('');
  });

  test('Should maintain the user`s prop', () => {
    const wrapper = shallow(componentToRender);
    const targetInput = wrapper.find('Email').at(0);
    expect(targetInput.prop('super')).toBe('ok');
    expect(targetInput.prop('cool')).toBe('true');
  });

  test('Should render a form with 3 inputs with extra props', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
        name="super"
        action="google"
        onSubmit={() => {}}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
    );
    const form = wrapper.find('form').at(0);
    expect(form.prop('name')).toEqual('super');
    expect(form.prop('action')).toEqual('google');
    expect(typeof form.prop('onSubmit')).toEqual('function');
  });

  test('Should render a div when tag set to div', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
        tag="div"
      >
        <input />
        <input />
      </VeasyForm>
    );
    expect(wrapper.find('form')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('div').children()).toHaveLength(2);
  });
});

describe('Test the <VeasyForm /> interaction', () => {
  let mockSchema;
  let mockTarget;
  let mockComponent;
  let componentToRender;

  beforeEach(() => {
    mockSchema = {
      title: {
        minLength: 1,
        default: ''
      }
    };
    mockTarget = {
      name: 'title',
      value: 'abc'
    };
    mockComponent = {
      state: {
        isFormOK: false,
        title: {
          status: 'normal',
          errorText: '',
          value: ''
        }
      },
      setState: () => {}
    };
    componentToRender = (
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <div>
          <p>
            <Input name="title" />
          </p>
        </div>
        <input />
        <div>
          <Email super="ok" cool="true" />
        </div>
      </VeasyForm>
    );
  });

  test('trigger onBlur should invoke triggerValidation', () => {
    const wrapper = shallow(componentToRender);
    const mockTrigger = jest.fn();
    wrapper.instance().triggerValidation = mockTrigger;
    expect(mockTrigger.mock.calls.length).toBe(0);
    const target = wrapper.find('form').at(0);
    target.simulate('blur');
    expect(mockTrigger.mock.calls.length).toBe(1);
  });

  test('should trigger lib.resetForm', () => {
    const mockReset = jest.fn();
    const mockUpdate = jest.fn();
    lib.resetForm = mockReset;
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockUpdate}
      >
        <div>
          <p>
            <Input name="title" />
          </p>
        </div>
        <input />
        <div>
          <Email super="ok" cool="true" />
        </div>
      </VeasyForm>
    );
    const target = wrapper.find('form').at(0);
    target.simulate('reset', { preventDefault: () => {} });
    expect(mockReset.mock.calls.length).toBe(1);
    const params = mockReset.mock.calls[0];
    expect(params[0]).toEqual({
      title: {
        default: '',
        minLength: 1
      }
    });
    expect(params[1]).toEqual({
      isFormOK: false,
      title: { errorText: '', status: 'normal', value: '' }
    });
    expect(mockUpdate.mock.calls.length).toBe(1);
  });

  test('should not validate if the event owner is not included in the schema', () => {
    const wrapper = shallow(componentToRender);
    const target = wrapper.find('Email').at(0);
    expect(target.prop('onChange')).toBeFalsy();
    expect(target).toBeTruthy();

    const mockTrigger = jest.fn();
    wrapper.instance().triggerValidation = mockTrigger;

    target.simulate('change');
    expect(mockTrigger.mock.calls.length).toBe(0);
  });
})
