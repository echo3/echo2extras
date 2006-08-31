/*
 * This file is part of the Echo2 DnD Project. Copyright (C) 2005-2006 Jason
 * Dalton
 * 
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 * 
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
 * the specific language governing rights and limitations under the License.
 * 
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or the
 * GNU Lesser General Public License Version 2.1 or later (the "LGPL"), in which
 * case the provisions of the GPL or the LGPL are applicable instead of those
 * above. If you wish to allow use of your version of this file only under the
 * terms of either the GPL or the LGPL, and not to allow others to use your
 * version of this file under the terms of the MPL, indicate your decision by
 * deleting the provisions above and replace them with the notice and other
 * provisions required by the GPL or the LGPL. If you do not delete the
 * provisions above, a recipient may use your version of this file under the
 * terms of any one of the MPL, the GPL or the LGPL.
 */
 
/**
 * Static object/namespace for Drag and Drop support. This object/namespace
 * should not be used externally.
 * <p>
 * Creates a new DragSource data object.
 */
EchoDragSource = function(elementId) { 
    this.initialOffsetX = null;
    this.initialOffsetY = null;
    this.originX = null;
	this.originY = null;
	
    this.elementId = elementId;
    this.element = null;
    
    this.cloneElement = null;
    this.tooltip = EchoDragSource.DEFAULT_TOOLTIP;
    
    this.dropTargetArray = new Array();    
    this.dropTargetPositions = new Array();
};

EchoDragSource.DEFAULT_TOOLTIP = "";

/**
 * Active <code>EchoDragSource</code> instance.
 */
EchoDragSource.activeInstance = null;

/**
 * Initializes a server-rendered drag source element.
 */
EchoDragSource.prototype.init = function() {

    // TODO 
    // Setting capture to true when registering event handler results in any content being draggable (but no longer clickable).
    // We can also return true from event handler allowing events to percolate down to child elements, but this can cause
    // problems for components like Button.  It might make sense to modify Button to be more compatible with DND.
    
    this.element = document.getElementById(this.elementId);
	this.element.style.cursor = "move";
	
    EchoEventProcessor.addHandler(this.element, "mousedown", "EchoDragSource.processMouseDown", false);
	EchoDomPropertyStore.setPropertyValue(this.element, "component", this);
};

EchoDragSource.prototype.addDropTarget = function(dropTargetId) {
	var dropTarget = document.getElementById(dropTargetId);
	this.dropTargetArray[this.dropTargetArray.length] = dropTarget;
	this.dropTargetPositions[this.dropTargetPositions.length] = EchoDragSource.getElementPosition(dropTarget);
};

/**
 * Process a "mousedown" event.
 * 
 * @param echoEvent the event
 */
EchoDragSource.prototype.processMouseDown = function(echoEvent) {
    // Prevent default event (avoid selection start in browsers).
    EchoDomUtil.preventEventDefault(echoEvent);
    
    // Mark active instance.
    EchoDragSource.activeInstance = this;
    
    // Find positions of all drop targets.
    for (var i = 0; i < this.dropTargetPositions.length; i++) {
	    this.dropTargetPositions[i] = EchoDragSource.getElementPosition(this.dropTargetArray[i]);
	}
    
    // Create semi-transparent clone of element to use for dragging.
    this.cloneElement = this.element.cloneNode(true);
    this.cloneElement.style.position = "absolute";
    document.getElementsByTagName("body")[0].appendChild(this.cloneElement);
    EchoDragSource.setOpacity(this.cloneElement, 6);
    
    // Adjust opacity of original container.
    EchoDragSource.setOpacity(this.element, 2);
    
    // Store origin coordinate of element.
    var position = EchoDragSource.getElementPosition(this.element);
    this.originX = position.left;
	this.originY = position.top;

    // Store initial cursor position.
	var cursorPosition = EchoDragSource.getCursorPosition(echoEvent);
	this.initialOffsetX = cursorPosition.x - this.originX;
	this.initialOffsetY = cursorPosition.y - this.originY;	
		
    // Register temporary mouse/selection handlers.
    EchoDomUtil.addEventListener(document, "mousemove", EchoDragSource.processMouseMove, false);
    EchoDomUtil.addEventListener(document, "mouseup", EchoDragSource.processMouseUp, false);
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.addEventListener(document, "selectstart", EchoDragSource.selectStart, false);
    }
    this.processMouseMove(echoEvent);
};

/**
 * Process mouse release event.
 */
EchoDragSource.prototype.processMouseUp = function(e) {
    // Remove temporary mouse/selection handlers.
    EchoDomUtil.removeEventListener(document, "mousemove", EchoDragSource.processMouseMove, false);
    EchoDomUtil.removeEventListener(document, "mouseup", EchoDragSource.processMouseUp, false);
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.removeEventListener(document, "selectstart", EchoDragSource.selectStart, false);
    }
    
    // Clear active instance.
    EchoDragSource.activeInstance = null;    
    
    // Remove semi-transparent clone.
    this.cloneElement.parentNode.removeChild(this.cloneElement);
    
    // Redraw positioning for MSIE.
    EchoVirtualPosition.redraw();
    
    var dropTarget = this.getActiveDropTarget(e);
    
    EchoDragSource.setOpacity(this.element, 10);
    if (dropTarget) {
	    EchoClientMessage.setActionValue(this.element.id, "drop", dropTarget.id);
    	EchoServerTransaction.connect();
    }
    
    // cleanup
    this.cloneElement = null;
    this.originX = null;
	this.originY = null;
	this.initialOffsetX = null;
	this.initialOffsetY = null;
};

EchoDragSource.prototype.processMouseMove = function(e) {
    e = e ? e : window.event;	 
    var cursorPosition = EchoDragSource.getCursorPosition(e);
	this.cloneElement.style.left = cursorPosition.x - this.initialOffsetX + "px"; 
	this.cloneElement.style.top = cursorPosition.y - this.initialOffsetY + "px";
	
	var onTarget = this.getActiveDropTarget(e);
	if (onTarget) {
		this.cloneElement.title = this.tooltip;
		EchoDragSource.setOpacity(this.cloneElement, 10);
	} else {
		this.cloneElement.title = "";
		EchoDragSource.setOpacity(this.cloneElement, 6);
	}
};

EchoDragSource.prototype.getActiveDropTarget = function(e) {

	for (var i=0; i<this.dropTargetArray.length; i++) {
		var dropTarget = this.dropTargetArray[i];
		var elementPosition = this.dropTargetPositions[i];
		
		var cursorPosition = EchoDragSource.getCursorPosition(e);
		var cursorX = cursorPosition.x;
		var cursorY = cursorPosition.y;
		
		var targetX1 = elementPosition.left;
		var targetX2 = targetX1 + dropTarget.offsetWidth;
		
		var targetY1 = elementPosition.top;
		var targetY2 = targetY1 + dropTarget.offsetHeight;
	
		// Check that the cursor is over the drop target
		var onTarget = (cursorX >= targetX1 && cursorX <= targetX2 && 
						cursorY >= targetY1 && cursorY <= targetY2);
			
		if (onTarget) {
			return dropTarget;
		}
	}
};

EchoDragSource.prototype.dispose = function() {

	EchoEventProcessor.removeHandler(this.element, "mousedown");
	EchoDomPropertyStore.dispose(this.element);
	
	this.initialOffsetX = null;
    this.initialOffsetY = null;
    this.originX = null;
	this.originY = null;
	
    this.elementId = null;
    this.element = undefined;
    
    this.cloneElement = undefined;
    this.tooltip = null;
    
    this.dropTargetArray = null;
    this.dropTargetPositions = null;
};

/**
 * Returns the DragSource data object instance based on the root element of the
 * DragSource.
 * 
 * @param element the root element or element id of the DragSource
 * @return the relevant DragSource instance
 */
EchoDragSource.getComponent = function(element) {
    return EchoDomPropertyStore.getPropertyValue(element, "component");
};

EchoDragSource.getCursorPosition = function(e) {
    var pageX;
    var pageY;
    
    if(e.pageX) {
        pageX = e.pageX;
        pageY = e.pageY;
    }
    else {
        pageX = e.clientX + document.body.scrollLeft - document.body.clientLeft;
        pageY = e.clientY + document.body.scrollTop - document.body.clientTop;
    }
    return {x:pageX,y:pageY};
};

EchoDragSource.getElementPosition = function(element) {
    var offsetLeft = 0;
    var offsetTop = 0;
    
    while (element){
        offsetLeft += element.offsetLeft;
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }   
    return {left:offsetLeft,top:offsetTop};
};

EchoDragSource.processMouseDown = function(echoEvent) {
    var componentId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var dragSource = EchoDragSource.getComponent(componentId);
    dragSource.processMouseDown(echoEvent);
};

EchoDragSource.processMouseMove = function(e) {
    e = e ? e : window.event;
    if (EchoDragSource.activeInstance) {
        EchoDragSource.activeInstance.processMouseMove(e);
    }
};

EchoDragSource.processMouseUp = function(e) {
    e = e ? e : window.event;
    if (EchoDragSource.activeInstance) {
        EchoDragSource.activeInstance.processMouseUp(e);
    }
};

/**
 * Event handler for "SelectStart" events to disable selection while dragging
 * the Component. (Internet Explorer specific)
 */
EchoDragSource.selectStart = function() {
    EchoDomUtil.preventEventDefault(window.event);
};

EchoDragSource.setOpacity = function(element, value) {
	if (EchoClientProperties.get("browserInternetExplorer")) {
		element.style.zoom = 1;
		element.style.filter = "alpha(opacity=" + value*10 + ")";
	} else {
		element.style.opacity = value/10;
	}
}


/**
 * Static object/namespace for DragSource MessageProcessor implementation.
 */
EchoDragSource.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation (invoked by ServerMessage
 * processor).
 * 
 * @param messagePartElement the <code>message-part</code> element to process
 */
EchoDragSource.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType == 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "init":
                EchoDragSource.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "dispose":
                EchoDragSource.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes a <code>dispose</code> message to finalize the state of a
 * DragSource that is being removed.
 * 
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
EchoDragSource.MessageProcessor.processDispose = function(disposeElement) {
    var elementId = disposeElement.getAttribute("eid");
    var element = document.getElementById(elementId);
    var component = EchoDragSource.getComponent(element);
    
    if (component) {
    	component.dispose();
    }
};

/**
 * Processes an <code>init</code> message to initialize the state of a
 * DragSource that is being added.
 * 
 * @param initMessageElement the <code>init</code> element to process
 */
EchoDragSource.MessageProcessor.processInit = function(initElement) {
    var elementId = initElement.getAttribute("eid");    
    
    var dragSource = new EchoDragSource(elementId);
    dragSource.init();
    
    var tooltip = initElement.getAttribute("tooltip");
    if (tooltip) {
    	dragSource.tooltip = tooltip;
    }
        
    for (var i = 0; i < initElement.childNodes.length; ++i) {
        if (initElement.childNodes[i].nodeType == 1) {
            var dropTargetId = initElement.childNodes[i].getAttribute("eid"); 
            dragSource.addDropTarget(dropTargetId);           
        }
    }
};

