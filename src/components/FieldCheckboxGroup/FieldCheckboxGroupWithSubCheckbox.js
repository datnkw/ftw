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
import { FieldCheckbox, ValidationError } from '../../components';
import { injectIntl } from '../../util/reactIntl';
import FieldCheckboxGroup from './FieldCheckboxGroup';
import { findOptionsForSelectFilter } from '../../util/search';
import config from '../../config';
import configLevel from '../../config-level';
import { OnChange } from 'react-final-form-listeners';
import css from './FieldCheckboxGroup.css';

const FieldCheckboxWithSubCheckboxRenderer = props => {
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
    initialValues,
    subErrorMsg,
  } = props;

  const [choosenOption, setChoosenOption] = useState([]);

  useEffect(() => {
    setChoosenOption(initialValues.subjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIsChoosen = subject => {
    if (!choosenOption) {
      return false;
    }
    return choosenOption.includes(subject);
  };

  const classes = classNames(rootClassName || css.root, className);
  const classesSubCheckbox = classNames(classes, css.subCheckbox);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  const getSelectableLevel = subject => {
    let result = [];

    const filterConfig = config.custom.filters;

    const allLevelOptions = findOptionsForSelectFilter('levels', filterConfig);

    for (let i = 0; i < configLevel.length; i++) {
      if (configLevel[i].subject === subject) {
        configLevel[i].level.forEach(el => {
          result.push(allLevelOptions.find(item => item.key === el));
        });

        return result;
      }
    }

    return [];
  };

  return (
    <fieldset className={classes}>
      {label && options && options.length > 0 ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          const childName = `level${option.key}`;

          const getValidateBoolean = (allValues, optionKey, childName) => {
            if (
              !allValues.subjects.includes(optionKey) ||
              (!!allValues[childName] && allValues[childName].length !== 0)
            ) {
              return true;
            }

            return false;
          };
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
                id={childName}
                name={childName}
                options={getSelectableLevel(option.key)}
                isNeedMapping={isNeedMapping}
                errorMessage={subErrorMsg}
                isVisible={getIsChoosen(option.key)}
                validate={(_, allValues) => {
                  if (getValidateBoolean(allValues, option.key, childName)) {
                    return undefined;
                  }
                  return subErrorMsg;
                }}
              />
              <OnChange name={fields.name}>
                {value => {
                  setChoosenOption(value);
                }}
              </OnChange>
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={meta} />
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
