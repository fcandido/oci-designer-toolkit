/*
** Copyright (c) 2020, 2021, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded Designer Ready Javascript');

/*
** Define variables for Artefact classes
 */
//let okitJsonModel = new OkitJson();
let okitOciConfig = undefined;
let okitOciData = undefined;
let okitSettings = undefined;
let okitGitConfig = undefined;
let okitAutoSave = undefined;
let okitRegions = undefined;
//let okitTabularView = new OkitTabularJsonView();
/*
** Ready function initiated on page load.
 */
$(document).ready(function() {
    /*
    ** Initialise OKIT Variables
     */
    okitSettings = new OkitSettings();
    okitOciConfig = new OkitOCIConfig(loadHeaderConfigDropDown);
    okitRegions = new OkitRegions(loadHeaderRegionsDropDown);
    okitOciData = new OkitOCIData(okitSettings.profile);
    okitGitConfig = new OkitGITConfig();
    okitJsonModel = new OkitJson();
    okitJsonView = new OkitDesignerJsonView(okitJsonModel);
    okitTabularView = new OkitTabularJsonView(okitJsonModel);
    console.info(okitJsonView);
    okitViews = [];
    for (let view_class of okitViewClasses) {
        console.warn('View Class:', view_class);
        okitViews.push(view_class.newView(okitJsonModel, okitOciData, resource_icons_svg))
    }
    for (let view of okitViews) {console.warn('Okit View:', view)}
    /*
    ** Configure Auto Save
     */
    okitAutoSave = new OkitAutoSave(hideRecoverMenuItem);
    // Test is Auto Save exists
    recovered_model = okitAutoSave.getOkitJsonModel();
    if (recovered_model) {$(jqId('file_recover_menu_item_li')).removeClass('hidden');}
    if (okitSettings && okitSettings.auto_save) {
        okitAutoSave.startAutoSave();
    }
    /*
    ** Add handler functionality
     */
    console.info('Adding Designer Handlers');

    // Left Bar & Panels
    // Palette
    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_palette_button')
        .attr('class', 'okit-bar-panel-displayed okit-pointer-cursor palette okit-console-left-bar-icon')
        .on('click', function () {
            /*
            $(jqId('designer_left_column')).toggleClass('okit-slide-hide-left');
            $(this).toggleClass('okit-bar-panel-displayed');
            setTimeout(redrawSVGCanvas, 260);
            */
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#icons_palette').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
            }
            checkLeftColumn();
        })
        .text('Palette');
    // Compartment Explorer
    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_explorer_button')
        .attr('class', 'okit-pointer-cursor explorer okit-console-left-bar-icon')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#explorer_panel').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                let okit_tree = new OkitJsonTreeView(okitJsonModel, 'explorer_panel');
                okit_tree.draw();
            } else {
                $('#explorer_panel').empty();
            }
            checkLeftColumn();
        })
        .text('Explorer');
    // Templates
    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_templates_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#templates_panel').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
            } else {
                // $('#templates_panel').empty();
            }
            checkLeftColumn();
        })
        .text('Templates');
    // Git
    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_git_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#git_panel').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
            } else {
                $('#git_panel').empty();
            }
            checkLeftColumn();
        })
        .text('Git Repositories');
    if (a2c_mode) {
        // Container
        d3.select(d3Id('console_left_bar')).append('label')
            .attr('id', 'toggle_local_button')
            .attr('class', 'okit-pointer-cursor')
            .on('click', function () {
                let open = $(this).hasClass('okit-bar-panel-displayed');
                slideLeftPanelsOffScreen();
                if (!open) {
                    $('#local_panel').removeClass('hidden');
                    $(this).addClass('okit-bar-panel-displayed');
                } else {
                    $('#local_panel').empty();
                }
                checkLeftColumn();
            })
            .text('Filesystem');
    }
    // Preferences
    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_preferences_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#preferences_panel').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                okitSettings.buildPanel('preferences_panel', true);
            } else {
                $('#preferences_panel').empty();
            }
            checkLeftColumn();
        })
        .text('Preferences');

    // Right Bar & Panels
    // Description
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_description_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(DESCRIPTION_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
            }
            checkRightColumn();
        })
        .text('Description');
    // Properties
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_properties_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            d3.event.preventDefault();
            d3.event.stopPropagation();
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(PROPERTIES_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
            }
            checkRightColumn();
        })
        .text('Properties');
    // Validation
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_validation_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(VALIDATION_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
                okitJsonModel.validate(displayValidationResults);
            }
            // Check to see if Right Column needs to be hidden
            checkRightColumn();
        })
        .text('Validate');

    // TODO: Uncomment when Value Proposition files have been created
    // Value Proposition
    /*
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_value_proposition_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(VALUE_PROPOSITION_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
            }
            // Check to see if Right Column needs to be hidden
            checkRightColumn();
        })
        .text('Value Proposition');
     */

    // Cost Estimate
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_cost_estimate_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(COST_ESTIMATE_PANEL)).empty();
                $(jqId(COST_ESTIMATE_PANEL)).text('Estimating...');
                $(jqId(COST_ESTIMATE_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
                okitJsonModel.estimateCost(displayPricingResults);
            }
            // Check to see if Right Column needs to be hidden
            checkRightColumn();
        })
        .text('Cost Estimate');

    if (developer_mode) {
        // OKIT Model Json
        d3.select(d3Id('console_right_bar')).append('label')
            .attr('id', 'toggle_source_button')
            .attr('class', 'okit-pointer-cursor')
            .on('click', function () {
                let open = $(this).hasClass('okit-bar-panel-displayed');
                slideRightPanelsOffScreen();
                if (!open) {
                    $(jqId(JSON_MODEL_PANEL)).removeClass('hidden');
                    $(this).addClass('okit-bar-panel-displayed');
                    $(jqId('right_column_dragbar')).removeClass('hidden');
                }
                // Check to see if Right Column needs to be hidden
                checkRightColumn();
                // Display Json
                displayOkitJson();
            })
            .text('Model');
        // OKIT View Json
        d3.select(d3Id('console_right_bar')).append('label')
            .attr('id', 'toggle_source_button')
            .attr('class', 'okit-pointer-cursor')
            .on('click', function () {
                let open = $(this).hasClass('okit-bar-panel-displayed');
                slideRightPanelsOffScreen();
                if (!open) {
                    $(jqId(JSON_VIEW_PANEL)).removeClass('hidden');
                    $(this).addClass('okit-bar-panel-displayed');
                    $(jqId('right_column_dragbar')).removeClass('hidden');
                }
                // Check to see if Right Column needs to be hidden
                checkRightColumn();
                // Display Json
                displayOkitJson();
            })
            .text('View');
        // OKIT Region Json
        d3.select(d3Id('console_right_bar')).append('label')
            .attr('id', 'toggle_source_button')
            .attr('class', 'okit-pointer-cursor')
            .on('click', function () {
                let open = $(this).hasClass('okit-bar-panel-displayed');
                slideRightPanelsOffScreen();
                if (!open) {
                    $(jqId(JSON_REGION_PANEL)).removeClass('hidden');
                    $(this).addClass('okit-bar-panel-displayed');
                    $(jqId('right_column_dragbar')).removeClass('hidden');
                }
                // Check to see if Right Column needs to be hidden
                checkRightColumn();
                // Display Json
                displayOkitJson();
            })
            .text('Regions Model');
    }

    console.info('Added Designer Handlers');

    /*
    ** Add Load File Handling
     */
    //document.getElementById('files').addEventListener('change', handleFileSelect, false);

    /*
    ** Load Empty Properties Sheet
     */
    $(jqId(PROPERTIES_PANEL)).load('propertysheets/empty.html');

    /*
    ** Add Drag Bar Functionality
     */
    $(jqId('right_column_dragbar')).mousedown(function(e) {
        e.preventDefault();
        right_drag_bar_start_x = e.pageX;
        dragging_right_drag_bar = true;
        let main_panel = $('.main');
        let ghostbar = $('<div>',
            {
                id: 'ghostbar',
                css: {
                    height: main_panel.outerHeight(),
                    top: main_panel.offset().top,
                    left: main_panel.offset().left
                },
                class: 'okit-vertical-ghost-bar'
            }).appendTo('body');

        $(document).mousemove(function(e) {
            ghostbar.css("left",e.pageX+2);
        });
    });

    /**/
    $(document).mouseup(function (e) {
        if (dragging_right_drag_bar) {
            let center_column_width = $(jqId('designer_center_column')).width();
            let right_column_width = $(jqId('designer_right_column')).width();
            let moved = right_drag_bar_start_x - e.pageX;
            let new_width = right_column_width + moved;
            // Remove Bar artefacts
            $(jqId('ghostbar')).remove();
            $(document).unbind('mousemove');
            dragging_right_drag_bar = false;
            // Set Width
            $(jqId('designer_right_column')).width(new_width);
            if (new_width > 250) {
                $(jqId('designer_right_column')).css('min-width', new_width);
            } else {
                $(jqId('designer_right_column')).css('min-width', 250);
            }
            setTimeout(redrawSVGCanvas, 260);
        }
    });
    /**/

    $(jqId('navigation_menu_button')).click(function(e) {
        slideRightPanelsOffScreen();
        $(jqId('designer_right_column')).addClass('okit-slide-hide-right');
    });



    setOCILink();

    /*
    ** Check Palette layout
     */

    if (!okitSettings.icons_only) {
        $(jqId("icons_and_text")).prop('checked', 'checked');
        $(jqId("icons_and_text")).click();
    }
    if (okitSettings.target) {
        $(jqId(`${okitSettings.target}_palette`)).prop('checked', 'checked');
        $(jqId(`${okitSettings.target}_palette`)).click();
    }


    /*
    ** Display New Canvas
     */
    newDiagram();
    redrawSVGCanvas();

    /*
    ** Add redraw on resize
     */
    // window.addEventListener('resize', () => { redrawSVGCanvas(true) });

    /*
    ** Load Side Panels in Background
    */

    loadTemplatePanel()
    loadGitPanel()
    loadFilesystemPanel()

});
