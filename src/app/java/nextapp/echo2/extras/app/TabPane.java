package nextapp.echo2.extras.app;

import nextapp.echo2.app.Component;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Pane;
import nextapp.echo2.app.PaneContainer;

/**
 * A container pane which displays child components in separate tabs.
 */
public class TabPane extends Component 
implements Pane, PaneContainer {
    
    public static final String ACTIVE_TAB_CHANGED_PROPERTY = "activeTab";
    public static final String INPUT_ACTIVE_TAB_INDEX = "activeTabIndex";
    
    public static final String PROPERTY_TAB_HEIGHT = "tabHeight";
    
    public static final String PROPERTY_TAB_POSITION = "tabPosition";
    public static final String PROPERTY_TAB_WIDTH = "tabWidth";
    
    public static final int TAB_POSITION_BOTTOM = 1;
    public static final int TAB_POSITION_TOP = 0;
    
    private String activeTabRenderId;
    
    /**
     * Returns the index of the active tab.
     * 
     * @return the active tab index
     */
    public int getActiveTabIndex() {
        if (activeTabRenderId == null) {
            return 0;
        }
        int length = getComponentCount();
        for (int i = 0; i < length; ++i) {
            if (activeTabRenderId.equals(getComponent(i).getRenderId())) {
                return i;
            }
        }
        return 0;
    }
    
    /**
     * Returns the <code>Component</code> contained in the active tab.
     * 
     * @return the active tab <code>Component</code>
     */
    public Component getActiveTab() {
        int activeTabIndex = getActiveTabIndex();
        if (activeTabIndex < getComponentCount()) {
            return getComponent(activeTabIndex);
        } else {
            return null;
        }
    }
    
    /**
     * Returns the height of an individual tab.
     * 
     * @return the tab height
     */
    public Extent getTabHeight() {
        return (Extent) getProperty(PROPERTY_TAB_HEIGHT);
    }
    
    /**
     * Returns the position where the tabs are located relative to the pane 
     * content.
     * 
     * @return the tab position, one of the following values:
     *         <ul>
     *          <li><code>TAB_POSITION_TOP</code></li>
     *          <li><code>TAB_POSITION_BOTTOM</code></li>
     *         </ul>
     */
    public int getTabPosition() {
        Integer tabPosition = (Integer) getProperty(PROPERTY_TAB_POSITION);
        return tabPosition == null ? TAB_POSITION_TOP : tabPosition.intValue();
    }
    
    /**
     * Returns the width of an individual tab.
     * 
     * @return the tab width
     */
    public Extent getTabWidth() {
        return (Extent) getProperty(PROPERTY_TAB_WIDTH);
    }
    
    /**
     * @see nextapp.echo2.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);
        if (inputName.equals(INPUT_ACTIVE_TAB_INDEX)) {
//            setActiveTabIndex(inputValue == null ? 0 : ((Integer) inputValue).intValue());
        }
    }
    
    /**
     * Sets the active tab.
     * 
     * @param newValue the child <code>Component</code> whose tab should 
     *        be displayed.
     */
    public void setActiveTab(Component newValue) {
        activeTabRenderId = newValue == null ? null : newValue.getRenderId();
        firePropertyChange(ACTIVE_TAB_CHANGED_PROPERTY, null, null);
    }
    
    /**
     * Sets the active tab index.
     * 
     * @param newValue the index of the child <code>Component</code> whose tab
     *        should be displayed
     */
    public void setActiveTabIndex(int newValue) {
        if (newValue < getComponentCount()) {
            setActiveTab(getComponent(newValue));
        }
    }

    /**
     * Sets the height of an individual tab.
     * 
     * @param newValue the new tab height
     */
    public void setTabHeight(Extent newValue) {
        setProperty(PROPERTY_TAB_HEIGHT, newValue);
    }
    
    /**
     * Sets the position where the tabs are located relative to the pane 
     * content.
     * 
     * @param newValue the new tab position, one of the following values:
     *        <ul>
     *         <li><code>TAB_POSITION_TOP</code></li>
     *         <li><code>TAB_POSITION_BOTTOM</code></li>
     *        </ul>
     */
    public void setTabPosition(int newValue) {
        setProperty(PROPERTY_TAB_POSITION, new Integer(newValue));
    }

    /**
     * Sets the width of an individual tab.
     * 
     * @param newValue the new tab width
     */
    public void setTabWidth(Extent newValue) {
        setProperty(PROPERTY_TAB_WIDTH, newValue);
    }
}
