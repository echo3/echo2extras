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

package nextapp.echo2.extras.webcontainer;

import org.w3c.dom.Element;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Insets;
import nextapp.echo2.app.Pane;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.extras.app.TabPane;
import nextapp.echo2.extras.app.layout.TabPaneLayoutData;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.PartialUpdateManager;
import nextapp.echo2.webcontainer.PartialUpdateParticipant;
import nextapp.echo2.webcontainer.PropertyUpdateProcessor;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webcontainer.SynchronizePeerFactory;
import nextapp.echo2.webcontainer.propertyrender.BorderRender;
import nextapp.echo2.webcontainer.propertyrender.ColorRender;
import nextapp.echo2.webcontainer.propertyrender.ExtentRender;
import nextapp.echo2.webcontainer.propertyrender.InsetsRender;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;

/**
 * <code>ComponentSynchronizePeer</code> implementation for synchronizing
 * <code>TabPane</code> components.
 */
public class TabPanePeer 
implements ComponentSynchronizePeer, PropertyUpdateProcessor {

    private static final String PROPERTY_ACTIVE_TAB = "activeTab";
    
    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service TAB_PANE_SERVICE = JavaScriptService.forResource("Echo2Extras.TabPane",
            "/nextapp/echo2/extras/webcontainer/resource/js/TabPane.js");

    static {
        WebRenderServlet.getServiceRegistry().add(TAB_PANE_SERVICE);
    }
    
    /**
     * <code>PartialUpdateParticipant</code> to update active tab.
     */
    private PartialUpdateParticipant activeTabUpdateParticipant = new PartialUpdateParticipant() {
    
        /**
         * @see nextapp.echo2.webcontainer.PartialUpdateParticipant#renderProperty(nextapp.echo2.webcontainer.RenderContext,
         *       nextapp.echo2.app.update.ServerComponentUpdate)
         */
        public void renderProperty(RenderContext rc, ServerComponentUpdate update) {
            renderSetActiveTabDirective(rc, update, (TabPane) update.getParent());
        }
    
        /**
         * @see nextapp.echo2.webcontainer.PartialUpdateParticipant#canRenderProperty(nextapp.echo2.webcontainer.RenderContext, 
         *      nextapp.echo2.app.update.ServerComponentUpdate)
         */
        public boolean canRenderProperty(RenderContext rc, ServerComponentUpdate update) {
            return true;
        }
    };
    
    /**
     * The <code>PartialUpdateManager</code> for this synchronization peer.
     */
    private PartialUpdateManager partialUpdateManager;
    
    /**
     * Default constructor.
     */
    public TabPanePeer() {
        partialUpdateManager = new PartialUpdateManager();
        partialUpdateManager.add(TabPane.ACTIVE_TAB_INDEX_CHANGED_PROPERTY, activeTabUpdateParticipant);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#getContainerId(nextapp.echo2.app.Component)
     */
    public String getContainerId(Component child) {
        return ContainerInstance.getElementId(child.getParent()) + "_content_" + child.getRenderId();
    }

    /**
     * @see nextapp.echo2.webcontainer.PropertyUpdateProcessor#processPropertyUpdate(nextapp.echo2.webcontainer.ContainerInstance, 
     *      nextapp.echo2.app.Component, org.w3c.dom.Element)
     */
    public void processPropertyUpdate(ContainerInstance ci, Component component, Element propertyElement) {
        String propertyName = propertyElement.getAttribute(PropertyUpdateProcessor.PROPERTY_NAME);
        if (PROPERTY_ACTIVE_TAB.equals(propertyName)) {
            String propertyValue = propertyElement.getAttribute("value");
            Component[] children = component.getVisibleComponents();
            for (int i = 0; i < children.length; ++i) {
                if (children[i].getRenderId().equals(propertyValue)) {
                    ci.getUpdateManager().getClientUpdateManager().setComponentProperty(component, 
                            TabPane.ACTIVE_TAB_INDEX_CHANGED_PROPERTY, new Integer(i));
                    return;
                }
            }
        }
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderAdd(nextapp.echo2.webcontainer.RenderContext, 
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String, nextapp.echo2.app.Component)
     */
    public void renderAdd(RenderContext rc, ServerComponentUpdate update, String targetId, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(TAB_PANE_SERVICE.getId());
        serverMessage.addLibrary(ExtrasUtil.JS_EXTRAS_UTIL_SERVICE.getId());
        TabPane tabPane = (TabPane) component;
        renderInitDirective(rc, tabPane, targetId);
        Component[] children = tabPane.getVisibleComponents();
        for (int i = 0; i < children.length; ++i) {
            renderAddTabDirective(rc, update, tabPane, children[i]);
        }
        for (int i = 0; i < children.length; ++i) {
            renderChild(rc, update, tabPane, children[i]);
        }
    }

    private void renderAddChildren(RenderContext rc, ServerComponentUpdate update) {
        TabPane tabPane = (TabPane) update.getParent();
        Component[] addedChildren = update.getAddedChildren();
        Component[] children = tabPane.getVisibleComponents();
        
        // Iterating through arrays and checking for reference equality is used here (versus loading daddedChildren
        // into a hashtable) because we'll be dealing with very small array lengths, typically less than 10.
        for (int i = 0; i < children.length; ++i) {
            for (int j = 0; j < addedChildren.length; ++j) {
                if (children[i] == addedChildren[j]) {
                    renderAddTabDirective(rc, update, tabPane, children[i]);
                    break;
                }
            }
        }
        
        // Add children.
        for (int i = 0; i < addedChildren.length; ++i) {
            renderChild(rc, update, tabPane, addedChildren[i]);
        }
    }
    
    private void renderAddTabDirective(RenderContext rc, ServerComponentUpdate update, TabPane tabPane, Component child) {
        TabPaneLayoutData layoutData = (TabPaneLayoutData) child.getLayoutData();
        String elementId = ContainerInstance.getElementId(tabPane);
        Element addPartElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasTabPane.MessageProcessor", "add-tab");
        addPartElement.setAttribute("eid", elementId);
        addPartElement.setAttribute("tab-id", child.getRenderId());
        addPartElement.setAttribute("tab-index", Integer.toString(tabPane.indexOf(child)));
        if  (child instanceof Pane) {
            addPartElement.setAttribute("pane", "true");
        }
        if (layoutData != null) {
            if (layoutData.getTitle() != null) {
                addPartElement.setAttribute("title", layoutData.getTitle()); 
            }
        }
    }
    
    /**
     * Renders an individual child component of the <code>TabPane</code>.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param update the <code>ServerComponentUpdate</code> being performed
     * @param child The child <code>Component</code> to be rendered
     */
    private void renderChild(RenderContext rc, ServerComponentUpdate update, TabPane tabPane, Component child) {
        ComponentSynchronizePeer syncPeer = SynchronizePeerFactory.getPeerForComponent(child.getClass());
        syncPeer.renderAdd(rc, update, getContainerId(child), child);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderDispose(
     *      nextapp.echo2.webcontainer.RenderContext, nextapp.echo2.app.update.ServerComponentUpdate, nextapp.echo2.app.Component)
     */
    public void renderDispose(RenderContext rc, ServerComponentUpdate update, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(TAB_PANE_SERVICE.getId());
        serverMessage.addLibrary(ExtrasUtil.JS_EXTRAS_UTIL_SERVICE.getId());
        renderDisposeDirective(rc, (TabPane) component);
    }

    /**
     * Renders a dispose directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param tabPane the <code>TabPane</code> being rendered
     */
    private void renderDisposeDirective(RenderContext rc, TabPane tabPane) {
        String elementId = ContainerInstance.getElementId(tabPane);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_PREREMOVE, 
                "ExtrasTabPane.MessageProcessor", "dispose");
        initElement.setAttribute("eid", elementId);
    }
    
    /**
     * Renders an initialization directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param tabPane the <code>TabPane</code> being rendered
     */
    private void renderInitDirective(RenderContext rc, TabPane tabPane, String targetId) {
        String elementId = ContainerInstance.getElementId(tabPane);
        ServerMessage serverMessage = rc.getServerMessage();
        Element partElement = serverMessage.addPart(ServerMessage.GROUP_ID_UPDATE, "ExtrasTabPane.MessageProcessor");
        Element initElement = serverMessage.getDocument().createElement("init");
        initElement.setAttribute("container-eid", targetId);
        initElement.setAttribute("eid", elementId);
        
        if (!tabPane.isRenderEnabled()) {
        	initElement.setAttribute("enabled", "false");
        }
        Color background = (Color) tabPane.getRenderProperty(TabPane.PROPERTY_BACKGROUND);
        if (background != null) {
            initElement.setAttribute("default-background", ColorRender.renderCssAttributeValue(background));
        }
        Color foreground = (Color) tabPane.getRenderProperty(TabPane.PROPERTY_FOREGROUND);
        if (foreground != null) {
            initElement.setAttribute("default-foreground", ColorRender.renderCssAttributeValue(foreground));
        }
        Insets defaultContentInsets = (Insets) tabPane.getRenderProperty(TabPane.PROPERTY_DEFAULT_CONTENT_INSETS);
        if (defaultContentInsets != null) {
            initElement.setAttribute("default-content-insets", InsetsRender.renderCssAttributeValue(defaultContentInsets));
        }
        Insets insets = (Insets) tabPane.getRenderProperty(TabPane.PROPERTY_INSETS);
        if (insets != null) {
        	initElement.setAttribute("insets", InsetsRender.renderCssAttributeValue(insets));
        }
        Extent tabInset = (Extent) tabPane.getRenderProperty(TabPane.PROPERTY_TAB_INSET);
        if (tabInset != null) {
            initElement.setAttribute("tab-inset", ExtentRender.renderCssAttributeValue(tabInset));
        }
        Extent tabSpacing = (Extent) tabPane.getRenderProperty(TabPane.PROPERTY_TAB_SPACING);
        if (tabSpacing != null) {
            initElement.setAttribute("tab-spacing", ExtentRender.renderCssAttributeValue(tabSpacing));
        }
        
        Integer tabPosition = (Integer) tabPane.getRenderProperty(TabPane.PROPERTY_TAB_POSITION);
        if (tabPosition != null) {
            initElement.setAttribute("tab-position", tabPosition.intValue() == TabPane.TAB_POSITION_BOTTOM ? "bottom" : "top");
        }
        
        Integer borderType = (Integer) tabPane.getRenderProperty(TabPane.PROPERTY_BORDER_TYPE);
        if (borderType != null) {
            switch (borderType.intValue()) {
            case TabPane.BORDER_TYPE_ADJACENT_TO_TABS:
                initElement.setAttribute("border-type", "adjacent");
                break;
            case TabPane.BORDER_TYPE_NONE:
                initElement.setAttribute("border-type", "none");
                break;
            case TabPane.BORDER_TYPE_PARALLEL_TO_TABS:
                initElement.setAttribute("border-type", "parallel");
                break;
            case TabPane.BORDER_TYPE_SURROUND:
                initElement.setAttribute("border-type", "surround");
                break;
            }
        }
        
        //BUGBUG. Just render the border CSS, have the client deal with it!
        Border inactiveBorder = (Border) tabPane.getRenderProperty(TabPane.PROPERTY_INACTIVE_BORDER);
        if (inactiveBorder != null) {
            if (inactiveBorder.getColor() != null) {
                initElement.setAttribute("inactive-border-color", ColorRender.renderCssAttributeValue(inactiveBorder.getColor()));
            }
            if (inactiveBorder.getSize() != null && inactiveBorder.getSize().getUnits() == Extent.PX) {
                initElement.setAttribute("inactive-border-size", Integer.toString(inactiveBorder.getSize().getValue()));
            }
            initElement.setAttribute("inactive-border-style", BorderRender.getStyleValue(inactiveBorder.getStyle())); 
        }
        Border activeBorder = (Border) tabPane.getRenderProperty(TabPane.PROPERTY_ACTIVE_BORDER);
        if (activeBorder != null) {
            if (activeBorder.getColor() != null) {
                initElement.setAttribute("active-border-color", ColorRender.renderCssAttributeValue(activeBorder.getColor()));
            }
            if (activeBorder.getSize() != null && activeBorder.getSize().getUnits() == Extent.PX) {
                initElement.setAttribute("active-border-size", Integer.toString(activeBorder.getSize().getValue()));
            }
            initElement.setAttribute("active-border-style", BorderRender.getStyleValue(activeBorder.getStyle())); 
        }
        
        int activeTabIndex = tabPane.getActiveTabIndex();
        if (activeTabIndex != -1 && activeTabIndex < tabPane.getVisibleComponentCount()) {
            initElement.setAttribute("active-tab", tabPane.getVisibleComponent(activeTabIndex).getRenderId());
        }
        
        partElement.appendChild(initElement);
    }
    
    private void renderRemoveChildren(RenderContext rc, ServerComponentUpdate update) {
        TabPane tabPane = (TabPane) update.getParent();
        Component[] removedChildren = update.getRemovedChildren();
        for (int i = 0; i < removedChildren.length; ++i) {
            renderRemoveTabDirective(rc, update, tabPane, removedChildren[i]);
        }
    }
    
    private void renderRemoveTabDirective(RenderContext rc, ServerComponentUpdate update, TabPane tabPane, Component child) {
        String elementId = ContainerInstance.getElementId(tabPane);
        Element removeTabElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_REMOVE, 
                "ExtrasTabPane.MessageProcessor", "remove-tab");
        removeTabElement.setAttribute("eid", elementId);
        removeTabElement.setAttribute("tab-id", child.getRenderId());
    }
    
    private void renderSetActiveTabDirective(RenderContext rc, ServerComponentUpdate update, TabPane tabPane) {
        int activeTabIndex = tabPane.getActiveTabIndex();
        if (activeTabIndex == -1 || activeTabIndex >= tabPane.getVisibleComponentCount()) {
            // Do nothing.
            return;
        }
        
        String elementId = ContainerInstance.getElementId(tabPane);
        Element setActiveTabElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasTabPane.MessageProcessor", "set-active-tab");
        setActiveTabElement.setAttribute("eid", elementId);
        setActiveTabElement.setAttribute("active-tab", tabPane.getVisibleComponent(activeTabIndex).getRenderId());
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderUpdate(
     *      nextapp.echo2.webcontainer.RenderContext, nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String)
     */
    public boolean renderUpdate(RenderContext rc, ServerComponentUpdate update, String targetId) {
        // Determine if fully replacing the component is required.
        boolean fullReplace = false;
        if (update.hasUpdatedLayoutDataChildren()) {
            // TODO: Perform fractional update on LayoutData change instead of full replace.
            fullReplace = true;
        } else if (update.hasUpdatedProperties()) {
            if (!partialUpdateManager.canProcess(rc, update)) {
                fullReplace = true;
            }
        }
        
        if (fullReplace) {
            // Perform full update.
            DomUpdate.renderElementRemove(rc.getServerMessage(), ContainerInstance.getElementId(update.getParent()));
            renderAdd(rc, update, targetId, update.getParent());
        } else {
            // Perform incremental updates.
            if (update.hasRemovedChildren()) {
                renderRemoveChildren(rc, update);
            }
            if (update.hasAddedChildren()) {
                renderAddChildren(rc, update);
            }
            if (update.hasUpdatedProperties()) {
                partialUpdateManager.process(rc, update);
            }
        }
        
        return fullReplace;
    }
}
