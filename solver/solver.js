const fs = require('fs');
const time = require('./time.js');

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

//console.log(courses.find(c => c.subject == 198 && c.code == 211).sections[0].times);

const my_courses = [
    courses.find(c => c.subject == 198 && c.code == 205),
    courses.find(c => c.subject == 198 && c.code == 211),
    courses.find(c => c.subject == 590 && c.code == 101),
    courses.find(c => c.subject == 640 && c.code == 250),
];

function* cartesian(head, ...tail) {
    const remainder = tail.length > 0 ? cartesian(...tail) : [[]];
    for (let r of remainder)
        for (let h of head)
            yield [h, ...r];
}

function* permutations(a, b) {
    for (let i = 0; i < a.length; i++)
        for (let j = 0; j < b.length; j++)
            yield [a[i], b[j]];
}

function combinations(n, lst) {
    if (!n) return [[]];
    if (!lst.length) return [];

    var x = lst[0],
        xs = lst.slice(1);

    return combinations(n - 1, xs).map(function (t) {
        return [x].concat(t);
    }).concat(combinations(n, xs));
}

const times_compatible = (t0, t1) => !time.intersects(t0.interval, t1.interval) || t0.day != t1.day;
const sections_compatible = (s0, s1) => Array.from(cartesian(s0.times, s1.times)).reduceRight((acc, pair) => acc && times_compatible(...pair));
const schedule_compatible = sections => combinations(2, sections).reduceRight((acc, pair) => acc && sections_compatible(...pair));

const schedules = cartesian(...my_courses.map(c => c.sections));

let results = [];
for (let schedule of schedules) {
    if (schedule_compatible(schedule))
        results.push(schedule);
}
console.log(results);
console.log(`Valid: ${results.length} of ${my_courses.map(c => c.sections.length).reduceRight((acc, v) => acc * v)}`);

const t1 = process.hrtime();
const dt = [t1[0] - t0[0], t1[1] - t0[1]];
const micros = dt[0] * 1000000 + dt[1] / 1000;
console.log(micros / 1000);
