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

/**
 * ExtrasTransitionPane Object/Namespace/Constructor.
 *
 * @param elementId the root id of the TransitionPane.
 * @param containerElementId the id of the DOM element which will contain the 
 *        TransitionPane.
 */
ExtrasTransitionPane = function(elementId, containerElementId) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;
    this.transitionDuration = -1;
    this.initialized = false;
    
    this.transition = null; 
};

/**
 * Default transition duration: 350ms.
 */
ExtrasTransitionPane.DEFAULT_TRANSITION_DURATION = 350;

ExtrasTransitionPane.prototype.addChild = function(childId) {
    this.clearTransition();
    this.newChildDivElement = document.createElement("div");
    this.newChildDivElement.id = this.elementId + "_content_" + childId;
    this.newChildDivElement.style.position = "absolute";
    this.newChildDivElement.style.top = "0px";
    this.newChildDivElement.style.left =  "0px";
    this.newChildDivElement.style.width =  "100%";
    this.newChildDivElement.style.height = "100%";
    if (this.initialized) {
        this.newChildDivElement.style.display = "none";
    } else {
        this.initialized = true;
    }
    this.transitionPaneDivElement.appendChild(this.newChildDivElement);
};

ExtrasTransitionPane.prototype.create = function() {
    var containerElement = document.getElementById(this.containerElementId);
    if (!containerElement) {
        throw "Container element not found: " + this.containerElementId;
    }

    this.transitionPaneDivElement = document.createElement("div");
    this.transitionPaneDivElement.id = this.elementId;
    this.transitionPaneDivElement.style.position = "absolute";
    this.transitionPaneDivElement.style.overflow = "hidden";
    
    this.transitionPaneDivElement.style.top = "0px";
    this.transitionPaneDivElement.style.left =  "0px";
    this.transitionPaneDivElement.style.width =  "100%";
    this.transitionPaneDivElement.style.height = "100%";
    
    containerElement.appendChild(this.transitionPaneDivElement);
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "component", this);
};

ExtrasTransitionPane.prototype.clearTransition = function() {
    if (this.timeout) {
        window.clearTimeout(this.timeout);
        this.timeout = null;
    }
    if (this.transitionActive) {
        this.transition.dispose();
        this.transitionActive = false;
    }
};

ExtrasTransitionPane.prototype.dispose = function() {
    this.clearTransition();
    EchoDomPropertyStore.dispose(this.transitionPaneDivElement);
    this.transitionPaneDivElement = null;
};

ExtrasTransitionPane.prototype.doImmediateTransition = function() {
    if (this.oldChildDivElement) {
        this.transitionPaneDivElement.removeChild(this.oldChildDivElement);

        // Clear reference.
        this.oldChildDivElement = null;
    }
    if (this.newChildDivElement) {
        this.newChildDivElement.style.display = "block";
        
        // Clear reference.
        this.newChildDivElement = null;

        EchoVirtualPosition.redraw();
    }
};

ExtrasTransitionPane.prototype.doTransition = function() {
    this.transitionStartTime = new Date().getTime();
    this.transitionStep(true);
};

ExtrasTransitionPane.prototype.removeChild = function(childId) {
    this.clearTransition();
    var oldChildDivElement = document.getElementById(this.elementId + "_content_" + childId);
    if (oldChildDivElement) {
        // Verify element exists, in case attempting to remove non-existant child.
        this.stripIds(oldChildDivElement);
        
        // If another child was attached, remove it.
        if (this.oldChildDivElement && this.oldChildDivElement.parentNode) {
            this.oldChildDivElement.parentNode.removeChild(this.oldChildDivElement);
        }
        
        this.oldChildDivElement = oldChildDivElement;
    }
};

ExtrasTransitionPane.prototype.setTransition = function(transition) {
    this.clearTransition();
    this.transition = transition;
};

ExtrasTransitionPane.prototype.stripIds = function(element) {
    var length = element.childNodes.length;
    for (var i = 0; i < length; ++i) {
        if (element.childNodes[i].nodeType == 1) {
            element.childNodes[i].id = null;
            if (element.childNodes[i].childNodes.length > 0) {
                this.stripIds(element.childNodes[i]);
            }
        }
    }
};

ExtrasTransitionPane.prototype.transitionStep = function(firstStep) {
    // Method is invoked from timeout, which has now completed, thus it is removed.
    this.timeout = null;
    
    if (firstStep) {
        if (this.transition) {
            this.transitionActive = true;
            this.transition.init();

            // Configure duration setting.
            if (this.transitionDuration < 0) {
                if (this.transition.transitionDuration) {
                    // Use transition duration specified by running transition.
                    this.activeTransitionDuration = this.transition.transitionDuration;
                } else {
                    // Use global default duration.
                    this.activeTransitionDuration = ExtrasTransitionPane.DEFAULT_TRANSITION_DURATION;
                }
            } else {
                // A specific duration has been configured, override default.
                this.activeTransitionDuration = this.transitionDuration;
            }
            
            this.timeout = window.setTimeout("ExtrasTransitionPane.processTimeout(\"" + this.elementId + "\");", 5);
        } else {
            this.doImmediateTransition();
        }
    } else {
        var time = new Date().getTime();
        var progress = (time - this.transitionStartTime) / this.activeTransitionDuration;
    
        if (progress < 1) {
            this.transition.step(progress);
            this.timeout = window.setTimeout("ExtrasTransitionPane.processTimeout(\"" + this.elementId + "\");", 5);
        } else {
            this.transition.dispose();
            this.transitionActive = false;
        }
    }
};

ExtrasTransitionPane.getComponent = function(transitionPaneId) {
    return EchoDomPropertyStore.getPropertyValue(transitionPaneId, "component");
};

ExtrasTransitionPane.processTimeout = function(transitionPaneId) {
    var transitionPane = ExtrasTransitionPane.getComponent(transitionPaneId);
    transitionPane.transitionStep();
};

/**
 * Static object/namespace for TransitionPane MessageProcessor 
 * implementation.
 */
ExtrasTransitionPane.MessageProcessor = function() { };

ExtrasTransitionPane.MessageProcessor.installTransition = function(transitionPane, type) {
    switch (type) {
    case "camera-pan-left":
        transitionPane.setTransition(new ExtrasTransitionPane.CameraPan(transitionPane, ExtrasTransitionPane.CameraPan.LEFT));
        break;
    case "camera-pan-right":
        transitionPane.setTransition(new ExtrasTransitionPane.CameraPan(transitionPane, ExtrasTransitionPane.CameraPan.RIGHT));
        break;
    case "camera-pan-up":
        transitionPane.setTransition(new ExtrasTransitionPane.CameraPan(transitionPane, ExtrasTransitionPane.CameraPan.UP));
        break;
    case "camera-pan-down":
        transitionPane.setTransition(new ExtrasTransitionPane.CameraPan(transitionPane, ExtrasTransitionPane.CameraPan.DOWN));
        break;
    case "blind-black-in":
        transitionPane.setTransition(new ExtrasTransitionPane.Blind(transitionPane, false));
        break;
    case "blind-black-out":
        transitionPane.setTransition(new ExtrasTransitionPane.Blind(transitionPane, true));
        break;
    case "fade-to-black":
        transitionPane.setTransition(new ExtrasTransitionPane.FadeImage(transitionPane, "000000"));
        break;
    case "fade-to-white":
        transitionPane.setTransition(new ExtrasTransitionPane.FadeImage(transitionPane, "ffffff"));
        break;
    case "fade":
        if (EchoClientProperties.get("notSupportedCssOpacity") && 
                !EchoClientProperties.get("proprietaryIEOpacityFilterRequired")) {
            transitionPane.setTransition(null);
        } else {
            transitionPane.setTransition(new ExtrasTransitionPane.FadeOpacity(transitionPane));
        }
        break;
    default:
        transitionPane.setTransition(null);
    }
};

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasTransitionPane.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "add-child":
                ExtrasTransitionPane.MessageProcessor.processAddChild(messagePartElement.childNodes[i]);
                break;
            case "dispose":
                ExtrasTransitionPane.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasTransitionPane.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "remove-child":
                ExtrasTransitionPane.MessageProcessor.processRemoveChild(messagePartElement.childNodes[i]);
                break;
            case "update":
                ExtrasTransitionPane.MessageProcessor.processUpdate(messagePartElement.childNodes[i]);
                break;
            case "transition":
                ExtrasTransitionPane.MessageProcessor.processTransition(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>add-child</code> message to add a new child to the TransitionPane.
 *
 * @param addChildMessageElement the <code>add-child</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processAddChild = function(addChildMessageElement) {
    var elementId = addChildMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    var childId = addChildMessageElement.getAttribute("child-id");
    transitionPane.addChild(childId);
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * TransitionPane component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (transitionPane) {
        transitionPane.dispose();
    }
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * TransitionPane component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var transitionPane = new ExtrasTransitionPane(elementId, containerElementId);

    var type = initMessageElement.getAttribute("type");
    ExtrasTransitionPane.MessageProcessor.installTransition(transitionPane, type);

    transitionPane.create();
};

/**
 * Processes a <code>remove-child</code> message to remove a child from the 
 * TransitionPane.
 * 
 * @param removeChildMessageElement the <code>remove-child</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processRemoveChild = function(removeChildMessageElement) {
    var elementId = removeChildMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    var childId = removeChildMessageElement.getAttribute("child-id");
    transitionPane.removeChild(childId);
};

/**
 * Processes a <code>update</code> message to change the transition type..
 *
 * @param updateMessageElement the <code>update</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processUpdate = function(updateMessageElement) {
    var elementId = updateMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    
    var type = updateMessageElement.getAttribute("type");
    if (type) {
        ExtrasTransitionPane.MessageProcessor.installTransition(transitionPane, type);
    }
    var duration = updateMessageElement.getAttribute("duration");
    if (duration) {
        transitionPane.transitionDuration = parseInt(duration);
    }
};

/**
 * Processes a <code>transition</code> message to start a transition.
 *
 * @param transitionMessageElement the <code>transition</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processTransition = function(transitionMessageElement) {
    var elementId = transitionMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    transitionPane.doTransition();
};

ExtrasTransitionPane.FadeImage = function(transitionPane, color) {
    this.transitionDuration = 1000;
    this.transitionPane = transitionPane;
    this.color = color;
    this.renderedProgress = 0;
    this.renderedFadeStepIndex = -1;
    
    var image927 = new Image();
    image927.src = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
            + "fade-" + this.color + "-927";
    var image787 = new Image();
    image787.src = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
            + "fade-" + this.color + "-787";
    var image700 = new Image();
    image700.src = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
            + "fade-" + this.color + "-700";
    var image420 = new Image();
    image420.src = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
            + "fade-" + this.color + "-420";
    var image230 = new Image();
    image230.src = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
            + "fade-" + this.color + "-230";
    var image820 = new Image();
};

ExtrasTransitionPane.FadeImage.createFadeSteps = function() {
    // Index 0 indicates total translucency of layerstack, 1 = transparent, 0 = opaque.
    // Index 1-2 are image alpha values to stack on top of one another to create desired translucency.
    // Five images are used on two layers, images have transparency values of 92.7%, 78.7%, 70.0% 42.0%, and 23.0%
    var fadeSteps = new Array();
    fadeSteps.push(new Array(927,  927, null));
    fadeSteps.push(new Array(859,  927,  927));
    fadeSteps.push(new Array(787,  787, null));
    fadeSteps.push(new Array(730,  787,  927));
    fadeSteps.push(new Array(700,  700, null));
    fadeSteps.push(new Array(649,  700,  927));
    fadeSteps.push(new Array(619,  787,  787));
    fadeSteps.push(new Array(551,  700,  787));
    fadeSteps.push(new Array(490,  700,  700));
    fadeSteps.push(new Array(420,  420, null));
    fadeSteps.push(new Array(389,  420,  927));
    fadeSteps.push(new Array(331,  420,  787));
    fadeSteps.push(new Array(294,  420,  700));
    fadeSteps.push(new Array(230,  230, null));
    fadeSteps.push(new Array(213,  230,  927));
    fadeSteps.push(new Array(176,  420,  420));
    fadeSteps.push(new Array(161,  230,  700));
    fadeSteps.push(new Array( 97,  230,  420));
    fadeSteps.push(new Array( 53,  230,  230));
    
    return fadeSteps;
}

ExtrasTransitionPane.FadeImage.fadeSteps = ExtrasTransitionPane.FadeImage.createFadeSteps();

ExtrasTransitionPane.FadeImage.prototype.init = function() {
    this.translucentElements = new Array();
    if (EchoClientProperties.get("proprietaryIEPngAlphaFilterRequired")) {
        this.dxRender = true;
    }
    for (var i = 0; i < 2; ++i) {
        this.translucentElements[i] = document.createElement("div");
        this.translucentElements[i].style.position = "absolute";
        this.translucentElements[i].style.zIndex = i + 2;
        this.translucentElements[i].style.left = "0px";
        this.translucentElements[i].style.top = "0px";
        this.translucentElements[i].style.width = "100%";
        this.translucentElements[i].style.height = "100%";
        this.transitionPane.transitionPaneDivElement.appendChild(this.translucentElements[i]);
    }
};

ExtrasTransitionPane.FadeImage.prototype.step = function(progress) {
    var currentAnimationStep = Math.ceil(progress * this.totalAnimationSteps);
    if (currentAnimationStep == 0) {
        currentAnimationStep = 1;
    }
    
    var targetTranslucency = Math.abs((progress - 0.5) * 2) * 1000;
    
    var bestIndex = 0;
    var bestDelta = 1000;
    for (var i = 0; i < ExtrasTransitionPane.FadeImage.fadeSteps.length; ++i) {
        var delta = Math.round(Math.abs(ExtrasTransitionPane.FadeImage.fadeSteps[i][0] - targetTranslucency));
        if (delta < bestDelta) {
            bestDelta = delta;
            bestIndex = i;
        }
    }

    if (this.renderedFadeStepIndex != bestIndex) {  
        for (var i = 0; i < 2; ++i) {
            var imgId = ExtrasTransitionPane.FadeImage.fadeSteps[bestIndex][i + 1];
            var previousImgId = this.renderedFadeStepIndex == -1 
                    ? null : ExtrasTransitionPane.FadeImage.fadeSteps[this.renderedFadeStepIndex][i + 1];
            if (imgId == previousImgId) {
                continue;
            }
            if (imgId) {
                var imgUrl = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
                        + "fade-" + this.color + "-" + imgId;
                if (this.dxRender) {
                    this.translucentElements[i].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader("
                            + "src='" + imgUrl + "', sizingMethod='scale');";
                } else {
                    this.translucentElements[i].style.backgroundImage = "url(" + imgUrl + ")";
                }
            } else {
                if (this.dxRender) {
                    this.translucentElements[i].style.filter = "";
                } else {
                    this.translucentElements[i].style.backgroundImage = "";
                }
            }
        }
    }

    if (progress >= 0.5 && this.renderedProgress < 0.5) {
        // fade is crossing midpoint, swap content.
        if (this.transitionPane.oldChildDivElement) {
            this.transitionPane.oldChildDivElement.style.display = "none";
        }
        if (this.transitionPane.newChildDivElement) {
            this.transitionPane.newChildDivElement.style.display = "block";
            EchoVirtualPosition.redraw();
        }
    }
    
    this.renderedProgress = progress;
    this.renderedFadeStepIndex = bestIndex;
};

ExtrasTransitionPane.FadeImage.prototype.dispose = function() {
    for (var i = 0; i < this.translucentElements.length; ++i) {
        this.transitionPane.transitionPaneDivElement.removeChild(this.translucentElements[i]);
        this.translucentElements[i] = null;
    }
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 0;
    }
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.FadeOpacity = function(transitionPane) {
    this.transitionDuration = 1000;
    this.transitionPane = transitionPane;
    this.renderedProgress = 0;
    this.renderedFadeStepIndex = -1;
};

ExtrasTransitionPane.FadeOpacity.prototype.dispose = function() {
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 0;
        if (EchoClientProperties.get("proprietaryIEOpacityFilterRequired")) {
            this.transitionPane.newChildDivElement.style.filter = "";
        } else {
            this.transitionPane.newChildDivElement.style.opacity = 1;
        }
    }
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.FadeOpacity.prototype.init = function() {
    if (this.transitionPane.newChildDivElement) {
        if (EchoClientProperties.get("proprietaryIEOpacityFilterRequired")) {
            this.transitionPane.newChildDivElement.style.filter = "alpha(opacity=0)";
        } else {
            this.transitionPane.newChildDivElement.style.opacity = 0;
        }
        this.transitionPane.newChildDivElement.style.display = "block";
        EchoVirtualPosition.redraw();
    }
};

ExtrasTransitionPane.FadeOpacity.prototype.step = function(progress) {
    if (this.transitionPane.newChildDivElement) {
        if (EchoClientProperties.get("proprietaryIEOpacityFilterRequired")) {
            var percent = parseInt(progress * 100);
            this.transitionPane.newChildDivElement.style.filter = "alpha(opacity=" + percent + ")";
        } else {
            this.transitionPane.newChildDivElement.style.opacity = progress;
        }
    } else if (this.transitionPane.oldChildDivElement) {
        if (EchoClientProperties.get("proprietaryIEOpacityFilterRequired")) {
            var percent = parseInt((1 - progress) * 100);
            this.transitionPane.oldChildDivElement.style.filter = "alpha(opacity=" + percent + ")";
        } else {
            this.transitionPane.oldChildDivElement.style.opacity = 1 - progress;
        }
    }
};

/**
 * Blind transition. 
 */
ExtrasTransitionPane.Blind = function(transitionPane, reverseAnimation) {
    this.transitionDuration = 700;
    this.transitionPane = transitionPane;
    this.reverseAnimation = reverseAnimation;
    this.renderedAnimationStep = 0;
    this.totalAnimationSteps = 14;
    this.contentSwapAnimationStep = Math.floor(this.totalAnimationSteps) / 2 + 1;
    this.imagePrefix = "blind-black-";
    
    // Precache images.
    for (var i = 1; i <= this.totalAnimationSteps; ++i) {
        var image = new Image();
        image.src = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
                + this.imagePrefix + i;
    }
};

ExtrasTransitionPane.Blind.prototype.dispose = function() {
    this.transitionPane.transitionPaneDivElement.removeChild(this.blindElement);
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 0;
        this.transitionPane.newChildDivElement.style.top = "0px";
    }
    this.blindElement = null;
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.Blind.prototype.init = function() {
    this.blindElement = document.createElement("div");
    this.blindElement.style.position = "absolute";
    this.blindElement.style.zIndex = 2;
    this.blindElement.style.left = "0px";
    this.blindElement.style.top = "0px";
    this.blindElement.style.width = "100%";
    this.blindElement.style.height = "100%";
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.zIndex = 1;
    }
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 1;
    }
    this.transitionPane.transitionPaneDivElement.appendChild(this.blindElement);
};

ExtrasTransitionPane.Blind.prototype.step = function(progress) {
    var currentAnimationStep = Math.ceil(progress * this.totalAnimationSteps);
    if (currentAnimationStep == 0) {
        currentAnimationStep = 1;
    }
    if (currentAnimationStep == this.renderedAnimationStep) {
        // No need for update, already current.
        return;
    }
    
    var imgUrl = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
            + this.imagePrefix + currentAnimationStep;
    
    this.blindElement.style.backgroundImage = "url(" + imgUrl + ")";
    
    if (currentAnimationStep < this.contentSwapAnimationStep) {
        if (this.transitionPane.oldChildDivElement) {
            if (this.reverseAnimation) {
                this.transitionPane.oldChildDivElement.style.top = 
                        (this.contentSwapAnimationStep - currentAnimationStep) + "px";
            } else {
                this.transitionPane.oldChildDivElement.style.top = (0 - currentAnimationStep) + "px";
            }
        }
    } else {
        if (this.renderedAnimationStep < this.contentSwapAnimationStep) {
            // blind is crossing horizontal, swap content.
            if (this.transitionPane.oldChildDivElement) {
                this.transitionPane.oldChildDivElement.style.display = "none";
            }
            if (this.transitionPane.newChildDivElement) {
                this.transitionPane.newChildDivElement.style.display = "block";
                EchoVirtualPosition.redraw();
            }
        }
        if (this.transitionPane.newChildDivElement) {
            if (this.reverseAnimation) {
                this.transitionPane.newChildDivElement.style.top 
                        = (currentAnimationStep - this.totalAnimationSteps) + "px";
            } else {
                this.transitionPane.newChildDivElement.style.top 
                        = (this.totalAnimationSteps - currentAnimationStep) + "px";
            }
        }
    }
    
    this.renderedAnimationStep = currentAnimationStep;
};

/**
 * Camera-Pantransition. 
 */
ExtrasTransitionPane.CameraPan = function(transitionPane, direction) {
    this.transitionPane = transitionPane;
    this.direction = direction;
};

ExtrasTransitionPane.CameraPan.LEFT = 0;
ExtrasTransitionPane.CameraPan.RIGHT = 1;
ExtrasTransitionPane.CameraPan.UP = 2;
ExtrasTransitionPane.CameraPan.DOWN = 3;

ExtrasTransitionPane.CameraPan.prototype.dispose = function() {
    this.travel = null;
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 0;
        this.transitionPane.newChildDivElement.style.top = "0px";
        this.transitionPane.newChildDivElement.style.left = "0px";
    }
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.CameraPan.prototype.init = function() {
    var bounds = new EchoCssUtil.Bounds(this.transitionPane.transitionPaneDivElement);
    this.travel = (this.direction == ExtrasTransitionPane.CameraPan.DOWN 
            || this.direction == ExtrasTransitionPane.CameraPan.UP)
            ? bounds.height : bounds.width;
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.zIndex = 1;
    }
    this.newChildOnScreen = false;
};

ExtrasTransitionPane.CameraPan.prototype.step = function(progress) {
    switch (this.direction) {
    case ExtrasTransitionPane.CameraPan.DOWN:
        if (this.transitionPane.newChildDivElement) {
            this.transitionPane.newChildDivElement.style.top = ((1 - progress) * this.travel) + "px";
        }
        if (this.transitionPane.oldChildDivElement) {
            this.transitionPane.oldChildDivElement.style.top = (0 - (progress * this.travel)) + "px";
        }
        break;
    case ExtrasTransitionPane.CameraPan.UP:
        if (this.transitionPane.newChildDivElement) {
            this.transitionPane.newChildDivElement.style.top = (0 - ((1 - progress) * this.travel)) + "px";
        }
        if (this.transitionPane.oldChildDivElement) {
            this.transitionPane.oldChildDivElement.style.top = (progress * this.travel) + "px";
        }
        break;
    case ExtrasTransitionPane.CameraPan.RIGHT:
        if (this.transitionPane.newChildDivElement) {
            this.transitionPane.newChildDivElement.style.left = ((1 - progress) * this.travel) + "px";
        }
        if (this.transitionPane.oldChildDivElement) {
            this.transitionPane.oldChildDivElement.style.left = (0 - (progress * this.travel)) + "px";
        }
        break;
    default:
        if (this.transitionPane.newChildDivElement) {
            this.transitionPane.newChildDivElement.style.left = (0 - ((1 - progress) * this.travel)) + "px";
        }
        if (this.transitionPane.oldChildDivElement) {
            this.transitionPane.oldChildDivElement.style.left = (progress * this.travel) + "px";
        }
        break;
    }
    if (!this.newChildOnScreen && this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.display = "block";
        this.transitionPane.newChildDivElement.style.zIndex = 2;
        this.newChildOnScreen = true;
    }
};
