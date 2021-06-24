const mask = 0xFF
const size = mask + 1
const values = new Uint8Array(size * 2)
for (let i = 0; i < size; i++) {
  values[i] = values[size + i] = 0 | (Math.random() * 0xFF)
}

const lerp = function (t, a, b) {
  return a + t * (b - a)
}
const fade = function (t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

const grad1d = function (hash, x) {
  return (hash & 1) === 0 ? x : -x
}

const noise1d = function (x) {
  const intX = (0 | x) & mask
  const fracX = x - (0 | x)
  const t = fade(fracX)
  const a = grad1d(values[intX], fracX)
  const b = grad1d(values[intX + 1], fracX - 1)
  return lerp(t, a, b)
}

export default noise1d
