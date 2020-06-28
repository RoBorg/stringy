export function typedArraysAreEqual(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  return a.every((val, i) => val === b[i]);
}
