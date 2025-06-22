/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
*/
/**********************************************************************************************
*************** 
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
*Description:This script ensures that whenever a user selects a blood group in the form,the list 
*of eligible blood donors—filtered based on the selected blood group and the donor's last blood
* donation date—is displayed in the form.
*
** REVISION HISTORY
*
* @version 1.0 17-June-2025 : Created the initial build by JJ0403

***************************************************************************************************

*****************/
define(['N/record', 'N/url'],
    /**
     * @param {record} record
     * @param {url} url
     */
    function (record, url) {

        
    /**
      * Validation function to be executed when record is saved.
      *
      * @param {Object} scriptContext
      * @param {Record} scriptContext.currentRecord - Current form record
      * @returns {boolean} Return true if record is valid
      *
      * @since 2015.2
      */
        function saveRecord(scriptContext) {
            try {
                    let curRecord = scriptContext.currentRecord;
                    let custBloodGrp = curRecord.getValue('search_bldgrp');
                    let suiteletUrl = generateSuiteletUrl(custBloodGrp);

                    navigateToSuitelet(suiteletUrl);                
            } catch (error) {
                log.error('Unexpected Error occurred', error);
            }
        }

        /**
         * Generates the Suitelet URL for fetching matching blood donors.
         *
         * @param {string} custBloodGrp - Selected blood group value
         * @returns {string} - Constructed Suitelet URL
         */
        function generateSuiteletUrl(custBloodGrp) {
            try {
                return url.resolveScript({
                    scriptId: 'customscript_jj_sl_find_matching_donor',
                    deploymentId: 'customdeploy_jj_sl_find_matching_donor',
                    params: {
                        'cust_bldgroup': custBloodGrp
                    }
                });
                
            } catch (error) {
                log.error('Unexpected Error occurred', error);

            }
        }

        /**
         * Redirects to the Suitelet page.
         *
         * @param {string} suiteletUrl - URL to navigate to
         */
        function navigateToSuitelet(suiteletUrl) {
            try{
                window.onbeforeunload = null; 
                window.location.href = suiteletUrl;
            } catch (error) {
                log.error('Unexpected Error occurred', error);

            }
        }

        return {
            saveRecord: saveRecord,
        };
    });