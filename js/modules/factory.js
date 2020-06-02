/*
 *  @module - $Factory
 *  @desc - Used to create object classes
 */
var $Factory = (function() {
  'use strict';
  return {


    /*
     *  @class - sObject
     *  @desc - Represents an sObject in the 3D space
     */
    sObject: function(x, y, z, object) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.selected = false;
    
      // size is always 5x5x5
      // each face has a connector
      // sides are for general lookups
      // top and bottom are for parent / child
      var offset = 2;
      var spacing = 1;
      this.nodes = {
        yTopI: [x, y+offset, z + spacing],
        yTopO: [x, y+offset, z - spacing],
        yBottomI: [x, y-offset, z + spacing],
        yBottomO: [x, y-offset, z - spacing],
        xTopI: [x+offset, y, z - spacing],
        xTopO: [x+offset, y, z + spacing],
        xBottomI: [x-offset, y, z + spacing],
        xBottomO: [x-offset, y, z - spacing],
        zTopI: [x + spacing, y, z+offset],
        zTopO: [x - spacing, y, z+offset],
        zBottomI: [x - spacing, y, z-offset],
        zBottomO: [x + spacing, y, z-offset]
      }
    
      this.nodeUsage = {
        yTopI: false,
        yTopO: false,
        yBottomI: false,
        yBottomO: false,
        xTopI: false,
        xTopO: false,
        xBottomI: false,
        xBottomO: false,
        zTopI: false,
        zTopO: false,
        zBottomI: false,
        zBottomO: false
      }
    
      for (var key in object) {
        this[key] = object[key];
      }
      this.ref = null;
    
      this.links = [];
    
    },


    /*
     *  @class - Link
     *  @desc - Represents a link between sObjects
     */
    Link: function(link, ref, o) {
      this.label = link.label;
      this.name = link.name;
      this.target = link.target;
      this.object = o.name;
      this.ref = ref;
      this.selected = false;
    }


  }
}());