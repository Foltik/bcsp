import time from './time.js';
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
        instructors: s.instructors.map( i.name),
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
