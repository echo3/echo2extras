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

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Insets;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.WindowPane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.CalendarSelect;
import nextapp.echo2.extras.testapp.InteractiveApp;
import nextapp.echo2.extras.testapp.StyleUtil;
import nextapp.echo2.extras.testapp.TestControlsPane;

/**
 * Interactive test module for <code>CalendarSelect</code>s.
 */
public class CalendarSelectTest extends SplitPane {

    public CalendarSelectTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");
        
        TestControlsPane testControlsPane = new TestControlsPane("CalendarSelect");
        add(testControlsPane);
        
        final CalendarSelect calendarSelect = new CalendarSelect();
        add(calendarSelect);
        
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Foreground", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Color color = StyleUtil.randomColor();
                calendarSelect.setForeground(color);
            }
        });
        
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Background", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Color color = StyleUtil.randomColor();
                calendarSelect.setBackground(color);
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Remove Calendar", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                remove(calendarSelect);
            }
        });

        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border (All Attributes)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarSelect.setBorder(StyleUtil.randomBorder());
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border Color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Border border = calendarSelect.getBorder();
                if (border == null) {
                    border = new Border(new Extent(1), Color.BLUE, Border.STYLE_SOLID);
                }
                calendarSelect.setBorder(new Border(border.getSize(), StyleUtil.randomColor(), border.getStyle()));
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border Size", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarSelect.setBorder(StyleUtil.nextBorderSize(calendarSelect.getBorder()));
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Border Style", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarSelect.setBorder(StyleUtil.nextBorderStyle(calendarSelect.getBorder()));
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Remove Border", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarSelect.setBorder(null);
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Query Date", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Date date = calendarSelect.getDate();
                InteractiveApp.getApp().consoleWrite(date == null ? "No Date" : date.toString());
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Set Date", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Calendar calendar = new GregorianCalendar();
                calendar.add(Calendar.DAY_OF_MONTH, ((int) (Math.random() * 10000)) - 5000);
                calendarSelect.setDate(calendar.getTime());
            }
        });
        testControlsPane.addButton(TestControlsPane.CATEGORY_PROPERTIES, "Add CalendarSelect WindowPane", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                WindowPane windowPane = new WindowPane("Calendar Select Test", new Extent(240), new Extent(225));
                windowPane.setPositionX(new Extent((int) (Math.random() * 500)));
                windowPane.setPositionY(new Extent((int) (Math.random() * 300) + 140));
                windowPane.setStyleName("Default");
                windowPane.setInsets(new Insets(10, 5));
                windowPane.add(new CalendarSelect());
                InteractiveApp.getApp().getDefaultWindow().getContent().add(windowPane);
            }
        });
    }
}
