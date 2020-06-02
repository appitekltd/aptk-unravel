/*  
 *  @module - $Unravel
 *  @desc - Controls the core client-side application
 */
var $Unravel = new Vue({
  el: '#unravel',
  data: {
    loading: {
      objects: false,
      data: true,
      rendered: false,
      generic: false
    },
    popup: {
      selection: false,
      create: false,
      edit: false,
      error: false,
    },
    search: {
      all: '',
      selected: ''
    },
    error: '',
    name: '',
    ghost: false,
    rendered: false,
    configurations: [],
    configuration: {},
    allObjects: [],
    selectedObjects: [],
    objects: [],
    target: null,
    preview: null,
    selectedObject: {}
  },
  computed: {

    // gets all the relationships for the current highlighted 'preview'
    previewRelationships: function() {
      if (this.preview && this.preview.links) {
        var name = this.preview.name;
        return this.preview.links.filter(function(l) {
          return l.target != name;
        });
      } else {
        return [];
      }
    },

    // gets all the children for the current highlighted 'preview'
    previewChildren: function() {
      if (this.preview && this.preview.links) {
        var name = this.preview.name;
        return this.preview.links.filter(function(l) {
          return l.target == name;
        });
      } else {
        return [];
      }
    },

    // sorts the full object list alphabetically by API name
    sortedAllObjects: function() {
      var _this = this;
      var query = this.search.all.toLowerCase();
      return this.allObjects.sort(function(a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      }).filter(function(o) {
        return _this.selectedObjects.indexOf(o.name) == -1 && 
          o.name.toLowerCase().indexOf(query) != -1;
      })
    },

    // sorts the selected object list alphabetically by API name
    sortedSelectedObjects: function() {
      var query = this.search.selected.toLowerCase();
      return this.selectedObjects.sort(function(a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      }).filter(function(o) {
        return o.toLowerCase().indexOf(query) != -1;
      })
    },

    // sorts the general object list alphabetically by API name
    sortedObjects: function() { 
      return this.objects.sort(function(a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      })
    },

    // get all currently shown objects
    showObjects: function() {
      return this.objects.filter(function(o) {
        return o.show == true;
      });
    }

  },
  methods: {


    /*
     *  @method - selectObject()
     *  @desc - set an object as selected
     *  
     *  @param {Object} object - sObject to select 
     * 
     *  @return {null}
     */
    selectObject: function(object) {
      if ($Unravel.selectedObjects.indexOf(object.name) == -1) {
        $Unravel.selectedObjects.push(object.name);
      }
    },


    /*
     *  @method - removeObject()
     *  @desc - remove an object from the selected object list
     *  
     *  @param {Integer} index - index of the object to remove
     *  @param {String} name - api name of the object to remove
     * 
     *  @return {null}
     */
    removeObject: function(index, name) {
      $Unravel.selectedObjects.splice(index, 1);
      if ($Unravel.target == name) $Unravel.target = null;
    },


    /*
     *  @method - setGhost()
     *  @desc - Sets an object as 'ghosted' (partially visible)
     *  
     *  @param {Integer} index - index of the object to remove
     *  @param {String} name - api name of the object to remove
     * 
     *  @return {null}
     */
    setGhost: function(o) {
      o.ghost = !o.ghost;
      $Render.setObject(o, 'ghost'); // update object in renderer
    },


    /*
     *  @method - setAllGhost()
     *  @desc - Set all objects as 'ghosted' (partially visible)
     *  
     *  @param {Integer} index - index of the object to remove
     *  @param {String} name - api name of the object to remove
     * 
     *  @return {null}
     */
    setAllGhost: function() {
      var _this = this;
      this.ghost = !this.ghost;
      this.objects.forEach(function(o) {
        o.ghost = _this.ghost;
      });
      $Render.setObjects(this.objects, 'ghost'); // update objects in renderer
    },


    /*
     *  @method - setTarget()
     *  @desc - Set a target for the renderer to build a data model around
     *  
     *  @param {Object} object - sObject to set as target
     * 
     *  @return {null}
     */
    // set target for render
    setTarget: function(object) {
      $Unravel.objects.forEach(function(o) {
        o.target = object.name == o.name ? true : false;
      });
      this.target = object.name;
      $Unravel.renderScene(); // call to re-render scene
    },


    /*
     *  @method - setPreview()
     *  @desc - Set object as the preview
     *  
     *  @param {Object} object - sObject to set as preview
     * 
     *  @return {null}
     */
    setPreview: function(object) {
      $Unravel.objects.forEach(function(o) {
        o.selected = object == null ? false : o.name == object.name ? true : false;
      });
      $Unravel.preview = $Unravel.cloneObjects(object);
    },


    /*
     *  @method - renderScene()
     *  @desc - Resets the scene if not the first time, then calls the rendered
     *    to reset everything and render the scene again
     *  
     *  @param {Boolean} first - whether this is the first time rendering is
     *    called. If not then we reset the scene.
     * 
     *  @return {null}
     */
    renderScene: function(first) {
      if (!first) $Render.resetScene();
      $Render.initScene();
      $Mapper.createMap(this.target, this.cloneObjects(this.showObjects), 0, [], true);
      $Remote.runAction('updateCount', [], function(e) { console.log(e); });
    },


    /*
     *  @method - toggleObject()
     *  @desc - Toggle object as visible
     *  
     *  @param {Object} object - sOBject to set as shown
     * 
     *  @return {null}
     */
    toggleObject: function(object) {
      object.show = !object.show;
      $Unravel.renderScene();
    },


    /*
     *  @method - cloneObjects()
     *  @desc - 'Clones' a list of objects to remove references
     *  
     *  @param {List<Object>} objects - list of objects to 'clone'
     * 
     *  @return {List<Object>} - returns an unlinked set of objects
     */
    cloneObjects: function(objects) {
      if (objects == null) return null;
      return JSON.parse(JSON.stringify(objects));
    },


    /*
     *  @method - saveConfiguration()
     *  @desc - Save a new configuration record to Salesforce
     * 
     *  @return {null}
     */
    saveConfiguration: function() {
      $Unravel.loading.generic = true;
      var config = {
        Id: $Unravel.configuration.Id,
        Name: $Unravel.name,
        aptk_unravel__Target__c: $Unravel.target,
        aptk_unravel__Objects__c: $Unravel.selectedObjects.join(',')
      };
      if (config.Id == undefined || config.Id == null) delete config.Id;
      $Remote.runAction('saveConfiguration', [config], function(id) {
        config.Id = id;
        $Unravel.configurations.push(config);
        $Unravel.configuration = config;
        $Unravel.loadObjects();
      })
    },


    /*
     *  @method - loadObjects()
     *  @desc - Load all the object data from Salesforce (names + basic details)
     *  
     *  @param {Boolean} load - set true if we need to go and get all the 
     *    metadata for the objects straight away - delay if we are loading
     *    a config.
     * 
     *  @return {null}
     */
    loadObjects: function(load) {
      console.log('Loading data for ' + $Unravel.selectedObjects.join(','));
      $Unravel.loading.data = true;
      var target = $Unravel.target;

      $Remote.runAction('getObjectData', [$Unravel.selectedObjects], function(res) {
        console.log('Loaded data.');
        $Unravel.loading.rendered = true;
        var objects = JSON.parse(res);
        objects = objects.map(function(o) {
          var name = o.name;
          o.selected = o.name == target ? true : false;
          o.target = o.name == target ? true : false;
          // exceptions, so many objects don't have a color, woo!
          if (name == 'OpportunityLineItem') name = 'ProductItem';
          if (name.indexOf('ChangeEvent') != -1) name = 'Event';
          if (name.indexOf('AIInsight') != -1) name = 'Insight';
          if (name.indexOf('ContactRole') != -1) name = 'OpportunityContactRole';
          if (name.indexOf('Apex') == 1) name = 'Apex';
          // try lowercase or split camel case to form dash format
          // i.e. OpportunityContactRole becomes opportunity-contact-role
          var key = name.toLowerCase();
          var alt = name.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase();
          var color = $Colors[key] || $Colors[alt];
          if (color == undefined) {
            var keys = Object.keys($Colors);
            var random = Math.floor((Math.random() * keys.length) + 1);
            color = $Colors[keys[random]];
          }
          o.color = color;
          o.show = true;
          o.ghost = false;
          return o;
        });
        $Unravel.objects = objects;
        $Unravel.renderScene(true);
        $Unravel.loading.data = false;
        $Unravel.popup.create = false;
        $Unravel.popup.edit = false;
        $Unravel.loading.generic = false;
        $Unravel.popup.selection = false;
        if (load) $Unravel.loadMetadata();
        Vue.nextTick(function() {
          $Unravel.rendered = true;
        })
      }, true)
    },


    /*
     *  @method - LoadMetadata()
     *  @desc - Get all the actual metadata for the objects in Salesforce
     *  
     *  @param {Boolean} force - use to specify if we need to show the 
     *    'create' popup when finished, otherwise load in the background
     * 
     *  @return {null}
     */
    loadMetadata: function(force) {
      if ($Unravel.allObjects.length == 0) {
        $Unravel.loading.objects = true;
        $Remote.runAction('getObjects', [], function(res) {
          $Unravel.allObjects = JSON.parse(res);
          $Unravel.loading.objects = false;
          if ($Unravel.loading.rendered == false || force == true) {
            $Unravel.popup.create = true;
          }
        }, true);
      } else {
        if ($Unravel.loading.rendered == false || force == true) {
          $Unravel.popup.create = true;
        }
      }
    },


    /*
     *  @method - loadConfiguration()
     *  @desc - Load a specific configuration and the objects as part of it
     *  
     *  @param {aptk_unravel__Unravel_Configuration__c} config - config record
     *    from Salesforce
     * 
     *  @return {null}
     */
    loadConfiguration: function(config) {
      $Unravel.loading.generic = true;
      $Unravel.configuration = config;
      $Unravel.selectedObjects = config.aptk_unravel__Objects__c.split(',');
      $Unravel.target = config.aptk_unravel__Target__c;
      $Unravel.loadObjects(true);
    },


    /*
     *  @method - editConfiguration()
     *  @desc - Open the 'edit' mode for a configuration record
     * 
     *  @return {null}
     */
    editConfiguration: function() {
      $Unravel.name = $Unravel.configuration.Name || '';
      $Unravel.target = $Unravel.configuration.aptk_unravel__Target__c || null;
      $Unravel.selectedObjects = $Unravel.configuration.aptk_unravel__Objects__c ? 
      $Unravel.configuration.aptk_unravel__Objects__c.split(',') : [];
      $Unravel.popup.create = true;
      $Unravel.popup.edit = true;
    },


    /*
     *  @method - deleteConfiguration()
     *  @desc - Delete a given configuration from Salesforce
     *  
     *  @param {aptk_unravel__Unravel_Configuration__c} c - config to delete
     *  @param {Integer} i - index of config record in list
     * 
     *  @return {null}
     */
    deleteConfiguration: function(c, i) {
      $Unravel.loading.generic = true;
      $Remote.runAction('deleteConfiguration', [c.Id], function(res) { 
        $Unravel.configurations.splice(i, 1);
        $Unravel.loading.generic = false;
      })
    },


    /*
     *  @method - closePopups()
     *  @desc - Close all popups
     * 
     *  @return {null}
     */
    closePopups: function() {
      $Unravel.loading.data = false;
      $Unravel.popup.create = false;
      $Unravel.popup.edit = false;
      $Unravel.loading.generic = false;
      $Unravel.popup.selection = false;
    }

  },
  mounted: function() {
    Vue.nextTick(function() {

      // if we don't have the permission set throw an error
      if ($Permission == 'false') {
        $Unravel.closePopups();
        $Unravel.popup.error = true;
        $Unravel.error = 'You need to assign yourself the "Unravel User" Permission Set to use the Unraveller.';
      } else {
        // otherwise get all our configuration records
        $Remote.runAction('getConfigurations', [], function(res) {
          $Unravel.configurations = res;
          $Unravel.loading.data = false;
          $Unravel.popup.selection = true;
        }, true);

      }

    })
  }
});