import React from 'react';
import XHRUploader from '../src/index.js';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

describe('XHRUploader component', () => {
  it('should be defined', () => {
    expect(XHRUploader).to.exist;
  });
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<XHRUploader url="/test" />);
  });

  describe('when rendered into the document', () => {
    it('should render', () => {
      const instance = wrapper.instance();
      expect(instance).to.be.instanceOf(XHRUploader);
    });

    it('should have no items in state initially', () => {
      expect(wrapper.state().items.length).to.equal(0);
    });

    it('should have active state when there is an active drag event', () => {
      const dropTarget = wrapper.find('[data-test-id="dropTarget"]');
      dropTarget.simulate('dragEnter');
      expect(wrapper.state().isActive).to.equal(true);
      dropTarget.simulate('dragOver');
      expect(wrapper.state().isActive).to.equal(true);
      dropTarget.simulate('dragLeave');
      expect(wrapper.state().isActive).to.equal(false);
    });
  });
});
