import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Button, Form, FieldNumberInput } from '../../components';
import css from './EditSeatForm.css';
import * as validators from '../../util/validators';

export const EditSeatFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        invalid,
        pristine,
        updated,
        updateInProgress,
        fetchErrors,
        date,
        intl,
        isOpenModal,
      } = formRenderProps;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
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
              <FormattedMessage id="EditSeatForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditSeatForm.showListingFailed" />
            </p>
          ) : null}
          <h1 className={css.titleEditSeat}>
            <FormattedMessage id="EditSeatForm.setSeatTitle" />{' '}
            <span className={css.dateInLabelEdit}>{!date ? '' : date.format('DD/MM/YYYY')}</span>
          </h1>
          <FieldNumberInput
            isOpenModal={isOpenModal}
            id="seat"
            name="seat"
            className={css.seatNumberInput}
            type="number"
            label={intl.formatMessage({ id: 'EditSeatForm.labelFieldNumberInput' })}
            placeholder={intl.formatMessage({ id: 'EditSeatForm.placeholderFieldNumberInput' })}
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
            {intl.formatMessage({ id: 'EditSeatForm.submitButtonText' })}
          </Button>
        </Form>
      );
    }}
  />
);

EditSeatFormComponent.defaultProps = { fetchErrors: null };

EditSeatFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditSeatFormComponent);
