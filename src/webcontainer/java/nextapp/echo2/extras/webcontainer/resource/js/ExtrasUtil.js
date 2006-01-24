/* 
 * This file is part of the Echo2 Extras Project.
 * Copyright (C) 2005-2006 NextApp, Inc.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */

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
