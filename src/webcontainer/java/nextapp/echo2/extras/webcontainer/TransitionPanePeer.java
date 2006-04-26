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

import nextapp.echo2.app.Component;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.extras.app.TransitionPane;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.PartialUpdateManager;
import nextapp.echo2.webcontainer.PartialUpdateParticipant;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webcontainer.SynchronizePeerFactory;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;

/**
 * <code>ComponentSynchronizePeer</code> implementation for synchronizing
 * <code>TransitionPane</code> components.
 */
public class TransitionPanePeer
implements ComponentSynchronizePeer {

    /**
     * <code>PartialUpdateParticipant</code> to update transition type.
     */
    private PartialUpdateParticipant typeUpdateParticipant = new PartialUpdateParticipant() {
    
        /**
         * @see nextapp.echo2.webcontainer.PartialUpdateParticipant#renderProperty(nextapp.echo2.webcontainer.RenderContext,
         *       nextapp.echo2.app.update.ServerComponentUpdate)
         */
        public void renderProperty(RenderContext rc, ServerComponentUpdate update) {
            renderSetTypeDirective(rc, update, (TransitionPane) update.getParent()); 
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
     * Service to provide supporting JavaScript library.
     */
    public static final Service TRANSITION_PANE_SERVICE = JavaScriptService.forResource("Echo2Extras.TransitionPane",
            "/nextapp/echo2/extras/webcontainer/resource/js/TransitionPane.js");
    
    static {
        WebRenderServlet.getServiceRegistry().add(TRANSITION_PANE_SERVICE);
    }
    
    /**
     * The <code>PartialUpdateManager</code> for this synchronization peer.
     */
    private PartialUpdateManager partialUpdateManager;
    
    /**
     * Default constructor.
     */
    public TransitionPanePeer() {
        partialUpdateManager = new PartialUpdateManager();
        partialUpdateManager.add(TransitionPane.PROPERTY_TYPE, typeUpdateParticipant);
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#getContainerId(nextapp.echo2.app.Component)
     */
    public String getContainerId(Component child) {
        return ContainerInstance.getElementId(child.getParent()) + "_content_" + child.getRenderId();
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderAdd(nextapp.echo2.webcontainer.RenderContext,
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String, nextapp.echo2.app.Component)
     */
    public void renderAdd(RenderContext rc, ServerComponentUpdate update, String targetId, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(TRANSITION_PANE_SERVICE.getId());
        TransitionPane transitionPane = (TransitionPane) component;
        
        renderInitDirective(rc, transitionPane, targetId);
        if (transitionPane.getVisibleComponentCount() > 0) {
            Component child = transitionPane.getVisibleComponent(0);
            renderAddChild(rc, update, transitionPane, child);
        }
    }
    
    private void renderAddChild(RenderContext rc, ServerComponentUpdate update, 
            TransitionPane transitionPane, Component child) {
        String elementId = ContainerInstance.getElementId(transitionPane);
        Element addChildElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasTransitionPane.MessageProcessor", "add-child");
        addChildElement.setAttribute("eid", elementId);
        addChildElement.setAttribute("child-id", child.getRenderId());
        
        ComponentSynchronizePeer syncPeer = SynchronizePeerFactory.getPeerForComponent(child.getClass());
        syncPeer.renderAdd(rc, update, getContainerId(child), child);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderDispose(nextapp.echo2.webcontainer.RenderContext, 
     *      nextapp.echo2.app.update.ServerComponentUpdate, nextapp.echo2.app.Component)
     */
    public void renderDispose(RenderContext rc, ServerComponentUpdate update, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(TRANSITION_PANE_SERVICE.getId());
        renderDisposeDirective(rc, (TransitionPane) component);
    }

    /**
     * Renders a dispose directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param transitionPane the <code>TransitionPane</code> being rendered
     */
    private void renderDisposeDirective(RenderContext rc, TransitionPane transitionPane) {
        String elementId = ContainerInstance.getElementId(transitionPane);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_PREREMOVE, 
                "ExtrasTransitionPane.MessageProcessor", "dispose");
        initElement.setAttribute("eid", elementId);
    }
    
    private String getTransitionTypeString(TransitionPane transitionPane) {
        Integer transitionType = (Integer) transitionPane.getProperty(TransitionPane.PROPERTY_TYPE);
        if (transitionType != null) {
            switch (transitionType.intValue()) {
            case TransitionPane.TYPE_CAMERA_PAN_LEFT:
                return "camera-pan-left";
            case TransitionPane.TYPE_CAMERA_PAN_RIGHT:
                return "camera-pan-right";
            }
        }
        return null;
    }
    
    /**
     * Renders an initialization directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param transitionPane the <code>TransitionPane</code> being rendered
     */
    private void renderInitDirective(RenderContext rc, TransitionPane transitionPane, String targetId) {
        String elementId = ContainerInstance.getElementId(transitionPane);
        ServerMessage serverMessage = rc.getServerMessage();
        Element partElement = serverMessage.addPart(ServerMessage.GROUP_ID_UPDATE, "ExtrasTransitionPane.MessageProcessor");
        Element initElement = serverMessage.getDocument().createElement("init");
        initElement.setAttribute("container-eid", targetId);
        initElement.setAttribute("eid", elementId);
        String type = getTransitionTypeString(transitionPane);
        if (type != null) {
            initElement.setAttribute("type", type);
        }
        partElement.appendChild(initElement);
    }
    
    private void renderRemoveChild(RenderContext rc, ServerComponentUpdate update, 
            TransitionPane transitionPane, Component child) {
        String elementId = ContainerInstance.getElementId(transitionPane);
        Element removeChildElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_REMOVE, 
                "ExtrasTransitionPane.MessageProcessor", "remove-child");
        removeChildElement.setAttribute("eid", elementId);
        removeChildElement.setAttribute("child-id", child.getRenderId());
    }

    private void renderSetTypeDirective(RenderContext rc, ServerComponentUpdate update, TransitionPane transitionPane) {
        String elementId = ContainerInstance.getElementId(transitionPane);
        Element setTypeElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasTransitionPane.MessageProcessor", "set-type");
        setTypeElement.setAttribute("eid", elementId);
        String type = getTransitionTypeString(transitionPane);
        if (type != null) {
            setTypeElement.setAttribute("type", type);
        }
    }
    
    private void renderTransitionDirective(RenderContext rc, ServerComponentUpdate update, TransitionPane transitionPane) {
        String elementId = ContainerInstance.getElementId(transitionPane);
        Element transitionElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_POSTUPDATE, 
                "ExtrasTransitionPane.MessageProcessor", "transition");
        transitionElement.setAttribute("eid", elementId);
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderUpdate(nextapp.echo2.webcontainer.RenderContext,
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String)
     */
    public boolean renderUpdate(RenderContext rc, ServerComponentUpdate update, String targetId) {
        TransitionPane transitionPane = (TransitionPane) update.getParent();
        
        // Determine if fully replacing the component is required.
        boolean fullReplace = false;
        if (update.hasUpdatedLayoutDataChildren()) {
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
            if (update.hasUpdatedProperties()) {
                partialUpdateManager.process(rc, update);
            }

            // Perform incremental updates.
            if (update.hasRemovedChildren() || update.hasAddedChildren()) {
                if (update.hasRemovedChildren()) {
                    Component[] removedChildren = update.getRemovedChildren();
                    if (removedChildren.length > 1) {
                        // Should not occur, sanity check.
                        throw new IllegalStateException("Multiple removed children.:");
                    }
                    renderRemoveChild(rc, update, transitionPane, removedChildren[0]);
                }
                if (update.hasAddedChildren()) {
                    Component[] addedChildren = update.getAddedChildren();
                    if (addedChildren.length > 1) {
                        // Should not occur, sanity check.
                        throw new IllegalStateException("Multiple added children.:");
                    }
                    renderAddChild(rc, update, transitionPane, addedChildren[0]);
                }
                renderTransitionDirective(rc, update, transitionPane);
            }
        }
        
        return fullReplace;
    }
}
