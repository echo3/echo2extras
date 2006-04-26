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
    this.transitionDuration = 350;
    this.initialized = false;
    
    this.transition = null; 
};

ExtrasTransitionPane.prototype.addChild = function(childId) {
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

ExtrasTransitionPane.prototype.dispose = function() {
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
    }
};

ExtrasTransitionPane.prototype.doTransition = function() {
    this.transitionStartTime = new Date().getTime();
    this.transitionEndTime = this.transitionStartTime + this.transitionDuration;
    this.transitionStep(true);
};

ExtrasTransitionPane.prototype.removeChild = function(childId) {
    this.oldChildDivElement = document.getElementById(this.elementId + "_content_" + childId);
    this.stripIds(this.oldChildDivElement);
//    this.transitionPaneDivElement.removeChild(childDivElement);
};

ExtrasTransitionPane.prototype.stripIds = function(element) {
    var length = element.childNodes.length;
    for (var i = 0; i < length; ++i) {
        if (element.childNodes[i].nodeType == 1) {
            EchoDebugManager.consoleWrite("stripping: " + element.childNodes[i].id);
            element.childNodes[i].id = null;
            if (element.childNodes[i].childNodes.length > 0) {
                this.stripIds(element.childNodes[i]);
            }
        }
    }
};

ExtrasTransitionPane.prototype.transitionStep = function(firstStep) {
    if (firstStep) {
        if (this.transition) {
            this.transition.init();
            window.setTimeout("ExtrasTransitionPane.processTimeout(\"" + this.elementId + "\", 1);");
        } else {
            this.doImmediateTransition();
        }
    } else {
        var time = new Date().getTime();
        var progress = (time - this.transitionStartTime) / this.transitionDuration;
    
        if (progress < 1) {
            this.transition.step(progress);
            window.setTimeout("ExtrasTransitionPane.processTimeout(\"" + this.elementId + "\", 1);");
        } else {
            this.transition.dispose();
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

ExtrasTransitionPane.MessageProcessor.assignTransition = function(transitionPane, typeString) {
    switch (typeString) {
    case "camera-pan-left":
        transitionPane.transition = new ExtrasTransitionPane.CameraPanLeft(transitionPane);
        break;
    case "camera-pan-right":
        transitionPane.transition = new ExtrasTransitionPane.CameraPanRight(transitionPane);
        break;
    default:
        transitionPane.transition = null;
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
            case "set-type":
                ExtrasTransitionPane.MessageProcessor.processSetType(messagePartElement.childNodes[i]);
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
    ExtrasTransitionPane.MessageProcessor.assignTransition(transitionPane, type);

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
 * Processes a <code>set-type</code> message to change the transition type..
 *
 * @param setTypeMessageElement the <code>set-type</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processSetType = function(setTypeMessageElement) {
    var elementId = setTypeMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    
    var type = setTypeMessageElement.getAttribute("type");
    ExtrasTransitionPane.MessageProcessor.assignTransition(transitionPane, type);
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

/**
 * Camera-Pan-Left transition. 
 */
ExtrasTransitionPane.CameraPanLeft = function(transitionPane) {
    this.transitionPane = transitionPane;
};

ExtrasTransitionPane.CameraPanLeft.prototype.dispose = function() {
    this.widthTravel = null;
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 0;
        this.transitionPane.newChildDivElement.style.left = "0px";
    }
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.CameraPanLeft.prototype.init = function() {
    var bounds = new EchoCssUtil.Bounds(this.transitionPane.transitionPaneDivElement);
    this.widthTravel = bounds.width;
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.zIndex = 1;
    }
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 2;
        this.transitionPane.newChildDivElement.style.left = (0 - this.widthTravel) + "px";
        this.transitionPane.newChildDivElement.style.display = "block";
    }
};

ExtrasTransitionPane.CameraPanLeft.prototype.step = function(progress) {
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.left = (0 - ((1 - progress) * this.widthTravel)) + "px";
    }
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.left = (progress * this.widthTravel) + "px";
    }
};

/**
 * Camera-Pan-Right transition. 
 */
ExtrasTransitionPane.CameraPanRight = function(transitionPane) {
    this.transitionPane = transitionPane;
};

ExtrasTransitionPane.CameraPanRight.prototype.dispose = function() {
    this.widthTravel = null;
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 0;
        this.transitionPane.newChildDivElement.style.left = "0px";
    }
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.CameraPanRight.prototype.init = function() {
    var bounds = new EchoCssUtil.Bounds(this.transitionPane.transitionPaneDivElement);
    this.widthTravel = bounds.width;
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.zIndex = 1;
    }
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 2;
        this.transitionPane.newChildDivElement.style.left = this.widthTravel + "px";
        this.transitionPane.newChildDivElement.style.display = "block";
    }
};

ExtrasTransitionPane.CameraPanRight.prototype.step = function(progress) {
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.left = ((1 - progress) * this.widthTravel) + "px";
    }
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.left = (0 - (progress * this.widthTravel)) + "px";
    }
};
