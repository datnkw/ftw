/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React from 'react';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, ValidationError } from '../../components';
import { injectIntl } from '../../util/reactIntl';
import FieldCheckboxGroup from './FieldCheckboxGroup';

import css from './FieldCheckboxGroup.css';

const FieldCheckboxWithSubCheckboxRenderer = props => {
  const {
    className,
    rootClassName,
    label,
    twoColumns,
    id,
    fields,
    options,
    meta,
    intl,
    isNeedMapping,
    errorMessage,
    subLabel,
    subOptions,
    subErrorMsg,
  } = props;

  console.log('subOptions: ', subOptions);

  const classes = classNames(rootClassName || css.root, className);
  const classesSubCheckbox = classNames(classes, css.subCheckbox);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  return (
    <fieldset className={classes}>
      {label && options && options.length > 0 ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                id={fieldId}
                name={fields.name}
                label={isNeedMapping ? intl.formatMessage({ id: option.label }) : option.label}
                value={option.key}
              />
              <FieldCheckboxGroup
                className={classesSubCheckbox}
                id={`level${fields.name}`}
                name={`level${fields.name}`}
                options={subOptions}
                isNeedMapping={isNeedMapping}
                errorMessage={subErrorMsg}
              />
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta, error: errorMessage }} />
    </fieldset>
  );
};

FieldCheckboxWithSubCheckboxRenderer.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
  twoColumns: false,
};

FieldCheckboxWithSubCheckboxRenderer.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
    })
  ).isRequired,
  twoColumns: bool,
};

const FieldCheckboxGroupWithSubCheckbox = props => (
  <FieldArray component={FieldCheckboxWithSubCheckboxRenderer} {...props} />
);

// Name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in
FieldCheckboxGroupWithSubCheckbox.propTypes = {
  name: string.isRequired,
};

export default injectIntl(FieldCheckboxGroupWithSubCheckbox);
