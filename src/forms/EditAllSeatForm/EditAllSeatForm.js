import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import * as validators from '../../util/validators';
import { propTypes } from '../../util/types';
import { Button, Form, FieldNumberInput } from '../../components';
import css from '../EditAllSeatForm/EditAllSeatForm.css';

export const EditAllSeatFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        // disabled,
        ready,
        handleSubmit,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        intl,
      } = formRenderProps;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      const inputRequired = validators.required(
        intl.formatMessage({
          id: 'EditSeatForm.inputRequired',
        })
      );

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditAllSeatForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditAllSeatForm.showListingFailed" />
            </p>
          ) : null}
          <FieldNumberInput
            id="allSeat"
            name="allSeat"
            className={css.seatNumberInput}
            type="text"
            label="set seat for all date"
            placeholder="input number of seat"
            maxLength="10"
            validate={inputRequired}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditAllSeatFormComponent.defaultProps = { fetchErrors: null };

EditAllSeatFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditAllSeatFormComponent);
