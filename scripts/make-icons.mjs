import sharp from 'sharp'
import { readFileSync } from 'node:fs'
const svg = readFileSync('public/favicon.svg')
for (const [name, size] of [['icon-192', 192], ['icon-512', 512], ['apple-touch-icon', 180]]) {
  await sharp(svg, { density: 300 }).resize(size, size).png().toFile(`public/${name}.png`)
}
