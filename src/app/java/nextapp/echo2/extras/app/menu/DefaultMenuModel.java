package nextapp.echo2.extras.app.menu;

import java.util.ArrayList;
import java.util.List;

import nextapp.echo2.app.ImageReference;

public class DefaultMenuModel 
implements MenuModel {

    private List items = null;
    private String text;
    private ImageReference icon;
    
    public DefaultMenuModel() {
        super();
    }
    
    public DefaultMenuModel(String text) {
        super();
        this.text = text;
    }
    
    public DefaultMenuModel(String text, ImageReference icon) {
        super();
        this.text = text;
        this.icon = icon;
    }
    
    public void addItem(ItemModel item) {
        addItem(item, -1);
    }
    
    public void addItem(ItemModel item, int index) {
        if (items == null) {
            items = new ArrayList();
        }
        if (index == -1) {
            items.add(item);
        } else {
            items.add(index, item);
        }
    }
    
    /**
     * @see nextapp.echo2.extras.app.menu.MenuModel#getIcon()
     */
    public ImageReference getIcon() {
        return icon;
    }

    /**
     * @see nextapp.echo2.extras.app.menu.MenuModel#getItem(int)
     */
    public ItemModel getItem(int itemIndex) {
        return (ItemModel) items.get(itemIndex);
    }

    /**
     * @see nextapp.echo2.extras.app.menu.MenuModel#getItemCount()
     */
    public int getItemCount() {
        return items == null ? 0 : items.size();
    }

    /**
     * @see nextapp.echo2.extras.app.menu.MenuModel#getText()
     */
    public String getText() {
        return text;
    }
    
    public void removeItem(ItemModel item) {
        if (items == null) {
            return;
        }
        items.remove(item);
    }
    
    public void setIcon(ImageReference newValue) {
        icon = newValue;
    }
    
    public void setText(String newValue) {
        text = newValue;
    }
}
