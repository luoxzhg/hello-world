// Original file: ocr.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ExecReq as _imo_ocr_ExecReq, ExecReq__Output as _imo_ocr_ExecReq__Output } from '../imo_ocr/ExecReq';
import type { ExecResp as _imo_ocr_ExecResp, ExecResp__Output as _imo_ocr_ExecResp__Output } from '../imo_ocr/ExecResp';

export interface imo_serviceClient extends grpc.Client {
  imo_ocr(argument: _imo_ocr_ExecReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  imo_ocr(argument: _imo_ocr_ExecReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  imo_ocr(argument: _imo_ocr_ExecReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  imo_ocr(argument: _imo_ocr_ExecReq, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  imoOcr(argument: _imo_ocr_ExecReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  imoOcr(argument: _imo_ocr_ExecReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  imoOcr(argument: _imo_ocr_ExecReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  imoOcr(argument: _imo_ocr_ExecReq, callback: (error?: grpc.ServiceError, result?: _imo_ocr_ExecResp__Output) => void): grpc.ClientUnaryCall;
  
}

export interface imo_serviceHandlers extends grpc.UntypedServiceImplementation {
  imo_ocr: grpc.handleUnaryCall<_imo_ocr_ExecReq__Output, _imo_ocr_ExecResp>;
  
}

export interface imo_serviceDefinition extends grpc.ServiceDefinition {
  imo_ocr: MethodDefinition<_imo_ocr_ExecReq, _imo_ocr_ExecResp, _imo_ocr_ExecReq__Output, _imo_ocr_ExecResp__Output>
}
