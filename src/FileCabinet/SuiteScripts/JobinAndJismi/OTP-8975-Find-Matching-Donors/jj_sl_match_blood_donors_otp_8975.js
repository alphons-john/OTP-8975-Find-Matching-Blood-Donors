/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/************************************************************************************************
***************
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
*Description:This script ensures that whenever a user selects a blood group in the form,the list of 
*eligible blood donors—filtered based on the selected blood group and the donor's last blood donation
* date—is displayed in the form.
*
** REVISION HISTORY
*
* @version 1.0 17-June-2025 : Created the initial build by JJ0403

*************************************************************************************************
***********************/
define(['N/log', 'N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (log, record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                let donorData;
                let donors = scriptContext.request.parameters.cust_bldgroup || '';
                const donorSearch = createDonorFilterForm (donors);
                donorSearch.clientScriptFileId = 1395;
                scriptContext.response.writePage(donorSearch);
                findDonorByBldgrp(donors)
            } catch (error) {
                log.error('Unexpected Error occurred', error);
            }
        }
        const createDonorFilterForm = (donors) => {
            try{
            const donorSearch = serverWidget.createForm({
                title: 'Search Donor'
            });
            donorSearch.addField({
                id: 'search_bldgrp',
                type: serverWidget.FieldType.SELECT,
                label: 'Blood Group',
                source:'customlist_jj_blood_grp'
            }).defaultValue = donors;
            donorData = donorSearch.addSublist({
                id: "sublistid",
                type: serverWidget.SublistType.INLINEEDITOR,
                label: "List of Donor Details",
            });
            donorData.addField({
                id: "sub_fisrt_name",
                type: serverWidget.FieldType.TEXT,
                label: "First name",
            });
            donorData.addField({
                id: "sub_last_name",
                type: serverWidget.FieldType.TEXT,
                label: "Last Name",
            });
            donorData.addField({
                id: "sub_phno",
                type: serverWidget.FieldType.TEXT,
                label: "Phone Number",
            });
            donorData.addField({
                id: "sub_gender",
                type: serverWidget.FieldType.TEXT,
                label: "Gender",
            });
            donorData.addField({
                id: "sub_bldgrp",
                type: serverWidget.FieldType.TEXT,
                label: "Blood Group",
            });
            donorData.addField({
                id: "sub_last_dondate",
                type: serverWidget.FieldType.TEXT,
                label: "Last Donation Date",
            });
            return donorSearch;
            } catch (error) {
                log.error('Unexpected Error occurred', error);
            }
        }

        const findDonorByBldgrp =(donors) =>{
        try{

        let filter = [["custrecord_jj_last_donation_date","before","threemonthsagotodate"]]
        if ( donors) {
            filter.push("AND", ["custrecord_jj_bld_group", "anyof", donors]);
        }

        let BloodDonorSearch = search.create({
            type: "customrecord_jj_blood_donor_detials",
            filters:filter,
            columns:
            [
                search.createColumn({name: "custrecord_jj_first_name", label: "First Name"}),
                search.createColumn({name: "custrecord_jj_last_name", label: "Last Name"}),
                search.createColumn({name: "custrecord_jj_phone_number", label: "Phone Number"}),
                search.createColumn({name: "custrecord_jj_gender", label: "Gender"}),
                search.createColumn({name: "custrecord_jj_bld_group", label: "Blood Group"}),
                search.createColumn({name: "custrecord_jj_last_donation_date", label: "Last Donation Date"})
            ]
            })
            let index = 0
            BloodDonorSearch.run().each((result) => {
                    let FirstName = result.getValue('custrecord_jj_first_name');
                    let LastName = result.getValue('custrecord_jj_last_name');
                    let Gender = result.getText('custrecord_jj_gender');
                    let PhoneNO = result.getValue('custrecord_jj_phone_number');
                    let BloodGroup = result.getText('custrecord_jj_bld_group');
                    let LastDonationDate = result.getValue('custrecord_jj_last_donation_date');   
                    
                    donorData.setSublistValue({
                        id: "sub_fisrt_name",
                        line: index,
                        value: FirstName,
                    });
                    donorData.setSublistValue({
                        id: "sub_last_name",
                        line: index,
                        value: LastName,
                    });
                    donorData.setSublistValue({
                        id: "sub_phno",
                        line: index,
                        value: PhoneNO,
                    });
                    donorData.setSublistValue({
                        id: "sub_bldgrp",
                        line: index,
                        value: BloodGroup,
                    });
                    donorData.setSublistValue({
                        id: "sub_last_dondate",
                        line: index,
                        value: LastDonationDate,
                    });
                    donorData.setSublistValue({
                        id: "sub_gender",
                        line: index,
                        value: Gender,
                    });
                    index++;
                    return true;
                });
            } catch (error) {
                log.error('Unexpected Error occurred', error);
            }
        }



        return {onRequest}

    });
