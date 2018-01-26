import * as React from 'react';
import { Row, Col, Progress } from 'antd';
import * as filesize from 'filesize';
import './ProgressBar.css';

interface ProgressBarProps {
    displayName: string;
    percent: number;
    status: 'success' | 'active' | 'exception';
    url: string;
    beforeSize?: number;
    afterSize?: number;
}

const progressConfigProps = {
    strokeWidth: 10
};
export default class ProgressBar extends React.Component <ProgressBarProps> {
    state: {
        displayName: string,
        percent: number,
        url: string
    };
    constructor(props: ProgressBarProps) {
        super(props);
    }
    render() {
        return (
            <div className="process-bar__container">
                <Row align="middle" justify="center" gutter={4}>
                    <Col span={3} offset={1}>{this.props.displayName}</Col>
                    <Col span={2}>{this.formatByte(this.props.beforeSize)}</Col>
                    <Col span={13}>
                        <Progress percent={this.props.percent} {...progressConfigProps} />
                    </Col>
                    <Col span={2}>{this.formatByte(this.props.afterSize)}</Col>
                    <Col span={2} offset={-1}>
                        <a className="link" href={this.props.url}>下载</a>
                    </Col>
                </Row>
            </div>
        );
    }
    formatByte = (byte: number = 0) => {
        return filesize(byte, { base: 10 });
    }
}