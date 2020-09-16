/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React, { useState, useEffect } from 'react';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, ValidationByErrorMsg } from '../../components';
import { injectIntl } from '../../util/reactIntl';
import { OnChange } from 'react-final-form-listeners';
import css from './FieldCheckboxGroup.css';

const FieldCheckboxRenderer = props => {
  const {
    className,
    rootClassName,
    label,
    twoColumns,
    id,
    fields,
    options,
    intl,
    isNeedMapping,
    errorMessage,
    isVisible,
    choosenOption,
  } = props;

  console.log('props: ', props);

  const [selectedValue, setSelectedValue] = useState([]);

  useEffect(() => {
    setSelectedValue(choosenOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //when component use this props doesn't need hidden option, set isVisibleFinal is true
  const isVisibleFinal = isVisible === null ? true : isVisible && options && options.length > 0;

  const classes = classNames(rootClassName || css.root, className, {
    [css.visible]: isVisibleFinal,
  });
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  const getErrorMessage = () => {
    console.log('selectedValue: ', selectedValue);

    if (!selectedValue) {
      return errorMessage;
    }
    if (selectedValue.length === 0) {
      return errorMessage;
    }

    return '';
  };

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
              <OnChange name={fields.name}>
                {value => {
                  setSelectedValue(value);
                }}
              </OnChange>
            </div>
          );
        })}
      </ul>
      <ValidationByErrorMsg fieldMeta={{ error: getErrorMessage() }} name={''} />
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
