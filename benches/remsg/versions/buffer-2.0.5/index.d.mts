import { Buffer as Buffer$1 } from "node:buffer";

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
declare const decodeMsg: (data: Buffer$1) => REMsg;
//#endregion
//#region src/encode.d.ts
declare const encodeMsg: (input: REMsg) => Buffer<ArrayBufferLike>;
//#endregion
export { LanguageCodes, type REMsg, decodeMsg, encodeMsg };