import React from 'react';
import ReactDOM from 'react-dom';

import Calendar from './calendar.js';
//import DB from './storage.js';
import {schedule} from './schedule.js';
import * as time from './time.js';


import raw_courses from './courses.json';
const courses = raw_courses.map(c => ({
    title: c.title,
    school: c.school.code,
    subject: c.subject,
    code: c.courseNumber,
    sections: c.sections.map(s => ({
        index: s.index,
        instructors: s.instructors.map(i => i.name),
        times: s.meetingTimes.map(t => ({
            name: c.title,
            campus: t.campusLocation,
            building: t.buildingCode,
            room: t.roomNumber,
            day: t.meetingDay,
            interval: [time.minutes(t.startTimeMilitary), time.minutes(t.endTimeMilitary)],
            duration: time.duration(time.minutes(t.startTimeMilitary), time.minutes(t.endTimeMilitary))
        }))
    }))
}));

const my_courses = [
    courses.find(c => c.subject == 198 && c.code == 205),
    courses.find(c => c.subject == 198 && c.code == 211),
    courses.find(c => c.subject == 590 && c.code == 101),
    courses.find(c => c.subject == 640 && c.code == 250),
];
console.log(my_courses);

const time_reqs = [
    t => t.interval[0] > time.minutes('0800'),
    t => t.campus == 2 || t.campus == 3
];
const trans_reqs = [
    t => !time.overlaps(20, t[0].interval, t[1].interval)
];
const section_reqs = [];

// unary - After a single match add the score once
// sum   - After each match add the score
// all   - Add the score once if all match
const time_prefs = [
    [500, t => t.interval[0] > time.minutes('1000'), 'all']
];
const trans_prefs = [
    [100, t => t[0].campus != t[1].campus && time.delta(t[0].interval[1], t[1].interval[0]) >= 30, 'all']
];
const section_prefs = [];


const results = schedule(my_courses,
                         time_reqs, trans_reqs, section_reqs,
                         time_prefs, trans_prefs, section_prefs).toArray();

console.log(results);

const days = ['M', 'T', 'W', 'TH', 'F'];
const to_block = items => items.map(i => ({
    name: i.name,
    start: i.interval[0],
    len: i.interval[1] - i.interval[0]
}));
const get_items = r => [...Array(7)].map((e, i) => r.days[days[i]] ? to_block(r.days[days[i]]) : []);
console.log(get_items(results[0]));

ReactDOM.render(<Calendar start={480} end={1260} items={get_items(results[0])}/>, document.getElementById('root'));
