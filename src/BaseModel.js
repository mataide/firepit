const deeps = require('deeps');
const INTERNALS = require('./internals');

function schemaDefaults(name) {
  return {
    schema: true,
    app: '[DEFAULT]',
    identity: name.toLowerCase(),
    autoId: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoCreatedBy: true,
    autoUpdatedBy: true,
    collectionName: name.toLowerCase(), // TODO identity vs collectionName
  };
}

const hasOwnProperty = Object.hasOwnProperty;

// TODO Handle all attribute types
function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

class BaseModel {

  constructor(appName, modelName) {
    this.appName = appName;
    this.modelName = modelName;
    this.app = INTERNALS.apps[appName].app;
    this.schema = deeps.merge(Object.assign({}, schemaDefaults(this.modelName), INTERNALS.apps[appName].config), INTERNALS.apps[appName].schemas[modelName]);
  }

  validateSchema() {
    if (this.schema.schema && (!this.schema.attributes || !Object.keys(this.schema.attributes).length)) {
      throw new Error('No schema attributes but is required'); // TODO
    }

    const keys = Object.keys(this.schema.attributes || {});

    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      let attribute = this.schema.attributes[key];

      if (typeof attribute === 'string') {
        attribute = this.schema.attributes[key] = {
          type: attribute,
        };
      }
      this.validateAttributeType(key, attribute);
      this.validateDefaultValue(key, attribute);
      this.validateEnums(key, attribute);
    }
  }

  validateAttributeType(key, attribute) {
    if (!INTERNALS.validTypes.includes(attribute.type)) {
      throw new Error(`Type ${attribute.type} aint valid`); // TODO
    }
  }

  validateDefaultValue(key, attribute) {
    if (hasOwnProperty.call(attribute, 'defaultsTo')) {
      if (typeOf(attribute.defaultsTo) !== attribute.type) {
        throw new Error(`Default value ${attribute.defaultsTo} is not of type ${attribute.type}`); // TODO
      }
    }
  }

  validateEnums(key, attribute) {
    if (hasOwnProperty.call(attribute, 'enum')) {
      if (typeOf(attribute.enum) !== 'array') {
        throw new Error(`Enum prop must be an array`); // TODO
      }

      for (let i = 0, len = attribute.enum.length; i < len; i++) {
        const value = attribute.enum[i];
        if (typeOf(value) !== attribute.type) {
          throw new Error(`Enum contains value isnt of the type ${attribute.type}`); // TODO
        }
      }

      if (hasOwnProperty.call(attribute, 'defaultsTo') && !attribute.enum.includes(attribute.defaultValue)) {
        throw new Error(`Default value not in enum array`); // TODO
      }
    }
  }
}

module.exports = BaseModel;
