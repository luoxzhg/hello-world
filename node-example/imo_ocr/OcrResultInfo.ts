// Original file: ocr.proto

import type { Point as _imo_ocr_Point, Point__Output as _imo_ocr_Point__Output } from '../imo_ocr/Point';

export interface OcrResultInfo {
  'points'?: (_imo_ocr_Point)[];
  'ocrStr'?: (string);
  'confidence'?: (number | string);
}

export interface OcrResultInfo__Output {
  'points'?: (_imo_ocr_Point__Output)[];
  'ocrStr'?: (string);
  'confidence'?: (number);
}
