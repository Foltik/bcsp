export const minutes = t => Math.floor(t / 100) * 60 + (t % 100);
export const military = t => Math.floor(t / 60) * 100 + (t % 60);

export const delta = (t0, t1) => t1 - t0;
export const duration = (t0, t1) => Math.abs(delta(t0, t1));

export const first = (t0, t1) => Math.min(t0, t1);
export const last = (t0, t1) => Math.max(t0, t1);

export const before = (t0, t1) => t0 < t1;
export const after = (t0, t1) => t0 > t1;

export const intersects = (i0, i1) => i0[0] <= i1[1] && i1[0] <= i0[1];
export const overlaps = (buffer, i0, i1) =>
      intersects(i0, i1) ||
      (before(i0[1], i1[0]) && delta(i0[1], i1[0]) < buffer) ||
      (before(i1[1], i0[0]) && delta(i1[1], i0[0]) < buffer);
