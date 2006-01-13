package nextapp.echo2.extras.app.menu;

import nextapp.echo2.app.ImageReference;

public interface MenuModel extends ItemModel {
    
    public String getText();
    
    public int getItemCount();
    
    public ItemModel getItem(int itemIndex);
    
    public ImageReference getIcon();
}
