// Original file: ocr.proto


export interface ExecReq {
  'image'?: (Buffer | Uint8Array | string);
  'maxLines'?: (number);
}

export interface ExecReq__Output {
  'image'?: (Buffer);
  'maxLines'?: (number);
}
