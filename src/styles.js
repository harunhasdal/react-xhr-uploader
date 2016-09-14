
const styles = {
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

export default styles;
