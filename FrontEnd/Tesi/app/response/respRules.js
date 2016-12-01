"use strict";
var RespRules = (function () {
    function RespRules(stresponse) {
        this.stresponse = stresponse;
    }
    return RespRules;
}());
exports.RespRules = RespRules;
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
    function ResponseData(response) {
        this.response = response;
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
//# sourceMappingURL=respRules.js.map