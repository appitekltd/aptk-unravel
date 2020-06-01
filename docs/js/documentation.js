var documentation = {
  'Unravel': {
    menu: [
      { name: 'Introduction', links: ['Getting Started']},
      { name: 'Creating Configurations', links: []},
      { name: 'Using the Unraveller', links: []},
      { name: 'FAQs', links: []},
      { name: 'Known Issues', links: []},
      { name: 'Planned Features', links: []},
    ],
    pages: {
      'Introduction': [
        { type: 'Text', text: 'Unravel is an interactive 3D Data Modeler for Salesforce that allows you to explore Salesforce data models and architecture in 3D.'},
        { type: 'Image', text: 'View your data models in a new dimension - literally!', image: '../screenshots/unravel/preview.png'},
        { type: 'Text', text: 'Using Unravel is really easy, you just specify what objects you want to look at, set a "target" object, and Unravel will do the rest!'},
        { type: 'Text', text: 'Let\'s get you up and running with Unravel.'},
        { type: 'Navigation', next: 'Getting Started'},
      ],
      'Getting Started': [
        { type: 'Text', text: 'To first get started with Unravel, you need to make sure you have the [https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000FZLTWUA5]package installed[] and give yourself the correct permission set.'},
        { type: 'Subtitle', text: 'Licenses' },
        { type: 'Text', text: 'Unravel is always a site-wide license so you don\'t have to worry about assigning licenses to yourself or your admin team.'},
        { type: 'Subtitle', text: 'Permission Sets' },
        { type: 'Text', text: 'To use the Unraveller you need to give yourself the "Unravel User" permission set. This grants access to the Unravel app in both Salesforce Classic and Salesforce Lightning, as well as access to use the Unraveller and create configurations.'},
        { type: 'Image', text: 'Give the "Unravel User" permission set to anyone who wants to use the Unravelller - including yourself!', image: '../screenshots/unravel/permission-set.png'},
        { type: 'Text', text: 'Once you have the permission set you will be able to see the "Unravel" app in both Salesforce Classic and Salesforce Lightning. Let\'s go there and start making some configurations!'},
        { type: 'Navigation', back: 'Introduction', next: 'Creating Configurations'},
      ],
      'Creating Configurations': [
        { type: 'Text', text: 'To render a 3D data model Unravel needs to know what objects you want to look at! We do this by creating an Unravel Configuration.'},
        { type: 'Text', text: 'To create a configuration head over to the "Unraveller" tab in the "Unravel" app. When the page loads you will see a configuration list (empty the first time you use Unravel!), as well as the option to create a new configuration.'},
        { type: 'Image', text: 'Manage all your configurations from this one place', image: '../screenshots/unravel/unraveller-selection.png'},
        { type: 'Text', text: 'Let\'s create a new configuration - click on the "Create New Configuration" button and you\'ll see a new screen popup. It will take a few minutes to load all the objects in your Salesforce org but don\'t worry that\'s perfectly normal!'},
        { type: 'Image', text: 'Set the objects and the target for your new configuration', image: '../screenshots/unravel/unraveller-new.png'},
        { type: 'Text', text: 'You need to set the following details for your configuration:'},
        { type: 'List', items: [
          'Name: A name to give this configuration',
          'Objects: Pick the objects you want to view in this data model',
          'Target: Pick a target for Unravel to base the data model around.',
        ]},
        { type: 'Text', text: 'Your "Target" object will be rendered at the top of the data structure with everything else cascading from it - don\'t worry about it too much, you can change this at any time!'},
        { type: 'Text', text: 'Once you have filled in the details, click "Start Unravelling" and Unravel will save your configuration and work it\'s magic.'},
        { type: 'Image', text: 'Your first 3D data model!', image: '../screenshots/unravel/unraveller-loaded.png'},
        { type: 'Text', text: 'Just like that you have your first 3D data model! Now let\'s talk about how you can interact with your 3D data model and make the most out of Unravel.'},
        { type: 'Navigation', back: 'Getting Started', next: 'Using the Unraveller'},
      ],
      'Using the Unraveller': [
        { type: 'Text', text: 'Once you have loaded a configuration you can use the Unraveller to explore your 3D data models.'},
        { type: 'Image', text: 'Explore your data models with ease!', image: '../screenshots/unravel/unraveller-new.png'},
        { type: 'Subtitle', text: 'Rotate, pan, zoom'},
        { type: 'Text', text: 'Unravel uses the mouse as the controls for exploring the data model. You can do the following things:'},
        { type: 'List', items: [
          'Rotate: Hold the left mouse button down while moving the mouse to rotate the data model',
          'Pan: Hold the right mouse button down while moving the mouse to pan the data model',
          'Zoom: Scroll the mouse wheel up or down to zoom in and out.',
        ]},
        { type: 'Text', text: 'There is a handy cheat-sheet built into the Unraveller in the bottom-right corner!'},
        { type: 'Subtitle', text: 'Hover for more'},
        { type: 'Text', text: 'To learn more about a specific object "cube" or relationship "line" simply hover the mouse over it. It will turn white and a box will popup in the top-right corner with information about it.'},
        { type: 'Image', text: 'Hover over to get more information', image: '../screenshots/unravel/preview.png'},
        { type: 'Subtitle', text: 'Changing Targets'},
        { type: 'Text', text: 'The "Target" object you set in your configuration is highlighted in blue in the left-hand menu. You can change the target at any time by clicking on a different object name. This will instantly re-render the scene to build the data model around the new target.'},
        { type: 'Subtitle', text: 'Ghosting Objects'},
        { type: 'Text', text: 'At any time you can "ghost" an object to make it transparent - this can help bring the focus on specific objects. To toggle an object click the "eye" button next to the object name in the left-hand menu. You can toggle all objects in one go from the top-right eye button.'},
        { type: 'Image', text: 'Ghost objects to put the focus on other objects', image: '../screenshots/unravel/ghost.png'},
        { type: 'Subtitle', text: 'Updating Configurations'},
        { type: 'Text', text: 'As you look at your data model you might realise some objects are missing or not related and want to change the configuration. You can do this at any time by clicking the "Update Configuration" button in the bottom right corner.'}
      ],
      'FAQs': [
        { type: 'Text', text: 'The following are FAQs we commonly get about designing with Unravel. If you have any questions that you\'d like to ask us about, you can let us know on our [https://url.appitek.com/feedback?ref=unravel]feedback page[].'},
        { type: 'Subtitle', text: 'Questions'},
        { type: 'ListS', items: [
          'Unravel doesn\'t load in IE11?: Unravel uses technologies that do not support IE11, and as such you will need a modern browser to use it',
          'What rendering library does Unravel use?: Unravel loads the metadata from Salesforce and uses the Javascript Library [https://threejs.org/docs]three.js[] to render them client side.',
          'When I render a configuration I see lots of objects in a row?: This happens when you have objects with no relationships to each other. As Unravel renders the data model if it comes across an object with no "links" it puts it along the top with the hope that later it will have a link for it - but if there are no links then there is nothing to show! You should only put objects that are related together in some way to get the most out of Unravel',
          'Can I render External Objects in Unravel?: Unravel does indeed support Salesforce External Objects (objects ending in "__x"), but only if their External Data Source does not use the "simple URL" type. This is due to Salesforce Limitations.',
          'Can I create new objects in Unravel?: We have no plans to make Unravel anything but a read-only application - as we have plans for a seperate application for that sort of thing, so watch this space!'
        ]}
      ],
      'Known Issues': [
        { type: 'Text', text: 'The following are issues that we know about, that we are currently looking into solving. If you come across any issues when using Unravel, please let us know through our [https://url.appitek.com/feedback?ref=unravel]feedback form[].'},
        { type: 'Subtitle', text: 'Issues'},
        { type: 'Text', text: 'There are currently no issues we are aware of - nice!'}
      ],
      'Planned Features': [
        { type: 'Text', text: 'We have a lot of ideas at Appitek HQ of how we can improve Unravel, and we\'re always listening to feedback from our users! If you have any ideas of things you think would improve your Unravel experience, let us know through our [https://url.appitek.com/feedback?ref=unravel]feedback form[].' },
        { type: 'Subtitle', text: 'Planned Features'},
        { type: 'ListS', items: ['Add ability to add "custom" objects and relationships that can be rendered independently of Salesforce metadata', 'Add ability to let users "move" the object cubes around in the 3D space']}
      ],
      'Page Not Found': [
        { type: 'Text', text: 'We couldn\'t find the page you were looking for. <br/> Please pick a different item from the menu or try searching for your problem in the search bar above.'}
      ],
    }
  }
}

function searchDocumentation(event, type) {
  var search = document.getElementById('documentation-search').value.toLowerCase();
  if (event.key == 'Enter' && search != '') {
    [].slice.call(document.getElementsByClassName('selected'), 0).forEach(function(el) {
      if (el.className.indexOf('doc-p') != -1) {
        el.className = 'doc-p';
      }
    })
    var label = document.getElementById('documentation-search').value;
    var pages = documentation[type].pages;
    var mount = document.getElementById('documentation-content');
    mount.innerHTML = '';
    var title = document.createElement('h2');
    title.innerText = 'Search results for "' + label + '"';
    title.style.marginBottom = '20px';
    mount.appendChild(title);
    var matches = {};
    for (var page in pages) {
      pages[page].forEach(function(section) {
        if (section.type == 'Text' && section.text.toLowerCase().indexOf(search) != -1) {
          if (matches[page] == undefined) matches[page] = [];
          matches[page].push(getSnippet(section.text, search))
        }
        if (section.type == 'List') {
          var text = section.items.join('\n\n');
          if (text.toLowerCase().indexOf(search) != -1) {
            if (matches[page] == undefined) matches[page] = [];
            matches[page].push(getSnippet(text, search))
          }
        }
      })
    }
    for (var match in matches) {
      var link = document.createElement('div');
      link.className = 'aptk-documentation--result';
      link.setAttribute('onclick', 'loadPage(\'' + match + '\', \'' + type + '\')');
      var page = document.createElement('h3');
      page.innerText = match + ' Page';
      link.appendChild(page);
      matches[match].forEach(function(snip) {
        var snippet = document.createElement('p');
        snippet.innerHTML = processText(snip);
        link.appendChild(snippet);
      })
      mount.appendChild(link);
    }
  }
}

function getSnippet(text, match) {
  var spacing = 40;
  var startIndex = text.toLowerCase().indexOf(match);
  var startOffset = startIndex > spacing ? spacing : 0;
  var startText = '...' + text.substring(startOffset, startIndex);
  var endIndex = startIndex + match.length;
  var endOffset = text.length > endIndex + spacing ? endIndex + spacing : text.length;
  var endText = text.substring(endIndex, endOffset) + '...';
  var snippet = '<span class="aptk-documentation--highlight">' + text.substring(startIndex, endIndex) + '</span>';
  return startText + snippet + endText;
}

function loadDocumentation(type, page) {
  var docs = documentation[type];
  var mount = document.getElementById('documentation-menu');
  mount.innerHTML = '';
  docs.menu.forEach(function(item) {
    var menu = document.createElement('li');
    var name = document.createElement('p');
    name.setAttribute('onclick', 'loadPage(\'' + item.name + '\', \'' + type + '\')');
    name.id = item.name;
    name.innerText = item.name;
    name.className = 'doc-p';
    menu.appendChild(name);
    if (item.links.length > 0) {
      var links = document.createElement('ul');
      links.className = 'sub';
      item.links.forEach(function(link) {
        var sub = document.createElement('li');
        var subname = document.createElement('p');
        subname.setAttribute('onclick', 'loadPage(\'' + link + '\', \'' + type + '\')');
        subname.innerText = link;
        subname.id = link;
        sub.appendChild(subname);
        links.appendChild(sub);
      })
      menu.appendChild(links);
    }
    mount.appendChild(menu);
  });
  for (p in docs.pages) {
    docs.pages[p].unshift({ type: 'Title', text: p });
  }
  loadPage(page, type);
}

function loadPage(name, type) {
  window.scroll(0, 0);
  console.log('Loading ' + type + ' Documentation for ' + name);
  window.location.hash = name;
  [].slice.call(document.getElementsByClassName('selected'), 0).forEach(function(el) {
    if (el.className.indexOf('doc-p') != -1) {
      el.className = 'doc-p';
    }
  })
  var docs = documentation[type];
  document.getElementById('documentation-search').value = '';
  var mount = document.getElementById('documentation-content');
  var menu = document.getElementById(name);
  if (menu) menu.className = 'doc-p selected';
  mount.innerHTML = '';
  var content = docs.pages[name] || docs.pages['Page Not Found'];
  var codes = [];
  content.forEach(function(item) {
    var el;
    switch(item.type) {
      case 'Title': 
        el = document.createElement('h2');
      break;
      case 'Subtitle':
        el = document.createElement('h3');
      break;
      case 'Text': 
        el = document.createElement('p');
      break;
      case 'Warning': 
        el = document.createElement('span');
        el.className = 'aptk-documentation--warning';
      break;
      case 'List':
        el = document.createElement('ul');
        el.className = 'aptk-documentation--list';
      break;
      case 'Code':
        el = document.createElement('div');
        el.className = 'aptk-documentation--block';
      break;
      case 'ListS':
        el = document.createElement('ul');
        el.className = 'aptk-documentation--list alt';
      break;
      case 'Image': 
        el = document.createElement('div');
        el.className = 'aptk-documentation--image';
      break;
      case 'Navigation':
        el = document.createElement('div');
        el.className = 'aptk-documentation--links';
      break;
    }
    if (item.type == 'Code') {
      console.log(item);
      var leftText = document.createElement('textarea');
      leftText.value = item.left;
      var rightText = document.createElement('textarea');
      rightText.value = item.right;
      el.appendChild(leftText);
      el.appendChild(rightText);
      codes.push(leftText);
      codes.push(rightText);
    } else if (item.type == 'List' || item.type == 'ListS') {
      if (item.items) {
        item.items.forEach(function(point) {
          var list = document.createElement('li');
          if (point.indexOf(':') != -1) {
            var split = point.split(':');
            list.innerHTML = processText('<b>' + split.shift() + '</b>: ' + split.join(':'));
          } else {
            list.innerHTML = processText(point);
          }
          el.appendChild(list);
        })
      }
    } else if (item.type == 'Navigation') {
      if (item.next) {
        var next = document.createElement('button');
        next.className = 'aptk-button action';
        next.innerText = 'Next';
        next.setAttribute('onclick', 'loadPage(\'' + item.next + '\', \'' + item.doc + '\')');
        el.appendChild(next);
      }
      if (item.back) {
        var back = document.createElement('button');
        back.className = 'aptk-button';
        back.innerText = 'Back';
        back.setAttribute('onclick', 'loadPage(\'' + item.back + '\', \'' + item.doc + '\')');
        el.appendChild(back);
      }
    } else if (item.type == 'Image') {
      var link = document.createElement('a');
      try {
        link.href = $VF == true ? $URL + '/' + item.image.split('/screenshots/unravel/')[1] : item.image;
      } catch(e) {
        link.href = item.image;
      }
      link.target = '_blank';
      var img = document.createElement('img');
      try {
        img.src = $VF == true ? $URL + '/' + item.image.split('/screenshots/unravel/')[1] : item.image;
      } catch(e) {
        img.src = item.image;
      }
      var desc = document.createElement('p');
      desc.innerHTML = processText(item.text);
      link.appendChild(img);
      link.appendChild(desc);
      el.appendChild(link);
    } else {
      el.innerHTML = processText(item.text);
    }
    mount.appendChild(el);
  });
  codes.forEach(function(code) {
    CodeMirror.fromTextArea(code, {
      lineNumbers: true,
      readOnly: true
    })
  })
}

function processText(text) {
  if (!text) return '';
  return text.replace(/``/g, '<span class="aptk-documentation--code">')
    .replace(/`/g, '</span>')
    .replace(/\[\]/g, '</a>')
    .replace(/\[/g, '<a target="_blank" href="')
    .replace(/\]/g, '">');
}

function checkFrame() {
  try {
    var self = window.self == window.top;
    console.log(self);
    if (self == false) {
      document.body.className += ' aptk-iframed';
    }
  } catch(e) {
    document.body.className += ' aptk-iframed';
  }
}
