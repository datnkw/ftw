/**
 * Provides a date picker for Final Forms (using https://github.com/airbnb/react-dates)
 *
 * NOTE: If you are using this component inside BookingDatesForm,
 * you should convert value.date to start date and end date before submitting it to API
 */
import React, { Component } from 'react';
import { bool, object, string, arrayOf } from 'prop-types';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { ValidationError, FieldSelect } from '../../components';
import { propTypes } from '../../util/types';
import { injectIntl } from '../../util/reactIntl';
import DateInput from './DateInput';
import css from './FieldDateInput.css';

const MAX_MOBILE_SCREEN_WIDTH = 768;

class FieldDateInputComponent extends Component {
  //setState fromHour
  constructor(props) {
    super(props);
    this.state = {
      timeBegin: 0,
    };
  }

  generateHourOptions(isBegin, hourBegin = -1) {
    let hourSelection = [];

    const lastHour = isBegin ? 22 : 23;

    for (let i = parseInt(hourBegin) + 1; i < lastHour; i++) {
      hourSelection.push({
        key: i,
        //render hour format: hh:mm
        label: `${i < 10 ? '0' + i : i}:00`,
      });
    }

    return hourSelection;
  }

  render() {
    const {
      className,
      rootClassName,
      id,
      label,
      input,
      meta,
      useMobileMargins,
      intl,
      ...rest
    } = this.props;

    if (label && !id) {
      throw new Error('id required when a label is given');
    }

    const { touched, invalid, error } = meta;
    const value = input.value;

    // If startDate is valid label changes color and bottom border changes color too
    const dateIsValid = value && value.date instanceof Date;
    // Error message and input error styles are only shown if the
    // field has been touched and the validation has failed.
    const hasError = touched && invalid && error;

    const inputClasses = classNames({
      [css.pickerSuccess]: dateIsValid,
      [css.pickerError]: hasError,
    });

    const { onBlur, onFocus, type, checked, ...restOfInput } = input;

    const inputProps = {
      onBlur: input.onBlur,
      onFocus: input.onFocus,
      useMobileMargins,
      id,
      readOnly: typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH,
      ...restOfInput,
      ...rest,
    };

    if (!inputProps.value) {
      inputProps.value = {
        date: null,
      };
    }

    const classes = classNames(rootClassName || css.fieldRoot, className);
    const errorClasses = classNames({ [css.mobileMargins]: useMobileMargins });

    return (
      <div className={classes}>
        {label ? (
          <label className={classNames({ [css.mobileMargins]: useMobileMargins })} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <DateInput className={JSON.stringify(inputClasses)} {...inputProps} />
        <ValidationError className={errorClasses} fieldMeta={meta} />
        <div className={css.hourSelectorWrapper}>
          <FieldSelect
            name="FromHour"
            id="from"
            label={intl.formatMessage({ id: 'FieldDateInput.fromLabel' })}
            onChangeCustomEvent={event => {
              this.setState({
                timeBegin: event.target.value,
              });
            }}
          >
            <option disabled value="">
              {intl.formatMessage({ id: 'FieldDateInput.selectHour' })}
            </option>
            {this.generateHourOptions(true).map(c => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect
            name="ToHour"
            id="to"
            label={intl.formatMessage({ id: 'FieldDateInput.toLabel' })}
          >
            <option disabled value="">
              {intl.formatMessage({ id: 'FieldDateInput.selectHour' })}
            </option>
            {this.generateHourOptions(false, this.state.timeBegin).map(c => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </FieldSelect>
        </div>
      </div>
    );
  }
}

FieldDateInputComponent.defaultProps = {
  className: null,
  rootClassName: null,
  useMobileMargins: false,
  id: null,
  label: null,
  placeholderText: null,
  timeSlots: null,
};

FieldDateInputComponent.propTypes = {
  className: string,
  rootClassName: string,
  useMobileMargins: bool,
  id: string,
  label: string,
  placeholderText: string,
  timeSlots: arrayOf(propTypes.timeSlot),
  input: object.isRequired,
  meta: object.isRequired,
};

const FieldDateInput = props => {
  return <Field component={FieldDateInputComponent} {...props} />;
};

export { DateInput };
export default injectIntl(FieldDateInput);
