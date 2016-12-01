"use strict";
var RespTriples = (function () {
    function RespTriples(stresponse) {
        this.stresponse = stresponse;
    }
    return RespTriples;
}());
exports.RespTriples = RespTriples;
var STResponse = (function () {
    function STResponse(request, data, type, reply) {
        this.request = request;
        this.data = data;
        this.type = type;
        this.reply = reply;
    }
    return STResponse;
}());
var ResponseData = (function () {
    function ResponseData(triples) {
        this.triples = triples;
    }
    return ResponseData;
}());
exports.ResponseData = ResponseData;
var Reply = (function () {
    function Reply(status) {
        this.status = status;
    }
    return Reply;
}());
exports.Reply = Reply;
//# sourceMappingURL=respTriples.js.map