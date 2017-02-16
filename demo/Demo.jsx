import React from 'react';
import XHRUploader from '../src/index.js';

const UPLOAD_URL = 'http://localhost:3000/api/uploadfile';

const Demo = () => (
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
      <XHRUploader url={UPLOAD_URL} />
    </article>
    <article>
      <p>By default, the component uses POST method for file transver. The component accepts the 
      </p><pre>method</pre><p> property to specify different http method.</p>
      <pre style={{fontSize: 10}}>
        {`
          <XHRUploader
            url='${UPLOAD_URL}'
            method='PUT'
          />
        `}
      </pre>
      <XHRUploader url={UPLOAD_URL} method="PUT" />
    </article>
    <article>
      <p>You can enable automatic upload after drag and drop or file selection with </p>
      <pre>auto</pre>
      <p> property to get rid of the upload button.</p>
      <pre style={{fontSize: 10}}>
        {`
          <XHRUploader
            url='${UPLOAD_URL}'
            auto
          />
        `}
      </pre>
      <XHRUploader url={UPLOAD_URL} auto />
    </article>
    <article>
      <p>You can enable multiple file support with </p><pre>maxFiles</pre><p> property</p>
      <pre style={{fontSize: 10}}>
        {`
          <XHRUploader
            url='${UPLOAD_URL}'
            auto
            maxFiles={5}
          />
        `}
      </pre>
      <XHRUploader url={UPLOAD_URL} auto maxFiles={5} />
    </article>
    <article>
      <p>You can enable chunked file upload with</p><pre>chunks</pre> and <pre>chunkSize</pre> <p>properties</p>
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
        chunkSize={512 * 1024} />
    </article>
    <article>
      <h2>Customising look and feel</h2>
      <p>The component accepts a </p><pre>style</pre><p> property as a javascript object to override the default styles of the component.</p>
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
              alignSelf: 'flex-end'
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
      <p>You do not need to pass in the entire style object in order to modify a particular inline style... E.g. if you need to override only the</p>
      <pre>root</pre>
      <p>style, then you can pass your styles object as follows:</p>
      <pre style={{fontSize: 10}}>{`
        const myStyles = {root: {border: 'none', padding: 'none'}};
        <XHRUploader
          url='${UPLOAD_URL}'
          styles={myStyles}
        />
      `}</pre>
      <p>XhrUploader will set the default styles above for all properties except for the ones that you override.</p>
      <br />
      <h3>Styling upload action controls</h3>
      <p>For upload action controls, supply the following props as class names:</p>
      <pre>cancelIconClass</pre><pre>completeIconClass</pre><pre>uploadIconClass</pre>
      <p>If the above class names are not provided, default Font Awesome classes, e.g. 'fa fa-close', are stored.</p>
      <p>You will need to install FontAwesome if you would like to use their icons. </p>
      <br />
      <h3>Styling progress bar</h3>
      <p>The upload progress bar is styled as HTML5 native progress bar of the host browser. To customise it, supply the following class name:</p>
      <pre>progressClass</pre>
    </article>
  </div>
);

export default Demo;
