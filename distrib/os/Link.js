var TSOS;
(function (TSOS) {
    var Link = (function () {
        function Link(value, nextLink) {
            this.value = value;
            this.nextLink = nextLink;
        }
        return Link;
    })();
    TSOS.Link = Link;
})(TSOS || (TSOS = {}));
