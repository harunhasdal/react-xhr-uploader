import React from 'react';
import XHRUploader from '../src/index.js';

const UPLOAD_URL = 'http://localhost:3000/api/uploadfile';

export default class Demo extends React.Component {
  render() {
    return (
      <div>
        <article>
          <p>Default usage comes up with an upload button for manual instantiation of the upload and supports one file.</p>
          <pre style={{fontSize: 10}}>
        {`
<XHRUploader
url='${UPLOAD_URL}'
/>
        `}
          </pre>
          <XHRUploader url={UPLOAD_URL}/>
        </article>
        <article>
          <p>You can enable automatic upload after drag and drop or file selection with <pre>auto</pre> property to get rid of the upload button.</p>
          <pre style={{fontSize: 10}}>
            {`
<XHRUploader
url='${UPLOAD_URL}'
auto
/>
            `}
          </pre>
          <XHRUploader url={UPLOAD_URL} auto/>
        </article>
        <article>
          <p>You can enable multiple file support with <pre>maxFiles</pre> property</p>
          <pre style={{fontSize: 10}}>
            {`
<XHRUploader
url='${UPLOAD_URL}'
auto
maxFiles={5}
/>
            `}
          </pre>
          <XHRUploader url={UPLOAD_URL} auto maxFiles={5}/>
        </article>
        <article>
          <p>You can enable chunked file upload with <pre>chunks</pre> and <pre>chunkSize</pre> properties</p>
          <pre style={{fontSize: 10}}>
        {`
<XHRUploader
url='${UPLOAD_URL}'
auto
maxFiles='1'
chunks
chunkSize='512 * 1024'
/>
        `}
          </pre>
          <XHRUploader
            url={UPLOAD_URL}
            auto
            chunks
            chunkSize={512 * 1024}
          />
        </article>
        <article>
          <h2>Customising look and feel</h2>
          <p>The component accepts a <pre>style</pre> property as a javascript object to override the default styles of the component.</p>
          <p>Following is the default styles object the component uses. You can modify this object with your styles and pass in props.</p>
          <pre style={{fontSize: 10}}>
            {`
  const defaultStyles = {
  root: {
    border: '1px solid #CACACA',
    padding: 20
  },
  dropTargetStyle: {
    border: '3px dashed #4A90E2',
    padding: 10,
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  dropTargetActiveStyle: {
    backgroundColor: '#ccffcc'
  },
  placeHolderStyle: {
    paddingLeft: '20%',
    paddingRight: '20%',
    textAlign: 'center'
  },
  uploadButtonStyle: {
    width: '100%',
    marginTop: 10,
    height: 32,
    alignSelf: 'center',
    cursor: 'pointer',
    backgroundColor: '#D9EBFF',
    border: '1px solid #5094E3',
    fontSize: 14
  },
  fileset: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderTop: '1px solid #CACACA'
  },
  fileDetails: {
    paddingTop: 10,
    display: 'flex',
    alignItems: 'flex-start'
  },
  fileName: {
    flexGrow: '8'
  },
  fileSize: {
    'float': 'right',
    flexGrow: '2',
    alignSelf: 'flex-end'
  },
  removeButton: {
    alignSelf: 'flex-end',
  },
  progress: {
    marginTop: 10,
    width: '100%',
    height: 16,
    WebkitAppearance: 'none'
  }
};
            `}
          </pre>
        </article>
      </div>
    );
  }
}
