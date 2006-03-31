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

package nextapp.echo2.extras.app;

import java.util.EventListener;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.FillImage;
import nextapp.echo2.app.Pane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.menu.DefaultMenuModel;
import nextapp.echo2.extras.app.menu.DefaultMenuSelectionModel;
import nextapp.echo2.extras.app.menu.ItemModel;
import nextapp.echo2.extras.app.menu.MenuModel;
import nextapp.echo2.extras.app.menu.MenuSelectionModel;
import nextapp.echo2.extras.app.menu.OptionModel;
import nextapp.echo2.extras.app.menu.RadioOptionModel;
import nextapp.echo2.extras.app.menu.ToggleOptionModel;

/**
 * A pull-down menu pane.  This component should generally be used as a child 
 * of a vertically-oriented <code>SplitPane</code> component.  For a 
 * "traditional looking" pulldown menu bar with normal-sized fonts, set the 
 * height of the containing region to between 26 and 32 pixels.
 */
public class MenuBarPane extends Component 
implements Pane {
    
    public static final String INPUT_SELECT = "select";
    public static final String MODEL_CHANGED_PROPERTY = "model";
    public static final String SELECTION_MODEL_CHANGED_PROPERTY = "selectionModel";

    public static final String PROPERTY_BACKGROUND_IMAGE = "backgroundImage";
    public static final String PROPERTY_BORDER = "border";
    public static final String PROPERTY_MENU_BACKGROUND = "menuBackground";
    public static final String PROPERTY_MENU_BACKGROUND_IMAGE = "menuBackgroundImage";
    public static final String PROPERTY_MENU_BORDER = "menuBorder";
    public static final String PROPERTY_MENU_FOREGROUND = "menuForeground";
    public static final String PROPERTY_SELECTION_BACKGROUND = "selectionBackground";
    public static final String PROPERTY_SELECTION_BACKGROUND_IMAGE = "selectionBackgroundImage";
    public static final String PROPERTY_SELECTION_FOREGROUND = "selectionForeground";
    
    private MenuModel model;
    private MenuSelectionModel selectionModel;
    
    /**
     * Creates a new <code>MenuBarPane</code> with an empty
     * <code>DefaultMenuModel</code> as its model and a.
     * <code>DefaultMenuSelectionModel</code> to provide state information.
     */
    public MenuBarPane() {
        this(null, null);
    }
    
    /**
     * Creates a new <code>MenuBarPane</code> displaying the specified 
     * <code>MenuModel</code> and using a 
     * <code>DefaultMenuSelectionModel</code> to provide state information.
     * 
     * @param model the model
     * @param selectionModel the selection model
     */
    public MenuBarPane(MenuModel model) {
        this(model, null);
    }
    
    /**
     * Creates a new <code>MenuBarPane</code> displaying the specified 
     * <code>MenuModel</code> and using the specified 
     * <code>MenuSelectionModel</code> to provide state information.
     * 
     * @param model the model
     * @param selectionModel the selection model
     */
    public MenuBarPane(MenuModel model, MenuSelectionModel selectionModel) {
        super();
        setModel(model == null ? new DefaultMenuModel() : model);
        setSelectionModel(selectionModel == null ? new DefaultMenuSelectionModel() : selectionModel);
    }
    
    /**
     * Adds an <code>ActionListener</code> to be notified when a menu item 
     * is selected.
     * 
     * @param l the listener to add
     */
    public void addActionListener(ActionListener l) {
        getEventListenerList().addListener(ActionListener.class, l);
    }
    
    /**
     * Deselects <code>RadioOptionModel</code> items in a group when a selection
     * is made within that group.  Operates by recursively searching 
     * <code>MenuModel</code>s for <code>RadioOptionModel</code>s with a specific
     * group id. 
     * 
     * @param menuModel the <code>MenuModel</code> to search 
     * @param groupId the id of the group to deselect
     * @param newSelectionId the id of the new selection in the group
     */
    private void deselectGroup(MenuModel menuModel, Object groupId, Object newSelectionId) {
        int count = menuModel.getItemCount();
        for (int i = 0; i < count; ++i) {
            ItemModel itemModel = menuModel.getItem(i);
            if (itemModel instanceof MenuModel) {
                deselectGroup((MenuModel) itemModel, groupId, newSelectionId);
            } else if (itemModel instanceof RadioOptionModel) {
                RadioOptionModel radioOptionModel = (RadioOptionModel) itemModel;
                if (radioOptionModel.getGroupId() != null && radioOptionModel.getGroupId().equals(groupId)) {
                    selectionModel.setSelected(radioOptionModel.getId(), false);
                }
            }
        }
    }
    
    /**
     * Programmatically performs a menu action.
     * 
     * @param optionModel the <code>OptionModel</code> whose action is to be 
     *        invoked
     */
    public void doAction(OptionModel optionModel) {
        if (selectionModel != null && optionModel instanceof ToggleOptionModel) {
            if (optionModel instanceof RadioOptionModel) {
                RadioOptionModel radioOptionModel = (RadioOptionModel) optionModel;
                deselectGroup(model, radioOptionModel.getGroupId(), radioOptionModel.getId());
                selectionModel.setSelected(radioOptionModel.getId(), true);
            } else {
                ToggleOptionModel toggleOptionModel = (ToggleOptionModel) optionModel;
                selectionModel.setSelected(toggleOptionModel.getId(), !selectionModel.isSelected(toggleOptionModel.getId()));
            }
            firePropertyChange(SELECTION_MODEL_CHANGED_PROPERTY, null, null);
        }
        fireActionPerformed(optionModel);
    }
    
    /**
     * Notifies <code>ActionListener</code>s that an option was chosen. 
     * 
     * @param optionModel the selected <code>OptionModel</code>
     */
    private void fireActionPerformed(OptionModel optionModel) {
        if (!hasEventListenerList()) {
            return;
        }
        ActionEvent e = new ActionEvent(this, optionModel.getId());
        EventListener[] listeners = getEventListenerList().getListeners(ActionListener.class);
        for (int i = 0; i < listeners.length; ++i) {
            ((ActionListener) listeners[i]).actionPerformed(e);
        }
    }
    
    /**
     * Returns the background image that will be displayed in the 
     * <code>MenuBarPane</code>.  This background image will also be 
     * used around pull-down menus in the event that a menu 
     * background image is not specified.
     * 
     * @return the default background image
     */
    public FillImage getBackgroundImage() {
        return (FillImage) getProperty(PROPERTY_BACKGROUND_IMAGE);
    }
    
    /**
     * Returns the border that will be displayed around the 
     * <code>MenuBarPane</code>.  This border will also be used around
     * pull-down menus in the event that a menu border is not specified.
     * 
     * @return the default border
     */
    public Border getBorder() {
        return (Border) getProperty(PROPERTY_BORDER);
    }
    
    /**
     * Returns the background color that will be displayed in pull-down
     * menus.  Use this property only if a color different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "background" property").
     * 
     * @return the menu background
     */
    public Color getMenuBackground() {
        return (Color) getProperty(PROPERTY_MENU_BACKGROUND);
    }
    
    /**
     * Returns the background image that will be displayed in pull-down
     * menus.  Use this property only if an image different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "backgroundImage" property").
     * 
     * @return the menu background image
     */
    public FillImage getMenuBackgroundImage() {
        return (FillImage) getProperty(PROPERTY_MENU_BACKGROUND_IMAGE);
    }
    
    /**
     * Returns the border that will be displayed around pull-down
     * menus.  Use this property only if a border different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "border" property").
     * 
     * @return the menu border
     */
    public Border getMenuBorder() {
        return (Border) getProperty(PROPERTY_MENU_BORDER);
    }
    
    /**
     * Returns the foreground color that will be displayed in pull-down
     * menus.  Use this property only if a color different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "foreground" property").
     * 
     * @return the menu foreground
     */
    public Color getMenuForeground() {
        return (Color) getProperty(PROPERTY_MENU_FOREGROUND);
    }
    
    /**
     * Returns the model
     * 
     * @return the model
     */
    public MenuModel getModel() {
        return model;
    }
    
    /**
     * Returns the background color used to highlight the currently 
     * selected menu item.
     * 
     * @return the selection background
     */
    public Color getSelectionBackground() {
        return (Color) getProperty(PROPERTY_SELECTION_BACKGROUND);
    }
    
    /**
     * Returns the background image used to highlight the currently 
     * selected menu item.
     * 
     * @return the selection background image
     */
    public FillImage getSelectionBackgroundImage() {
        return (FillImage) getProperty(PROPERTY_SELECTION_BACKGROUND_IMAGE);
    }
    
    /**
     * Returns the foreground color used to highlight the currently 
     * selected menu item.
     * 
     * @return the selection foreground
     */
    public Color getSelectionForeground() {
        return (Color) getProperty(PROPERTY_SELECTION_FOREGROUND);
    }

    /**
     * Returns the selection model
     * 
     * @return the selection model
     */
    public MenuSelectionModel getSelectionModel() {
        return selectionModel;
    }
    
    /**
     * @see nextapp.echo2.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    public void processInput(String name, Object value) {
        if (INPUT_SELECT.equals(name)) {
            OptionModel optionModel = (OptionModel) value;
            doAction(optionModel);
        }
    }
    
    /**
     * Removes an <code>ActionListener</code> from being notified when a menu 
     * item is selected.
     * 
     * @param l the listener to remove
     */
    public void removeActionListener(ActionListener l) {
        getEventListenerList().removeListener(ActionListener.class, l);
    }
    
    /**
     * Sets the background image that will be displayed in the 
     * <code>MenuBarPane</code>.  This background image will also be 
     * used around pull-down menus in the event that a menu 
     * background image is not specified.
     * 
     * @param newValue the new default background image
     */
    public void setBackgroundImage(FillImage newValue) {
        setProperty(PROPERTY_BACKGROUND_IMAGE, newValue);
    }
    
    /**
     * Sets the border that will be displayed around the 
     * <code>MenuBarPane</code>.  This border will also be used around
     * pull-down menus in the event that a menu border is not specified.
     * 
     * @param newValue the new default border
     */
    public void setBorder(Border newValue) {
        setProperty(PROPERTY_BORDER, newValue);
    }
    
    /**
     * Sets the background color that will be displayed in pull-down
     * menus.  Use this property only if a color different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "background" property").
     * 
     * @param newValue the new menu background
     */
    public void setMenuBackground(Color newValue) {
        setProperty(PROPERTY_MENU_BACKGROUND, newValue);
    }
    
    /**
     * Sets the background image that will be displayed in pull-down
     * menus.  Use this property only if an image different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "backgroundImage" property").
     * 
     * @param newValue the new menu background image
     */
    public void setMenuBackgroundImage(FillImage newValue) {
        setProperty(PROPERTY_MENU_BACKGROUND_IMAGE, newValue);
    }
    
    /**
     * Sets the border that will be displayed around pull-down
     * menus.  Use this property only if a border different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "border" property").
     * 
     * @param newValue the new menu border
     */
    public void setMenuBorder(Border newValue) {
        setProperty(PROPERTY_MENU_BORDER, newValue);
    }
    
    /**
     * Sets the foreground color that will be displayed in pull-down
     * menus.  Use this property only if a color different from
     * the one used for the menu bar is desired for pull-down menus
     * (otherwise use only the "foreground" property").
     * 
     * @param newValue the new menu foreground
     */
    public void setMenuForeground(Color newValue) {
        setProperty(PROPERTY_MENU_FOREGROUND, newValue);
    }
    
    /**
     * Sets the model.
     * 
     * @param newValue the new model
     */
    public void setModel(MenuModel newValue) {
        if (newValue == null) {
            throw new IllegalArgumentException("Model may not be null.");
        }
        MenuModel oldValue = model;
        model = newValue;
        firePropertyChange(MODEL_CHANGED_PROPERTY, oldValue, newValue);
    }
    
    /**
     * Sets the background color used to highlight the currently 
     * selected menu item.
     * 
     * @param newValue the new selection background
     */
    public void setSelectionBackground(Color newValue) {
        setProperty(PROPERTY_SELECTION_BACKGROUND, newValue);
    }
    
    /**
     * Sets the background image used to highlight the currently 
     * selected menu item.
     * 
     * @param newValue the new selection background image
     */
    public void setSelectionBackgroundImage(FillImage newValue) {
        setProperty(PROPERTY_SELECTION_BACKGROUND_IMAGE, newValue);
    }
    
    /**
     * Sets the foreground color used to highlight the currently 
     * selected menu item.
     * 
     * @param newValue the new selection foreground
     */
    public void setSelectionForeground(Color newValue) {
        setProperty(PROPERTY_SELECTION_FOREGROUND, newValue);
    }
    
    /**
     * Sets the selection model.
     * 
     * @param newValue the new selection model
     */
    public void setSelectionModel(MenuSelectionModel newValue) {
        if (newValue == null) {
            throw new IllegalArgumentException("Selection model may not be null.");
        }
        MenuSelectionModel oldValue = selectionModel;
        selectionModel = newValue;
        firePropertyChange(MODEL_CHANGED_PROPERTY, oldValue, newValue);
    }
}
