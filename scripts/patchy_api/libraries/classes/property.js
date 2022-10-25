import { world, DynamicPropertiesDefinition, Trigger } from "@minecraft/server";
import { content, native, overworld, server, typeOf, assignToPath } from "../utilities";
import errorLogger from "./error";
import global from "./global.js";

class PropertyBuilder {
  constructor() {
    this.numbers = [];
    this.booleans = [];
    this.strings = {};
    this.rand = Math.random();
  }
  getObjectFromKey(key) {
    try {
      const numbers = this.numbers.filter(path => path.startsWith(`${key}.`));
      const booleans = this.booleans.filter(path => path.startsWith(`${key}.`));
      const strings = Object.keys(this.strings.filter(path => path.startsWith(`${key}.`)));
      let object = {};
      const paths = [...numbers, ...booleans, ...strings];
      // content.warn({ paths });
      paths.forEach((path, i) => {
        const pathArray = path.split('.');
        const value = world.getDynamicProperty(path);
        const assign = assignToPath(pathArray, object, value);
        // content.warn({ path, assign, value });
        if (assign) {
          object = assign;
        }
      });
      return object;
    } catch (error) {
      errorLogger.log(error, error.stack, { event: 'worldInitialize', key: 'PropertyGetObjectFromKey' });
    }
  }
  registerEvent(event) {
    try {
      const { numbers, booleans, strings } = this;
      const propertyDefinitions = new DynamicPropertiesDefinition();
      numbers.forEach(numberIdentifier => {
        propertyDefinitions.defineNumber(numberIdentifier);
      });
      booleans.forEach(booleanIdentifier => {
        propertyDefinitions.defineBoolean(booleanIdentifier);
      });
      strings.forEach((stringIdentifier, stringMaxLength) => {
        propertyDefinitions.defineString(stringIdentifier, stringMaxLength);
      });
      event.propertyRegistry.registerWorldDynamicProperties(propertyDefinitions);
    } catch (error) {
      errorLogger.log(error, error.stack, { event: 'worldInitialize', key: 'PropertyRegistration' });
    }
  }
  /**
    * @method register gets a database on Databases
    * @param {{dentifier: (Object?string)}} name Database name
    * @returns {Database} this[name]
  */
  register(registryObject, currentKeySet) {
    content.warn({ registryObject, currentKeySet, });
    registryObject.forEach((identifier, args) => {
      const key = `${(currentKeySet) ? `${currentKeySet}.` : ''}${identifier}`;
      // content.warn({ key });
      if (identifier.includes('.')) {
        throw new Error(`the identifier: ${(currentKeySet) ? `${currentKeySet}.` : '' + `'${identifier}'`}, must not contain '.'`);
      } else if (typeOf(args) === 'Array') {
        if (args[0] === 'string') {
          throw new Error(`the type, Array[0], in the value for the identifier: ${key}, must 'string' if it is a string`);
        } else {
          const maxLength = Number(args[1]);
          if (!Number.isInteger(maxLength)) {
            throw new Error(`the value for type, key,in the object for the identifier: ${key}, must be an integer since it is max length`);
          } else {
            // content.warn({ key, args });
            this.registerString(key, maxLength);
          }

        }
      } else if (typeOf(args) === 'Object') {
        this.register(args, key);
      } else {
        if (args === 'number') {
          // content.warn({ key, args });
          this.registerNumber(key);
        } else if (args === 'boolean') {
          // content.warn({ key, args });
          this.registerBoolean(key);
        } else {
          throw new Error(`${value} for the identifier: ${key}  must must be number, boolean or an object with {string: <maxLength: Integer>}`);
        }
      }
    });
  }
  setInitialValues(setObject, currentKeySet) {
    try {

      setObject.forEach((identifier, value) => {
        const key = `${(currentKeySet) ? `${currentKeySet}.` : ''}${identifier}`;
        if (typeOf(value) === 'Object') {
          this.setInitialValues(value, key);
        } else {
          this.setValue(key, value, true);
        }
      });
    } catch (error) {
      errorLogger.log(error, error.stack, { event: 'worldInitialize', key: 'PropertySetInitialValues' });
    }
  }
  setValues(setObject, currentKeySet) {
    setObject.forEach((identifier, value) => {
      if (typeOf(value) === 'Object') {
        this.setInitialValues(value, (currentKeySet) ? `${currentKeySet}.` : '' + identifier);
      } else {
        this.setValue((currentKeySet) ? `${currentKeySet}.` : '' + identifier, value, false);
      }
    });
  }
  setValue(identifier, value, initializeOnly) {
    try {
      if (initializeOnly && world.getDynamicProperty(identifier)) {
        return;
      }
      world.setDynamicProperty(identifier, value);
    } catch (error) {
      errorLogger.log(error, error.stack, { event: 'worldInitialize', key: 'PropertySetValue' });
    }
  }
  registerNumber(identifier) {
    content.warn({ bool: this.numbers.includes(identifier), identifier, bools: this.numbers });
    if (!this.numbers.includes(identifier)) {
      this.numbers.push(identifier);
    }
  }
  registerBoolean(identifier) {
    content.warn({ bool: this.booleans.includes(identifier), identifier, bools: this.booleans });
    if (!this.booleans.includes(identifier)) {
      this.booleans.push(identifier);
    }
  }
  registerString(identifier, maxLength) {
    this.strings[identifier] = maxLength;
  }
}

const propertyBuilder = new PropertyBuilder();

export default propertyBuilder;