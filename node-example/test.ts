interface SuccessResponse {
   code: 0;
   data: any;
}
type OmitLiteral<Literals extends string | number, ExcludedLiterals extends Literals> = keyof Omit<{ [Key in Literals]: never }, ExcludedLiterals>;

interface FailureResponse {
   code: Omit<{ [key in number]: never }, 0>;
   msg: string;
}

interface success {
   name: string;
   code: number;
   data: object;
}

type ChangeSuccess<T> = {
   [P in keyof T]: P extends 'code' ? T[P] extends 0 ? T[P] : never : T[P]
}

type main = ChangeSuccess<success>

type ResponseData = SuccessResponse | FailureResponse;

type IsZro<T> = T extends 0 ? SuccessResponse : FailureResponse

function test(r: ResponseData) {
   if (r.code === 0) {
      return r
   }
   else if (r.code === 1) {
      return r
   }
   else {
      return r
   }
}