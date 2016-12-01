export class RespTriples {

    constructor(
        public stresponse: STResponse
      ) { }

}

class STResponse {

    constructor(
        public request: string,
        public data: ResponseData,
        public type: string,
        public reply: Reply
      ) { }

}

export class ResponseData {

  constructor(public triples: string[][][]) {
  }

}

export class Reply {

    constructor(
        public status:string
      ) { }

}
