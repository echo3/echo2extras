ExtrasTabPane = function() { };

/**
 * Static object/namespace for TabPane MessageProcessor 
 * implementation.
 */
ExtrasTabPane.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasTabPane.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "add-tab":
                ExtrasTabPane.MessageProcessor.processAddTab(messagePartElement.childNodes[i]);
                break;
            case "dispose":
                ExtrasTabPane.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasTabPane.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "remove-tab":
                ExtrasTabPane.MessageProcessor.processRemoveTab(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>add-tab</code> message to add a new tab to the TabPane.
 *
 * @param addTabMessageElement the <code>add-tab</code> element to process
 */
ExtrasTabPane.MessageProcessor.processAddTab = function(addTabMessageElement) {
    var elementId = addTabMessageElement.getAttribute("eid");
    var tabId = addTabMessageElement.getAttribute("tab-id");
    var title = addTabMessageElement.getAttribute("title");
    
    tabPaneDivElement = document.getElementById(elementId);
    if (!tabPaneDivElement) {
        throw "TabPane DIV element not found: " + elementId;
    }
    
    var headerTrElement = document.getElementById(elementId + "_header_tr");
    var headerTdElement = document.createElement("td");
    headerTdElement.style.borderWidth = "0px";
    headerTdElement.style.padding = "0px";
    headerTdElement.id = elementId + "_header_td_" + tabId;
    
    headerDivElement = document.createElement("div");
    headerDivElement.style.height = 32;
    headerDivElement.style.border = "2px outset #00007f";
    headerTdElement.appendChild(headerDivElement);
    
    headerDivElement.appendChild(document.createTextNode(title === null ? "*" : title));
    
    var tabBodyDivElement = document.createElement("div");
    tabBodyDivElement.id = elementId + "_body_" + tabId;
    
    headerTrElement.appendChild(headerTdElement);
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * TabPane component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasTabPane.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * TabPane component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasTabPane.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var containerElement = document.getElementById(containerElementId);
    if (!containerElement) {
        throw "Container element not found: " + containerElementId;
    }
    var tabHeight = initMessageElement.getAttribute("tab-height");
    if (!tabHeight) {
        tabHeight = "32px";
    }
    
    var tabPaneDivElement = document.createElement("div");
    tabPaneDivElement.id = elementId;
    tabPaneDivElement.style.position = "absolute";
    tabPaneDivElement.style.backgroundColor = "#abcdef";
    tabPaneDivElement.style.width = "100%";
    tabPaneDivElement.style.height = "100%";
    
    var headerContainerDivElement = document.createElement("div");
    headerContainerDivElement.id = elementId + "_header";
    headerContainerDivElement.style.backgroundColor = "#ff0000";
    headerContainerDivElement.style.position = "absolute";
    headerContainerDivElement.style.top = "0px";
    headerContainerDivElement.style.left = "0px";
    headerContainerDivElement.style.width = "100%";
    headerContainerDivElement.style.height = "32px";
    tabPaneDivElement.appendChild(headerContainerDivElement);
    
    var headerTableElement  = document.createElement("table");
    headerTableElement.style.borderWidth = "0px";
    headerTableElement.style.borderCollapse = "collapse";
    headerTableElement.style.padding = "0px";
    headerContainerDivElement.appendChild(headerTableElement);
    
    var headerTbodyElement = document.createElement("tbody");
    headerTableElement.appendChild(headerTbodyElement);
    
    var headerTrElement = document.createElement("tr");
    headerTrElement.id = elementId + "_header_tr";
    headerTbodyElement.appendChild(headerTrElement);
    
    var bodyDivElement = document.createElement("div");
    bodyDivElement.id = elementId + "_body";
    bodyDivElement.style.position = "absolute";
    bodyDivElement.style.backgroundColor = "#00ff00";
    bodyDivElement.style.top = "32px";
    bodyDivElement.style.left = "0px";
    bodyDivElement.style.right = "0px";
    bodyDivElement.style.bottom = "0px";
    bodyDivElement.style.border = "2px outset #00007f";
    tabPaneDivElement.appendChild(bodyDivElement);
    
    containerElement.appendChild(tabPaneDivElement);
    EchoDomPropertyStore.setPropertyValue(elementId, "tabHeight", tabHeight);
};

/**
 * Processes a <code>remove-tab</code> message to remove a tab from the TabPane.
 *
 * @param removeTabMessageElement the <code>remove-tab</code> element to process
 */
ExtrasTabPane.MessageProcessor.processRemoveTab = function(removeTabMessageElement) {
    var elementId = removeTabMessageElement.getAttribute("eid");
    var tabId = removeTabMessageElement.getAttribute("tab-id");
    alert("remove: elementId=" + elementId + ",tabId=" + tabId);
};

