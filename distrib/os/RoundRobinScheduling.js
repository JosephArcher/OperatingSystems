///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="schedulingAlgorithm.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Truck = (function (_super) {
    __extends(Truck, _super);
    function Truck(options) {
        _super.call(this, options);
        this.bedLength = options.bedLength;
        this.fourByFour = options.fourByFour;
    }
    Object.defineProperty(Truck.prototype, "bedLength", {
        get: function () {
            return this._bedLength;
        },
        set: function (value) {
            if (value == null || value == undefined || value == '') {
                this._bedLength = 'Short';
            }
            else {
                this._bedLength = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Truck;
})(SchedulingAlgorithm);
