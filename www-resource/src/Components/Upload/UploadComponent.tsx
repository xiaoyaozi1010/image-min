import * as React from 'react';
import { Upload, Icon, message } from 'antd';
import './UploadComponent.css';
import ProgressBar from './../Progress/ProgressBar';

const Dragger = Upload.Dragger;
const draggerProps = {
    name: 'file',
    multiple: false,
    action: '/api/upload',
    showUploadList: false,
};

export default class UploadComponent extends React.Component <any> {
    state = {
        files: []
    };
    render() {
        const processList = this.state.files.map((file: any) => (
            <ProgressBar 
                displayName={file.name} 
                percent={file.percent} 
                status={file.status} 
                url={file.response && file.response.data.url} 
                key={file.uid} 
                beforeSize={file.size}
                afterSize={file.response && file.response.data.size}
            />
        ));
        return (
        <>
            <Dragger {...draggerProps} onChange={this.onChange}>
              <p className="upload-drag-icon">
                <Icon type="upload" />
              </p>
              <p className="upload-text">Click or drag file to here to upload.</p>
              <p className="upload-hint">
                Support for <span>jpeg/gif/png/svg</span> upload or a <span>zip</span> file.
              </p>
            </Dragger>
            {processList}
        </>
        );
    }
    onChange = (info: any) => {
        const status = info.file.status;
        this.setState({ files: info.fileList });
        if (status === 'done') {
            if (info.file.response && info.file.response.code < 1) {
                message.error(`${info.file.name} 处理过程出现错误。${info.file.response.msg}`);
            }
            else {
                message.success(`${info.file.name} 文件压缩完成。`);
            }
            
        }
        else if (status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }
    }
}