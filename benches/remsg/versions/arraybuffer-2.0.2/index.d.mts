//#region src/polyfills.d.ts
declare global {
  interface Uint8Array {
    toHex(): string;
  }
  interface Uint8ArrayConstructor {
    fromHex(string: string, into?: Uint8Array): {
      bytes: Uint8Array;
      read: number;
    };
  }
}
//#endregion
//#region src/constants.d.ts
declare const LanguageCodes: readonly ["ja", "en", "fr", "it", "de", "es", "ru", "pl", "nl", "pt", "pt-br", "ko", "zh-tw", "zh-cn", "fi", "sv", "da", "no", "cs", "hu", "sk", "ar", "tr", "bg", "el", "ro", "th", "uk", "vi", "id", "fiction", "hi", "es-mx", "max"];
//#endregion
//#region src/types.d.ts
type REMsgEntry = {
  meta: {
    id: string;
    crc: number;
    hash: number;
  };
  name: string;
  attributes: Array<string | number>;
  strings: Record<(typeof LanguageCodes)[number], "" | string>;
};
type REMsg = {
  meta: {
    version: number;
    attributes: Array<{
      type: number;
      name: string;
    }>;
  };
  entries: REMsgEntry[];
};
//#endregion
//#region src/decode.d.ts
declare const decodeMsg: (data: Uint8Array) => REMsg;
//#endregion
//#region src/encode.d.ts
declare const encodeMsg: (input: REMsg) => Uint8Array<ArrayBufferLike>;
//#endregion
export { LanguageCodes, type REMsg, decodeMsg, encodeMsg };
//# sourceMappingURL=index.d.mts.map