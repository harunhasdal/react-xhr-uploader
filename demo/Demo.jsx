import React from 'react';
import XHRUploader from '../src/index.js';

const UPLOAD_URL = 'http://localhost:3000/api/uploadfile';

export default class Demo extends React.Component {
  render() {
    return (
      <div>
      <pre style={{fontSize: 10}}>
        {`
<XHRUploader
url='${UPLOAD_URL}'
auto
maxFiles='5'
/>
        `}
      </pre>
      <XHRUploader url={UPLOAD_URL} auto maxFiles={5}/>
      </div>
    );
  }
}
