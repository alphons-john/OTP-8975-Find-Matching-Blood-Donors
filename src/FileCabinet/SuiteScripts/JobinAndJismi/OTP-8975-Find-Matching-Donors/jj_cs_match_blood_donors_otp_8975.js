/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/url'],
/**
 * @param{record} record
 * @param{url} url
 */
function(record, url) {
    
   
    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        console.log("fieldChanged triggered")
        let fieldId = scriptContext.fieldId;
        let curRecord=scriptContext.currentRecord;
        if(fieldId === 'search_bldgrp'){
                let custBloodGrp =curRecord.getValue('search_bldgrp');

                let suiteletUrl = url.resolveScript({
                scriptId: 'customscript_jj_sl_find_matching_donor',
                deploymentId: 'customdeploy_jj_sl_find_matching_donor',
                    params:{
                    'cust_bldgroup':custBloodGrp,
                }
                });
                   window.location.href = suiteletUrl; 

    }

    }

    

    return {
        fieldChanged: fieldChanged,
        
    };
    
});
