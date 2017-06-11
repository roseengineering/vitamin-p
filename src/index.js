
var picodom = require('picodom');
var redux = require('redux');

var h = picodom.h;
var patch = picodom.patch;
var createStore = redux.createStore;

var store;

exports.__esModule = true;


var hyper = exports.default = function(tag, props, children){
    children = [].slice.call(arguments, 2);

    if (typeof tag != 'string')
        return tag(props, store.getState(), children);

    var cls = tag.split('.');
    if (cls[1]) props.className = cls.slice(1).join(' ');
    return h(cls[0] || 'div', props, children);
}


exports.connect = function(reducer, render, middleware){
    store = createStore(reducer);

    var dispatch = function(action){
        if (middleware) action = middleware(action, dispatch);
        typeof action == 'function' ? 
            action(dispatch) : 
            action && store.dispatch(action);
    }

    store.subscribe(function(){
        var node = hyper(render, {});
        postMessage(JSON.stringify(node));
    });

    onmessage = function(m){
        dispatch(JSON.parse(m.data));
    };

    return {
        postMessage: function(data){
            onmessage({ data: data })
        }
    };
}

exports.createApp = function(parent, worker){
    var tree = null;
    var el = null;

    var dispatch = function(action){
        worker.postMessage(JSON.stringify(action));
    };

    var expose = function(ob){
        var d = {};
        for (var k in ob){
            var v = ob[k];
            if (v === null || (typeof v != 'object' && typeof v != 'function'))
                d[k] = v;
        }
        return d;
    };

    var update = function(node){
        node = JSON.parse(node, function(key, value){
            if (!key.indexOf('on')){
                return value === null ? null : function(ev){
                    var payload = expose(ev);
                    dispatch({ type: value, payload: payload });
                };
            }
            return value;
        });
        el = patch(parent, el, tree, (tree = node));
    };

    if (worker instanceof Worker) {
        worker.onmessage = function(m){ update(m.data) };
    } else {
        postMessage = update;
    }

    return dispatch;
}

