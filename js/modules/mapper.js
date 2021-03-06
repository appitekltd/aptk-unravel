/*
 *  @module - $Mapper
 *  @desc - A horrific module used to create the 3D map for a given 
 *    set of related or unrelated objects
 */
var $Mapper = (function() {
  'use strict';

  return {


    /*
     *  @method - createMap()
     *  @desc - Creates a map of all the objects and their links
     * 
     *  @param {String} target - target object to base the model around
     *  @param {List<Object>} objects - sObject list of objects in the model
     *  @param {Integer} offset - offset for recursion
     *  @param {List<Object>} all - all objects for recursion
     *  @param {Boolean} first - whether this is the first call for recursion
     * 
     *  @return {null}
     */
    createMap(target, objects, offset, all, first) {
      // get the target object from the list of object
      var targetObject = objects.filter(function(o) { return o.name == target; })[0];
      targetObject.positioned = true;
      // create a new sobject
      var targetSObject = new $Factory.sObject(offset * 16, first ? 8 : 0, 0, targetObject);
      // get the related children and create new sobjects for them
      var childObjects = $Mapper.findChildren(target, objects);
      // this also gets any children of those children etc
      var childSObjects = $Mapper.handleChildren(target, childObjects, objects, [offset * 16, 0, 0]);
      // for each sobject render the object on screen
      var allSObjects = [targetSObject].concat(childSObjects);
      allSObjects.forEach(function(o) {
        var ref = $Render.createObject(o.x, o.y, o.z, o);
        o.ref = ref;
        ref._o = o;
        all.push(o);
      });
      // for each relationship we need to render the links
      $Mapper.setLinks(allSObjects, objects, offset, all);
      // what about the objects that were not children?
      // we still need to render them but just away from the target
      setTimeout(function() {
        var leftovers = objects.filter(function(o) {
          return o.positioned != true;
        }).sort(function(a, b) {
          if (a.name > b.name) return -1;
          if (a.name < b.name) return 1;
          return 0;
        });
        if (leftovers.length > 0) {
          var newTarget = leftovers[0].name;
          $Mapper.createMap(newTarget, leftovers, offset+1, all, false);
        } else {
          // final pass
          $Mapper.setLinks(all, all, 0, all, true);
        }
      }, 100);
    },


    /*
     *  @method - setLinks()
     *  @desc - Sets all the links on the objects
     * 
     *  @param {List<Objects>} allObjects - all objects in the model
     *  @param {List<Objects>} objects - all objects to set links for
     *  @param {Integer} offset - offset for recursion
     *  @param {List<Object>} all - all objects for recursion
     *  @param {Boolean} final - @DEPRECATED
     * 
     *  @return {null}
     */
    setLinks: function(allObjects, objects, offset, all, final) {
      var top = 8;
      allObjects.forEach(function(o) {
        o.relationships.forEach(function(l) {
          if (l.set == undefined) {
          // get the target object in the reference
          var t = allObjects.filter(function(oo) { return oo.name == l.target; })[0];
          // if object hasn't been touched yet we need to put it along the top
          if (t == undefined) {
            var match = objects.filter(function(x) { return x.name == l.target; })[0];
            if (match != undefined && match.positioned == false) {
              match.positioned = true;
              t = new $Factory.sObject(offset * 16, 0, top, match);
              var ref = $Render.createObject(offset * 16, 0, top, match);
              t.ref = ref;
              ref._o = t;
              allObjects.push(t);
              all.push(t);
              top += 8;
            }
          }

          // if no target found
          if (t != undefined) {
            // get the closest set of nodes for the two objects
            var closest = $Mapper.getNodes(t, o);
            // create a vector link between the two nodes then create the link bezier
            var link = $Mapper.getLink(closest[0], closest[1]);
            if (link != null) {
              l.set = true;
              var ref = $Render.createLink(link);
              // add link to the object links list
              var lobj = new $Factory.Link(l, ref, o);
              ref._l = lobj;
              o.links.push(lobj);
              t.links.push(lobj);
            }
          }

          }
        });
      });
    },


    /*
     *  @method - getLink()
     *  @desc - Gets set of 4 vectors to use as a bezier curve for a given link
     * 
     *  @param {List} start - start vector [x,y]
     *  @param {List} end - end vector [x,y]
     * 
     *  @return {List} - returns 4 vectors that plot a bezier curve
     */
    getLink: function(start, end) {

      if (start == undefined || end == undefined) return null;

      // get the y difference between the start and end vectors
      var y = (end[1] - start[1]) / 2;

      // create two more points between the y diff
      var join1 = [start[0], start[1] + y, start[2]];
      var join2 = [end[0], end[1] - y, end[2]];

      // return new 4 point vector for bezier curve
      return [start, join1, join2, end];

    },
    

    /*
     *  @method - findChildren()
     *  @desc - Finds any objects that have at least one link to the target
     * 
     *  @param {String} target - target object API name
     *  @param {List<Object>} objects - objects to search through
     * 
     *  @return {List<Object>} - returns objects with at least one relationship 
     *    that targets the given target object
     */
    findChildren: function(target, objects) {

      // return all the objects that have at least 1 link to the target
      return objects.filter(function(o) {
        var links = o.relationships.filter(function(r) { return r.target == target});
        return links.length > 0 ? true : false;
      });

    },


    /*
     *  @method - handleChildren()
     *  @desc - Sets the position of children based on the parent
     * 
     *  @param {Object} parent - @DEPRECATEd
     *  @param {List<Object>} children - children to position
     *  @param {List<Object>} objects - all objects in the model
     *  @param {List} coords - co-ordinates of the parent [x,y]
     * 
     *  @return {List<Object>} - returns the newly positioned children objects
     */
    handleChildren: function(parent, children, objects, coords) {
      // get total number of child
      var totalChildObjects = children.length;
      var childSObjects = [];
      // get hardcoded pyramid positions for layouts
      var positions = [];
      var nsize = 1 * -8;
      var psize = 1 * 8;
      var nsize2 = 1 * -16;
      var psize2 = 1 * 16;
      // set position based on number of children
      if (totalChildObjects == 1) {
        /*
         *  0, -8, 0
         */
        positions = [
          [coords[0] + 0, coords[1] + nsize, coords[2] + 0]
        ];
      } else if (totalChildObjects > 1 && totalChildObjects <=4) {
        /*
         *    -8,-8, 8        -8,-8,-8    
         *
         *                X
         *
         *     8,-8, 8         8,-8,-8
         */
        positions = [
          [coords[0] + nsize, coords[1] + nsize, coords[2] + psize],
          [coords[0] + nsize, coords[1] + nsize, coords[2] + nsize],
          [coords[0] + psize, coords[1] + nsize, coords[2] + psize],
          [coords[0] + psize, coords[1] + nsize, coords[2] + nsize]
        ];
      } else if (totalChildObjects > 4 && totalChildObjects <= 9) {
        /*
         *    -16,-8, 16        -16,-8,0        -16,-8,-16    
         *
         *      0,-8,16            X            0,-8,-16
         *
         *     16,-8, 16        16,-8,0         16,-8,-16
         */
        positions = [
          [coords[0] + nsize2, coords[1] + nsize, coords[2] + psize2],
          [coords[0] + nsize2, coords[1] + nsize, coords[2] + 0],
          [coords[0] + nsize2, coords[1] + nsize, coords[2] + nsize2],
          [coords[0] + 0, coords[1] + nsize, coords[2] + psize2],
          [coords[0] + 0, coords[1] + nsize, coords[2] + 0],
          [coords[0] + 0, coords[1] + nsize, coords[2] + nsize2],
          [coords[0] + psize2, coords[1] + nsize, coords[2] + psize2],
          [coords[0] + psize2, coords[1] + nsize, coords[2] + 0],
          [coords[0] + psize2, coords[1] + nsize, coords[2] + nsize2],
        ];
      }
      // filter out by children not already position, and then position them
      children.filter(function(c) {
        return c.positioned == false;
      }).map(function(c) {
        c.positioned = true;
        return c;
      }).forEach(function(c, i) {
        var pos = positions[i];
        var obj = new $Factory.sObject(pos[0], pos[1], pos[2], c);
        childSObjects.push(obj);
        // repeat for any children of this child
        var childObjects = $Mapper.findChildren(obj.name, objects);
        childSObjects = childSObjects.concat($Mapper.handleChildren(obj, childObjects, objects, [pos[0], pos[1], pos[2]]));
      });
      // return all the finished child sobjects
      return childSObjects;
    },


    /*
     *  @method - getNodes()
     *  @desc - Based on a start and end vector we find out the closest 'faces' 
     *    to use for each cube that is rendered on those vectors
     * 
     *  @param {Object} start - 3D vector representing the 'start' {x:0,y:0,z:0}
     *  @param {Object} end - 3D vector representing the 'end' {x:0,y:0,z:0}
     * 
     *  @return {List} - returns start and end nodes [start, end], where 
     *    a node is a 3D vector object {x:0,y:0,z:0}
     */  
    getNodes: function(start, end) {
      if (start.x == end.x && start.y == end.y) {
        if (start.z > end.z) {
          start.nodeUsage.zBottomO = true;
          end.nodeUsage.zTopI = true;
          return [start.nodes.zBottomO, end.nodes.zTopI];
        } else {
          start.nodeUsage.zTopO = true;
          end.nodeUsage.zBottomI = true;
          return [start.nodes.zTopO, end.nodes.zBottomI];
        }
      } else if (start.x == end.x && start.z == end.z) {
        if (start.y > end.y) {
          start.nodeUsage.yBottomO = true;
          end.nodeUsage.yTopI = true;
          return [start.nodes.yBottomO, end.nodes.yTopI];
        } else {
          start.nodeUsage.yTopO = true;
          end.nodeUsage.yBottomI = true;
          return [start.nodes.yTopO, end.nodes.yBottomI];
        }
      } else if (start.y == end.y && start.z == end.z) {
        if (start.x > end.x) {
          start.nodeUsage.xBottomO = true;
          end.nodeUsage.xTopI = true;
          return [start.nodes.xBottom0, end.nodes.xTopI];
        } else {
          start.nodeUsage.xTopO = true;
          end.nodeUsage.xBottomI = true;
          return [start.nodes.xTop0, end.nodes.xBottomI];
        }
      } else if (start.y == end.y) {
        if (start.x > end.x) {
          start.nodeUsage.xBottomO = true;
          end.nodeUsage.xTopI = true;
          return [start.nodes.xBottomO, end.nodes.xTopI];
        } else {
          start.nodeUsage.xTopO = true;
          end.nodeUsage.xBottomI = true;
          return [start.nodes.xTopO, end.nodes.xBottomI];
        }
      } else {
        if (start.y > end.y) {
          start.nodeUsage.yBottomO = true;
          end.nodeUsage.yTopI = true;
          return [start.nodes.yBottomO, end.nodes.yTopI];
        } else {
          start.nodeUsage.yTopO = true;
          end.nodeUsage.yBottomI = true;
          return [start.nodes.yTopO, end.nodes.yBottomI];
        }
      }
    }
    

  }
}());