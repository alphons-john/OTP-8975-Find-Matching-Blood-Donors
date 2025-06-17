/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 /**********************************************************************************************
* 
*
*
*
${OTP-8975}:{Search through the database to find the matching blood donors}
*
*
**************************************************************************************************
*
*Author:Jobin and Jismi IT Services
*
*Date Created:17-June-2025
*
*Description:This script ensures that whenever a user selects a blood group in the form,the list of eligible blood donors—filtered based on the 
*selected blood group and the donor's last blood donation date—is displayed in the form.
*
** REVISION HISTORY
 *
* @version 1.0 17-June-2025 : Created the initial build by JJ0403
*/
define(['N/record', 'N/url'],
    /**
     * @param {record} record
     * @param {url} url
     */
    function (record, url) {

        /**
         * Handles the field change event.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Column number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            console.log("fieldChanged triggered");

            let fieldId = scriptContext.fieldId;
            let curRecord = scriptContext.currentRecord;

            if (fieldId === 'search_bldgrp') {
                let custBloodGrp = curRecord.getValue('search_bldgrp');
                let suiteletUrl = generateSuiteletUrl(custBloodGrp);

                navigateToSuitelet(suiteletUrl);
            }
        }

        /**
         * Generates the Suitelet URL for fetching matching blood donors.
         *
         * @param {string} custBloodGrp - Selected blood group value
         * @returns {string} - Constructed Suitelet URL
         */
        function generateSuiteletUrl(custBloodGrp) {
            return url.resolveScript({
                scriptId: 'customscript_jj_sl_find_matching_donor',
                deploymentId: 'customdeploy_jj_sl_find_matching_donor',
                params: {
                    'cust_bldgroup': custBloodGrp
                }
            });
        }

        /**
         * Redirects to the Suitelet page.
         *
         * @param {string} suiteletUrl - URL to navigate to
         */
        function navigateToSuitelet(suiteletUrl) {
            window.location.href = suiteletUrl;
        }

        return {
            fieldChanged: fieldChanged
        };
    });