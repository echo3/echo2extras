package nextapp.echo2.extras.app;

import nextapp.echo2.app.Component;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Pane;

/**
 * A container pane which displays child components in separate tabs.
 */
public class TabPane extends Component 
implements Pane {
    
    public static final int TAB_POSITION_TOP = 0;
    public static final int TAB_POSITION_BOTTOM = 1;
    
    public static final String ACTIVE_TAB_CHANGED_PROEPRTY = "activeTab";
    public static final String PROPERTY_TAB_HEIGHT = "tabHeight";
    public static final String PROPERTY_TAB_POSITION = "tabPosition";
    public static final String PROPERTY_TAB_WIDTH = "tabWidth";
    
    private int activeTab = 0;
    
    /**
     * Returns the index of the active tab.
     * 
     * @return the active tab index
     */
    public int getActiveTab() {
        return activeTab;
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
     * Sets the active tab.
     * 
     * @param newValue the index of the new active tab
     */
    public void setActiveTab(int newValue) {
        int oldValue = activeTab;
        activeTab = newValue;
        firePropertyChange(ACTIVE_TAB_CHANGED_PROEPRTY, new Integer(oldValue), new Integer(newValue));
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
