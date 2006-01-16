package nextapp.echo2.extras.app.layout;

import nextapp.echo2.app.LayoutData;

/**
 * <code>LayoutData</code> implementation for children of 
 * <code>AccordionPane</code> components.
 */
public class AccordionPaneLayoutData implements LayoutData {

    private String title;
    
    /**
     * Returns the title of the accordion tab.
     * 
     * @return the tab title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of the accordion tab.
     * 
     * @param newValue the new title
     */
    public void setTitle(String newValue) {
        title = newValue;
    }
}
