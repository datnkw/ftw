export const getObjectLevel = values => {
  let result = {};

  const { subjects } = values;

  subjects.forEach(el => {
    const fieldLevelName = `level${el}`;
    result[fieldLevelName] = values[fieldLevelName];
  });

  return result;
};
