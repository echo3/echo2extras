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

import nextapp.echo2.app.Color;
import nextapp.echo2.app.ContentPane;
import nextapp.echo2.app.Label;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.WindowPane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.app.layout.SplitPaneLayoutData;
import nextapp.echo2.extras.app.CalendarSelect;
import nextapp.echo2.extras.app.TabPane;
import nextapp.echo2.extras.app.layout.TabPaneLayoutData;
import nextapp.echo2.extras.testapp.AbstractTest;
import nextapp.echo2.extras.testapp.ButtonColumn;
import nextapp.echo2.extras.testapp.StyleUtil;
import nextapp.echo2.extras.testapp.TestControlsPane;

/**
 * Interactive test module for <code>TabPane</code>s.
 */
public class TabPaneTest extends AbstractTest {
        
    private int tabNumber;

    public TabPaneTest() {
        
        super("TabPane");
        
        final TabPane tabPane = new TabPane();
        setTestComponent(tabPane);
        
        // Add/Remove Tabs

        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add Label (No LayoutData)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.add(new Label("Generic Label"));
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add Label", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Label label = new Label("Tab Pane Child " + tabNumber);
                label.setBackground(StyleUtil.randomBrightColor());
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Label #" + tabNumber);
                label.setLayoutData(layoutData);
                tabPane.add(label);
                ++tabNumber;
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add Label (index 0)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Label label = new Label("Tab Pane Child " + tabNumber);
                label.setBackground(StyleUtil.randomBrightColor());
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Inserted Label #" + tabNumber);
                label.setLayoutData(layoutData);
                tabPane.add(label, 0);
                ++tabNumber;
            }
        });
        
        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add Label (index 2)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (tabPane.getComponentCount() < 2) {
                    // Do nothing
                    return;
                }
                Label label = new Label("Tab Pane Child " + tabNumber);
                label.setBackground(StyleUtil.randomBrightColor());
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Inserted Label #" + tabNumber);
                label.setLayoutData(layoutData);
                tabPane.add(label, 2);
                ++tabNumber;
            }
        });
        
        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add CalendarSelect", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                CalendarSelect calendarSelect = new CalendarSelect();
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Calendar #" + tabNumber++);
                calendarSelect.setLayoutData(layoutData);
                tabPane.add(calendarSelect);
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add TabPaneTest", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                TabPaneTest tabPaneTest = new TabPaneTest();
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("TPT #" + tabNumber++);
                tabPaneTest.setLayoutData(layoutData);
                tabPane.add(tabPaneTest);
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add ContentPane", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                final ContentPane contentPane = new ContentPane();
                ButtonColumn buttonColumn = new ButtonColumn();
                buttonColumn.addButton("Add WindowPane", new ActionListener(){
                
                    public void actionPerformed(ActionEvent e) {
                        WindowPane windowPane = new WindowPane();
                        windowPane.setStyleName("Default");
                        windowPane.setTitle("Test Window");
                        windowPane.add(new Label(StyleUtil.QUASI_LATIN_TEXT_1));
                        contentPane.add(windowPane);
                    }
                });
                buttonColumn.addButton("Add TabPaneTest WindowPane", new ActionListener(){
                
                    public void actionPerformed(ActionEvent e) {
                        WindowPane windowPane = new WindowPane();
                        windowPane.setStyleName("Default");
                        windowPane.setTitle("Test Window");
                        windowPane.add(new TabPaneTest());
                        contentPane.add(windowPane);
                    }
                });
                contentPane.add(buttonColumn);
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("ContentPane #" + tabNumber++);
                contentPane.setLayoutData(layoutData);
                tabPane.add(contentPane);
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Add SplitPane", new ActionListener(){
        
            public void actionPerformed(ActionEvent arg0) {
                SplitPane splitPane = new SplitPane(SplitPane.ORIENTATION_HORIZONTAL_LEFT_RIGHT);
                splitPane.setResizable(true);
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("SplitPane #" + tabNumber++);
                splitPane.setLayoutData(layoutData);
                tabPane.add(splitPane);
                
                SplitPaneLayoutData splitPaneLayoutData;
                
                Label left = new Label("Left");
                splitPaneLayoutData = new SplitPaneLayoutData();
                splitPaneLayoutData.setBackground(new Color(0xafafff));
                left.setLayoutData(splitPaneLayoutData);
                splitPane.add(left);
                
                Label right = new Label("Right");
                splitPaneLayoutData = new SplitPaneLayoutData();
                splitPaneLayoutData.setBackground(new Color(0xafffaf));
                right.setLayoutData(splitPaneLayoutData);
                splitPane.add(right);
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_CONTENT, "Remove Last Tab", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (tabPane.getComponentCount() > 0) {
                    tabPane.remove(tabPane.getComponentCount() - 1);
                }
            }
        });

        // General Properties

        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Tab Position = Top", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.setTabPosition(TabPane.TAB_POSITION_TOP);
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Tab Position = Bottom", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.setTabPosition(TabPane.TAB_POSITION_BOTTOM);
            }
        });
        
        addColorPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "foreground");
        addColorPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "background");
        addFontPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "font");
        addBorderPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "inactiveBorder");
        addBorderPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "activeBorder");
        
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border Type = None", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.setBorderType(TabPane.BORDER_TYPE_NONE);
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border Type = Adjacent", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.setBorderType(TabPane.BORDER_TYPE_ADJACENT_TO_TABS);
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border Type = Parallel", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.setBorderType(TabPane.BORDER_TYPE_PARALLEL_TO_TABS);
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border Type = Surround", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.setBorderType(TabPane.BORDER_TYPE_SURROUND);
            }
        });
        
        addInsetsPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "insets");
        addInsetsPropertyTests(TestControlsPane.CATEGORY_PROPERTIES, "defaultContentInsets");
        
        // Selection Properties

        testControlsPane.addButton(TestControlsPane.CATEGORY_SELECTION, "Select TabIndex 0", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.setActiveTabIndex(0);
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_SELECTION, "Select TabIndex 2", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (tabPane.getComponentCount() > 0) {
                    tabPane.setActiveTabIndex(2);
                }
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_SELECTION, "Select Tab Null", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (tabPane.getComponentCount() > 0) {
                    tabPane.setActiveTab(null);
                }
            }
        });
        
        addStandardIntegrationTests();
    }
}
