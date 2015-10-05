///<reference path="Link.ts" />
var TSOS;
(function (TSOS) {
    var LinkedList = (function () {
        function LinkedList(headLink) {
            this.headLink = headLink;
        }
        return LinkedList;
    })();
    TSOS.LinkedList = LinkedList;
})(TSOS || (TSOS = {}));
