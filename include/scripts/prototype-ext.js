Object.extend(Event, {
	_domReady : function() {
		if (arguments.callee.done) return;
		arguments.callee.done = true;

		if (this._timer)  clearInterval(this._timer);

		this._readyCallbacks.each(function(f) { f() });
		this._readyCallbacks = null;
	},

	onDOMReady : function(f) {
		if (!this._readyCallbacks) {
			var domReady = this._domReady.bind(this);

			if (document.addEventListener)
			document.addEventListener("DOMContentLoaded", domReady, false);

			/*@cc_on @*/
			/*@if (@_win32)
			document.write("<scr"+"ipt id=__ie_onload defer src=//0></scr"+"ipt>");
			document.getElementById("__ie_onload").onreadystatechange = function() {
				if (this.readyState == "complete") domReady();
			};
			/*@end @*/

			if (/WebKit/i.test(navigator.userAgent)) {
				this._timer = setInterval(function() {
					if (/loaded|complete/.test(document.readyState)) domReady();
				}, 10);
			}

			Event.observe(window, 'load', domReady);
			Event._readyCallbacks =  [];
		}
		Event._readyCallbacks.push(f);
	},
	emulateClick:function(element) {
		try {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
			return $(element).dispatchEvent(evt);
		}
		catch (e) {
			$(element).click();
		}
	},
	emulateOnClick:function(element) {
		try {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("onclick", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
			return $(element).dispatchEvent(evt);
		}
		catch (e) {
			$(element).click();
		}
	}
});

String.prototype.padOrig = function(l, s, t){
				return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
								+ 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
								+ this + s.substr(0, l - t) : this;
};

String.prototype.pad = function(l, s, t){
				return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
								+ 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
								+ this + s.substr(0, l - t) : this;
};

Object.extend(Array.prototype, {
	item:function(index) {
		for(var i in this) {
			if (typeof(this[index])!= 'function' && i == index)
				return this[i];
		}
	}
});


Object.extend(Event.Methods, {
	stop: function(){
		Event.extend(event);
		if (Prototype.Browser.IE) {
			window.event.returnValue = false;
			window.event.cancelBubble = true;
		}
		else
		{
			eventobj.stopPropagation();
			eventobj.preventDefault();
		}
		event.stopped = true;
	}
});

function disableAnchor(element) {
	var element = $(element);
	if(element != null)
	{
		var href = element.getAttribute("href");
		var onclick = element.getAttribute("onclick");
		//First we store previous value in a new attribute
		if(href && href != "" && href != null) {
			element.setAttribute('href_bak', href);
		}
		if(onclick != null)	{
			element.setAttribute('onclick_back', onclick);
			element.setAttribute('onclick', "void(0);");
		}
		element.removeAttribute('href');
	}
}
function enableAnchor(element) {
	var element = $(element);
	if(element != null)
	{
		var hrefBack = element.getAttribute("href_bak");
		var onclickBack = element.getAttribute("onclick_back");
		if(onclickBack !=null ) {
			element.setAttribute('onclick', onclickBack);
			element.removeAttribute('onclick_back');
		}
		if(hrefBack != null ) {
			element.setAttribute('href', hrefBack);
			try {
				element.removeAttribute('href_bak');
			}
			catch (e) {
				element.href_bak = null;
			}
		}
	}
}

function $S(id)
{
	var radioButtons = window.top.frames['master'].fetchObjectByAttributeValue('type','radio','INPUT');
	for (var x = 0; x < radioButtons.length; x ++) {
		if (radioButtons[x].id == id && radioButtons[x].checked) {
	//alert(radioButtons.length+' : '+x+' : '+radioButtons[x].name+' = '+radioButtons[x].value);
			return radioButtons[x].value;
		}
	}
	return -1;
}

function $RD(id)
{
	var elts = document.getElementsByTagName('INPUT');

	var classArray = new Array();
	for (var i = 0; i < elts.length; ++i)
	{
		if (elts[i].type=='radio' && elts[i].id==id)
		{
			classArray.push(elts[i]);
		}
	}
	return classArray;
}

var $CE = function(tagName, attributes, styles){ //short for create element
						var el = document.createElement(tagName);
						if (attributes)
												$H(attributes).each(function(pair){
																		eval("el." + pair.key + "='" + pair.value + "'");
												});
						if (styles)
												$H(styles).each(function(pair){
																		el.style[pair.key] = pair.value;
												});

						return $(el);
};

//adding he new methods
Element.addMethods({
	clearChildren: function(element) {
		element = $(element);
		$A(element.childNodes).each(function(e){
					e.parentNode.removeChild(e);
		});
		return element;
	},

	append: function(element, tagName, attributes, styles) {
		element = $(element);
		var newEl = $CE(tagName, attributes, styles);
		element.appendChild(newEl);
		return newEl;//<-- this one returns the new element
	},

	appendText: function(element, text){
		element = $(element);
		var t = document.createTextNode(text);
		element.appendChild(t);
		return element;
			}
});

var loadThird;
function loadThirdMenu()
{
	if (menuObject == undefined) {
		loadThird = setTimeout(loadThirdMenu,50);
	}
	else {
		menuObject.initialLoad = false;
		menuObject.updateMenu('third', 0, false);
		clearTimeout(loadThird);
	}
}


LowPro = {};
LowPro.Version = '0.2';

if (!Element.addMethods)
		Element.addMethods = function(o) { Object.extend(Element.Methods, o) };

// Simple utility methods for working with the DOM
DOM = {
		nextElement : function(element) {
				element = $(element);
				while (element = element.nextSibling)
						if (element.nodeType == 1) return $(element);
				return null;
		},
		previousElement : function(element) {
				element = $(element);
				while (element = element.previousSibling)
						if (element.nodeType == 1) return $(element);
				return null;
		},
		remove : function(element) {
				return $(element).parentNode.removeChild(element);
		},
		insertAfter : function(element, node) {
				return $(element).previousSibling.inserBefore(node);
		},
		replaceElement : function(element, node) {
				$(element).parentNode.replaceChild(node, element);
				return node;
		},
		appendRow: function(element, attributes, styles) {
			var element = $(element);
			var el = element.insertRow(-1);
			if (attributes) {
		for (key in attributes) {
			eval("el." + key + "='" + attributes[key] + "'");
		}
	}
	return $(el)
		},
		appendCell: function(element, attributes, styles) {
			var element = $(element);
			var el = element.insertCell(-1);
			if (attributes)
		for (key in attributes) {
			eval("el." + key + "='" + attributes[key] + "'");
		}
	return $(el)
		}
};

// Add them to the element mixin
Element.addMethods(DOM);

// DOMBuilder for prototype
DOM.Builder = {
		IE_TRANSLATIONS : {
				'class' : 'className',
				'for' : 'htmlFor'
		},
		ieAttrSet : function(attrs, attr, el) {
				var trans;
				if (trans = this.IE_TRANSLATIONS[attr]) el[trans] = attrs[attr];
				else if (attr == 'style') el.style.cssText = attrs[attr];
				else if (attr.match(/^on/)) el[attr] = new Function(attrs[attr]);
				else el.setAttribute(attr, attrs[attr]);
		},
	tagFunc : function(tag) {
			return function() {
					var attrs, children;
					if (arguments.length>0) {
							if (arguments[0].nodeName || typeof arguments[0] == "string") children = arguments;
							else { attrs = arguments[0]; children = [].slice.call(arguments, 1); };
					}
					return DOM.Builder.create(tag, attrs, children);
			};
		},
	create : function(tag, attrs, children) {
		attrs = attrs || {}; children = children || [];
		var isIE = navigator.userAgent.match(/MSIE/);
		var el = document.createElement((isIE && attrs.name) ? "<" + tag + " name=" + attrs.name + ">" : tag);
		for (var attr in attrs) {
				if (typeof attrs[attr] != 'function') {
						if (isIE) this.ieAttrSet(attrs, attrs, el);
						else el.setAttribute(attr, attrs[attr]);
				};
			}
		for (var i=0; i<children.length; i++) {
			if (typeof children[i] == 'string') children[i] = document.createTextNode(children[i]);
			el.appendChild(children[i]);
		}
		return $(el);
	}
};

// Automatically create node builders as $tagName.
(function() {
	var els = ("p|div|span|strong|em|img|table|tr|td|th|thead|tbody|tfoot|pre|code|" +
							"h1|h2|h3|h4|h5|h6|ul|ol|li|form|input|textarea|legend|fieldset|" +
							"select|option|blockquote|cite|br|hr|dd|dl|dt|address|a|button|abbr|acronym|" +
							"script|link|style|bdo|ins|del|object|param|col|colgroup|optgroup|caption|" +
							"label|dfn|kbd|samp|var").split("|");
		var el, i=0;
	while (el = els[i++]) window['$' + el] = DOM.Builder.tagFunc(el);
})();

// Extend Element with observe and stopObserving.
Element.addMethods({
		observe : function(el, event, callback) {
				Event.observe(el, event, callback);
		},
		stopObserving : function(el, event, callback) {
				Event.stopObserving(el, event, callback);
		}
});

// Replace out existing event observe code with Dean Edwards' addEvent
// http://dean.edwards.name/weblog/2005/10/add-event/
Object.extend(Event, {
		observe : function(el, type, func) {
				el = $(el);
				if (!func.$$guid) func.$$guid = Event._guid++;
			if (!el.events) el.events = {};
			var handlers = el.events[type];
			if (!handlers) {
				handlers = el.events[type] = {};
				if (el["on" + type]) {
					handlers[0] = el["on" + type];
				}
			}
			handlers[func.$$guid] = func;
			el["on" + type] = Event._handleEvent;

				if (!Event.observers) Event.observers = [];
				Event.observers.push([el, name, func, false]);
	},
	stopObserving : function(el, type, func) {
				if (el.events && el.events[type]) delete el.events[type][func.$$guid];
		},
		_handleEvent : function(e) {
				var returnValue = true;
				e = e || Event._fixEvent(window.event);
				var handlers = this.events[e.type], el = $(this);
				for (var i in handlers) {
					el.$$handleEvent = handlers[i];
					if (el.$$handleEvent(e) === false) returnValue = false;
				}
			return returnValue;
		},
		_fixEvent : function(e) {
				e.preventDefault = Event._preventDefault;
				e.stopPropagation = Event._stopPropagation;
				return e;
		},
		_preventDefault : function() { this.returnValue = false },
		_stopPropagation : function() { this.cancelBubble = true },
		_guid : 1
});

// Allows you to trigger an event element.
Object.extend(Event, {
		trigger : function(element, event, fakeEvent) {
				element = $(element);
				fakeEvent = fakeEvent || { type :  event };
				this.observers.each(function(cache) {
						if (cache[0] == element && cache[1] == event)
								cache[2].call(element, fakeEvent);
				});
		}
});

// Based on event:Selectors by Justin Palmer
// http://encytemedia.com/event-selectors/
//
// Usage:
//
// Event.addBehavior({
//      "selector:event" : function(event) { /* event handler.  this refers to the element. */ },
//      "selector" : function() { /* runs function on dom ready.  this refers to the element. */ }
//      ...
// });
//
// Multiple calls will add to exisiting rules.  Event.addBehavior.reassignAfterAjax and
// Event.addBehavior.autoTrigger can be adjusted to needs.
Event.addBehavior = function(rules) {
		var ab = this.addBehavior;
		Object.extend(ab.rules, rules);

		if (ab.autoTrigger) {
				this.onDOMReady(ab.load.bind(ab));
		}

		Ajax.Responders.register({
				onComplete : function() {
						if (Event.addBehavior.reassignAfterAjax)
								setTimeout(function() { ab.load() }, 10);
				}
		});

};

Object.extend(Event.addBehavior, {
		rules : {}, cache : [],
		reassignAfterAjax : true,
		autoTrigger : true,

		load : function() {
				this.unload();
				for (var selector in this.rules) {
						var observer = this.rules[selector];
						var sels = selector.split(',');
						sels.each(function(sel) {
								var parts = sel.split(/:(?=[a-z]+$)/), css = parts[0], event = parts[1];
								$$(css).each(function(element) {
										if (event) {
												$(element).observe(event, observer);
												Event.addBehavior.cache.push([element, event, observer]);
										} else {
												if (!element.$$assigned || !element.$$assigned.include(observer)) {
														if (observer.attach) observer.attach(element);
														else observer.call($(element));
														element.$$assigned = element.$$assigned || [];
														element.$$assigned.push(observer);
												}
										}
								});
						});
				}
		},

		unload : function() {
				this.cache.each(function(c) {
						Event.stopObserving.apply(Event, c);
				});
		}

});

Event.observe(window, 'unload', Event.addBehavior.unload.bind(Event.addBehavior));

// Behaviors can be bound to elements to provide an object orientated way of controlling elements
// and their behavior.  Use Behavior.create() to make a new behavior class then use attach() to
// glue it to an element.  Each element then gets it's own instance of the behavior and any
// methods called onxxx are bound to the relevent event.
//
// Usage:
//
// var MyBehavior = Behavior.create({
//   onmouseover : function() { this.element.addClassName('bong') }
// });

// Event.addBehavior({ 'a.rollover' : MyBehavior });
Behavior = {
		create : function(members) {
				var behavior = function(element) { this.element = $(element) };
				behavior.prototype.initialize = Prototype.K;
				Object.extend(behavior.prototype, members);
				Object.extend(behavior, Behavior.ClassMethods);
				return behavior;
		},
		ClassMethods : {
				attach : function(element) {
						var bound = new this(element);
						bound.initialize.apply(bound);
						this._bindEvents(bound);
						return bound;
				},
				_bindEvents : function(bound) {
						for (var member in bound)
								if (member.match(/^on(.+)/) && typeof bound[member] == 'function')
										bound.element.observe(RegExp.$1, bound[member].bindAsEventListener(bound));
				}
		}
};


// Original code by Sylvian Zimmer
// http://www.sylvainzimmer.com/index.php/archives/2006/06/25/speeding-up-prototypes-selector/
// Optimises execution speed of the $$ function.  Rewritten for readability by Justin Palmer.
//
// Turn off optimisation with LowPro.optimize$$ = false;
LowPro.SelectorLite = Class.create();
LowPro.SelectorLite.prototype = {
		initialize: function(selectors) {
				this.results = [];
				this.selectors = [];
				this.index = 0;

				for(var i = selectors.length -1; i >= 0; i--) {
						var params = { tag: '*', id: null, classes: [] };
						var selector = selectors[i];
						var needle = selector.length - 1;

						do {
								var id = selector.lastIndexOf("#");
								var klass = selector.lastIndexOf(".");
								var cursor = Math.max(id, klass);

								if(cursor == -1) params.tag = selector.toUpperCase();
								else if(id == -1 || klass == cursor) params.classes.push(selector.substring(klass + 1));
								else if(!params.id) params.id = selector.substring(id + 1);

								selector = selector.substring(0, cursor);
						} while(cursor > 0);

						this.selectors[i] = params;
				}

		},

		get: function(root) {
				this.findElements(root || document, this.index == (this.selectors.length - 1));
				return this.results;
		},

		findElements: function(parent, descendant) {
				var selector = this.selectors[this.index], results = [], element;
				if (selector.id) {
						element = $(selector.id);
						if (element && (selector.tag == '*' || element.tagName == selector.tag) && (element.childOf(parent))) {
										results = [element];
						}
				} else {
						results = $A(parent.getElementsByTagName(selector.tag));
				}

				if (selector.classes.length == 1) {
						results = results.select(function(target) {
							return $(target).hasClassName(selector.classes[0]);
						});
				} else if (selector.classes.length > 1) {
						results = results.select(function(target) {
								var klasses = $(target).classNames();
								return selector.classes.all(function(klass) {
										return klasses.include(klass);
								});
						});
				}

				if (descendant) {
						this.results = this.results.concat(results);
				} else {
						++this.index;
						results.each(function(target) {
								this.findElements(target, this.index == (this.selectors.length - 1));
						}.bind(this));
				}
		}
};

LowPro.$$old=$$;
LowPro.optimize$$ = true;

/*$$ = function(a,b) {
		if (LowPro.optimize$$ == false || b || a.indexOf("[")>=0)
				return LowPro.$$old(a, b);
		return new LowPro.SelectorLite(a.split(/\s+/)).get();
};*/

function callInProgress(xmlhttp) {
    switch (xmlhttp.readyState) {
        case 1:
        case 2:
        case 3:
            return true;
            break;
        // Case 4 and 0
        default:
            return false;
            break;
    }
}

Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
    return max;
}

Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) if (this[i] < min) min = this[i];
    return min;
}
