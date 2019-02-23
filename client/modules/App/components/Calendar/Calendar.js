import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Style
import styles from './Calendar.css';

export class Calendar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="calendar">
            </div>
        );
    }
}

Calendar.propTypes = {
};

export default Calendar;
