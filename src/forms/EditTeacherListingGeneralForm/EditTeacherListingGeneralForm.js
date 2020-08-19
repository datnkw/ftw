import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput } from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';

import css from '../EditListingDescriptionForm/EditListingDescriptionForm.css';

const TITLE_MAX_LENGTH = 60;

const EditTeacherListingGeneralFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        genderOptions,
        teachingHourOptions,
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
      } = formRenderProps;

      const titleMessage = intl.formatMessage({ id: 'EditTeacherListingGeneralForm.title' });
      const titlePlaceholderMessage = intl.formatMessage({
        id: 'EditTeacherListingGeneralForm.titlePlaceholder',
      });
      const titleRequiredMessage = intl.formatMessage({
        id: 'EditTeacherListingGeneralForm.titleRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditTeacherListingGeneralForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditTeacherListingGeneralForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditTeacherListingGeneralForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditTeacherListingGeneralForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const allTextGenderSelect = {
        label: 'EditTeacherListingGeneralForm.genderLabel',
        placeholder: 'EditTeacherListingGeneralForm.genderPlaceholder',
        required: 'EditTeacherListingGeneralForm.genderRequired',
      };
      const allTextTeachingHourSelect = {
        label: 'EditTeacherListingGeneralForm.teachingHourLabel',
        placeholder: 'EditTeacherListingGeneralForm.teachingHourPlaceholder',
        required: 'EditTeacherListingGeneralForm.teachingHourRequired',
      };

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <CustomCategorySelectFieldMaybe
            id="gender"
            name="gender"
            allText={allTextGenderSelect}
            categories={genderOptions}
            intl={intl}
          />

          <CustomCategorySelectFieldMaybe
            id="gender"
            name="gender"
            allText={allTextTeachingHourSelect}
            categories={teachingHourOptions}
            intl={intl}
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

EditTeacherListingGeneralFormComponent.defaultProps = { className: null, fetchErrors: null };

EditTeacherListingGeneralFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditTeacherListingGeneralFormComponent);
