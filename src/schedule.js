import {query} from 'itiriri';
import G from 'generatorics';
import * as time from './time.js';

// Utility
function every(arr, ...preds) {
    return preds.map(p => arr.reduce((acc, v) => acc && p(v), true))
               .reduce((acc, v) => acc && v, true);
}

const adjacent_pairs = arr =>
    arr.reduce((acc, v, i, a) => {
        if (i < a.length - 1) {
            acc.push([a[i], a[i + 1]]);
        }
        return acc;
    }, []);

function split_days(sections) {
    const days = sections
          .map(s => s.times)
          .map(ts =>
               ts.reduce((acc, t) => {
                   acc[t.day] = acc[t.day] ? acc[t.day].concat([t]) : [t];
                   return acc;
               }, {}))
          .reduce((acc, days) => {
              Object.keys(days).map(day => acc[day] = acc[day] ? acc[day].concat(days[day]) : days[day]);
              return acc;
          }, {});
    Object.keys(days).map(day => days[day].sort((i0, i1) => i0.interval[0] - i1.interval[1]));
    return days;
};


// Compatibility

const days_compatible = (days, time_reqs, trans_reqs) =>
    every(Object.keys(days).map(day => {
        return every(days[day], ...time_reqs) &&
               every(adjacent_pairs(days[day]), t => !time.intersects(t[0].interval, t[1].interval), ...trans_reqs);
    }), b => b);

const sections_compatible = (sections, section_reqs) =>
    every(sections, ...section_reqs);


// Scoring

const score_fns = {
    unary: (arr, p) =>
      arr.some(p[1]) ? p[0] : 0,
    all: (arr, p) =>
      every(arr, p[1]) ? p[0] : 0,
    sum: (arr, p) =>
      arr.reduce((acc, e) => p[1](e) ? acc + p[0] : acc, 0)
};

const score = (arr, pairs) =>
      pairs.reduce((acc, p) => acc + score_fns[p[2]](arr, p), 0);

const score_schedule = (schedule, time_prefs, transition_prefs, section_prefs) => {
    const temporal_score = Object.values(schedule.days).reduce((acc, day) =>
        acc + score(day, time_prefs) + score(adjacent_pairs(day), transition_prefs), 0);

    const section_score = score(schedule.sections, section_prefs);

    schedule.score = temporal_score + section_score;
    return schedule;
};


// Interface

export function schedule(courses,
                time_reqs = [], trans_reqs = [], section_reqs = [],
                time_prefs = [], trans_prefs = [], section_prefs = []) {

    return query(G.cartesian(...courses.map(c => c.sections)))
        .map(s => ({
            courses,
            sections: s,
            days: split_days(s),
            score: 0
        }))
        .filter(obj => sections_compatible(obj.sections, section_reqs))
        .filter(obj => days_compatible(obj.days, time_reqs, trans_reqs))
        .map(s => score_schedule(s, time_prefs, trans_prefs, section_prefs))
        .sort((a, b) => b.score - a.score);
}
