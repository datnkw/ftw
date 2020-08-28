import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';
import { findOptionsForSelectFilter } from '../../util/search';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldCheckboxGroupMappingLabel } from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import config from '../../config';

import css from '../EditListingDescriptionForm/EditListingDescriptionForm.css';

const TITLE_MAX_LENGTH = 60;

const EditTeacherListingGeneralFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
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
        filterConfig,
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

      const subjectOptions = findOptionsForSelectFilter('subjects', filterConfig);
      const levelOptions = findOptionsForSelectFilter('levels', filterConfig);

      const subjectSelectLabel = intl.formatMessage({
        id: 'EditTeacherListingGeneralForm.subjectSelectLabel',
      });
      const levelSelectLabel = intl.formatMessage({
        id: 'EditTeacherListingGeneralForm.levelSelectLabel',
      });

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
            id="teachingHour"
            name="teachingHour"
            allText={allTextTeachingHourSelect}
            categories={teachingHourOptions}
            intl={intl}
          />

          <FieldCheckboxGroupMappingLabel
            className={css.features}
            id={'subjects'}
            name={'subjects'}
            label={subjectSelectLabel}
            options={subjectOptions}
          />

          <FieldCheckboxGroupMappingLabel
            className={css.features}
            id={'levels'}
            name={'levels'}
            label={levelSelectLabel}
            options={levelOptions}
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

EditTeacherListingGeneralFormComponent.defaultProps = {
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

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
  filterConfig: propTypes.filterConfig,
};

export default compose(injectIntl)(EditTeacherListingGeneralFormComponent);
