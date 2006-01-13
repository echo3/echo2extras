ExtrasUtil = function() { };

ExtrasUtil.Bounds = function(element) {
    this.left = 0;
    this.top = 0;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    while (element != null) {
        this.left += element.offsetLeft;
        this.top += element.offsetTop;
        element = element.offsetParent;
    }
};

ExtrasUtil.Bounds.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + ") [" + this.width + "x" + this.height + "]";
};

