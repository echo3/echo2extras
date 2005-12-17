package nextapp.echo2.extras.app.layout;

import nextapp.echo2.app.LayoutData;

/**
 * <code>LayoutData</code> implementation for children of <code>TabPane</code>
 * components.
 */
public class TabPaneLayoutData implements LayoutData {

    private String title;
    
    /**
     * Returns the title of the tab.
     * 
     * @return the tab title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of the tab.
     * 
     * @param newValue the new title
     */
    public void setTitle(String newValue) {
        title = newValue;
    }
}
