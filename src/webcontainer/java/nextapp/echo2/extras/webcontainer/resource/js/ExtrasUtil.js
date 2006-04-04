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

ExtrasUtil = function() { };

ExtrasUtil.Arrays = function() { };

ExtrasUtil.Arrays.indexOf = function(array, element) {
    for (var i = 0; i < array.length; ++i) {
        if (array[i] == element) {
            return i;
        }
    }
    return -1;
}

ExtrasUtil.Arrays.insertElement = function(array, element, index) {
    if (index == 0) {
        array.unshift(element);
    } else if (index == -1 || index == array.length) {
        array.push(element);
    } else if (index > array.length) {
        throw "Array index of bounds: " + index + " (size=" + array.length + ")";
    } else {
        for (var i = array.length - 1; i >= index; --i) {
            array[i + 1] = array[i];
        }
        array[index] = element;
    }
};

ExtrasUtil.Arrays.removeElement = function(array, element) {
    var index = ExtrasUtil.Arrays.indexOf(array, element);
    if (index == -1) {
        return;
    }
    ExtrasUtil.Arrays.removeIndex(array, index);
};

ExtrasUtil.Arrays.removeIndex = function(array, index) {
    for (i = index; i < array.length - 1; ++i) {
        array[i] = array[i + 1];
    }
    array.length = array.length - 1;
};

ExtrasUtil.Color = function() { };

ExtrasUtil.Color.adjustIntensity = function(colorString, factor) {
    if (colorString.length != 7 || colorString.charAt(0) != "#") {
        throw "Invalid color: " + colorString;
    }
    var red = parseInt(colorString.substring(1, 3), 16);
    var green = parseInt(colorString.substring(3, 5), 16);
    var blue = parseInt(colorString.substring(5, 7), 16);
    red = parseInt(red * factor);
    green = parseInt(green * factor);
    blue = parseInt(blue * factor);
    red = red < 0x100 ? red : 0xff;
    green = green < 0x100 ? green : 0xff;
    blue = blue < 0x100 ? blue : 0xff;
    var out = "#";
    if (red < 0x10) {
        out += "0";
    }
    out += red.toString(16);
    if (green < 0x10) {
        out += "0";
    }
    out += green.toString(16);
    if (blue < 0x10) {
        out += "0";
    }
    out += blue.toString(16);
    return out;
};
