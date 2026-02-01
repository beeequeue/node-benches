import { Buffer } from "node:buffer";

//#region src/constants.ts
const LanguageCodes = [
	"ja",
	"en",
	"fr",
	"it",
	"de",
	"es",
	"ru",
	"pl",
	"nl",
	"pt",
	"pt-br",
	"ko",
	"zh-tw",
	"zh-cn",
	"fi",
	"sv",
	"da",
	"no",
	"cs",
	"hu",
	"sk",
	"ar",
	"tr",
	"bg",
	"el",
	"ro",
	"th",
	"uk",
	"vi",
	"id",
	"fiction",
	"hi",
	"es-mx",
	"max"
];

//#endregion
//#region node_modules/.pnpm/binary-util@2.0.4/node_modules/binary-util/dist/decoder.mjs
var Decoder = class {
	#buffer;
	#currentOffset = 0;
	#littleEndian = true;
	/**
	* Creates a new decoder instance for parsing binary data.
	*
	* Defaults to little endian.
	*/
	constructor(buffer) {
		this.#buffer = buffer;
	}
	/**
	* Returns the current offset in the decoder's buffer.
	*
	* @example
	* ```ts
	* //                          1   + 256 + 0   + 0
	* const buffer = Buffer.from([0x01, 0x01, 0x00, 0x00])
	* const decoder = new Decoder(buffer)
	* decoder.readUint32() // 257
	* decoder.currentOffset // 4
	* ```
	*/
	get currentOffset() {
		return this.#currentOffset;
	}
	/**
	* Changes the current endianness of the decoder.
	* @param endianness - `big` or `little`
	* @example
	* ```ts
	* //                          0   + 0   + 256 + 1
	* const buffer = Buffer.from([0x00, 0x00, 0x01, 0x01])
	* const decoder = new Decoder(buffer)
	* decoder.endianness("big")
	* decoder.readUint32() // 257
	* ```
	*/
	endianness(endianness) {
		this.#littleEndian = endianness === "little";
	}
	/**
	* Move the current offset by an amount relative to the current offset.
	* @param offset - The amount to move the offset.
	* @returns The previous offset.
	* @example
	* ```ts
	* //                         (max + max)|(1   + 0)
	* const buffer = Buffer.from([0xFF, 0xFF, 0x01, 0x00])
	* const decoder = new Decoder(buffer)
	* decoder.seek(2) // 0
	* decoder.readUint16() // 1
	* ```
	*/
	seek(offset) {
		const previous = this.#currentOffset;
		this.#currentOffset += offset;
		return previous;
	}
	/**
	* Move the current offset to an absolute position.
	* @param offset - The absolute position to move the offset to.
	* @returns The previous offset.
	* @example
	* ```ts
	* //                         (max + max)|(1   + 0)
	* const buffer = Buffer.from([0xff, 0xff, 0x01, 0x00])
	* const decoder = new Decoder(buffer)
	* decoder.readUint16() // 65535
	* decoder.goto(0) // 2
	* decoder.currentOffset // 0
	* decoder.readUint16() // 65535
	* ```
	*/
	goto(offset) {
		const previous = this.#currentOffset;
		this.#currentOffset = offset;
		return previous;
	}
	/**
	* Skips the current offset forwards until the next alignment boundary.
	*
	* Useful for skipping padding between structures.
	*
	* @param alignment - The alignment boundary to skip to.
	* @example
	* ```ts
	* // Assume we have a header 5 bytes long, then 3 bytes of padding up to 8 bytes in, then more data
	* const buffer = Buffer.from([
	*   0x74, 0xee, 0xb2, 0x36, 0x0c, 0x00, 0x00, 0x00,
	*   0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	* ])
	* const decoder = new Decoder(buffer)
	* // First we move the offset past the header
	* decoder.seek(5) // 0
	* // Then we can align to the next 8 byte boundary
	* decoder.alignTo(8)
	* decoder.currentOffset // 8
	* decoder.readUint64() // 1n
	* ```
	* @example
	*/
	alignTo(alignment) {
		if (alignment < 1) throw new Error("Cannot align to a number less than 1.");
		const remainder = this.#currentOffset % alignment;
		if (remainder !== 0) this.#currentOffset += alignment - remainder;
	}
	/**
	* Reads a signed 8-bit integer from the buffer (1 byte)
	*
	* @param opts
	* @param opts.pointer {number} - Read from a specific offset instead of the current offset, useful for pointers. Does not advance the current offset.
	* @returns Value between -128 and 127.
	* @example
	* ```ts
	* const decoder = new Decoder(Buffer.from([0xff]))
	* expect(decoder.readInt8()).toBe(-1)
	* ```
	* @example Read via pointer offset
	* ```ts
	* //                                      (3   + 0)  | pad | -1
	* const decoder = new Decoder(Buffer.from([0x03, 0x00, 0x00, 0xff]))
	* const pointer = decoder.readUint16() // 3
	* decoder.readInt8({ pointer }) // -1
	* ```
	*/
	readInt8(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 1);
		if (opts?.pointer == null) this.#currentOffset += 1;
		return view.getInt8(0);
	}
	/**
	* Reads an unsigned 8-bit integer from the buffer (1 byte)
	*
	* @param opts
	* @param opts.pointer {number} - Read from a specific offset instead of the current offset, useful for pointers. Does not advance the current offset.
	* @returns Value between 0 and 255.
	* @example
	* ```ts
	* const decoder = new Decoder(Buffer.from([0xff]))
	* expect(decoder.readInt8()).toBe(255)
	* ```
	* @example Read via pointer offset
	* ```ts
	* //                                      (3   + 0)  | pad | -1
	* const decoder = new Decoder(Buffer.from([0x03, 0x00, 0x00, 0xff]))
	* const pointer = decoder.readUint16() // 3
	* decoder.readInt8({ pointer }) // 255
	* ```
	*/
	readUint8(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 1);
		if (opts?.pointer == null) this.#currentOffset += 1;
		return view.getUint8(0);
	}
	/**
	* Reads a signed 16-bit integer from the buffer (2 bytes)
	*
	* See {@link Decoder#readInt8} for examples.
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readInt8}.
	* @returns Value between -32768 and 32767.
	*/
	readInt16(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 2);
		if (opts?.pointer == null) this.#currentOffset += 2;
		return view.getInt16(0, this.#littleEndian);
	}
	/**
	* Reads an unsigned 16-bit integer from the buffer (2 bytes)
	*
	* See {@link Decoder#readUint8} for examples.
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readUint8}.
	* @returns Value between 0 and 65535.
	*/
	readUint16(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 2);
		if (opts?.pointer == null) this.#currentOffset += 2;
		return view.getUint16(0, this.#littleEndian);
	}
	/**
	* Reads a signed 32-bit integer from the buffer (4 bytes)
	*
	* See {@link Decoder#readInt8} for examples.
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readInt8}.
	* @returns Value between -2147483648 and 2147483647.
	*/
	readInt32(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 4);
		if (opts?.pointer == null) this.#currentOffset += 4;
		return view.getInt32(0, this.#littleEndian);
	}
	/**
	* Reads an unsigned 32-bit integer from the buffer (4 bytes)
	*
	* See {@link Decoder#readUint8} for examples.
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readUint8}.
	* @returns Value between 0 and 4294967295.
	*/
	readUint32(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 4);
		if (opts?.pointer == null) this.#currentOffset += 4;
		return view.getUint32(0, this.#littleEndian);
	}
	/**
	* Reads a signed 64-bit integer from the buffer (8 bytes)
	*
	* See {@link Decoder#readInt8} for examples.
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readInt8}.
	* @returns {bigint} Value between -9223372036854775808n and 9223372036854775807n.
	*/
	readInt64(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 8);
		if (opts?.pointer == null) this.#currentOffset += 8;
		return view.getBigInt64(0, this.#littleEndian);
	}
	/**
	* Reads an unsigned 64-bit integer from the buffer (8 bytes)
	*
	* See {@link Decoder#readUint8} for examples.
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readUint8}.
	* @returns {bigint} Value between 0 and 18446744073709551615n.
	*/
	readUint64(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 8);
		if (opts?.pointer == null) this.#currentOffset += 8;
		return view.getBigUint64(0, this.#littleEndian);
	}
	/**
	* Reads a floating-point number from the buffer (4 bytes)
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readUint8}.
	* @returns {number} Float
	*/
	readFloat(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 4);
		if (opts?.pointer == null) this.#currentOffset += 4;
		return view.getFloat32(0, this.#littleEndian);
	}
	/**
	* Reads a 64-bit floating-point number from the buffer (8 bytes)
	*
	* @param opts
	* @param opts.pointer {number} - See {@link Decoder#readUint8}.
	* @returns {number} Double
	*/
	readDouble(opts) {
		const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + (opts?.pointer ?? this.#currentOffset), 8);
		if (opts?.pointer == null) this.#currentOffset += 8;
		return view.getFloat64(0, this.#littleEndian);
	}
	/**
	* Reads a slice from the buffer.
	*
	* @param opts
	* @param opts.length {number} - Length of slice (not inclusive).
	* @param opts.pointer {number} - See {@link Decoder#readUint8}.
	*/
	readBuffer(opts) {
		const offset = opts.pointer ?? this.#currentOffset;
		const result = this.#buffer.subarray(offset, offset + opts.length);
		if (opts.pointer == null) this.#currentOffset += opts.length;
		return result;
	}
	/**
	* Reads a string from the buffer. Defaults to `utf8`.
	*
	* @param opts - Requires either `zeroed` or `length`.
	* @param opts.zeroed - Read until a null terminator (`0x00`) is reached.
	* @param opts.length - Bytes to read.
	* @param opts.encoding - Defaults to `utf8`.
	* @example Zeroed
	* ```ts
	* const decoder = new Decoder(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x00]))
	* decoder.readString({ zeroed: true }) // "hello"
	* ```
	* @example Length
	* ```ts
	* const decoder = new Decoder(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]))
	* decoder.readString({ length: 5 }) // "hello"
	* ```
	*/
	readString(opts) {
		let strBuffer = null;
		if ("length" in opts && opts.length != null) strBuffer = this.readBuffer(opts);
		if ("zeroed" in opts && opts.zeroed) {
			const view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset + this.#currentOffset);
			let size = 0;
			while (view.getUint8(size) !== 0) size++;
			strBuffer = this.#buffer.subarray(this.#currentOffset, this.#currentOffset + size);
			this.#currentOffset += size + 1;
		}
		if (strBuffer == null) throw new Error("You need to specify either `zeroed` or `length`.");
		return strBuffer.toString(opts.encoding ?? "utf8");
	}
};

//#endregion
//#region node_modules/.pnpm/binary-util@2.0.4/node_modules/binary-util/dist/encoder.mjs
var Encoder = class {
	#buffer;
	#currentOffset = 0;
	#littleEndian = true;
	constructor(length = 0) {
		this.#buffer = Buffer.alloc(length);
	}
	get currentOffset() {
		return this.#currentOffset;
	}
	get currentSize() {
		return this.#buffer.length;
	}
	get buffer() {
		const newBuffer = Buffer.alloc(this.#buffer.length);
		this.#buffer.copy(newBuffer);
		return newBuffer;
	}
	endianness(endianness) {
		this.#littleEndian = endianness === "little";
	}
	grow(size) {
		this.#buffer = Buffer.concat([this.#buffer, Buffer.alloc(size)]);
	}
	growIfNeeded(incomingSize) {
		if (this.#currentOffset + incomingSize > this.#buffer.length) this.grow(this.#currentOffset + incomingSize - this.#buffer.length);
	}
	seek(offset) {
		const previous = this.#currentOffset;
		this.growIfNeeded(offset);
		this.#currentOffset += offset;
		return previous;
	}
	goto(offset) {
		const previous = this.#currentOffset;
		this.growIfNeeded(this.currentOffset - offset);
		this.#currentOffset = offset;
		return previous;
	}
	alignTo(alignment) {
		const diff = this.#currentOffset % alignment;
		if (diff === 0) return;
		this.growIfNeeded(alignment - diff);
		this.#currentOffset += alignment - diff;
	}
	#createSetMethod = (size, littleEndianFunction, bigEndianFunction) => (value, opts) => {
		if (opts?.into == null || opts.into + size > this.#buffer.length) this.growIfNeeded(size);
		this.#buffer[!this.#littleEndian && bigEndianFunction != null ? bigEndianFunction : littleEndianFunction](value, opts?.into ?? this.#currentOffset, size);
		if (opts?.into == null) this.#currentOffset += size;
	};
	setInt8 = this.#createSetMethod(1, "writeInt8");
	setUint8 = this.#createSetMethod(1, "writeUInt8");
	setInt16 = this.#createSetMethod(2, "writeInt16LE", "writeInt16BE");
	setUint16 = this.#createSetMethod(2, "writeUInt16LE", "writeUInt16BE");
	setInt32 = this.#createSetMethod(4, "writeInt32LE", "writeInt32BE");
	setUint32 = this.#createSetMethod(4, "writeUInt32LE", "writeUInt32BE");
	setInt64 = this.#createSetMethod(8, "writeBigInt64LE", "writeBigInt64BE");
	setUint64 = this.#createSetMethod(8, "writeBigUInt64LE", "writeBigUInt64BE");
	setFloat = this.#createSetMethod(4, "writeFloatLE", "writeFloatBE");
	setDouble = this.#createSetMethod(8, "writeDoubleLE", "writeDoubleBE");
	setString(value, opts) {
		const data = Buffer.from(`${value}\x00`, opts?.encoding ?? "utf8");
		this.growIfNeeded(data.byteLength);
		data.copy(this.#buffer, opts?.into ?? this.#currentOffset);
		if (opts?.into == null) this.#currentOffset += data.byteLength;
	}
	setBuffer(value, opts) {
		this.growIfNeeded(value.length);
		value.copy(this.#buffer, opts?.into ?? this.#currentOffset);
		if (opts?.into == null) this.#currentOffset += value.length;
	}
};

//#endregion
//#region src/crypto.ts
const encryptionKey = [
	207,
	206,
	251,
	248,
	236,
	10,
	51,
	102,
	147,
	169,
	29,
	147,
	80,
	57,
	95,
	9
];
const decrypt = (data) => {
	const rawData = Buffer.from(data);
	let prev = 0;
	for (let i = 0; i < rawData.length; i++) {
		const cur = rawData[i];
		rawData[i] = cur ^ prev ^ encryptionKey[i & 15];
		prev = cur;
	}
	return rawData;
};
const encrypt = (data) => {
	const rawData = Buffer.from(data);
	let prev = 0;
	for (let i = 0; i < rawData.length; i++) {
		rawData[i] = rawData[i] ^ prev ^ encryptionKey[i & 15];
		prev = rawData[i];
	}
	return rawData;
};

//#endregion
//#region node_modules/.pnpm/murmur-hash@2.0.1/node_modules/murmur-hash/dist/index.js
var encoder = new TextEncoder();
function toBytes(input) {
	if (input instanceof Uint8Array) return input;
	return encoder.encode(input);
}
var C1 = 3432918353;
var C2 = 461845907;
function multiply(a, b) {
	return (a & 65535) * b + (((a >>> 16) * b & 65535) << 16) | 0;
}
function rotl(value, shift) {
	return value << shift | value >>> 32 - shift;
}
function fmix(h) {
	h ^= h >>> 16;
	h = multiply(h, 2246822507);
	h ^= h >>> 13;
	h = multiply(h, 3266489909);
	h ^= h >>> 16;
	return h;
}
function compute(bytes, seed) {
	const len = bytes.length;
	const blocks = len >>> 2;
	let h1 = seed;
	for (let i = 0; i < blocks; i++) {
		const offset = i * 4;
		let k12 = bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16 | bytes[offset + 3] << 24;
		k12 = multiply(k12, C1);
		k12 = rotl(k12, 15);
		k12 = multiply(k12, C2);
		h1 ^= k12;
		h1 = rotl(h1, 13);
		h1 = multiply(h1, 5) + 3864292196;
	}
	const tailOffset = blocks * 4;
	let k1 = 0;
	switch (len & 3) {
		case 3: k1 ^= bytes[tailOffset + 2] << 16;
		case 2: k1 ^= bytes[tailOffset + 1] << 8;
		case 1:
			k1 ^= bytes[tailOffset];
			k1 = multiply(k1, C1);
			k1 = rotl(k1, 15);
			k1 = multiply(k1, C2);
			h1 ^= k1;
	}
	h1 ^= len;
	h1 = fmix(h1);
	return h1 >>> 0;
}
function hash32(input, seed = 0) {
	return compute(toBytes(input), seed);
}

//#endregion
//#region src/utils.ts
const bufferToUUID = (buffer) => {
	const hex = buffer.toString("hex");
	return [
		hex.slice(6, 8) + hex.slice(4, 6) + hex.slice(2, 4) + hex.slice(0, 2),
		hex.slice(10, 12) + hex.slice(8, 10),
		hex.slice(14, 16) + hex.slice(12, 14),
		hex.slice(16, 18) + hex.slice(18, 20),
		hex.slice(20, 32)
	].join("-");
};
const uUIDToBuffer = (uuid) => {
	const hex = uuid.replaceAll("-", "");
	return Buffer.from([
		hex.slice(6, 8) + hex.slice(4, 6) + hex.slice(2, 4) + hex.slice(0, 2),
		hex.slice(10, 12) + hex.slice(8, 10),
		hex.slice(14, 16) + hex.slice(12, 14),
		hex.slice(16, 18) + hex.slice(18, 20),
		hex.slice(20, 32)
	].join(""), "hex");
};
const SEED = 4294967295;
const hashString = (input) => hash32(Buffer.from(input, "utf16le"), SEED);
const extractStringMap = (data, baseOffset) => {
	if (data.length === 0) return /* @__PURE__ */ new Map();
	const string = data.toString("utf16le");
	if (string[string.length - 1] !== "\0") throw new Error("String is not null-terminated");
	const stringMap = /* @__PURE__ */ new Map();
	let start = 0;
	for (let i = 0; i < string.length; i++) if (string[i] === "\0") {
		stringMap.set(baseOffset + start * 2, string.slice(start, i));
		start = i + 1;
	}
	return stringMap;
};
const createStringMapAndData = (msg, initialOffset) => {
	let currentOffset = 0;
	const map = /* @__PURE__ */ new Map();
	const getStringOffset = (str) => {
		if (map.has(str)) return map.get(str);
		const offset = initialOffset + currentOffset;
		map.set(str, offset);
		currentOffset += str.length * 2 + 2;
		return offset;
	};
	const nullAttributes = [];
	const stringAttributes = [];
	for (let i = 0; i < msg.meta.attributes.length; i++) {
		const attribute = msg.meta.attributes[i];
		if (attribute.type === -1) {
			getStringOffset("");
			nullAttributes.push(i);
		} else if (attribute.type === 2) {
			getStringOffset(attribute.name);
			stringAttributes.push(i);
		}
	}
	for (let i = 0; i < msg.meta.attributes.length; i++) {
		const attribute = msg.meta.attributes[i];
		getStringOffset(attribute.name);
	}
	for (const entry of msg.entries) {
		getStringOffset(entry.name);
		for (const value of Object.values(entry.strings)) getStringOffset(value);
		for (const index of stringAttributes) getStringOffset(entry.attributes[index]);
	}
	let data = Buffer.alloc(0);
	for (const str of map.keys()) {
		const strBuffer = Buffer.from(`${str}\x00`, "utf16le");
		data = Buffer.concat([data, strBuffer]);
	}
	return {
		map,
		nullAttributes,
		stringAttributes,
		data
	};
};

//#endregion
//#region src/decode.ts
const parseHeader = (parser) => ({
	version: parser.readUint32(),
	magic: parser.readString({ length: 4 }),
	headerOffset: parser.readUint64(),
	entryCount: parser.readUint32(),
	attributeCount: parser.readUint32(),
	langCount: parser.readUint32(),
	["_"]: parser.alignTo(8),
	dataOffset: parser.readUint64(),
	["_2"]: parser.seek(8),
	langOffset: parser.readUint64(),
	attributesOffset: parser.readUint64(),
	attributeNamesOffset: parser.readUint64()
});
const decodeMsg = (data) => {
	const parser = new Decoder(data);
	const header = parseHeader(parser);
	const entries = [];
	if (header.magic !== "GMSG") throw new Error(`Invalid magic: ${header.magic}`);
	if (header.version !== 539100710 && header.version !== 23) throw new Error(`Unknown version: ${header.version}`);
	const entryHeaderOffsets = [];
	for (let i = 0; i < header.entryCount; i++) entryHeaderOffsets.push(parser.readUint64());
	parser.seek(8);
	const languages = [];
	for (let i = 0; i < header.langCount; i++) languages.push(LanguageCodes[parser.readInt32()] ?? "unknown");
	parser.alignTo(8);
	if (Number(header.attributesOffset) !== parser.currentOffset) throw new Error(`Attributes offset mismatch: ${header.attributesOffset} != ${parser.currentOffset}`);
	const attributesHeaders = [];
	for (let i = 0; i < header.attributeCount; i++) attributesHeaders.push({
		type: parser.readInt32(),
		nameOffset: null,
		name: null
	});
	parser.alignTo(8);
	if (Number(header.attributeNamesOffset) !== parser.currentOffset) throw new Error(`Attribute names offset mismatch: ${header.attributeNamesOffset} != ${parser.currentOffset}`);
	for (let i = 0; i < header.attributeCount; i++) attributesHeaders[i].nameOffset = parser.readUint64();
	if (header.entryCount !== 0) {
		for (let i = 0; i < header.entryCount; i++) {
			if (Number(entryHeaderOffsets[i]) !== parser.currentOffset) throw new Error(`Entry header offset mismatch: $${parser.currentOffset} != entry:${i}:${entryHeaderOffsets[i]}`);
			const entryHeader = {
				id: bufferToUUID(parser.readBuffer({ length: 16 })),
				crc: parser.readUint32(),
				hash: parser.readUint32(),
				nameOffset: parser.readUint64(),
				attributesOffset: parser.readUint64(),
				contentOffsetsByLang: []
			};
			for (let j = 0; j < header.langCount; j++) entryHeader.contentOffsetsByLang.push(parser.readUint64());
			entries.push({ header: entryHeader });
		}
		for (let i = 0; i < header.entryCount; i++) {
			const entry = entries[i];
			if (Number(entry.header.attributesOffset) !== parser.currentOffset) throw new Error(`Entry header attributes offset mismatch: $${parser.currentOffset} != entry:${i}:${entry.header.attributesOffset}`);
			entry.attributes = [];
			for (let j = 0; j < attributesHeaders.length; j++) {
				const attrHeader = attributesHeaders[j];
				switch (attrHeader.type) {
					case -1:
						entry.attributes[j] = Number(parser.readUint64());
						break;
					case 0:
						entry.attributes[j] = Number(parser.readUint64());
						break;
					case 1:
						entry.attributes[j] = parser.readDouble();
						break;
					case 2:
						entry.attributes[j] = Number(parser.readUint64());
						break;
					default: throw new Error(`Not implemented attribute type ${attrHeader.type}`);
				}
			}
		}
		if (Number(header.dataOffset) !== parser.currentOffset) throw new Error(`Data offset mismatch: $${header.dataOffset} != ${parser.currentOffset}`);
		const stringMap = extractStringMap(decrypt(data.subarray(parser.currentOffset)), parser.currentOffset);
		for (let i = 0; i < attributesHeaders.length; i++) {
			const attributeHeader = attributesHeaders[i];
			attributeHeader.name = stringMap.get(Number(attributeHeader.nameOffset));
		}
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			for (let j = 0; j < header.attributeCount; j++) switch (attributesHeaders[j].type) {
				case 2:
					entry.attributes[j] = stringMap.get(entry.attributes[j]);
					break;
				case -1:
					entry.attributes[j] = stringMap.get(entry.attributes[j]);
					if (entry.attributes[j] !== "" && entry.attributes[j] !== "\0") throw new Error(`Attribute with type -1 is not empty string: "${entry.attributes[j]}"`);
					break;
			}
		}
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			entry.name = stringMap.get(Number(entry.header.nameOffset));
			entry.strings = {};
			for (let j = 0; j < entry.header.contentOffsetsByLang.length; j++) {
				const offset = Number(entry.header.contentOffsetsByLang[j]);
				entry.strings[languages[j]] = stringMap.get(offset);
			}
		}
	}
	const parsedEntries = [];
	for (const { header, name, attributes, strings } of entries) {
		const hash = hashString(name);
		if (hash !== header.hash) throw new Error(`Hash mismatch for entry ${name}: ${hash} != ${header.hash}`);
		parsedEntries.push({
			meta: {
				id: header.id,
				crc: header.crc,
				hash: header.hash
			},
			name,
			attributes,
			strings
		});
	}
	return {
		meta: {
			version: header.version,
			attributes: attributesHeaders.map((attr) => ({
				type: attr.type,
				name: attr.name
			}))
		},
		entries: parsedEntries
	};
};

//#endregion
//#region src/encode.ts
const encodeMsg = (input) => {
	if (input.meta.version !== 539100710 && input.meta.version !== 23) throw new Error(`Unsupported version ${input.meta.version}`);
	const encoder = new Encoder();
	encoder.setUint32(input.meta.version);
	encoder.setString("GMSG", { encoding: "ascii" });
	encoder.setUint64(16n);
	encoder.setUint32(input.entries.length);
	encoder.setUint32(input.meta.attributes.length);
	const languageCount = input.entries[0] != null ? Object.keys(input.entries[0].strings).length : 0;
	encoder.setUint32(languageCount);
	encoder.alignTo(8);
	const dataOffsetOffset = encoder.currentOffset;
	encoder.setInt64(-1n);
	const unknownOffsetOffset = encoder.currentOffset;
	encoder.setInt64(-1n);
	const langOffsetOffset = encoder.currentOffset;
	encoder.setInt64(-1n);
	const attributesOffsetOffset = encoder.currentOffset;
	encoder.setInt64(-1n);
	const attributeNamesOffsetOffset = encoder.currentOffset;
	encoder.setInt64(-1n);
	const entryHeadersOffsets = [];
	for (let i = 0; i < input.entries.length; i++) {
		entryHeadersOffsets.push(encoder.currentOffset);
		encoder.setInt64(-1n);
	}
	encoder.setUint64(BigInt(encoder.currentOffset), { into: unknownOffsetOffset });
	encoder.setUint64(0n);
	encoder.setUint64(BigInt(encoder.currentOffset), { into: langOffsetOffset });
	for (let i = 0; i < languageCount; i++) encoder.setInt32(i);
	encoder.alignTo(8);
	encoder.setUint64(BigInt(encoder.currentOffset), { into: attributesOffsetOffset });
	for (const attribute of input.meta.attributes) encoder.setInt32(attribute.type);
	encoder.alignTo(8);
	encoder.setUint64(BigInt(encoder.currentOffset), { into: attributeNamesOffsetOffset });
	const attributeNameOffsetOffsets = [];
	for (const _ of input.meta.attributes) {
		attributeNameOffsetOffsets.push(encoder.currentOffset);
		encoder.setInt64(-1n);
	}
	const entryHeaderOffsets = [];
	for (let i = 0; i < input.entries.length; i++) {
		encoder.setUint64(BigInt(encoder.currentOffset), { into: entryHeadersOffsets[i] });
		const entry = input.entries[i];
		encoder.setBuffer(uUIDToBuffer(entry.meta.id));
		encoder.setUint32(entry.meta.crc);
		encoder.setUint32(hashString(entry.name));
		entryHeaderOffsets[i] ??= {};
		entryHeaderOffsets[i].name = encoder.currentOffset;
		encoder.setInt64(-1n);
		entryHeaderOffsets[i].attributes = encoder.currentOffset;
		encoder.setInt64(-1n);
		entryHeaderOffsets[i].langs = [];
		for (let j = 0; j < languageCount; j++) {
			entryHeaderOffsets[i].langs[j] = encoder.currentOffset;
			encoder.setInt64(-1n);
		}
		entryHeaderOffsets[i].attributeValues = [];
	}
	for (let i = 0; i < input.entries.length; i++) {
		const entry = input.entries[i];
		encoder.setUint64(BigInt(encoder.currentOffset), { into: entryHeaderOffsets[i].attributes });
		for (let j = 0; j < input.meta.attributes.length; j++) {
			switch (input.meta.attributes[j].type) {
				case -1:
					encoder.setInt64(-1n);
					break;
				case 0:
					encoder.setInt32(entry.attributes[j]);
					break;
				case 1:
					encoder.setDouble(entry.attributes[j]);
					break;
				case 2:
					encoder.setInt64(-1n);
					break;
			}
			entryHeaderOffsets[i].attributeValues[j] = encoder.currentOffset;
		}
	}
	const dataOffset = encoder.currentOffset;
	encoder.setUint64(BigInt(dataOffset), { into: dataOffsetOffset });
	const { data, map: stringMap, nullAttributes, stringAttributes } = createStringMapAndData(input, dataOffset);
	const encryptedData = encrypt(data);
	encoder.setBuffer(encryptedData);
	for (let i = 0; i < input.meta.attributes.length; i++) {
		const { name } = input.meta.attributes[i];
		const offset = attributeNameOffsetOffsets[i];
		encoder.setUint64(BigInt(stringMap.get(name)), { into: offset });
	}
	for (let i = 0; i < input.entries.length; i++) {
		const entry = input.entries[i];
		const offsets = entryHeaderOffsets[i];
		encoder.setUint64(BigInt(stringMap.get(entry.name)), { into: offsets.name });
		const strings = Object.values(entry.strings);
		for (let j = 0; j < strings.length; j++) {
			const string = strings[j];
			encoder.setUint64(BigInt(stringMap.get(string)), { into: offsets.langs[j] });
		}
		for (const index of stringAttributes) {
			const string = entry.attributes[index];
			encoder.setUint64(BigInt(stringMap.get(string)), { into: offsets.attributeValues[index] });
		}
		const nullStringOffset = stringMap.get("");
		for (const index of nullAttributes) encoder.setUint64(BigInt(nullStringOffset), { into: offsets.attributeValues[index] });
	}
	return encoder.buffer;
};

//#endregion
export { LanguageCodes, decodeMsg, encodeMsg };