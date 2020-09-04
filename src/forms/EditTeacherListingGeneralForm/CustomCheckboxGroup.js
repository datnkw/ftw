import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from '../EditListingDescriptionForm/EditListingDescriptionForm.css';

const CustomCheckboxGroup = props => {
  const { subjectSelected, categories, intl, allText } = props;
  const categoryLabel = intl.formatMessage({
    id: allText.label,
  });
  const categoryPlaceholder = intl.formatMessage({
    id: allText.placeholder,
  });
  const categoryRequired = required(
    intl.formatMessage({
      id: allText.required,
    })
  );
  return categories ? (
    <FieldSelect
      className={css.category}
      name={name}
      id={id}
      label={categoryLabel}
      validate={categoryRequired}
    >
      <option disabled value="">
        {categoryPlaceholder}
      </option>
      {categories.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomCheckboxGroup;
