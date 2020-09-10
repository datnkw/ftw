export const getObjectLevel = values => {
  let result = {};

  const { subjects } = values;

  if (!subjects) {
    return result;
  }

  subjects.forEach(el => {
    const fieldLevelName = `level${el}`;
    result[fieldLevelName] = values[fieldLevelName];
  });

  return result;
};
