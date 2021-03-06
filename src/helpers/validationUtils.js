/* eslint-disable no-param-reassign */
import is from 'is_js';
import {FieldStatus, throwError} from "./helpers";
import handlerMatcher, {
  RuleWhichNeedsArray,
  RuleWhichNeedsBoolean
} from "../ruleHandlers/matchers";
import {createNewFieldState} from './initializationUtils';

/**
 * If all fields in the state has their status !== error
 * Then we will set the isFormOK to true then return the state.
 * Just mutate the value since it's already a new state object
 *
 */
export function checkIsFormOK(schema, componentState) {
  const properties = Object.keys(schema);
  let isError = false;
  properties.some(prop => {
    if (prop === 'collectValues') return false;

    if (
      is.propertyDefined(schema[prop], 'isRequired') &&
      schema[prop].isRequired === false &&
      componentState[prop].status !== FieldStatus.error
    )
      return false;

    if (componentState[prop].status === FieldStatus.error) {
      isError = true;
      return true;
    }

    if (componentState[prop].status === FieldStatus.normal) {
      if (is.not.propertyDefined(schema[prop], 'default')) {
        isError = true;
        return true;
      }

      if (schema[prop].default !== componentState[prop].value) {
        isError = true;
        return true;
      }
    }
    return false;
  });
  componentState.isFormOK = !isError;

  return componentState;
}

function handleBeforeValidation(fieldValue, handler) {
  if (is.function(handler)) {
    return handler(fieldValue);
  }
  /* eslint no-console: 0 */
  console.warn(`[Veasy]: Expect beforeValidation to be a function \
while the value is ${handler}`);
  return fieldValue;
}

/**
 * It will run through the user's settings for a field,
 * and try matching to the matchers.js,
 * if according rule could be found,
 * it will then execute the according rule function.
 * For instance:
 * if user sets a `minLength` for a field,
 * This function will invoke the minLength()
 *
 */
function runMatchers(matcher, fieldState, fieldSchema) {
  const fieldName = Object.keys(fieldSchema)[0];
  const schema = fieldSchema[fieldName];
  Object.keys(schema).forEach(ruleInSchema => {
    if (is.propertyDefined(matcher, ruleInSchema)) {
      // eslint-disable-next-line no-use-before-define
      ruleRunner(
        ruleInSchema,
        matcher[ruleInSchema],
        fieldName,
        fieldState.value,
        schema
      );
    }
    else if (ruleInSchema === 'beforeValidation') {
      fieldState.value = handleBeforeValidation(
        fieldState.value,
        schema.beforeValidation
      );
    }
    // TODO: Do something when the rule is not match
    // else if (ruleInSchema !== 'default') {
    // }
  });
  return fieldState;
}

/**
 * This is the main entry for all validator.
 * It will generate the initial state to start with
 *
 */
export function rulesRunner(value, schema) {
  const fieldState = createNewFieldState();
  fieldState.value = value;

  if (is.existy(value) && is.not.empty(value)) {
    fieldState.status = FieldStatus.ok;
  }

  return runMatchers(handlerMatcher, fieldState, schema);
}

function extractUserDefinedMsg(handlerName, schema) {
  const result = { schema, userErrorText: '' };

  // No user message, just return
  if (is.not.array(schema[handlerName])) return result;

  const currentSchema = schema[handlerName];

  // Handle the case where the value of rule is array
  if (RuleWhichNeedsArray.includes(handlerName)) {
    // No user message, just return
    if (is.not.array(currentSchema[0])) return result;
  }

  // The most common case: [0] is rule and [1] is errText
  result.schema = { [handlerName]: currentSchema[0] };
  // eslint-disable-next-line prefer-destructuring
  result.userErrorText = currentSchema[1];
  return result;
}


function ruleRunner(ruleName, ruleHandler, fieldName, value, pschema) {
  const { schema, userErrorText } = extractUserDefinedMsg(
    ruleName,
    pschema
  );

  if (RuleWhichNeedsBoolean.includes(ruleName)) {
    if (schema[ruleName] === false) return;
  }

  const result = ruleHandler(fieldName, value, schema);
  if (result.isValid) return;

  throwError(value, userErrorText || result.errorText);
}
