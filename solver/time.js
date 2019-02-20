const minutes = t => Math.floor(t / 100) * 60 + (t % 100);
const military = t => Math.floor(t / 60) * 100 + (t % 60);

const delta = (t0, t1) => t1 - t0;
const duration = (t0, t1) => Math.abs(delta(t0, t1));

const first = (t0, t1) => Math.min(t0, t1);
const last = (t0, t1) => Math.max(t0, t1);

const before = (t0, t1) => t0 < t1;
const after = (t0, t1) => t0 > t1;

const intersects = (i0, i1) => i0[0] <= i1[1] && i1[0] <= i0[1];
const overlaps = (buffer, i0, i1) =>
      intersects(i0, i1) ||
      (before(i0[1], i1[0]) && delta(i0[1], i1[0]) < buffer) ||
      (before(i1[1], i0[0]) && delta(i1[1], i0[0]) < buffer);

module.exports.minutes = minutes;
module.exports.military = military;
module.exports.delta = delta;
module.exports.duration = duration;
module.exports.first = first;
module.exports.last = last;
module.exports.before = before;
module.exports.after = after;
module.exports.intersects = intersects;
module.exports.overlaps = overlaps;
