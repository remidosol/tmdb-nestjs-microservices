/**
 * Transform the _id field of a document from ObjectId to string
 *
 * @param val document
 * @returns document
 */
export const transformSingle = (val: any) => {
  if (!val) return val;

  if (val._id && !val._bsontype) {
    const newVal = JSON.parse(JSON.stringify(val));
    newVal._id = val._id.toString();

    return newVal;
  } else if (val._bsontype) {
    const newVal = val.toString();

    return newVal;
  }
};

/**
 * Transform the _id fields of array of documents from ObjectId to string
 *
 * @param val array of documents
 * @returns array of documents
 */
export const transformMultiple = (val: any[]) => {
  const newValue = JSON.parse(JSON.stringify(val));

  if (val && Array.isArray(val) && val.length) {
    for (const idx in val) {
      if (val[idx]._id && !val[idx]._bsontype) {
        newValue[idx]._id = val[idx]._id.toString();
      } else if (val[idx]._bsontype) {
        newValue[idx] = val[idx].toString();
      }
    }

    return newValue;
  }

  return newValue;
};
