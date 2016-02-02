import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import XHRUploader from '../src/index.js';

describe('XHRUploader component', () => {
  it('should be defined', () => {
    expect(XHRUploader).to.exist;
  });

  let instance;
  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(<XHRUploader url="/test"/>);
  });

  afterEach(() => {

  });

  describe('when rendered into the document', () => {
    it('should render', () => {
      expect(TestUtils.isCompositeComponent(instance)).to.be.true;
    });

    it('should have correct defaults', () => {
      expect(instance.props.auto).to.be.false;
      expect(instance.props.maxFiles).to.equal(1);
      expect(instance.props.maxSize).to.equal(25 * 1024 * 1024);
      expect(instance.props.chunks).to.be.false;
      expect(instance.props.encrypt).to.be.false;
      expect(instance.props.debug).to.be.false;
    });

    it('should have no items in state initially', () => {
      expect(instance.state.items).to.be.empty;
    });

    it('should have active state when there is an active drag event', () => {
      TestUtils.Simulate.dragEnter(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.true;
      TestUtils.Simulate.dragOver(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.true;
      TestUtils.Simulate.dragLeave(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.false;
      TestUtils.Simulate.dragEnter(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.true;
      TestUtils.Simulate.drop(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.false;
    });
  });
});
