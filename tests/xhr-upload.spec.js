// import React from 'react';
import XHRUploader from '../src/index.js';
// import {shallow} from 'enzyme';
import {expect} from 'chai';

describe('XHRUploader component', () => {
  it('should be defined', () => {
    expect(XHRUploader).to.exist;
  });
  // let instance = null;
  beforeEach(() => {
    // instance = shallow(<XHRUploader url="/test"/>);
  });


  describe('when rendered into the document', () => {
    it('should render', () => {
      // expect(instance.equals(XHRUploader)).to.equal(true);
    });

    it('should have correct defaults', () => {
      // expect(instance.props.auto).to.equal(false);
      // expect(instance.props.maxFiles).to.equal(1);
      // expect(instance.props.maxSize).to.equal(25 * 1024 * 1024);
      // expect(instance.props.chunks).to.equal(false);
      // expect(instance.props.encrypt).to.equal(false);
      // expect(instance.props.debug).to.equal(false);
    });

    it('should have no items in state initially', () => {
      // expect(instance.state.items).to.be.empty;
    });

    it('should have active state when there is an active drag event', () => {
      // TestUtils.Simulate.dragEnter(instance.refs.dropTarget);
      // expect(instance.state.isActive).to.be.true;
      // TestUtils.Simulate.dragOver(instance.refs.dropTarget);
      // expect(instance.state.isActive).to.be.true;
      // TestUtils.Simulate.dragLeave(instance.refs.dropTarget);
      // expect(instance.state.isActive).to.be.false;
      // TestUtils.Simulate.dragEnter(instance.refs.dropTarget);
      // expect(instance.state.isActive).to.be.true;
      // TestUtils.Simulate.drop(instance.refs.dropTarget);
      // expect(instance.state.isActive).to.be.false;
    });
  });
});
