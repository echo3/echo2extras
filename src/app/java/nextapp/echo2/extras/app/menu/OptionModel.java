package nextapp.echo2.extras.app.menu;

import nextapp.echo2.app.ImageReference;

public interface OptionModel extends ItemModel {
    
    public String getActionCommand();
    
    public String getText();
    
    public ImageReference getIcon();
}
