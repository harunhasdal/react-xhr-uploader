import React from 'react';
import XHRUploader from '../src/index.js';

export default class Demo extends React.Component {
  render() {
    return (
      <div>
        <XHRUploader url="http://localhost:3000/api/uploadfile"/>
      </div>
    );
  }
}
