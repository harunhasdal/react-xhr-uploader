import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import defaultStyles from './styles';

class XHRUploader extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], styles: Object.assign({}, defaultStyles, props.styles) };
    this.activeDrag = 0;
    this.xhrs = [];
    this.onClick = this.onClick.bind(this);
    this.onUploadButtonClick = this.onUploadButtonClick.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onClick() {
    this.fileInput.click();
  }

  onUploadButtonClick() {
    this.upload();
  }

  onFileSelect() {
    const items = this.filesToItems(this.fileInput.files);
    this.setState({ items }, () => {
      if (this.props.auto) {
        this.upload();
      }
    });
  }

  onDragEnter() {
    this.activeDrag += 1;
    this.setState({ isActive: this.activeDrag > 0 });
  }

  onDragOver(e) {
    if (e) {
      e.preventDefault();
    }
    return false;
  }

  onDragLeave() {
    this.activeDrag -= 1;
    if (this.activeDrag === 0) {
      this.setState({ isActive: false });
    }
  }

  onDrop(e) {
    if (!e) {
      return;
    }
    e.preventDefault();
    this.activeDrag = 0;
    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : [];
    const items = this.filesToItems(droppedFiles);

    this.setState({ isActive: false, items }, () => {
      if (this.props.auto) {
        this.upload();
      }
    });
  }

  clearIfAllCompleted() {
    if (this.props.clearTimeOut > 0) {
      const completed = this.state.items.filter(item => item.progress === 100).length;
      if (completed === this.state.items.length) {
        setTimeout(() => {
          this.setState({ items: [] });
        }, this.props.clearTimeOut);
      }
    }
  }

  updateFileProgress(index, progress) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], { progress });
    this.setState({ items: newItems }, this.clearIfAllCompleted);
  }

  updateFileChunkProgress(index, chunkIndex, progress) {
    const newItems = [...this.state.items];
    const currentItem = this.state.items[index];
    const newProgressArr = [...currentItem.chunkProgress];
    const totalProgress = newProgressArr.reduce((a, b) => a + b) / (newProgressArr.length - 1);
    // -1 because there is always single chunk for "0" percentage pushed as chunkProgress.push(0) in method filesToItems)
    newProgressArr[chunkIndex] = progress;
    newItems[index] = Object.assign({}, currentItem, { chunkProgress: newProgressArr, progress: totalProgress });
    this.setState({ items: newItems }, this.clearIfAllCompleted);
  }

  cancelFile(index) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], { cancelled: true });
    if (this.xhrs[index]) {
      this.xhrs[index].upload.removeEventListener('progress');
      this.xhrs[index].removeEventListener('load');
      this.xhrs[index].abort();
    }
    this.setState({ items: newItems });
  }

  upload() {
    const items = this.state.items;
    if (items) {
      items.filter(item => !item.cancelled).forEach(item => {
        this.uploadItem(item);
      });
    }
  }

  uploadItem(item) {
    if (this.props.chunks && item.file) {
      const BYTES_PER_CHUNK = this.props.chunkSize;
      const SIZE = item.file.size;

      let start = 0;
      let end = BYTES_PER_CHUNK;

      const chunkProgressHandler = (percentage, chunkIndex) => {
        this.updateFileChunkProgress(item.index, chunkIndex, percentage);
      };
      let chunkIndex = 0;
      while (start < SIZE) {
        this.uploadChunk(item.file.slice(start, end), (chunkIndex += 1), item.file.name, chunkProgressHandler);
        start = end;
        end = start + BYTES_PER_CHUNK;
      }
    } else {
      this.uploadFile(item.file, progress => this.updateFileProgress(item.index, progress));
    }
  }

  uploadChunk(blob, chunkIndex, fileName, progressCallback) {
    if (blob) {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append(this.props.fieldName, blob, `${fileName}-chunk${chunkIndex}`);

      xhr.onload = () => {
        progressCallback(100, chunkIndex);
      };
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          progressCallback(e.loaded / e.total * 100, chunkIndex);
        }
      };
      xhr.open(this.props.method, this.props.url, true);
      xhr.send(formData);
    }
  }

  uploadFile(file, progressCallback) {
    if (file) {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append(this.props.fieldName, file, file.name);

      xhr.onload = () => {
        progressCallback(100);
      };

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          progressCallback(e.loaded / e.total * 100);
        }
      };

      xhr.open(this.props.method, this.props.url, true);
      xhr.send(formData);
      this.xhrs[file.index] = xhr;
    }
  }

  filesToItems(files) {
    const fileItems = Array.prototype.slice.call(files).slice(0, this.props.maxFiles);
    const items = fileItems.map((f, i) => {
      if (this.props.chunks) {
        const chunkProgress = [];
        for (let j = 0; j <= f.size / this.props.chunkSize; j += 1) {
          chunkProgress.push(0);
        }
        return { file: f, index: i, progress: 0, cancelled: false, chunkProgress };
      }
      return { file: f, index: i, progress: 0, cancelled: false };
    });
    return items;
  }

  humanFileSize = function(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + " B";
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + " " + units[u];
  }

  renderDropTarget() {
    const { uploadIconClass } = this.props;
    const { styles } = this.state;
    let dropTargetStyle = styles.dropTargetStyle;
    if (this.state.isActive) {
      dropTargetStyle = Object.assign({}, dropTargetStyle, styles.dropTargetActiveStyle);
    }
    return (
      <div
        data-test-id="dropTarget"
        style={dropTargetStyle}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        <div style={styles.placeHolderStyle}>
          <p>{this.props.dropzoneLabel}</p>
          <i className={uploadIconClass} />
        </div>
        {this.renderFileSet()}
      </div>
    );
  }

  renderFileSet() {
    const items = this.state.items;
    const { progressClass, filesetTransitionName: transitionName } = this.props;
    if (items.length > 0) {
      const { cancelIconClass, completeIconClass } = this.props;
      const { progress, styles } = this.state;
      const cancelledItems = items.filter(item => item.cancelled === true);
      const filesetStyle = items.length === cancelledItems.length ? { display: 'none' } : styles.fileset;
      return (
        <TransitionGroup
          component="div"
          transitionName={transitionName}
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}
        >
          <div style={filesetStyle}>
            {items.filter(item => !item.cancelled && !!item.file).map(item => {
              const file = item.file;
              const iconClass = item.progress < 100 ? cancelIconClass : completeIconClass;
              return (
                <div key={item.index}>
                  <div style={styles.fileDetails}>
                    <span className="icon-file icon-large">&nbsp;</span>
                    <span style={styles.fileName}>{`${file.name}, ${file.type}`}</span>
                    <span style={styles.fileSize}>{`${this.humanFileSize(file.size)}`}</span>
                    <i
                      className={iconClass}
                      style={{ cursor: 'pointer' }}
                      onClick={e => {
                        e.stopPropagation();
                        this.cancelFile(item.index);
                      }}
                    />
                  </div>
                  <div>
                    <progress
                      style={progressClass ? {} : styles.progress}
                      className={progressClass}
                      min="0"
                      max="100"
                      value={item.progress}
                    >
                      {item.progress}%
                    </progress>
                  </div>
                </div>
              );
            })}
          </div>
        </TransitionGroup>
      );
    }
    return (
      <TransitionGroup
        component="div"
        transitionName={transitionName}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      />
    );
  }

  renderButton() {
    const { styles } = this.state;
    const displayButton = !this.props.auto;
    if (displayButton) {
      return (
        <button style={styles.uploadButtonStyle} onClick={this.onUploadButtonClick}>
          {this.props.buttonLabel}
        </button>
      );
    }
    return null;
  }

  renderInput() {
    const maxFiles = this.props.maxFiles;
    return (
      <input
        style={{ display: 'none' }}
        multiple={maxFiles > 1}
        type="file"
        ref={c => {
          if (c) {
            this.fileInput = c;
          }
        }}
        onChange={this.onFileSelect}
      />
    );
  }

  render() {
    const { styles } = this.state;
    return (
      <div style={styles.root}>
        {this.renderDropTarget()}
        {this.renderButton()}
        {this.renderInput()}
      </div>
    );
  }
}

XHRUploader.propTypes = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  auto: PropTypes.bool,
  fieldName: PropTypes.string,
  buttonLabel: PropTypes.string,
  dropzoneLabel: PropTypes.string,
  chunks: PropTypes.bool,
  chunkSize: PropTypes.number,
  maxFiles: PropTypes.number,
  clearTimeOut: PropTypes.number,
  filesetTransitionName: PropTypes.string,
  styles: PropTypes.shape({}),
  cancelIconClass: PropTypes.string,
  completeIconClass: PropTypes.string,
  uploadIconClass: PropTypes.string,
  progressClass: PropTypes.string
};

XHRUploader.defaultProps = {
  method: 'POST',
  auto: false,
  fieldName: 'datafile',
  buttonLabel: 'Upload',
  dropzoneLabel: 'Drag and drop your files here or pick them from your computer',
  maxSize: 25 * 1024 * 1024,
  chunks: false,
  chunkSize: 512 * 1024,
  localStore: false,
  maxFiles: 1,
  encrypt: false,
  clearTimeOut: 3000,
  filesetTransitionName: 'fileset',
  cancelIconClass: 'fa fa-close',
  completeIconClass: 'fa fa-check',
  uploadIconClass: 'fa fa-upload'
};

export default XHRUploader;
