/**
 * Provides a date picker for Final Forms (using https://github.com/airbnb/react-dates)
 *
 * NOTE: If you are using this component inside BookingDatesForm,
 * you should convert value.date to start date and end date before submitting it to API
 */
import React, { Component } from 'react';
import { Field } from 'react-final-form';
import { FieldSelect } from '..';
import { injectIntl } from '../../util/reactIntl';
import { OnChange } from 'react-final-form-listeners';
import css from './FieldTimeInput.css';

class FieldTimeInputComponent extends Component {
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
    const { intl } = this.props;

    return (
      <div className={css.hourSelectorWrapper}>
        <FieldSelect
          name="FromHour"
          id="from"
          label={intl.formatMessage({ id: 'FieldDateInput.fromLabel' })}
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
        <OnChange name="FromHour">
          {value => {
            this.setState({
              timeBegin: value,
            });
          }}
        </OnChange>
        <div className={css.divineLine}></div>
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
    );
  }
}

const FieldTimeInput = props => {
  return <Field component={FieldTimeInputComponent} {...props} />;
};

export default injectIntl(FieldTimeInput);
