'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTransitionGroup = require('react-transition-group');

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XHRUploader = function (_Component) {
  _inherits(XHRUploader, _Component);

  function XHRUploader(props) {
    _classCallCheck(this, XHRUploader);

    var _this = _possibleConstructorReturn(this, (XHRUploader.__proto__ || Object.getPrototypeOf(XHRUploader)).call(this, props));

    _this.state = { items: [], styles: Object.assign({}, _styles2.default, props.styles) };
    _this.activeDrag = 0;
    _this.xhrs = [];
    _this.onClick = _this.onClick.bind(_this);
    _this.onUploadButtonClick = _this.onUploadButtonClick.bind(_this);
    _this.onFileSelect = _this.onFileSelect.bind(_this);
    _this.onDragEnter = _this.onDragEnter.bind(_this);
    _this.onDragLeave = _this.onDragLeave.bind(_this);
    _this.onDrop = _this.onDrop.bind(_this);
    return _this;
  }

  _createClass(XHRUploader, [{
    key: 'onClick',
    value: function onClick() {
      this.fileInput.click();
    }
  }, {
    key: 'onUploadButtonClick',
    value: function onUploadButtonClick() {
      this.upload();
    }
  }, {
    key: 'onFileSelect',
    value: function onFileSelect() {
      var _this2 = this;

      var items = this.filesToItems(this.fileInput.files);
      this.setState({ items: items }, function () {
        if (_this2.props.auto) {
          _this2.upload();
        }
      });
    }
  }, {
    key: 'onDragEnter',
    value: function onDragEnter() {
      this.activeDrag += 1;
      this.setState({ isActive: this.activeDrag > 0 });
    }
  }, {
    key: 'onDragOver',
    value: function onDragOver(e) {
      if (e) {
        e.preventDefault();
      }
      return false;
    }
  }, {
    key: 'onDragLeave',
    value: function onDragLeave() {
      this.activeDrag -= 1;
      if (this.activeDrag === 0) {
        this.setState({ isActive: false });
      }
    }
  }, {
    key: 'onDrop',
    value: function onDrop(e) {
      var _this3 = this;

      if (!e) {
        return;
      }
      e.preventDefault();
      this.activeDrag = 0;
      var droppedFiles = e.dataTransfer ? e.dataTransfer.files : [];
      var items = this.filesToItems(droppedFiles);

      this.setState({ isActive: false, items: items }, function () {
        if (_this3.props.auto) {
          _this3.upload();
        }
      });
    }
  }, {
    key: 'clearIfAllCompleted',
    value: function clearIfAllCompleted() {
      var _this4 = this;

      if (this.props.clearTimeOut > 0) {
        var completed = this.state.items.filter(function (item) {
          return item.progress === 100;
        }).length;
        if (completed === this.state.items.length) {
          setTimeout(function () {
            _this4.setState({ items: [] });
          }, this.props.clearTimeOut);
        }
      }
    }
  }, {
    key: 'updateFileProgress',
    value: function updateFileProgress(index, progress) {
      var newItems = [].concat(_toConsumableArray(this.state.items));
      newItems[index] = Object.assign({}, this.state.items[index], { progress: progress });
      this.setState({ items: newItems }, this.clearIfAllCompleted);
    }
  }, {
    key: 'updateFileChunkProgress',
    value: function updateFileChunkProgress(index, chunkIndex, progress) {
      var newItems = [].concat(_toConsumableArray(this.state.items));
      var currentItem = this.state.items[index];
      var newProgressArr = [].concat(_toConsumableArray(currentItem.chunkProgress));
      var totalProgress = newProgressArr.reduce(function (a, b) {
        return a + b;
      }) / (newProgressArr.length - 1);
      // -1 because there is always single chunk for "0" percentage pushed as chunkProgress.push(0) in method filesToItems)
      newProgressArr[chunkIndex] = progress;
      newItems[index] = Object.assign({}, currentItem, { chunkProgress: newProgressArr, progress: totalProgress });
      this.setState({ items: newItems }, this.clearIfAllCompleted);
    }
  }, {
    key: 'cancelFile',
    value: function cancelFile(index) {
      var newItems = [].concat(_toConsumableArray(this.state.items));
      newItems[index] = Object.assign({}, this.state.items[index], { cancelled: true });
      if (this.xhrs[index]) {
        this.xhrs[index].upload.removeEventListener('progress');
        this.xhrs[index].removeEventListener('load');
        this.xhrs[index].abort();
      }
      this.setState({ items: newItems });
    }
  }, {
    key: 'upload',
    value: function upload() {
      var _this5 = this;

      var items = this.state.items;
      if (items) {
        items.filter(function (item) {
          return !item.cancelled;
        }).forEach(function (item) {
          _this5.uploadItem(item);
        });
      }
    }
  }, {
    key: 'uploadItem',
    value: function uploadItem(item) {
      var _this6 = this;

      if (this.props.chunks && item.file) {
        var BYTES_PER_CHUNK = this.props.chunkSize;
        var SIZE = item.file.size;

        var start = 0;
        var end = BYTES_PER_CHUNK;

        var chunkProgressHandler = function chunkProgressHandler(percentage, chunkIndex) {
          _this6.updateFileChunkProgress(item.index, chunkIndex, percentage);
        };
        var chunkIndex = 0;
        while (start < SIZE) {
          this.uploadChunk(item.file.slice(start, end), chunkIndex += 1, item.file.name, chunkProgressHandler);
          start = end;
          end = start + BYTES_PER_CHUNK;
        }
      } else {
        this.uploadFile(item.file, function (progress) {
          return _this6.updateFileProgress(item.index, progress);
        });
      }
    }
  }, {
    key: 'uploadChunk',
    value: function uploadChunk(blob, chunkIndex, fileName, progressCallback) {
      if (blob) {
        var formData = new FormData();
        var xhr = new XMLHttpRequest();
        var data = this.props.formData;

        if (data.length > 0) {
          data.map(function (d) {
            formData.append(d.name, d.value);
          });
        }

        formData.append(this.props.fieldName, blob, fileName + '-chunk' + chunkIndex);

        xhr.onload = function () {
          progressCallback(100, chunkIndex);
        };
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            progressCallback(e.loaded / e.total * 100, chunkIndex);
          }
        };
        xhr.open(this.props.method, this.props.url, true);
        xhr.send(formData);
      }
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(file, progressCallback) {
      if (file) {
        var formData = new FormData();
        var xhr = new XMLHttpRequest();
        var data = this.props.formData;

        if (data.length > 0) {
          data.map(function (d) {
            formData.append(d.name, d.value);
          });
        }

        formData.append(this.props.fieldName, file, file.name);

        xhr.onload = function () {
          progressCallback(100);
        };

        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            progressCallback(e.loaded / e.total * 100);
          }
        };

        xhr.open(this.props.method, this.props.url, true);
        xhr.send(formData);
        this.xhrs[file.index] = xhr;
      }
    }
  }, {
    key: 'filesToItems',
    value: function filesToItems(files) {
      var _this7 = this;

      var fileItems = Array.prototype.slice.call(files).slice(0, this.props.maxFiles);
      var items = fileItems.map(function (f, i) {
        if (_this7.props.chunks) {
          var chunkProgress = [];
          for (var j = 0; j <= f.size / _this7.props.chunkSize; j += 1) {
            chunkProgress.push(0);
          }
          return { file: f, index: i, progress: 0, cancelled: false, chunkProgress: chunkProgress };
        }
        return { file: f, index: i, progress: 0, cancelled: false };
      });
      return items;
    }
  }, {
    key: 'humanFileSize',
    value: function humanFileSize(bytes, si) {
      var thresh = si ? 1000 : 1024;
      if (Math.abs(bytes) < thresh) {
        return bytes + " B";
      }
      var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      var u = -1;
      do {
        bytes /= thresh;
        ++u;
      } while (Math.abs(bytes) >= thresh && u < units.length - 1);
      return bytes.toFixed(1) + " " + units[u];
    }
  }, {
    key: 'renderDropTarget',
    value: function renderDropTarget() {
      var uploadIconClass = this.props.uploadIconClass;
      var styles = this.state.styles;

      var dropTargetStyle = styles.dropTargetStyle;
      if (this.state.isActive) {
        dropTargetStyle = Object.assign({}, dropTargetStyle, styles.dropTargetActiveStyle);
      }
      return _react2.default.createElement(
        'div',
        {
          'data-test-id': 'dropTarget',
          style: dropTargetStyle,
          onClick: this.onClick,
          onDragEnter: this.onDragEnter,
          onDragOver: this.onDragOver,
          onDragLeave: this.onDragLeave,
          onDrop: this.onDrop
        },
        _react2.default.createElement(
          'div',
          { style: styles.placeHolderStyle },
          _react2.default.createElement(
            'p',
            null,
            this.props.dropzoneLabel
          ),
          _react2.default.createElement('i', { className: uploadIconClass })
        ),
        this.renderFileSet()
      );
    }
  }, {
    key: 'renderFileSet',
    value: function renderFileSet() {
      var _this8 = this;

      var items = this.state.items;
      var _props = this.props,
          progressClass = _props.progressClass,
          transitionName = _props.filesetTransitionName;

      if (items.length > 0) {
        var _props2 = this.props,
            cancelIconClass = _props2.cancelIconClass,
            completeIconClass = _props2.completeIconClass;
        var _state = this.state,
            progress = _state.progress,
            styles = _state.styles;

        var cancelledItems = items.filter(function (item) {
          return item.cancelled === true;
        });
        var filesetStyle = items.length === cancelledItems.length ? { display: 'none' } : styles.fileset;
        return _react2.default.createElement(
          _reactTransitionGroup.TransitionGroup,
          {
            component: 'div',
            transitionName: transitionName,
            transitionEnterTimeout: 0,
            transitionLeaveTimeout: 0
          },
          _react2.default.createElement(
            'div',
            { style: filesetStyle },
            items.filter(function (item) {
              return !item.cancelled && !!item.file;
            }).map(function (item) {
              var file = item.file;
              var iconClass = item.progress < 100 ? cancelIconClass : completeIconClass;
              return _react2.default.createElement(
                'div',
                { key: item.index },
                _react2.default.createElement(
                  'div',
                  { style: styles.fileDetails },
                  _react2.default.createElement(
                    'span',
                    { className: 'icon-file icon-large' },
                    '\xA0'
                  ),
                  _react2.default.createElement(
                    'span',
                    { style: styles.fileName },
                    file.name + ', ' + file.type
                  ),
                  _react2.default.createElement(
                    'span',
                    { style: styles.fileSize },
                    '' + _this8.humanFileSize(file.size)
                  ),
                  _react2.default.createElement('i', {
                    className: iconClass,
                    style: { cursor: 'pointer' },
                    onClick: function onClick(e) {
                      e.stopPropagation();
                      _this8.cancelFile(item.index);
                    }
                  })
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'progress',
                    {
                      style: progressClass ? {} : styles.progress,
                      className: progressClass,
                      min: '0',
                      max: '100',
                      value: item.progress
                    },
                    item.progress,
                    '%'
                  )
                )
              );
            })
          )
        );
      }
      return _react2.default.createElement(_reactTransitionGroup.TransitionGroup, {
        component: 'div',
        transitionName: transitionName,
        transitionEnterTimeout: 0,
        transitionLeaveTimeout: 0
      });
    }
  }, {
    key: 'renderButton',
    value: function renderButton() {
      var styles = this.state.styles;

      var displayButton = !this.props.auto;
      if (displayButton) {
        return _react2.default.createElement(
          'button',
          { style: styles.uploadButtonStyle, onClick: this.onUploadButtonClick },
          this.props.buttonLabel
        );
      }
      return null;
    }
  }, {
    key: 'renderInput',
    value: function renderInput() {
      var _this9 = this;

      var maxFiles = this.props.maxFiles;
      return _react2.default.createElement('input', {
        style: { display: 'none' },
        multiple: maxFiles > 1,
        type: 'file',
        ref: function ref(c) {
          if (c) {
            _this9.fileInput = c;
          }
        },
        onChange: this.onFileSelect
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var styles = this.state.styles;

      return _react2.default.createElement(
        'div',
        { style: styles.root },
        this.renderDropTarget(),
        this.renderButton(),
        this.renderInput()
      );
    }
  }]);

  return XHRUploader;
}(_react.Component);

XHRUploader.propTypes = {
  url: _propTypes2.default.string.isRequired,
  method: _propTypes2.default.string,
  auto: _propTypes2.default.bool,
  fieldName: _propTypes2.default.string,
  buttonLabel: _propTypes2.default.string,
  dropzoneLabel: _propTypes2.default.string,
  chunks: _propTypes2.default.bool,
  chunkSize: _propTypes2.default.number,
  maxFiles: _propTypes2.default.number,
  clearTimeOut: _propTypes2.default.number,
  filesetTransitionName: _propTypes2.default.string,
  styles: _propTypes2.default.shape({}),
  cancelIconClass: _propTypes2.default.string,
  completeIconClass: _propTypes2.default.string,
  uploadIconClass: _propTypes2.default.string,
  progressClass: _propTypes2.default.string,
  formData: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
  }))
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
  uploadIconClass: 'fa fa-upload',
  formData: []
};

exports.default = XHRUploader;