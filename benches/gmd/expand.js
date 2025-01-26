var f = { Ja: 0, En: 1, Fr: 2, Es: 3, De: 4, It: 5 },
  h = ["Ja", "En", "Fr", "Es", "De", "It"]
import { Buffer as o } from "node:buffer"
var g = class {
    #e
    #t = 0
    #i = !0
    constructor(t) {
      this.#e = t
    }
    get currentOffset() {
      return this.#t
    }
    endianness(t) {
      this.#i = t === "little"
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
      return t?.pointer == null && (this.#t += 2), e.getInt16(0, this.#i)
    }
    readUint16(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        2,
      )
      return t?.pointer == null && (this.#t += 2), e.getUint16(0, this.#i)
    }
    readInt32(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        4,
      )
      return t?.pointer == null && (this.#t += 4), e.getInt32(0, this.#i)
    }
    readUint32(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        4,
      )
      return t?.pointer == null && (this.#t += 4), e.getUint32(0, this.#i)
    }
    readInt64(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        8,
      )
      return t?.pointer == null && (this.#t += 8), e.getBigInt64(0, this.#i)
    }
    readUint64(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        8,
      )
      return t?.pointer == null && (this.#t += 8), e.getBigUint64(0, this.#i)
    }
    readFloat(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        4,
      )
      return t?.pointer == null && (this.#t += 4), e.getFloat32(0, this.#i)
    }
    readDouble(t) {
      let e = new DataView(
        this.#e.buffer,
        this.#e.byteOffset + (t?.pointer ?? this.#t),
        8,
      )
      return t?.pointer == null && (this.#t += 8), e.getFloat64(0, this.#i)
    }
    readBuffer(t) {
      let e = this.#e.subarray(this.#t, this.#t + t.length)
      return t.pointer == null && (this.#t += t.length), e
    }
    readString(t) {
      let e
      if (("length" in t && (e = this.readBuffer(t)), "zeroed" in t)) {
        let i = new DataView(this.#e.buffer, this.#e.byteOffset + this.#t),
          n = 0
        for (; i.getUint8(n) !== 0; ) n++
        ;(e = this.#e.subarray(this.#t, this.#t + n)), (this.#t += n + 1)
      }
      return e.toString(t.encoding ?? "utf8")
    }
  },
  a = class {
    #e
    #t = 0
    #i = !0
    constructor(t = 0) {
      this.#e = o.alloc(t)
    }
    get currentOffset() {
      return this.#t
    }
    get currentSize() {
      return this.#e.length
    }
    get buffer() {
      let t = o.alloc(this.#e.length)
      return this.#e.copy(t), t
    }
    endianness(t) {
      this.#i = t === "little"
    }
    grow(t) {
      this.#e = o.concat([this.#e, o.alloc(t)])
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
    #n = (t, e, i) => (n, r) => {
      ;(r?.into == null || r.into + t > this.#e.length) && this.growIfNeeded(t),
        this.#e[!this.#i && i != null ? i : e](n, r?.into ?? this.#t, t),
        r?.into == null && (this.#t += t)
    }
    setInt8 = this.#n(1, "writeInt8")
    setUint8 = this.#n(1, "writeUInt8")
    setInt16 = this.#n(2, "writeInt16LE", "writeInt16BE")
    setUint16 = this.#n(2, "writeUInt16LE", "writeUInt16BE")
    setInt32 = this.#n(4, "writeInt32LE", "writeInt32BE")
    setUint32 = this.#n(4, "writeUInt32LE", "writeUInt32BE")
    setInt64 = this.#n(8, "writeBigInt64LE", "writeBigInt64BE")
    setUint64 = this.#n(8, "writeBigUInt64LE", "writeBigUInt64BE")
    setFloat = this.#n(4, "writeFloatLE", "writeFloatBE")
    setDouble = this.#n(8, "writeDoubleLE", "writeDoubleBE")
    setString(t, e) {
      let i = o.from(`${t}\0`, e?.encoding ?? "utf8")
      this.growIfNeeded(i.byteLength),
        i.copy(this.#e, e?.into ?? this.#t),
        e?.into == null && (this.#t += i.byteLength)
    }
    setBuffer(t, e) {
      this.growIfNeeded(t.length),
        t.copy(this.#e, e?.into ?? this.#t),
        e?.into == null && (this.#t += t.length)
    }
  }
var c = (t) => ({
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
  w = (t) => {
    let e = new g(t),
      i = c(e)
    if (i.magic !== "GMD") throw new Error(`Invalid magic: ${i.magic}`)
    if (i.version !== 66306)
      throw new Error(`Unknown version: 0x${i.version.toString(16)}`)
    let n = e.readString({ length: i.filenameSize + 1 }).slice(0, -1),
      r =
        40 +
        n.length +
        1 +
        i.labelCount * 20 +
        (i.labelCount > 0 ? 256 * 4 : 0) +
        i.labelSize +
        i.sectionSize
    if (r !== t.byteLength) throw new Error(`Unexpected size: ${t.length} !== ${r}`)
    i.labelCount !== 0 &&
      console.warn(`File contains ${i.labelCount} labels, and they are not supported.`)
    let l = e.currentOffset
    for (let s = 0; s < i.labelCount; s++);
    if (l + i.labelSize !== e.currentOffset)
      throw new Error(`Unexpected label size: ${i.labelSize} !== ${e.currentOffset - l}`)
    let u = []
    for (let s = 0; s < i.sectionCount; s++) u.push(e.readString({ zeroed: !0 }))
    return {
      version: i.version,
      language: h[i.language],
      filename: n,
      unknownData: i.unknownData,
      labels: [],
      texts: u,
    }
  }
import { Buffer as d } from "node:buffer"
var b = (t) => {
  if (t.version !== 66306)
    throw new Error(`Unsupported version 0x${t.version.toString(16)}`)
  let e = new a()
  for (let r of t.texts) e.setString(r)
  let i = e.buffer,
    n = new a()
  return (
    n.setString("GMD"),
    n.setUint32(t.version),
    n.setUint32(f[t.language]),
    n.setBuffer(t.unknownData),
    n.setUint32(t.labels.length),
    n.setUint32(t.texts.length),
    n.setUint32(0),
    n.setUint32(i.byteLength),
    n.setUint32(t.filename.length),
    n.setString(t.filename),
    d.concat([n.buffer, i])
  )
}
export { f as Language, h as LanguageR, w as decodeGmd, b as encodeGmd }
//# sourceMappingURL=index.js.map
