import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './ValidationError.css';

/**
 * This component can be used to show validation errors next to form
 * input fields. The component takes the final-form Field component
 * `meta` object as a prop and infers if an error message should be
 * shown.
 */
const ValidationError = props => {
  const { rootClassName, className, fieldMeta } = props;

  const { error } = fieldMeta;

  const classes = classNames(rootClassName || css.root, className);

  return error ? <div className={classes}>{error}</div> : null;
};

ValidationError.defaultProps = { rootClassName: null, className: null };

const { shape, string } = PropTypes;

ValidationError.propTypes = {
  rootClassName: string,
  className: string,
  fieldMeta: shape({
    error: string,
  }).isRequired,
};

export default ValidationError;
