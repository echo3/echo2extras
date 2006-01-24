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

ExtrasUtil.Insets = function(insetsString) {
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
    
    if (arguments.length == 1) {
        this.loadValuesFromString(insetsString);
    } else if (arguments.length == 2) {
        this.top = this.bottom = arguments[0];
        this.right = this.left = arguments[1];
    } else if (arguments.length == 4) {
        this.top = arguments[0];
        this.right = arguments[1];
        this.bottom = arguments[2];
        this.left = arguments[3];
    }
};

ExtrasUtil.Insets.prototype.loadValuesFromString = function(insetsString) {
    insetsString = new String(insetsString);
    var elements = insetsString.split(" ");
    switch (elements.length) {
    case 1:
        this.top = this.left = this.right = this.bottom = parseInt(elements[0]);
        break;
    case 2:
        this.top = this.bottom = parseInt(elements[0]);
        this.right = this.left = parseInt(elements[1]);
        break;
    case 3:
        this.top = parseInt(elements[0]);
        this.right = this.left = parseInt(elements[1]);
        this.bottom = parseInt(elements[2]);
        break;
    case 4:
        this.top = parseInt(elements[0]);
        this.right = parseInt(elements[1]);
        this.bottom = parseInt(elements[2]);
        this.left = parseInt(elements[3]);
        break;
    default:
        throw "Illegal inset value: " + insetsString;
    }
};

ExtrasUtil.Insets.prototype.toString = function(insetsString) {
    if (this.top == this.bottom && this.right == this.left) {
        if (this.top == this.right) {
            return this.top + "px"
        } else {
            return this.top + "px " + this.right + "px";
        }
    } else {
        return this.top + "px " + this.right + "px " + this.bottom + "px " + this.left + "px";
    }
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
