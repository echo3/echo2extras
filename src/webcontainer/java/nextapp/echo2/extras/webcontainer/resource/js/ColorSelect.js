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

ExtrasColorSelect = function(elementId, containerElementId) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;

    // Note: Default image values are provided here for stand-alone testing outside of the Echo2 framework.
    this.svGradientImageSrc = "SVTransparentGradient.png";
    this.hGradientImageSrc = "HGradient.png";
    this.arrowDownImageSrc = "ArrowDown.gif";
    this.arrowLeftImageSrc = "ArrowLeft.gif";
    this.arrowRightImageSrc = "ArrowRight.gif";
    this.arrowUpImageSrc = "ArrowUp.gif";
    
    this.displayValue = true;
    
    this.transparentImageSrc = "Transparent.gif"
    this.h = 0;
    this.s = 1;
    this.v = 1;
    this.valueWidth = 150;
    this.saturationHeight = 150;
    this.hueWidth = 20;
    this.enableInternetExplorerPngWorkaround = false;
    
    this.hActive = false;
    this.svActive = false;
    this.enabled = true;
};

ExtrasColorSelect.prototype.create = function() {
    var containerElement = document.getElementById(this.containerElementId);
    var colorSelectDivElement = document.createElement("div");
    colorSelectDivElement.id = this.elementId;
    colorSelectDivElement.style.position = "relative";
    colorSelectDivElement.style.left = "0px";
    colorSelectDivElement.style.top = "0px";
    colorSelectDivElement.style.width = (this.valueWidth + this.hueWidth + 29) + "px";
    colorSelectDivElement.style.height = (this.saturationHeight + 36) +"px";
    colorSelectDivElement.style.overflow = "hidden";
    
    var svDivElement = document.createElement("div");
    svDivElement.id = this.elementId + "_sv";
    svDivElement.style.position = "absolute";
    svDivElement.style.left = "7px";
    svDivElement.style.top = "7px";
    svDivElement.style.width = this.valueWidth + "px";
    svDivElement.style.height = this.saturationHeight + "px";
    svDivElement.style.backgroundColor = "#ff0000";
    colorSelectDivElement.appendChild(svDivElement);

    if (this.enableInternetExplorerPngWorkaround) {
        svDivElement.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader("
                + "src='" + this.svGradientImageSrc + "', sizingMethod='scale');";
    } else {
        var svGradientImgElement = document.createElement("img");
        svGradientImgElement.src = this.svGradientImageSrc;
        svGradientImgElement.style.width = this.valueWidth + "px";
        svGradientImgElement.style.height = this.saturationHeight + "px";
        svDivElement.appendChild(svGradientImgElement);
    }
    
    var vLineDivElement = document.createElement("div");
    vLineDivElement.id = this.elementId + "_vline";
    vLineDivElement.style.position = "absolute";
    vLineDivElement.style.left = "2px";
    vLineDivElement.style.top = "0px";
    vLineDivElement.style.width = "11px";
    vLineDivElement.style.height = (this.saturationHeight + 14) + "px";
    vLineDivElement.style.overflow = "hidden";
    colorSelectDivElement.appendChild(vLineDivElement);

    var vLineTopImgElement = document.createElement("img");
    vLineTopImgElement.src = this.arrowDownImageSrc;
    vLineTopImgElement.style.position = "absolute";
    vLineTopImgElement.style.left = "0px";
    vLineTopImgElement.style.top = "0px";
    vLineDivElement.appendChild(vLineTopImgElement);
    
    var vLineBarDivElement = document.createElement("div");
    vLineBarDivElement.style.position = "absolute";
    vLineBarDivElement.style.top = "7px";
    vLineBarDivElement.style.left = "5px";
    vLineBarDivElement.style.height = this.saturationHeight + "px";
    vLineBarDivElement.style.width = "1px";
    vLineBarDivElement.style.backgroundColor = "#000000";
    vLineDivElement.appendChild(vLineBarDivElement);

    var vLineBottomImgElement = document.createElement("img");
    vLineBottomImgElement.src = this.arrowUpImageSrc;
    vLineBottomImgElement.style.position = "absolute";
    vLineBottomImgElement.style.left = "0px";
    vLineBottomImgElement.style.top = (this.saturationHeight + 7) + "px";
    vLineDivElement.appendChild(vLineBottomImgElement);

    var sLineDivElement = document.createElement("div");
    sLineDivElement.id = this.elementId + "_sline";
    sLineDivElement.style.position = "absolute";
    sLineDivElement.style.left = "0px";
    sLineDivElement.style.top = (this.saturationHeight + 2) + "px";
    sLineDivElement.style.height = "11px";
    sLineDivElement.style.width = (this.valueWidth + 14) + "px";
    sLineDivElement.style.overflow = "hidden";
    colorSelectDivElement.appendChild(sLineDivElement);
    
    var sLineLeftImgElement = document.createElement("img");
    sLineLeftImgElement.src = this.arrowRightImageSrc;
    sLineLeftImgElement.style.position = "absolute";
    sLineLeftImgElement.style.left = "0px";
    sLineLeftImgElement.style.top = "0px";
    sLineDivElement.appendChild(sLineLeftImgElement);
    
    var sLineRightImgElement = document.createElement("img");
    sLineRightImgElement.src = this.arrowLeftImageSrc;
    sLineRightImgElement.style.position = "absolute";
    sLineRightImgElement.style.left = this.valueWidth + 7 + "px";
    sLineRightImgElement.style.top = "0px";
    sLineDivElement.appendChild(sLineRightImgElement);

    var sLineBarDivElement = document.createElement("div");
    sLineBarDivElement.style.position = "absolute";
    sLineBarDivElement.style.left = "0px";
    sLineBarDivElement.style.left = "7px";
    sLineBarDivElement.style.top = "5px";
    sLineBarDivElement.style.width = this.valueWidth + "px";
    sLineBarDivElement.style.height = "1px";
    sLineBarDivElement.style.fontSize = "1px";
    sLineBarDivElement.style.borderTop = "1px #000000 solid";
    sLineBarDivElement.style.lineHeight = "0";
    sLineDivElement.appendChild(sLineBarDivElement);

    var hDivElement = document.createElement("div");
    hDivElement.id = this.elementId + "_h";
    hDivElement.style.position = "absolute";
    hDivElement.style.left = (this.valueWidth + 22) + "px";
    hDivElement.style.top = "7px";
    hDivElement.style.width = this.hueWidth + "px";
    hDivElement.style.height = this.saturationHeight + "px";
    colorSelectDivElement.appendChild(hDivElement);
    
    var hGradientImgElement = document.createElement("img");
    hGradientImgElement.src = this.hGradientImageSrc;
    hGradientImgElement.style.position = "absolute";
    hGradientImgElement.style.left = "0px";
    hGradientImgElement.style.top = "0px";
    hGradientImgElement.style.width = this.hueWidth + "px";
    hGradientImgElement.style.height = this.saturationHeight + "px";
    hDivElement.appendChild(hGradientImgElement);
    
    var hLineDivElement = document.createElement("div");
    hLineDivElement.id = this.elementId + "_hline";
    hLineDivElement.style.position = "absolute";
    hLineDivElement.style.left = (this.valueWidth + 15) + "px";
    hLineDivElement.style.top = (this.saturationHeight + 2) + "2px";
    hLineDivElement.style.height = "11px";
    hLineDivElement.style.width = (this.hueWidth + 14) + "px";
    hLineDivElement.style.overflow = "hidden";
    colorSelectDivElement.appendChild(hLineDivElement);
    
    var hLineLeftImgElement = document.createElement("img");
    hLineLeftImgElement.src = this.arrowRightImageSrc;
    hLineLeftImgElement.style.position = "absolute";
    hLineLeftImgElement.style.left = "0px";
    hLineLeftImgElement.style.top = "0px";
    hLineDivElement.appendChild(hLineLeftImgElement);
    
    var hLineRightImgElement = document.createElement("img");
    hLineRightImgElement.src = this.arrowLeftImageSrc;
    hLineRightImgElement.style.position = "absolute";
    hLineRightImgElement.style.left = (this.hueWidth + 7) + "px";
    hLineRightImgElement.style.top = "0px";
    hLineDivElement.appendChild(hLineRightImgElement);

    var hLineBarDivElement = document.createElement("div");
    hLineBarDivElement.style.position = "absolute";
    hLineBarDivElement.style.left = "0px";
    hLineBarDivElement.style.left = "7px";
    hLineBarDivElement.style.top = "5px";
    hLineBarDivElement.style.width = this.hueWidth + "px";
    hLineBarDivElement.style.height = "1px";
    hLineBarDivElement.style.fontSize = "1px";
    hLineBarDivElement.style.borderTop = "1px #000000 solid";
    hLineBarDivElement.style.lineHeight = "0";
    hLineDivElement.appendChild(hLineBarDivElement);

    var colorDivElement = document.createElement("div");
    colorDivElement.id = this.elementId + "_color";
    colorDivElement.style.position = "absolute";
    colorDivElement.style.left = "7px";
    colorDivElement.style.top = (this.saturationHeight + 16) + "px";
    colorDivElement.style.width = (this.valueWidth + this.hueWidth + 13) + "px";
    colorDivElement.style.height = "18px";
    colorDivElement.style.color = "#ffffff";
    colorDivElement.style.backgroundColor = "#000000";
    colorDivElement.style.borderColor = "#000000";
    colorDivElement.style.borderStyle = "outset";
    colorDivElement.style.borderWidth = "1px";
    colorDivElement.style.fontFamily = "monospace";
    colorDivElement.style.textAlign = "center";
    if (this.displayValue) {
        colorDivElement.appendChild(document.createTextNode("#000000"));
    }
    colorSelectDivElement.appendChild(colorDivElement);

    var svListenerDivElement = document.createElement("div");
    svListenerDivElement.id = this.elementId + "_svlistener";
    svListenerDivElement.style.position = "absolute";
    svListenerDivElement.style.zIndex = "1";
    svListenerDivElement.style.left = "0px";
    svListenerDivElement.style.top = "0px";
    svListenerDivElement.style.width = (this.valueWidth + 14) + "px";
    svListenerDivElement.style.height = (this.saturationHeight + 14) + "px";
    svListenerDivElement.style.cursor = "crosshair";
    svListenerDivElement.style.backgroundImage = "url(" + this.transparentImageSrc + ")";
    colorSelectDivElement.appendChild(svListenerDivElement);

    var hListenerDivElement = document.createElement("div");
    hListenerDivElement.id = this.elementId + "_hlistener";
    hListenerDivElement.style.position = "absolute";
    hListenerDivElement.style.zIndex = "1";
    hListenerDivElement.style.left = (this.valueWidth + 15) + "px";
    hListenerDivElement.style.top = "0px";
    hListenerDivElement.style.width = (this.hueWidth + 14) + "px";
    hListenerDivElement.style.height = (this.saturationHeight + 16) + "px";
    hListenerDivElement.style.cursor = "crosshair";
    hListenerDivElement.style.backgroundImage = "url(" + this.transparentImageSrc + ")";
    colorSelectDivElement.appendChild(hListenerDivElement);

    containerElement.appendChild(colorSelectDivElement);
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "component", this);
    
    EchoEventProcessor.addHandler(svListenerDivElement.id, "mousedown", "ExtrasColorSelect.processSVMouseDown");
    EchoEventProcessor.addHandler(hListenerDivElement.id, "mousedown", "ExtrasColorSelect.processHMouseDown");
};

ExtrasColorSelect.prototype.dispose = function() {
    EchoEventProcessor.removeHandler(this.elementId + "_svlistener", "mousedown");
    EchoEventProcessor.removeHandler(this.elementId + "_svlistener", "mousemove");
    EchoEventProcessor.removeHandler(this.elementId + "_svlistener", "mouseup");
    EchoEventProcessor.removeHandler(this.elementId + "_hlistener", "mousedown");
    EchoEventProcessor.removeHandler(this.elementId + "_hlistener", "mousemove");
    EchoEventProcessor.removeHandler(this.elementId + "_hlistener", "mouseup");
};

/**
 * Returns the selected color.

 * @return the selected color as an 
 *         <code>ExtrasColorSelect.RGB</code> value.
 */
ExtrasColorSelect.prototype.getColor = function() {
    return ExtrasColorSelect.hsvToRgb(this.h, this.s, this.v);
};

ExtrasColorSelect.prototype.processHMouseDown = function(echoEvent) {
    if (!this.enabled || !EchoClientEngine.verifyInput(this.elementId, false)) {
        return;
    }
    this.hActive = true;
    this.svActive = false;
    EchoDomUtil.preventEventDefault(echoEvent);

    EchoEventProcessor.addHandler(this.elementId + "_hlistener", "mousemove", "ExtrasColorSelect.processHMouseMove");
    EchoEventProcessor.addHandler(this.elementId + "_hlistener", "mouseup", "ExtrasColorSelect.processHMouseUp");
};

ExtrasColorSelect.prototype.processHMouseMove = function(e) {
    if (this.hActive) {
        this.processHUpdate(e);
    }
};

ExtrasColorSelect.prototype.processHMouseUp = function(e) {
    if (this.hActive) {
        this.processHUpdate(e);
    }
    this.hActive = false;
    this.svActive = false;
    this.removeListeners();
};

ExtrasColorSelect.prototype.processHUpdate = function(echoEvent) {
    var hContainerDivElement = document.getElementById(this.elementId + "_hlistener");
    var bounds = new EchoCssUtil.Bounds(hContainerDivElement);
    this.h = (this.saturationHeight - (echoEvent.clientY - bounds.top - 7)) * 360 / this.saturationHeight;
    this.updateColor();
};

ExtrasColorSelect.prototype.processSVMouseDown = function(echoEvent) {
    if (!this.enabled || !EchoClientEngine.verifyInput(this.elementId, false)) {
        return;
    }
    this.hActive = false;
    this.svActive = true;
    EchoDomUtil.preventEventDefault(echoEvent);
    
    EchoEventProcessor.addHandler(this.elementId + "_svlistener", "mousemove", "ExtrasColorSelect.processSVMouseMove");
    EchoEventProcessor.addHandler(this.elementId + "_svlistener", "mouseup", "ExtrasColorSelect.processSVMouseUp");
};

ExtrasColorSelect.prototype.processSVMouseMove = function(e) {
    if (this.svActive) {
        this.processSVUpdate(e);
    }
};

ExtrasColorSelect.prototype.processSVMouseUp = function(e) {
    if (this.svActive) {
        this.processSVUpdate(e);
    }
    this.hActive = false;
    this.svActive = false;
    this.removeListeners();
};

ExtrasColorSelect.prototype.processSVUpdate = function(echoEvent) {
    var svContainerDivElement = document.getElementById(this.elementId + "_svlistener");
    var bounds = new EchoCssUtil.Bounds(svContainerDivElement);
    this.v = (echoEvent.clientX - bounds.left - 7) / this.valueWidth;
    this.s = 1 - ((echoEvent.clientY - bounds.top - 7) / this.saturationHeight);
    this.updateColor();
};

ExtrasColorSelect.prototype.removeListeners = function() {
    EchoEventProcessor.removeHandler(this.elementId + "_svlistener", "mousemove");
    EchoEventProcessor.removeHandler(this.elementId + "_svlistener", "mouseup");
    EchoEventProcessor.removeHandler(this.elementId + "_hlistener", "mousemove");
    EchoEventProcessor.removeHandler(this.elementId + "_hlistener", "mouseup");
};

/**
 * Sets the selected color.
 *
 * @param rgb the color to select as an <code>ExtrasColorSelect.RGB</code>
 *            value.
 */
ExtrasColorSelect.prototype.setColor = function(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    this.v = max;
    
    var delta = max - min;
    if (max == 0 || delta == 0) {
        this.s = 0;
        this.h = 0;
    } else {
        this.s = delta / max;
        if (r == max) {
            this.h = 60 * ((g - b) / delta);
        } else if (g == max) {
            this.h = 60 * (2 + (b - r) / delta);
        } else {
            this.h = 60 * (4 + (r - g) / delta);
        }
        if (this.h < 0) {
            this.h += 360;
        }
    }
    this.updateColor();
};

/**
 * Updates the component state in the outgoing <code>ClientMessage</code>.
 *
 * @param componentId the id of the Text Component
 */
ExtrasColorSelect.prototype.updateClientMessage = function(color) {
    var colorPropertyElement = EchoClientMessage.createPropertyElement(this.elementId, "color");
    var colorElement = colorPropertyElement.firstChild;
    if (!colorElement) {
        colorElement = EchoClientMessage.messageDocument.createElement("color");
        colorPropertyElement.appendChild(colorElement);
    }
    colorElement.setAttribute("r", color.r);
    colorElement.setAttribute("g", color.g);
    colorElement.setAttribute("b", color.b);
    EchoDebugManager.updateClientMessage();
};

ExtrasColorSelect.prototype.updateColor = function() {
    var svDivElement = document.getElementById(this.elementId + "_sv");
    var baseColor;
    if (this.enabled) {
        baseColor = ExtrasColorSelect.hsvToRgb(this.h, 1, 1);
    } else {
        baseColor = ExtrasColorSelect.hsvToRgb(this.h, 0.3, 0.7);
    }
    svDivElement.style.backgroundColor = baseColor.toHexTriplet();
   
    var renderColor = ExtrasColorSelect.hsvToRgb(this.h, this.s, this.v);
    var colorDivElement = document.getElementById(this.elementId + "_color");
    var renderHexTriplet = renderColor.toHexTriplet();
    colorDivElement.style.backgroundColor = renderHexTriplet;
    colorDivElement.style.borderColor = renderHexTriplet;
    colorDivElement.style.color = this.v < 0.67 ? "#ffffff" : "#000000";
    if (this.displayValue) {
        colorDivElement.childNodes[0].nodeValue = renderHexTriplet;
    }
   
    var sLineElement = document.getElementById(this.elementId + "_sline");
    var sLineTop = parseInt((1 - this.s) * this.saturationHeight) + 2;
    if (sLineTop < 2) {
         sLineTop = 2;
    } else if (sLineTop > this.saturationHeight + 2) {
        sLineTop = this.saturationHeight + 2;
    }
    sLineElement.style.top = sLineTop + "px";

    var vLineElement = document.getElementById(this.elementId + "_vline");
    var vLineLeft = parseInt(this.v * this.valueWidth) + 2;
    if (vLineLeft < 2) {
        vLineLeft = 2;
    } else if (vLineLeft > this.valueWidth + 2) {
        vLineLeft = this.valueWidth + 2;
    }
    vLineElement.style.left = vLineLeft + "px";
   
    var hLineElement = document.getElementById(this.elementId + "_hline");
    var hLineTop = parseInt((360 - this.h) / 360 * this.saturationHeight) + 2;
    if (hLineTop < 2) {
        hLineTop = 2;
    } else if (hLineTop > this.saturationHeight + 2) {
        hLineTop = this.saturationHeight + 2;
    }
    hLineElement.style.top = hLineTop + "px";
   
    this.updateClientMessage(renderColor);
};

ExtrasColorSelect.getComponent = function(componentId) {
    return EchoDomPropertyStore.getPropertyValue(componentId, "component");
};

ExtrasColorSelect.hsvToRgb = function(h, s, v) {
    var r, g, b;
    if (s == 0) {
        r = g = b = v;
    } else {
        h /= 60;
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - s * f);
        var t = v * (1 - s * (1 - f));
        switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default:
            r = v;
            g = p;
            b = q;
            break;
        }
    }
    return new ExtrasColorSelect.RGB(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
};

ExtrasColorSelect.processHMouseDown = function(echoEvent) {
    var componentId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var colorSelect = ExtrasColorSelect.getComponent(componentId);
    colorSelect.processHMouseDown(echoEvent);
};

ExtrasColorSelect.processHMouseMove = function(echoEvent) {
    var componentId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var colorSelect = ExtrasColorSelect.getComponent(componentId);
    colorSelect.processHMouseMove(echoEvent);
};

ExtrasColorSelect.processHMouseUp = function(echoEvent) {
    var componentId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var colorSelect = ExtrasColorSelect.getComponent(componentId);
    colorSelect.processHMouseUp(echoEvent);
};

ExtrasColorSelect.processSVMouseDown = function(echoEvent) {
    var componentId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var colorSelect = ExtrasColorSelect.getComponent(componentId);
    colorSelect.processSVMouseDown(echoEvent);
};

ExtrasColorSelect.processSVMouseMove = function(echoEvent) {
    var componentId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var colorSelect = ExtrasColorSelect.getComponent(componentId);
    colorSelect.processSVMouseMove(echoEvent);
};

ExtrasColorSelect.processSVMouseUp = function(echoEvent) {
    var componentId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var colorSelect = ExtrasColorSelect.getComponent(componentId);
    colorSelect.processSVMouseUp(echoEvent);
};

ExtrasColorSelect.RGB = function(r, g, b) {
    this.r = ExtrasColorSelect.RGB.cleanValue(r);
    this.g = ExtrasColorSelect.RGB.cleanValue(g);
    this.b = ExtrasColorSelect.RGB.cleanValue(b);
};

ExtrasColorSelect.RGB.cleanValue = function(value) {
    value = value ? parseInt(value) : 0;
    if (value < 0) {
        return 0;
    } else if (value > 255) {
        return 255;
    } else {
        return value;
    }
};

ExtrasColorSelect.RGB.prototype.toHexTriplet = function() {
    var rString = this.r.toString(16);
    if (rString.length == 1) {
        rString = "0" + rString;
    }
    var gString = this.g.toString(16);
    if (gString.length == 1) {
        gString = "0" + gString;
    }
    var bString = this.b.toString(16);
    if (bString.length == 1) {
        bString = "0" + bString;
    }
    return "#" + rString + gString + bString;
};

ExtrasColorSelect.RGB.prototype.toString = function() {
    return "(" + this.r + ", " + this.g + ", " + this.b + ")";
};

/**
 * MessageProcessor implementation.
 */
ExtrasColorSelect.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasColorSelect.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "dispose":
                ExtrasColorSelect.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasColorSelect.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "set-color":
                ExtrasColorSelect.MessageProcessor.processSetColor(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * ColorSelect component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasColorSelect.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var colorSelect = ExtrasColorSelect.getComponent(elementId);
    if (colorSelect) {
        colorSelect.dispose();
    }
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * ColorSelect component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasColorSelect.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var colorSelect = new ExtrasColorSelect(elementId, containerElementId);
    colorSelect.enabled = initMessageElement.getAttribute("enabled") != "false";
    colorSelect.displayValue = initMessageElement.getAttribute("display-value") != "false";
    if (initMessageElement.getAttribute("hue-width")) {
        colorSelect.hueWidth = parseInt(initMessageElement.getAttribute("hue-width"));
    }
    if (initMessageElement.getAttribute("value-width")) {
        colorSelect.valueWidth = parseInt(initMessageElement.getAttribute("value-width"));
    }
    if (initMessageElement.getAttribute("saturation-height")) {
        colorSelect.saturationHeight = parseInt(initMessageElement.getAttribute("saturation-height"));
    }
    
    colorSelect.transparentImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ExtrasUtil.Transparent";
    colorSelect.hGradientImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ColorSelect.HGradient";
    colorSelect.svGradientImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ColorSelect.SVGradient";
    colorSelect.arrowUpImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ColorSelect.ArrowUp";
    colorSelect.arrowDownImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ColorSelect.ArrowDown";
    colorSelect.arrowLeftImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ColorSelect.ArrowLeft";
    colorSelect.arrowRightImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ColorSelect.ArrowRight";
    colorSelect.enableInternetExplorerPngWorkaround = 
            EchoClientProperties.get("proprietaryIEPngAlphaFilterRequired") ? true : false;
    colorSelect.create();
};

/**
 * Processes an <code>set-color</code> message to set the selected color of
 * an existing ColorSelect component.
 *
 * @param setColorMessageElement the <code>set-color</code> element to process
 */
ExtrasColorSelect.MessageProcessor.processSetColor = function(setColorMessageElement) {
    var elementId = setColorMessageElement.getAttribute("eid");
    var colorSelect = ExtrasColorSelect.getComponent(elementId);
    var r = parseInt(setColorMessageElement.getAttribute("r"));
    var g = parseInt(setColorMessageElement.getAttribute("g"));
    var b = parseInt(setColorMessageElement.getAttribute("b"));
    colorSelect.setColor(new ExtrasColorSelect.RGB(r, g, b));
};
