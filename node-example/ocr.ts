import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { imo_serviceClient as _imo_ocr_imo_serviceClient, imo_serviceDefinition as _imo_ocr_imo_serviceDefinition } from './imo_ocr/imo_service';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  imo_ocr: {
    ExecReq: MessageTypeDefinition
    ExecResp: MessageTypeDefinition
    OcrResultInfo: MessageTypeDefinition
    Point: MessageTypeDefinition
    imo_service: SubtypeConstructor<typeof grpc.Client, _imo_ocr_imo_serviceClient> & { service: _imo_ocr_imo_serviceDefinition }
  }
}

