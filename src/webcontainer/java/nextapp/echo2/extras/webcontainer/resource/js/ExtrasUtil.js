ExtrasUtil = function() { };

ExtrasUtil.Bounds = function(element) {
    this.left = 0;
    this.top = 0;
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
    while (element != null) {
        this.left += element.offsetLeft;
        this.top += element.offsetTop;
        element = element.offsetParent;
    }
};

ExtrasUtil.Bounds.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + ") [" + this.width + "x" + this.height + "]";
};

ExtrasUtil.setCssPositionBottom = function(style, containerElementId, bottomPx, subtractedPixels) {
    if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
        var heightExpression = "(document.getElementById(\"" + containerElementId + "\").offsetHeight-" 
                + subtractedPixels + ")+\"px\"";
        style.setExpression("height", heightExpression);
    } else {
        style.bottom = bottomPx + "px";
    }
};

ExtrasUtil.setCssPositionTop = function(style, containerElementId, topPx, subtractedPixels) {
    if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
        var heightExpression = "(document.getElementById(\"" + containerElementId + "\").offsetHeight-" 
                + subtractedPixels + ")+\"px\"";
        style.setExpression("height", heightExpression);
    } else {
        style.top = topPx + "px";
    }
};

ExtrasUtil.setCssPositionRight = function(style, containerElementId, rightPx, subtractedPixels) {
    if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
        var widthExpression = "(document.getElementById(\"" + containerElementId + "\").offsetWidth-" 
                + subtractedPixels + ")+\"px\"";
        style.setExpression("width", widthExpression);
    } else {
        style.right = rightPx + "px";
    }
};
