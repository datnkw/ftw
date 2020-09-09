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
import { findOptionsForSelectFilter } from '../../util/search';
import config from '../../config';
import configLevel from '../../config-level';

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
    subOptions,
    subErrorMsg,
  } = props;

  console.log('subOptions: ', subOptions);

  const classes = classNames(rootClassName || css.root, className);
  const classesSubCheckbox = classNames(classes, css.subCheckbox);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  const getSelectableLevel = subject => {
    console.log('subject: ', subject);

    let result = [];

    const filterConfig = config.custom.filters;

    const allLevelOptions = findOptionsForSelectFilter('levels', filterConfig);

    // const getLevelsArray = subject => {
    for (let i = 0; i < configLevel.length; i++) {
      if (configLevel[i].subject === subject) {
        configLevel[i].level.forEach(el => {
          result.push(allLevelOptions.find(item => item.key === el));
        });

        return result;
      }
    }

    return [];
    // };
  };

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
                id={`level${option.key}`}
                name={`level${option.key}`}
                options={getSelectableLevel(option.key)}
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
