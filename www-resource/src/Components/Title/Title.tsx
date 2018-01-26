import * as React from 'react';
import './Title.css';
interface TitleComponentProps { 
    title: string; 
    subTitle?: string;
}

export default class Title extends React.Component<TitleComponentProps, object> {
    render() {
        return (
            <>
            <header className="title">
                <h1>{this.props.title || '欢迎使用 imagemin 图片压缩工具'}</h1>
                <p className="sub-title">{this.props.subTitle}</p>
            </header>
            </>
        );
    }
}