package nextapp.echo2.extras.app.menu;

import nextapp.echo2.app.ImageReference;

public class DefaultOptionModel 
implements OptionModel {

    private String text;
    private ImageReference icon;
    private String actionCommand;
    
    /**
     * Creates a  new <code>DefaultOptionModel</code>.
     * 
     * @param text the item text
     * @param icon the item icon
     * @param actionCommand the action command 
     */
    public DefaultOptionModel(String text, ImageReference icon, String actionCommand) {
        this.text = text;
        this.icon = icon;
        this.actionCommand = actionCommand;
    }
    
    /**
     * @see nextapp.echo2.extras.app.menu.OptionModel#getActionCommand()
     */
    public String getActionCommand() {
        return actionCommand;
    }

    /**
     * @see nextapp.echo2.extras.app.menu.OptionModel#getIcon()
     */
    public ImageReference getIcon() {
        return icon;
    }

    /**
     * @see nextapp.echo2.extras.app.menu.OptionModel#getText()
     */
    public String getText() {
        return text;
    }
}
