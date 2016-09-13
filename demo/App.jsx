import React from 'react';
import Fork from 'react-ghfork';
import pkgInfo from '../package.json';
import Demo from './Demo.jsx';

const App = () => (
  <div>
    <Fork className="right" project={`${pkgInfo.user}/${pkgInfo.name}`} />
    <p>Demonstrating the XHR Uploader component</p>
    <Demo />
  </div>
);

export default App;
