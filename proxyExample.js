/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

This file isn't used in the site. Just for code sample purposes.
*/

/////////////////////////////////////////////////////////

/* Initial example */
const myObject = {
  id: 1,
  name: 'Jeff Bezos'
};

const handler = {
  get: function() {
    console.log('custom get function');
  }
};

const p = new Proxy(myObject, handler);
console.log(p.id);

/////////////////////////////////////////////////////////

/* Expanded initial example */
const myObject = {
  id: 1,
  name: 'Colleen Aubrey'
};

const handler = {
  get: function(target, prop) {
    console.log('Custom get function');
    return target[prop];
  }
};

const p = new Proxy(myObject, handler);
console.log(p.id);

/////////////////////////////////////////////////////////

/* Default values */
const myObject = {
  id: 1,
  name: 'Jeff Bezos'
};

const handler = {
  get: function(target, prop) {
    return prop in target ? target[prop] : 'defaultValue';
  }
};

// More extensible
const withDefaultValue = (obj, defaultValue = undefined) => {
  return new Proxy(obj, {
    get: function(target, prop) {
      return prop in target ? target[prop] : defaultValue;
    }
  });
};

const obj = withDefaultValue(myObject);

/////////////////////////////////////////////////////////

/* Prevent deletion of properties */
const withNoDeletion = obj => {
  return new Proxy(obj, {
    deleteProperty: function(target, prop) {
      return false;
    }
  });
};

const obj = withNoDeletion({});

/////////////////////////////////////////////////////////

/* Object access history */
const withAccessHistory = obj => {
  const history = [];
  obj.getHistory = () => history;

  return new Proxy(obj, {
    get: function(target, prop) {
      history.push(prop);
      return target[prop];
    }
  });
  return obj;
};

const obj = withAccessHistory({
  id: 1,
  name: 'Brian Saltzman'
});

/////////////////////////////////////////////////////////

/* Prevent private variable access */
const withPrivate = obj => {
  return new Proxy(obj, {
    get: function(target, prop) {
      if (prop[0] === '_') {
        throw new Error(
          `${prop} is a private property and cannot be accessed.`
        );
      }
      return target[prop];
    }
  });
};
const myObject = withPrivate({
  id: 1,
  name: 'Jeff Bezos',
  _somethingPrivate: 'I actually like PHP'
});

/////////////////////////////////////////////////////////

/* Basic validation */
const withShittyAgeValidation = obj => {
  return new Proxy(obj, {
    set: function(target, prop, value) {
      switch (prop) {
        case 'age':
          if (typeof value !== 'number')
            throw new Error('Age must be a number');
        default:
          target[prop] = value;
      }
    }
  });
};
const obj = withShittyAgeValidation({});
// p.age = 33; p.age = 'asdf'

/////////////////////////////////////////////////////////

/* Memoization */
function myFunc(x) {
  console.log('Executing myFunc');
  return x + 1;
}

// Simple approach
function memoize(fn) {
  const results = {};
  return arg => {
    if (!results.hasOwnProperty(arg)) {
      results[arg] = fn(arg);
    }

    return results[arg];
  };
}

function memoizeWithProxy(fn) {
  const handler = {
    cache: {},
    apply: function(target, that, args) {
      const arg = args[0];

      if (!this.cache.hasOwnProperty(arg)) {
        this.cache[arg] = target(...args);
      }

      return this.cache[arg];
    }
  };

  return new Proxy(fn, handler);
}

/////////////////////////////////////////////////////////

/* Clear all timeouts */
function buildClearAllTimeouts() {
  const timeouts = [];
  const handler = {
    apply: function(target, that, args) {
      const timeout = target(...args);
      timeouts.push(timeout);
      return timeout;
    }
  };

  window.setTimeout = new Proxy(window.setTimeout, handler);
  window.clearAllTimeouts =
    window.clearAllTimeouts ||
    function() {
      timeouts.forEach(t => clearTimeout(t));
    };
}
buildClearAllTimeouts();

// setTimeout(() => { console.log('asdf') }, 8000);
// setTimeout(() => { console.log('asdf') }, 5000);
// clearAllTimeouts();
// setTimeout(() => { console.log('another') }, 3000);

/////////////////////////////////////////////////////////

/* Dynamic API caller */
const methods = ['get', 'post', 'put', 'delete']; // options, patch, etc.
const baseApi = {
  foo: () => {
    console.log('calling foo');
  }
}; // Can prefill functions here if you want
const apiCaller = new Proxy(baseApi, {
  get: function(target, prop) {
    if (target[prop]) return target[prop]; // Reeturn prefilled function if it exists

    const requestMethod = methods.find(method => prop.startsWith(method));
    if (!requestMethod) return; // or throw?

    const path =
      '/' +
      prop
        .substring(requestMethod.length) // getCampaigns$AdGroups -> Campaigns$AdGroups
        .replace(/\$/g, '/$/') // Campaigns$AdGroups -> Campaigns/AdGroups
        .toLowerCase(); // Campaigns/AdGroups -> campaigns/adgroups

    return (...args) => {
      let finalPath = path.replace(/\$/g, () => args.shift());
      const requestBody = args.shift() || {};
      const isGetOrHead = requestMethod === 'get' || requestMethod === 'head';

      // GET/HEAD requests cannot have a request body. Needs to be path params
      if (isGetOrHead && Object.keys(requestBody).length) {
        finalPath += '?';
        for ([key, value] of Object.entries(requestBody)) {
          finalPath += `${key}=${value}&`;
        }
        if (finalPath[finalPath.length - 1] === '&')
          finalPath = finalPath.slice(0, -1);
      }

      console.log(requestMethod, finalPath, requestBody);
      return fetch(finalPath, {
        method: requestMethod,
        body: isGetOrHead ? null : requestBody
      });
    };
  }
});

// apiCaller.getCampaigns()
// apiCaller.postCampaigns({ campaignName: 'name', budget: 3.5 });
// apiCaller.getCampaigns$AdGroups('123CampaignId123')
// apiCaller.getCampaigns$AdGruops$Keywords('123CampaignId123', '456AdGroupId456')
