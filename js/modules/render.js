var $Render = (function() {
  'use strict';

  var MOUSE_X = -99999;
  var MOUSE_Y = -99999;
  var RENDERER = {};
  var CAMERA = {};
  var SCENE = {};
  var OBJECTS = [];
  var LABELS = [];
  var INTERSECTED = null;
  var RENDER = false;

  document.addEventListener('mousemove', function(ev) {
    MOUSE_X = (event.clientX / window.innerWidth) * 2 - 1;
    MOUSE_Y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  

  return {


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


    createNode: function(points, type) {

      // create node
      //var color = type == 'I' ? '#007add' : '#ac0000';
      var node = new THREE.Mesh(new THREE.SphereGeometry( 0.5, 2, 2 ), new THREE.MeshBasicMaterial({color: 0x3B5F96 }));
      node.position.set(points[0], points[1], points[2]);

      // add to scene and return reference
      SCENE.add(node);
      return node;

    },


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


    resetScene: function() {

      RENDERER.dispose();
      
      var cleanMaterial = function(material) {
        material.dispose();
        for (var key of Object.keys(material)) {
          var value = material[key];
          if (value && typeof value === 'object' && 'minFilter' in value) {
            value.dispose();
          }
        }
      }

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
      
      SCENE = {};
      RENDERER = {};
      SCENE = {};
      CAMERA = {};
      OBJECTS = [];
      LABELS = [];
      INTERSECTED = null;

    },


    setObject: function(object, key) {
      var match = OBJECTS.filter(function(o) {
        return o._o != undefined && o._o.name == object.name;
      })[0];
      if (match) {
        match._o[key] = object[key];
      }
    },

    setObjects: function(objects, key) {
      objects.forEach(function(obj) {
        $Render.setObject(obj, 'ghost');
      })
    },


    initScene: function() {

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

      // begin rendering
      if (RENDER == false) {
        $Render.animateScene();
      }

      ORBIT.rotateInitial(90 * Math.PI / 180, 5 * Math.PI / 180);

    },

    renderScene: function() {

      // re render scene
      RENDERER.render(SCENE, CAMERA);

      // ensure labels are looking at the camera
      LABELS.forEach(function(label) {
        label.lookAt(CAMERA.position);
      });

    },

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

    animateScene: function() {

      // run render and update on each animate frame
      RENDER = true;

      requestAnimationFrame($Render.animateScene);
      $Render.renderScene();
      $Render.updateScene();

    }

  }


}());