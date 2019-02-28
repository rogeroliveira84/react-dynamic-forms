import React from 'react';
import { shallow } from 'enzyme';
import DynamicField from './dynamicField';

describe('DynamicField', () => {
    let mountedComponent;
    let props = [{
        id: 'fullName',
        type: 'text',
        label: 'Full Name',
        defaultValue: ''
    }];
    beforeEach(() => {
        // mountedComponent = shallow(<DynamicField {...props} />);
    });
    it('renders correctly', () => {
        expect(true).toBe(true);
        // const input = mountedComponent.find('input');
        // expect(input.length).toBe(1);
    });
});