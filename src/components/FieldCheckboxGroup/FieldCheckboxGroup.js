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
import css from './FieldCheckboxGroup.css';

const FieldCheckboxRenderer = props => {
  const {
    className,
    rootClassName,
    label,
    twoColumns,
    id,
    meta,
    fields,
    options,
    intl,
    isNeedMapping,
    isVisible,
  } = props;

  //when component use this props doesn't need hidden option, set isVisibleFinal is true
  const isVisibleFinal = isVisible === null ? true : isVisible && options && options.length > 0;

  const classes = classNames(rootClassName || css.root, className, {
    [css.visible]: isVisibleFinal,
  });
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  return (
    <fieldset className={classes}>
      {label ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          return (
            <div key={fieldId}>
              <li className={css.item}>
                <FieldCheckbox
                  id={fieldId}
                  name={fields.name}
                  label={isNeedMapping ? intl.formatMessage({ id: option.label }) : option.label}
                  value={option.key}
                />
              </li>
            </div>
          );
        })}
      </ul>
      <ValidationError fieldMeta={meta} />
    </fieldset>
  );
};

FieldCheckboxRenderer.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
  twoColumns: false,
};

FieldCheckboxRenderer.propTypes = {
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

const FieldCheckboxGroup = props => <FieldArray component={FieldCheckboxRenderer} {...props} />;

// Name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in
FieldCheckboxGroup.propTypes = {
  name: string.isRequired,
};

export default injectIntl(FieldCheckboxGroup);
