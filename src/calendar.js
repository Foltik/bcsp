import React, {Component} from 'react';
import './calendar.css';

const percentage = n => n * 100 + '%';

function Day(props) {
    const items = props.items.map((item, i) => {
        const pos = (item.start - props.start) / props.len;
        const height = (item.len / props.len);
        return <div className="item" style={{top: percentage(pos), height: percentage(height)}} key={i}>{item.name}</div>;
    });

    return <div className="day">{items}</div>;
}

function Days(props) {
    return (
        <div className="days">
            {[...Array(5)].map((e, i) =>
                 <Day start={props.start} len={props.len} items={props.items[i]} key={i} />)
            }
        </div>
    );
}

function Header(props) {
    return <span className="header">{props.title}</span>;
}

function Headers(props) {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
        <div className="headers">
            {dayNames.map(d => <Header title={d} key={d}/>)}
        </div>
    );
}

function Time(props) {
    return <span className="time" style={{top: percentage(props.pos)}}>{props.time / 60}:00</span>;
}

function Times(props) {
    return (
        <div className="times">
            {[...Array(Math.floor(props.len / 60) + 1)].map((e, i) =>
                <Time time={props.start + (i * 60)} pos={(i * 60) / props.len} key={i} />
            )}
        </div>
    );
}

function Separator(props) {
    return <div className="separator" style={{top: percentage(props.pos)}}></div>;
}

function Separators(props) {
    return (
        <div className="separators">
            {[...Array(Math.floor(props.len / 60) + 1)].map((e, i) =>
                <Separator pos={(i * 60) / props.len} key={i} />
            )}
        </div>
    );
}

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.len = this.props.end - this.props.start;
    }

    render() {
        return (
            <div className="calendar">
                <Headers />
                <Times start={this.props.start} len={this.len}/>
                <Separators start={this.props.start} len={this.len}/>
                <Days start={this.props.start} len={this.len} items={this.props.items}/>
            </div>
        );
    }
}

export default Calendar;
