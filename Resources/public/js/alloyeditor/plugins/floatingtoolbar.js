/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
/* global CKEDITOR */
YUI.add('ez-alloyeditor-plugin-floatingtoolbar', function (Y) {
    "use strict";

    console.log('ez-alloyeditor-plugin-floatingtoolbar');

    if (CKEDITOR.plugins.get('ezfloatingtoolbar')) {
        return;
    }

    var FLOATING_TOOLBAR_SELECTOR = '.ae-toolbar-floating',
        TOOLBAR_FIXED_CLASS = 'ae-toolbar-styles-fixed';

    function findScrollParent(editor) {
        var container = (new Y.Node(editor)).ancestor('.ez-main-content');
        if (container.getStyle('overflow') === 'auto') {
            return container.getDOMNode();
        }

        return window;
    }

    function findFocusedEditor() {
        for (var name in CKEDITOR.instances) {
            if (CKEDITOR.instances[name].focusManager.hasFocus) {
                return CKEDITOR.instances[name];
            }
        }

        return null;
    }

    function scrollHandler () {
        var toolbar = document.querySelector(FLOATING_TOOLBAR_SELECTOR);
        if (!toolbar) {
            return ;
        }

        var editor = findFocusedEditor();
        if (!editor) {
            return ;
        }

        toolbar.classList.toggle(TOOLBAR_FIXED_CLASS, editor.element.getClientRect().top < 0);
    }

    /**
     * CKEditor plugin to help the ...
     *
     * @class ezfloatingtoolbar
     * @namespace CKEDITOR.plugins
     * @constructor
     */
    CKEDITOR.plugins.add('ezfloatingtoolbar', {
        init: function (editor) {
            console.log("INIT!");
            findScrollParent(editor.element.$).addEventListener('scroll', scrollHandler);
        },
    });
});

