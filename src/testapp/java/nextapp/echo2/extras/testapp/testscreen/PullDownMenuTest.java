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

package nextapp.echo2.extras.testapp.testscreen;

import nextapp.echo2.app.ContentPane;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Label;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.WindowPane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.PullDownMenu;
import nextapp.echo2.extras.app.menu.DefaultOptionModel;
import nextapp.echo2.extras.app.menu.DefaultMenuModel;
import nextapp.echo2.extras.app.menu.MenuModel;
import nextapp.echo2.extras.app.menu.SeparatorModel;
import nextapp.echo2.extras.testapp.AbstractTest;
import nextapp.echo2.extras.testapp.InteractiveApp;
import nextapp.echo2.extras.testapp.StyleUtil;
import nextapp.echo2.extras.testapp.TestControlsPane;

/**
 * Interactive test module for <code>PullDownMenu</code>s.
 */
public class PullDownMenuTest extends AbstractTest {

    public PullDownMenuTest() {
        super("PullDownMenu");

        final PullDownMenu menu = new PullDownMenu(createMenuModel());
        menu.addActionListener(new ActionListener(){
        
            public void actionPerformed(ActionEvent e) {
                InteractiveApp.getApp().consoleWrite("Menu action: menu=" + e.getSource() + ", command=" + e.getActionCommand());
            }
        });
        setTestComponent(menu);

        addColorPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "foreground");
        addColorPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "background");
        addFontPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "font");
        addBorderPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "border");
        
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Add Test WindowPane", new ActionListener(){
        
            public void actionPerformed(ActionEvent e) {
                ContentPane rootContent = getApplicationInstance().getDefaultWindow().getContent();
                WindowPane windowPane = new WindowPane();
                windowPane.setTitle("Menu Test Window");
                windowPane.setStyleName("Default");
                SplitPane splitPane = new SplitPane(SplitPane.ORIENTATION_VERTICAL_TOP_BOTTOM, new Extent(32));
                windowPane.add(splitPane);
                PullDownMenu menu = new PullDownMenu(createMenuModel());
                menu.addActionListener(new ActionListener() {
                
                    public void actionPerformed(ActionEvent e) {
                        InteractiveApp.getApp().consoleWrite("Menu action: menu=" + e.getSource() 
                                + ", command=" + e.getActionCommand());
                    }
                });
                splitPane.add(menu);
                splitPane.add(new Label(StyleUtil.QUASI_LATIN_TEXT_1));
                rootContent.add(windowPane);
            }
        });
        
        addStandardIntegrationTests();
    }
    
    private MenuModel createMenuModel() {
        DefaultMenuModel menuModel = new DefaultMenuModel();
        
        DefaultMenuModel fileMenuModel = new DefaultMenuModel("File");
        fileMenuModel.addItem(new DefaultOptionModel("New", null, "new"));
        fileMenuModel.addItem(new DefaultOptionModel("Open", null, "open"));
        DefaultMenuModel openRecentMenuModel = new DefaultMenuModel("Open Recent");
        openRecentMenuModel.addItem(new DefaultOptionModel("Hotel.pdf", null, "open-recent-1"));
        openRecentMenuModel.addItem(new DefaultOptionModel("Alpha.txt", null, "open-recent-2"));
        openRecentMenuModel.addItem(new DefaultOptionModel("q4-earnings.txt", null, "open-recent-3"));
        openRecentMenuModel.addItem(new DefaultOptionModel("Bravo.odt", null, "open-recent-4"));
        openRecentMenuModel.addItem(new DefaultOptionModel("Golf.pdf", null, "open-recent-5"));
        openRecentMenuModel.addItem(new DefaultOptionModel("Alpha.txt", null, "open-recent-6"));
        openRecentMenuModel.addItem(new DefaultOptionModel("q3-earnings.txt", null, "open-recent-7"));
        openRecentMenuModel.addItem(new DefaultOptionModel("Charlie.odt", null, "open-recent-8"));
        openRecentMenuModel.addItem(new DefaultOptionModel("XYZ.pdf", null, "open-recent-9"));
        openRecentMenuModel.addItem(new DefaultOptionModel("Delta.txt", null, "open-recent-10"));
        openRecentMenuModel.addItem(new DefaultOptionModel("q1-earnings.txt", null, "open-recent-11"));
        openRecentMenuModel.addItem(new DefaultOptionModel("Foxtrot.odt", null, "open-recent-12"));
        fileMenuModel.addItem(openRecentMenuModel);
        fileMenuModel.addItem(new SeparatorModel());
        fileMenuModel.addItem(new DefaultOptionModel("Save", null, "save"));
        fileMenuModel.addItem(new DefaultOptionModel("Save as...", null, "save-as"));
        menuModel.addItem(fileMenuModel);
        
        DefaultMenuModel optionsMenuModel = new DefaultMenuModel("Options");
        optionsMenuModel.addItem(new DefaultOptionModel("Load Preferences...", null, "load-preferences"));
        optionsMenuModel.addItem(new DefaultOptionModel("Save Preferences...", null, "save-preferences"));
        menuModel.addItem(optionsMenuModel);
        
        return menuModel;
    }
}
