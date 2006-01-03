package nextapp.echo2.extras.webcontainer;

import org.w3c.dom.Element;

import nextapp.echo2.app.Component;
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

    private static final Integer TAB_POSITION_TOP = new Integer(TabPane.TAB_POSITION_TOP);
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
        partialUpdateManager.add(TabPane.ACTIVE_TAB_CHANGED_PROPERTY, activeTabUpdateParticipant);
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
            Integer value = new Integer(propertyElement.getAttribute("value"));
            ci.getUpdateManager().getClientUpdateManager().setComponentProperty(component, 
                    TabPane.ACTIVE_TAB_CHANGED_PROPERTY, value);
        }
        
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderAdd(nextapp.echo2.webcontainer.RenderContext, 
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String, nextapp.echo2.app.Component)
     */
    public void renderAdd(RenderContext rc, ServerComponentUpdate update, String targetId, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(TAB_PANE_SERVICE.getId());
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
        
        // Create tab containers for children (performed in distinct loop from adding 
        // children in order to minimize ServerMessage length).
        for (int i = 0; i < addedChildren.length; ++i) {
            renderAddTabDirective(rc, update, tabPane, addedChildren[i]);
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
        rc.getServerMessage().addLibrary(TAB_PANE_SERVICE.getId());
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
        int tabPosition = ((Integer) tabPane.getRenderProperty(TabPane.PROPERTY_TAB_POSITION, TAB_POSITION_TOP)).intValue();
        initElement.setAttribute("tab-position", tabPosition == TabPane.TAB_POSITION_BOTTOM ? "bottom" : "top");
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
        Element removePartElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_REMOVE, 
                "ExtrasTabPane.MessageProcessor", "remove-tab");
        removePartElement.setAttribute("eid", elementId);
        removePartElement.setAttribute("tab-id", child.getRenderId());
    }
    
    private void renderSetActiveTabDirective(RenderContext rc, ServerComponentUpdate update, TabPane tabPane) {
        Component activeTab = tabPane.getActiveTab();
        if (activeTab == null) {
            return;
        }
        String elementId = ContainerInstance.getElementId(tabPane);
        Element removePartElement = rc.getServerMessage().appendPartDirective(ServerMessage.GROUP_ID_REMOVE, 
                "ExtrasTabPane.MessageProcessor", "set-active-tab");
        removePartElement.setAttribute("eid", elementId);
        removePartElement.setAttribute("tab-id", activeTab.getRenderId());
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
            if (update.hasUpdatedProperties()) {
                partialUpdateManager.process(rc, update);
            }
            if (update.hasAddedChildren()) {
                renderAddChildren(rc, update);
            }
        }
        
        return fullReplace;
    }
}
