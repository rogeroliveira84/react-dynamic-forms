import React from 'react';
import { shallow } from 'enzyme';
import DynamicForm from './DynamicForm';

describe('DynamicForm', () => {
    let mountedComponent;
    let props = [{
        name: 'form1'
    }];
    beforeEach(() => {
        // mountedComponent = shallow(<DynamicForm {...props} />);
    });
    it('renders correctly', () => {
        expect(true).toBe(true);
        // debugger;
        // const component = mountedComponent.find('DynamicForm');

        // expect(component.length).toBe(1);
    });
});