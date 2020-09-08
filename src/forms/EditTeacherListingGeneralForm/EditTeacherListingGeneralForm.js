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
import configLevel from '../../config-level';
import _ from 'lodash';

import css from '../EditListingDescriptionForm/EditListingDescriptionForm.css';

const TITLE_MAX_LENGTH = 60;

class EditTeacherListingGeneralFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedSubjects: [] };
  }

  componentDidMount() {
    this.setState({
      selectedSubjects: this.props.initialValues.subjects || [],
    });
  }

  onSelectSubject = event => {
    const { selectedSubjects } = this.state;
    const subject = event.target.value;

    if (!subject) {
      return;
    }

    const index = selectedSubjects.indexOf(subject);
    if (index !== -1) {
      selectedSubjects.splice(index, 1);
    } else {
      selectedSubjects.push(subject);
    }

    this.setState({
      selectedSubjects: [...selectedSubjects],
    });
  };

  getSelectableLevel = input => {
    let result = [];

    const filterConfig = config.custom.filters;

    const allLevelOptions = findOptionsForSelectFilter('levels', filterConfig);

    const selectedSubjects = [...(input || [])];

    const getLevelsArray = subject => {
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

    for (let i = 0; i < selectedSubjects.length; i++) {
      result = [...result, ...getLevelsArray(selectedSubjects[i])];
    }

    result = _.uniqBy(result, 'key');

    return result;
  };

  render() {
    return (
      <FinalForm
        {...this.props}
        mutators={{ ...arrayMutators }}
        selectableLevel={this.getSelectableLevel(this.state.selectedSubjects)}
        onSelectSubject={this.onSelectSubject}
        render={formRenderProps => {
          const {
            selectableLevel,
            onSelectSubject,
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

          const { updateListingError, createListingDraftError, showListingsError } =
            fetchErrors || {};
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
                onSelectSubject={onSelectSubject}
              />

              <FieldCheckboxGroupMappingLabel
                className={css.features}
                id={'levels'}
                name={'levels'}
                label={levelSelectLabel}
                options={selectableLevel}
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
  }
}

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
