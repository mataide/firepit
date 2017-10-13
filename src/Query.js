const { UTILS } = require('./');
const { isInteger, isString, isObject, mergeDeep } = UTILS;
const { isValidFirestoreField, isValidSort } = require('./validate/shared');
const QueryInternal = require('./internals/QueryInternal');

class Query extends QueryInternal {
  constructor(model, initialCriteria = {}) {
    super(model, initialCriteria);
  }

  limit(val) {
    if (!isInteger(value)) throw new Error('limit must be an integer'); // todo
    if (val < 0) throw new Error('limit should not be less than 0'); // todo
    this._limit = val;
    return this;
  }

  page(val) {
    if (!isInteger(value)) throw new Error('page must be an integer'); // todo
    if (val < 0) throw new Error('page should not be less than 0'); // todo
    this._page = val;
    return this;
  }


  populate(association, subCriteria) {
    // todo
  }

  where(criteria) {
    if (!isObject(criteria)) throw new Error('criteria must be an object'); // todo
    mergeDeep(this._criteria, criteria);
    return this;
  }

  /**
   *
   * @param sortCriteria
   * @param sortValue
   * @return {Query}
   */
  sort(sortCriteria, sortValue) {
    let _sortCriteria = sortCriteria;
    if (isString(sortCriteria)) {
      _sortCriteria = { [sortCriteria]: sortValue === undefined ? 'asc' : sortValue };
    }

    // validate
    const entries = Object.entries(_sortCriteria);

    for (let i = 0, len = entries.length; i < len; i++) {
      const field = entries[i][0];
      const value = entries[i][1];

      if (!isValidFirestoreField(field)) {
        throw new Error('invalid firestore field name for sort()'); // todo
      }

      if (!isValidFirestoreField(field)) {
        throw new Error('invalid firestore field name for sort()'); // todo
      }

      if (!isValidSort(value)) {
        throw new Error('sort value must be one of X Y Z'); // todo
      }
    }

    this._sort = mergeDeep(this._sort || {}, _sortCriteria);
    return this;
  }

  /**
   * Promise .then proxy
   * @param fn
   */
  then(fn) {
    this._promiseDeferred();
    if (this._promise) return this._promise.then.bind(this._promise)(fn);
    return undefined; // will never get here - just to keep flow happy
  }

  /**
   * Promise .catch proxy
   * @param fn
   */
  catch(fn) {
    this._promiseDeferred();
    if (this._promise) return this._promise.catch.bind(this._promise)(fn);
    return undefined; // will never get here - just to keep flow happy
  }
}

module.exports = Query;