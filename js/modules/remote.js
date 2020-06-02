/*
 *  @module - $Remote
 *  @desc - Used to retrieve data from Salesforce via VF remoting, or fake data 
 *    when developing locally
 */
var $Remote = (function() {
  'use strict';
  var _remoteManager = null;
  try {
    _remoteManager = Visualforce.remoting.Manager;
  } catch(e) {};
  var _remoteActions = {};
  // fake data
  var _localData = {
    getObjects: '[{"name":"Account","label":"Account","external":null},{"name":"Contact","label":"Contact","external":null},{"name":"Lead","label":"Lead","external":null},{"name":"Opportunity","label":"Opportunity","external":null},{"name":"User","label":"User","external":null},{"name":"OpportunityLineItem","label":"Opportunity Product","external":null},{"name":"ApexClass","label":"Apex Class","external":null},{"name":"Case","label":"Case","external":null},{"name":"XeroInvoice","label":"Xero Invoice","external":"Xero"}]',
    getConfigurations: [{"Id":"001", "Name":"Sales Process","aptk_unravel__Target__c":"Account","aptk_unravel__Objects__c":"Account,Contact,Lead,Opportunity,User,OpportunityLineItem"},{"Id":"002", "Name":"Xero Integration","aptk_unravel__Target__c":"Account","aptk_unravel__Objects__c":"Account,Contact,Lead,Opportunity,User,OpportunityLineItem"}],
    saveConfiguration: 'ID',
    getObjectData: '[{"relationships":[{"relationship":"MasterRecord","target":"Account","name":"MasterRecordId","label":"Master Record ID"},{"relationship":"Parent","target":"Account","name":"ParentId","label":"Parent Account ID"},{"relationship":"Owner","target":"User","name":"OwnerId","label":"Owner ID"},{"relationship":"CreatedBy","target":"User","name":"CreatedById","label":"Created By ID"},{"relationship":"LastModifiedBy","target":"User","name":"LastModifiedById","label":"Last Modified By ID"}],"positioned":false,"name":"Account","label":"Account"},{"relationships":[{"relationship":"MasterRecord","target":"Contact","name":"MasterRecordId","label":"Master Record ID"},{"relationship":"Account","target":"Account","name":"AccountId","label":"Account ID"},{"relationship":"ReportsTo","target":"Contact","name":"ReportsToId","label":"Reports To ID"},{"relationship":"Owner","target":"User","name":"OwnerId","label":"Owner ID"},{"relationship":"CreatedBy","target":"User","name":"CreatedById","label":"Created By ID"},{"relationship":"LastModifiedBy","target":"User","name":"LastModifiedById","label":"Last Modified By ID"}],"positioned":false,"name":"Contact","label":"Contact"},{"relationships":[{"relationship":"Account","target":"Account","name":"AccountId","label":"Account ID"},{"relationship":"Owner","target":"User","name":"OwnerId","label":"Owner ID"},{"relationship":"CreatedBy","target":"User","name":"CreatedById","label":"Created By ID"},{"relationship":"LastModifiedBy","target":"User","name":"LastModifiedById","label":"Last Modified By ID"}],"positioned":false,"name":"Opportunity","label":"Opportunity"},{"relationships":[{"relationship":"MasterRecord","target":"Lead","name":"MasterRecordId","label":"Master Record ID"},{"relationship":"Owner","target":"User","name":"OwnerId","label":"Owner ID"},{"relationship":"ConvertedAccount","target":"Account","name":"ConvertedAccountId","label":"Converted Account ID"},{"relationship":"ConvertedContact","target":"Contact","name":"ConvertedContactId","label":"Converted Contact ID"},{"relationship":"ConvertedOpportunity","target":"Opportunity","name":"ConvertedOpportunityId","label":"Converted Opportunity ID"},{"relationship":"CreatedBy","target":"User","name":"CreatedById","label":"Created By ID"},{"relationship":"LastModifiedBy","target":"User","name":"LastModifiedById","label":"Last Modified By ID"}],"positioned":false,"name":"Lead","label":"Lead"},{"relationships":[{"relationship":"Manager","target":"User","name":"ManagerId","label":"Manager ID"},{"relationship":"CreatedBy","target":"User","name":"CreatedById","label":"Created By ID"},{"relationship":"LastModifiedBy","target":"User","name":"LastModifiedById","label":"Last Modified By ID"},{"relationship":"Contact","target":"Contact","name":"ContactId","label":"Contact ID"},{"relationship":"Account","target":"Account","name":"AccountId","label":"Account ID"}],"positioned":false,"name":"User","label":"User"}]'
  };
  return {


    /*
     *  @method - setActions()
     *  @desc - Set the actions available
     * 
     *  @param {Object} actions - object containing keys of actions from VF
     */
    setActions: function(actions) {
      _remoteActions = actions;
    },


    /*
     *  @method - runAction()
     *  @desc - Runs a given VF action, handling local dev use
     * 
     *  @param {String} action - action to call (name based on keys sent to the 
     *    setActions() method)
     *  @param {List} parameters - parameters to pass to VF remote method
     *  @param {Function} callback - callback to return result to
     *  @param {Boolean} escape - whether to turn off the VF method escaping
     *    the result (for JSON responses)
     * 
     *  @return {Callback} - returns the 'callback' parameter function with 
     *    the result as the only parameter
     */
    runAction: function(action, parameters, callback, escape) {
      parameters.unshift(_remoteActions[action]);
      parameters.push(function(result, event) {
        if (event.statusCode != 200) {
          return console.error(result, event);
        }
        return callback(result);
      });
      if (escape === true) parameters.push({escape: false});
      if (_remoteManager) {
        _remoteManager.invokeAction.apply(_remoteManager, parameters);
      } else {
        // local dev, no Visualforce module
        setTimeout(function() {
          return callback(_localData[action]);
        }, 500);
      }
    },
    // checks to see if we are local
    getManager: function() {
      return _remoteManager;
    }
  }
}());