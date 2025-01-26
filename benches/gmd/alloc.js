var a = { Ja: 0, En: 1, Fr: 2, Es: 3, De: 4, It: 5 },
  l = ["Ja", "En", "Fr", "Es", "De", "It"]
import { Buffer as f } from "node:buffer"
var g = class {
    #e
    #t = 0
    #n = !0
    constructor(t) {
      this.#e = t
    }
    get currentOffset() {
      return this.#t
    }
    endianness(t) {
      this.#n = t === "little"
    }
    seek(t) {
      let e = this.#t
      return (this.#t += t), e
    }
    goto(t) {
      let e = this.#t
      return (this.#t = t), e
    }
    alignTo(t) {
      this.#t += this.#t % t
    }
    readInt8(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        1,
      )
      return t?.pointer == null && (this.#t += 1), e.getInt8(0)
    }
    readUint8(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        1,
      )
      return t?.pointer == null && (this.#t += 1), e.getUint8(0)
    }
    readInt16(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        2,
      )
      return t?.pointer == null && (this.#t += 2), e.getInt16(0, this.#n)
    }
    readUint16(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        2,
      )
      return t?.pointer == null && (this.#t += 2), e.getUint16(0, this.#n)
    }
    readInt32(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        4,
      )
      return t?.pointer == null && (this.#t += 4), e.getInt32(0, this.#n)
    }
    readUint32(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        4,
      )
      return t?.pointer == null && (this.#t += 4), e.getUint32(0, this.#n)
    }
    readInt64(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        8,
      )
      return t?.pointer == null && (this.#t += 8), e.getBigInt64(0, this.#n)
    }
    readUint64(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        8,
      )
      return t?.pointer == null && (this.#t += 8), e.getBigUint64(0, this.#n)
    }
    readFloat(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        4,
      )
      return t?.pointer == null && (this.#t += 4), e.getFloat32(0, this.#n)
    }
    readDouble(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        8,
      )
      return t?.pointer == null && (this.#t += 8), e.getFloat64(0, this.#n)
    }
    readBuffer(t) {
      let e = this.#e.subarray(this.#t, this.#t + t.length)
      return t.pointer == null && (this.#t += t.length), e
    }
    readString(t) {
      let e
      if (("length" in t && (e = this.readBuffer(t)), "zeroed" in t)) {
        let n = new DataView(this.#e.buffer, this.#e.byteOffset + this.#t),
          r = 0
        for (; n.getUint8(r) !== 0; ) r++
        ;(e = this.#e.subarray(this.#t, this.#t + r)), (this.#t += r + 1)
      }
      return e.toString(t.encoding ?? "utf8")
    }
  },
  u = class {
    #e
    #t = 0
    #n = !0
    constructor(t = 0) {
      this.#e = f.alloc(t)
    }
    get currentOffset() {
      return this.#t
    }
    get currentSize() {
      return this.#e.length
    }
    get buffer() {
      let t = f.alloc(this.#e.length)
      return this.#e.copy(t), t
    }
    endianness(t) {
      this.#n = t === "little"
    }
    grow(t) {
      this.#e = f.concat([this.#e, f.alloc(t)])
    }
    growIfNeeded(t) {
      this.#t + t > this.#e.length && this.grow(this.#t + t - this.#e.length)
    }
    seek(t) {
      let e = this.#t
      return this.growIfNeeded(t), (this.#t += t), e
    }
    goto(t) {
      let e = this.#t
      return this.growIfNeeded(this.currentOffset - t), (this.#t = t), e
    }
    alignTo(t) {
      let e = this.#t % t
      e !== 0 && (this.growIfNeeded(t - e), (this.#t += t - e))
    }
    #i = (t, e, n) => (r, i) => {
      ;(i?.into == null || i.into + t > this.#e.length) && this.growIfNeeded(t),
        this.#e[!this.#n && n != null ? n : e](r, i?.into ?? this.#t, t),
        i?.into == null && (this.#t += t)
    }
    setInt8 = this.#i(1, "writeInt8")
    setUint8 = this.#i(1, "writeUInt8")
    setInt16 = this.#i(2, "writeInt16LE", "writeInt16BE")
    setUint16 = this.#i(2, "writeUInt16LE", "writeUInt16BE")
    setInt32 = this.#i(4, "writeInt32LE", "writeInt32BE")
    setUint32 = this.#i(4, "writeUInt32LE", "writeUInt32BE")
    setInt64 = this.#i(8, "writeBigInt64LE", "writeBigInt64BE")
    setUint64 = this.#i(8, "writeBigUInt64LE", "writeBigUInt64BE")
    setFloat = this.#i(4, "writeFloatLE", "writeFloatBE")
    setDouble = this.#i(8, "writeDoubleLE", "writeDoubleBE")
    setString(t, e) {
      let n = f.from(`${t}\0`, e?.encoding ?? "utf8")
      this.growIfNeeded(n.byteLength),
        n.copy(this.#e, e?.into ?? this.#t),
        e?.into == null && (this.#t += n.byteLength)
    }
    setBuffer(t, e) {
      this.growIfNeeded(t.length),
        t.copy(this.#e, e?.into ?? this.#t),
        e?.into == null && (this.#t += t.length)
    }
  }
var w = (t) => ({
    magic: t.readString({ zeroed: !0 }),
    version: t.readUint32(),
    language: t.readUint32(),
    unknownData: t.readBuffer({ length: 8 }),
    labelCount: t.readUint32(),
    sectionCount: t.readUint32(),
    labelSize: t.readUint32(),
    sectionSize: t.readUint32(),
    filenameSize: t.readUint32(),
  }),
  d = (t) => {
    let e = new g(t),
      n = w(e)
    if (n.magic !== "GMD") throw new Error(`Invalid magic: ${n.magic}`)
    if (n.version !== 66306)
      throw new Error(`Unknown version: 0x${n.version.toString(16)}`)
    let r = e.readString({ length: n.filenameSize + 1 }).slice(0, -1),
      i =
        40 +
        r.length +
        1 +
        n.labelCount * 20 +
        (n.labelCount > 0 ? 256 * 4 : 0) +
        n.labelSize +
        n.sectionSize
    if (i !== t.byteLength) throw new Error(`Unexpected size: ${t.length} !== ${i}`)
    n.labelCount !== 0 &&
      console.warn(`File contains ${n.labelCount} labels, and they are not supported.`)
    let s = e.currentOffset
    for (let o = 0; o < n.labelCount; o++);
    if (s + n.labelSize !== e.currentOffset)
      throw new Error(`Unexpected label size: ${n.labelSize} !== ${e.currentOffset - s}`)
    let h = []
    for (let o = 0; o < n.sectionCount; o++) h.push(e.readString({ zeroed: !0 }))
    return {
      version: n.version,
      language: l[n.language],
      filename: r,
      unknownData: n.unknownData,
      labels: [],
      texts: h,
    }
  }
import { Buffer as c } from "node:buffer"
var b = (t) => {
  if (t.version !== 66306)
    throw new Error(`Unsupported version 0x${t.version.toString(16)}`)
  let e = t.texts.reduce((s, h) => s + c.from(h).byteLength + 1, 0),
    n = new u(e)
  for (let s of t.texts) n.setString(s)
  let r = n.buffer
  if (r.byteLength !== e)
    throw new Error(`Unexpected text length: ${r.byteLength} !== ${e}`)
  let i = new u()
  return (
    i.setString("GMD"),
    i.setUint32(t.version),
    i.setUint32(a[t.language]),
    i.setBuffer(t.unknownData),
    i.setUint32(t.labels.length),
    i.setUint32(t.texts.length),
    i.setUint32(0),
    i.setUint32(r.byteLength),
    i.setUint32(t.filename.length),
    i.setString(t.filename),
    c.concat([i.buffer, r])
  )
}
export { a as Language, l as LanguageR, d as decodeGmd, b as encodeGmd }
//# sourceMappingURL=index.js.map
