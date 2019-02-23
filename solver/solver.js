const fs = require('fs');
const time = require('./time.js');
const schedule = require('./scheduler.js');

const distinct = (array, accessor) => [...new Set(array.map(accessor))];

const courses_file = './data/2019-1-NB-courses.json';
const section_file = './data/2019-1-NB-openSections.json';

const t0 = process.hrtime();

const raw_courses = fs.readFileSync(courses_file);
const courses = JSON.parse(raw_courses).map(c => ({
    title: c.title,
    school: c.school.code,
    subject: c.subject,
    code: c.courseNumber,
    sections: c.sections.map(s => ({
        index: s.index,
        instructors: s.instructors.map(i => i.name),
        times: s.meetingTimes.map(t => ({
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

const time_reqs = [
    t => t.interval[0] > time.minutes('0800'),
    t => t.campus == 2 || t.campus == 3,
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
console.log(`Valid: ${results.length} of ${my_courses.map(c => c.sections.length).reduceRight((acc, v) => acc * v)}`);

const util = require('util');
console.log(util.inspect(results[0].days, true, 10, true));


const t1 = process.hrtime();
const dt = [t1[0] - t0[0], t1[1] - t0[1]];
const micros = dt[0] * 1000000 + dt[1] / 1000;
console.log(micros / 1000);
