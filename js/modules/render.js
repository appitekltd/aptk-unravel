/*
 *  @module - $Render
 *  @desc - Used to actuall render the objects in the 3D space, using the 
 *    three.js framework
 */
var $Render = (function() {
  'use strict';
  // set global render vars
  var MOUSE_X = -99999;
  var MOUSE_Y = -99999;
  var RENDERER = {};
  var CAMERA = {};
  var SCENE = {};
  var OBJECTS = [];
  var LABELS = [];
  var INTERSECTED = null;
  var RENDER = false;
  // watch mouse position
  document.addEventListener('mousemove', function(ev) {
    MOUSE_X = (event.clientX / window.innerWidth) * 2 - 1;
    MOUSE_Y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  return {


    /*
     *  @method - createLight()
     *  @desc - Creates a light source and adds it to the scene
     * 
     *  @param {String} type - type of light, either 'ambient' or 'point'
     *  @param {String} color - hex color of light (only for 'point' type light)
     *  @param {Object} position - 3D vector position [x,y,z]
     * 
     *  @return {null}
     */
    createLight: function(type, color, position) {
      // create light based on type
      var light;
      if (type == 'ambient') {
        light = new THREE.AmbientLight('#404040', 4);
      } else {
        light = new THREE.PointLight(color, 1, 100);
        // point lights need position
        light.position.set(position[0], position[1], position[2]);
      }
      // add to scene
      SCENE.add(light);
    },


    /*
     *  @method - createObject()
     *  @desc - Creates an object as a cube, with an outline, plus a label of 
     *    the object name. All 3 objects are then added to the scene
     * 
     *  @param {Integer} x - x position
     *  @param {Integer} y - y position
     *  @param {Integer} z - z position
     *  @param {Object} obj - sObject object from $Factory
     *  
     *  @return {Object} - returns the three.js geometry for the cube
     */
    createObject: function(x, y, z, obj) {
      // create box
      var geometry = new THREE.BoxGeometry( 4, 4, 4 );
      geometry.center();
      var opacity = obj.ghost == true ? 0.25 : 1;
      var material = new THREE.MeshLambertMaterial( {color: obj.color, opacity: opacity, transparent: true });
      var cube = new THREE.Mesh( geometry, material );
      // create outlines
      var edges = new THREE.EdgesGeometry( geometry );
      var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: '#0c2242' } ) );
      // set positions and add to object list
      cube.position.set(x, y, z);
      line.position.set(x, y, z);
      OBJECTS.push(cube);
      var font = $Remote.getManager() == null ? 'font.json' : $Globals.font;
      // load fonts for labels
      new THREE.FontLoader().load(font, function (font) {
        $Render.createLabel(x, y, z, font, obj.label);
      });
      // add to scene and return reference to cube mesh
      SCENE.add(line);
      SCENE.add(cube);
      return cube;
    },


    /*
     *  @method - createLink()
     *  @desc - Creates a 'link' between objects using a given bezier curve and 
     *    adds it to the scene 
     * 
     *  @param {List} points - 4 vector points for the curve in the form of:
     *    [[x,y,z], [x,y,z], [x,y,z], [x,y,z]]
     *  
     *  @return {Object} - returns the three.js geometry for the line
     */
    createLink: function(points) {
      //$Render.createNode(points[0], 'I');
      var node = $Render.createNode(points[3], 'O');
      // create curve based on points array
      var curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(points[0][0], points[0][1], points[0][2]),
        new THREE.Vector3(points[1][0], points[1][1], points[1][2]),
        new THREE.Vector3(points[2][0], points[2][1], points[2][2]),
        new THREE.Vector3(points[3][0], points[3][1], points[3][2])
      );
      // create bezier curve and add to object list
      var points = curve.getPoints( 50 );
      var material = new THREE.LineBasicMaterial( { color: 0x3B5F96 } );
      var geometry = new THREE.BufferGeometry().setFromPoints( points );
      var line = new THREE.Line( geometry, material );
      line._node = node;
      OBJECTS.push(line);
      // add to scene and return reference to line mesh
      SCENE.add(line);
      return line;
    },


    /*
     *  @method - createLink()
     *  @desc - Creates a 'node' on an object to act as the anchor for 
     *    links between objects, and adds it to the scene
     * 
     *  @param {Object} points - 3D vector position [x,y,z]
     *  @param {String} type - @DEPRECATED
     *  
     *  @return {Object} - returns the three.js geometry for the node
     */
    createNode: function(points, type) {
      // create node
      //var color = type == 'I' ? '#007add' : '#ac0000';
      var node = new THREE.Mesh(new THREE.SphereGeometry( 0.5, 2, 2 ), new THREE.MeshBasicMaterial({color: 0x3B5F96 }));
      node.position.set(points[0], points[1], points[2]);
      // add to scene and return reference
      SCENE.add(node);
      return node;
    },


     /*
     *  @method - createLabel()
     *  @desc - Creates a text label for an object and adds it to the scene
     * 
     *  @param {Integer} x - x position
     *  @param {Integer} y - y position
     *  @param {Integer} z - z position
     *  @param {String} font - font to use
     *  @param {String} label - text for the label
     *  
     *  @return {null}
     */
    createLabel: function(x, y, z, font, label) {
      // create label
      var geometry = new THREE.TextGeometry(label, { font: font, size: 0.5, height: 0 });
      geometry.center();
      var material = new THREE.MeshBasicMaterial({color: '#ffffff' });
      var label =  new THREE.Mesh(geometry, material);
      // set positions and add to label list
      label.position.set(x, y + 3, z);
      LABELS.push(label);
      // add to scene
      SCENE.add(label);
    },


    /*
     *  @method - resetScene()
     *  @desc - Resets the scene by disposing of all three js objects and 
     *   resetting the global vars to remove all references
     * 
     *  @param {Integer} x - x position
     *  @param {Integer} y - y position
     *  @param {Integer} z - z position
     *  @param {String} font - font to use
     *  @param {String} label - text for the label
     *  
     *  @return {null}
     */
    resetScene: function() {
      // dispose of renderer
      RENDERER.dispose();
      // helper function to clean a given material
      var cleanMaterial = function(material) {
        material.dispose();
        for (var key of Object.keys(material)) {
          var value = material[key];
          if (value && typeof value === 'object' && 'minFilter' in value) {
            value.dispose();
          }
        }
      }
      // go through every material and clean it
      SCENE.traverse(function(object) {
        try {
          if (!object.isMesh) return object.geometry.dispose()
          if (object.material.isMaterial) {
            cleanMaterial(object.material);
          } else {
            for (var material of object.material) cleanMaterial(material);
          }
        } catch(e) {
          //console.error(e, object);
        }
      })
      // reset globals
      SCENE = {};
      RENDERER = {};
      SCENE = {};
      CAMERA = {};
      OBJECTS = [];
      LABELS = [];
      INTERSECTED = null;
    },


    /*
     *  @method - setObject()
     *  @desc - Sets a value on a given object, used to translate UI changes
     *    to actual render changes
     * 
     *  @param {Object} object - object to use
     *  @param {String} key - key to copy from the given object
     *  
     *  @return {null}
     */
    setObject: function(object, key) {
      // get the object in the scene that matches the given object
      var match = OBJECTS.filter(function(o) {
        return o._o != undefined && o._o.name == object.name;
      })[0];
      if (match) {
        // change the key value on the scene object
        // changes will get made in the next render tick
        match._o[key] = object[key];
      }
    },


    /*
     *  @method - setObjects()
     *  @desc - Set all objects as ghosted
     * 
     *  @param {List<Object>} objects - objects to render as ghosted
     *  @param {String} key - @DEPRECATED
     *  
     *  @return {null}
     */
    setObjects: function(objects, key) {
      objects.forEach(function(obj) {
        $Render.setObject(obj, 'ghost');
      })
    },


    /*
     *  @method - initScene()
     *  @desc - Start the scene and animate
     *  
     *  @return {null}
     */
    initScene: function() {
      // get the mount details
      var mount = document.getElementById('unravel-canvas');
      mount.innerHTML = '';
      var width = mount.clientWidth;
      var height = mount.clientHeight;
      // start renderer
      RENDERER =  new THREE.WebGLRenderer({
        antialias: true
      });
      RENDERER.setPixelRatio(window.devicePixelRatio);
      RENDERER.setSize(width, height);
      document.body.appendChild(RENDERER.domElement);
      // create camera
      CAMERA = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      CAMERA.position.set(50, 10, 70);
      CAMERA.lookAt(0, 0, 0);
      var ORBIT = new THREE.OrbitControls(CAMERA, RENDERER.domElement);
      // start scene
      SCENE = new THREE.Scene();
      SCENE.background = new THREE.Color( '#1f3f6f' ); // #1f3f6f
      // add lightning
      $Render.createLight('ambient');
      $Render.createLight('point', '#ff00ff', [50, 50, 0]);
      $Render.createLight('point', '#00ffff', [0, 50, 50]);
      // begin rendering (if not already)
      if (RENDER == false) {
        $Render.animateScene();
      }
      // set default rotation of camera
      ORBIT.rotateInitial(90 * Math.PI / 180, 5 * Math.PI / 180);
    },


    /*
     *  @method - renderScene()
     *  @desc - Render the scene and orient the labels
     *  
     *  @return {null}
     */
    renderScene: function() {
      // re render scene
      RENDERER.render(SCENE, CAMERA);
      // ensure labels are looking at the camera
      LABELS.forEach(function(label) {
        label.lookAt(CAMERA.position);
      });
    },


    /*
     *  @method - updateScene()
     *  @desc - Check where the mouse is and highlight any objects in the 
     *    path projected from the user to the mouse in the 3D space
     *  
     *  @return {null}
     */
    updateScene: function() {
      // create a ray based on camera to mouse position
      var vector = new THREE.Vector3(MOUSE_X, MOUSE_Y, 1);
      vector.unproject(CAMERA);
      var ray = new THREE.Raycaster(CAMERA.position, vector.sub(CAMERA.position).normalize());
      // get all the objects / meshes that overlap to be 'highlighted'
      var intersects = ray.intersectObjects(OBJECTS, true);
      INTERSECTED = intersects.length > 0 ? intersects[0] : null;
      // reset all others
      $Render.resetAll();
      // if we have intersections highlight the object and any related links
      if (intersects.length > 0) {
        OBJECTS.forEach(function(o) {
          o = o.object ? o.object : o;
          var opacity = o._o ? o._o.ghost == true ? 0.25 : 0.5 : 0.5;
          o.material.setValues({opacity: opacity});
        })
        var o = INTERSECTED.object ? INTERSECTED.object : INTERSECTED;
        o.material.color.set('#FFFFFF');
        o.material.setValues({opacity: 1});
        if (o._o) {
          if (typeof $Unravel != 'undefined') $Unravel.setPreview(o._o);
          o._o.links.forEach(function(l) {
            l.ref.material.color.set('#FFFFFF');
            l.ref.material.setValues({opacity: 1});
            l.ref.renderOrder = 10;
            l.ref._node.material.color.set('#FFFFFF');
            l.ref._node.renderOrder = 5;
          })
        } else {
          o.renderOrder = 10;
          o._node.renderOrder = 10;
          o._node.material.color.set('#FFFFFF');
          if (typeof $Unravel != 'undefined') $Unravel.setPreview(o._l);
        }

      }
    },


    /*
     *  @method - resetAll()
     *  @desc - Reset all objects that may or may not have been highlighted
     *  
     *  @return {null}
     */
    resetAll: function() {
      if (typeof $Unravel != 'undefined') $Unravel.setPreview(null);
      var match = INTERSECTED ? INTERSECTED.object ? INTERSECTED.object.uuid : INTERSECTED.uuid : null;
      OBJECTS.forEach(function(o) {
        if (o.uuid != match) {
          o = o.object ? o.object : o;
          var color = o._o ? o._o.color : '#3B5F96';
          var opacity = o._o ? o._o.ghost == true ? 0.25 : 1 : 1;
          o.material.color.set(color);
          o.material.setValues({opacity: opacity});
          o.renderOrder = 0;
          if (o._node) {
            o._node.renderOrder = 0;
            o._node.material.color.set('#3B5F96');
          }
        }
      })
    },


    /*
     *  @method - animateScene()
     *  @desc - Run the animation loop
     *  
     *  @return {null}
     */
    animateScene: function() {
      // run render and update on each animate frame
      RENDER = true;
      // reuest next frame
      requestAnimationFrame($Render.animateScene);
      // render + update
      $Render.renderScene();
      $Render.updateScene();
    }


  }
}());