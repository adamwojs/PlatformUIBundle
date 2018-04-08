/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
/* global CKEDITOR */
YUI.add('ez-alloyeditor-plugin-focusblock', function (Y) {
    "use strict";

    var FOCUSED_CLASS = 'is-block-focused',
        TOOLBAR_FIXED_CLASS = 'ae-toolbar-styles-fixed';

    if (CKEDITOR.plugins.get('ezfocusblock')) {
        return;
    }

    function getScrollParent (editor) {
        var container = (new Y.Node(editor)).ancestor('.ez-main-content');
        if (container.getStyle('overflow') === 'auto') {
            return container.getDOMNode();
        }

        return window;
    }

    function isToolbarOutOfViewport (editor, toolbar) {
        var container = (new Y.Node(editor)).ancestor('.ez-main-content'),
            scrollY;

        if (container.getStyle('overflow') === 'auto') {
            scrollY = container.getDOMNode().scrollTop;
        } else {
            scrollY = window.scrollY;
        }

        return scrollY >= (editor.offsetTop - toolbar.offsetHeight) &&
               scrollY <= (editor.offsetTop + editor.offsetHeight + toolbar.offsetHeight);
    }

    function findFocusedBlock(editor) {
        return editor.element.findOne('.' + FOCUSED_CLASS);
    }

    function findNewFocusedBlock(elementPath) {
        var block = elementPath.block,
            elements = elementPath.elements;

        if (!block) {
            return null;
        }
        return elements[elements.length - 2];
    }

    function updateFocusedBlock(e) {
        var block = findNewFocusedBlock(e.data.path),
            oldBlock = findFocusedBlock(e.editor);

        if (oldBlock && (!block || block.$ !== oldBlock.$)) {
            oldBlock.removeClass(FOCUSED_CLASS);
        }
        if (block) {
            block.addClass(FOCUSED_CLASS);
        }
    }

    function clearFocusedBlock(e) {
        var oldBlock = findFocusedBlock(e.editor);

        if (oldBlock) {
            oldBlock.removeClass(FOCUSED_CLASS);
        }
    }

    function clearFocusedBlockFromData(e) {
        var doc = document.createDocumentFragment(),
            root, element, list, i;

        root = document.createElement('div');
        doc.appendChild(root);
        root.innerHTML = e.data.dataValue;
        list = root.querySelectorAll('.' + FOCUSED_CLASS);
        if (list.length) {
            for (i = 0; i != list.length; ++i) {
                element = list[i];

                element.classList.remove(FOCUSED_CLASS);
                // Workaround to https://jira.ez.no/browse/EZP-25028
                // RichText xhtml5edit parser does not accept empty class
                // attributes...
                // @TODO remove once fixed.
                if (!element.getAttribute('class')) {
                    element.removeAttribute('class');
                }
            }
            e.data.dataValue = root.innerHTML;
        }
    }

    var scrollHandler = function () {
        var toolbar = document.querySelector('.ae-toolbar-floating');
        if (!toolbar) {
             return ;
        }

        var editor = false;
        for (var editor_name in CKEDITOR.instances) {
            if (CKEDITOR.instances[editor_name].focusManager.hasFocus) {
                editor = CKEDITOR.instances[editor_name];
            }
        }

        if (!editor) {
            return ;
        }

        if (isToolbarOutOfViewport(editor.element.$, toolbar)) {
            toolbar.classList.add(TOOLBAR_FIXED_CLASS);
        } else {
            toolbar.classList.remove(TOOLBAR_FIXED_CLASS);
        }
    };

    /**
     * CKEditor plugin to add/remove the focused class on the block holding the
     * caret.
     *
     * @class ezfocusblock
     * @namespace CKEDITOR.plugins
     * @constructor
     */
    CKEDITOR.plugins.add('ezfocusblock', {
        init: function (editor) {
            editor.on('selectionChange', updateFocusedBlock);
            editor.on('blur', clearFocusedBlock);
            editor.on('getData', clearFocusedBlockFromData);

            getScrollParent(editor.element.$).addEventListener('scroll', scrollHandler);
        },
    });
});
