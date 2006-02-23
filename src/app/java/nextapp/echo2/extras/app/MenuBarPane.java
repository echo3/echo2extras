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
import nextapp.echo2.extras.app.menu.MenuModel;
import nextapp.echo2.extras.app.menu.OptionModel;

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
    
    /**
     * Creates a new <code>MenuBarPane</code> with an empty
     * <code>DefaultMenuModel</code> as its model.
     */
    public MenuBarPane() {
        this(new DefaultMenuModel());
    }
    
    /**
     * Creates a new <code>MenuBarPane</code> displaying the specified 
     * <code>MenuModel</code>.
     * 
     * @param model the model
     */
    public MenuBarPane(MenuModel model) {
        super();
        setModel(model);
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
     * Notifies <code>ActionListener</code>s that an option was chosen. 
     * 
     * @param optionModel the selected <code>OptionModel</code>
     */
    private void fireActionPerformed(OptionModel optionModel) {
        if (!hasEventListenerList()) {
            return;
        }
        ActionEvent e = new ActionEvent(this, optionModel.getActionCommand());
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
     * @see nextapp.echo2.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    public void processInput(String name, Object value) {
        if (INPUT_SELECT.equals(name)) {
            OptionModel optionModel = (OptionModel) value;
            fireActionPerformed(optionModel);
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
}
