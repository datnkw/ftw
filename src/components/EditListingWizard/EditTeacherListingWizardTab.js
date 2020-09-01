import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from '../../util/reactIntl';
import routeConfiguration from '../../routeConfiguration';
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPES,
} from '../../util/urlHelpers';
import { ensureListing } from '../../util/data';
import { createResourceLocatorString } from '../../util/routes';
import {
  EditTeacherListingGeneralPanel,
  EditTeacherListingLocationPanel,
  EditTeacherListingPricingPanel,
  EditTeacherListingAvailabilityPanel,
  EditTeacherListingPhotosPanel,
} from '../../components';

import css from './EditListingWizard.css';

export const GENERAL = 'general';
export const TEACHER_LOCATION = 'location';
export const TEACHER_PRICING = 'pricing';
export const TEACHER_AVAILABILITY = 'availability';
export const TEACHER_PHOTOS = 'photos';

// EditListingWizardTab component supports these tabs
export const SUPPORTED_TABS = [
  GENERAL,
  TEACHER_LOCATION,
  TEACHER_PRICING,
  TEACHER_AVAILABILITY,
  TEACHER_PHOTOS,
];

const pathParamsToNextTab = (params, tab, marketplaceTabs) => {
  const nextTabIndex = marketplaceTabs.findIndex(s => s === tab) + 1;
  const nextTab =
    nextTabIndex < marketplaceTabs.length
      ? marketplaceTabs[nextTabIndex]
      : marketplaceTabs[marketplaceTabs.length - 1];
  return { ...params, tab: nextTab };
};

// When user has update draft listing, he should be redirected to next EditListingWizardTab
const redirectAfterDraftUpdate = (listingId, params, tab, marketplaceTabs, history) => {
  const currentPathParams = {
    ...params,
    type: LISTING_PAGE_PARAM_TYPE_DRAFT,
    id: listingId,
  };
  const routes = routeConfiguration();

  // Replace current "new" path to "draft" path.
  // Browser's back button should lead to editing current draft instead of creating a new one.
  if (params.type === LISTING_PAGE_PARAM_TYPE_NEW) {
    const draftURI = createResourceLocatorString(
      'EditTeacherListingPage',
      routes,
      currentPathParams,
      {}
    );
    history.replace(draftURI);
  }

  // Redirect to next tab
  const nextPathParams = pathParamsToNextTab(currentPathParams, tab, marketplaceTabs);
  const to = createResourceLocatorString('EditTeacherListingPage', routes, nextPathParams, {});
  history.push(to);
};

const EditTeacherListingWizardTab = props => {
  const {
    tab,
    marketplaceTabs,
    params,
    images,
    onImageUpload,
    onRemoveImage,
    onUpdateImageOrder,
    errors,
    fetchInProgress,
    newListingPublished,
    history,
    availability,
    listing,
    handleCreateFlowTabScrolling,
    handlePublishListing,
    onUpdateListing,
    onCreateListingDraft,
    onChange,
    updatedTab,
    updateInProgress,
    intl,
  } = props;

  const { type } = params;
  const isNewURI = type === LISTING_PAGE_PARAM_TYPE_NEW;
  const isDraftURI = type === LISTING_PAGE_PARAM_TYPE_DRAFT;
  const isNewListingFlow = isNewURI || isDraftURI;

  const currentListing = ensureListing(listing);
  const imageIds = images => {
    return images ? images.map(img => img.imageId || img.id) : null;
  };

  const onCompleteEditListingWizardTab = (tab, updateValues) => {
    // Normalize images for API call
    const { images: updatedImages, ...otherValues } = updateValues;
    const imageProperty =
      typeof updatedImages !== 'undefined' ? { images: imageIds(updatedImages) } : {};
    const updateValuesWithImages = { ...otherValues, ...imageProperty };

    console.log('updateValues: ', updateValues);

    if (isNewListingFlow) {
      const onUpsertListingDraft = isNewURI
        ? (tab, updateValues) => onCreateListingDraft(updateValues)
        : onUpdateListing;

      const upsertValues = isNewURI
        ? updateValuesWithImages
        : { ...updateValuesWithImages, id: currentListing.id };

      onUpsertListingDraft(tab, upsertValues)
        .then(r => {
          if (tab === 'updateAllSeat') {
            return;
          } else if (tab !== marketplaceTabs[marketplaceTabs.length - 1]) {
            // Create listing flow: smooth scrolling polyfill to scroll to correct tab
            handleCreateFlowTabScrolling(false);

            // After successful saving of draft data, user should be redirected to next tab
            redirectAfterDraftUpdate(r.data.data.id.uuid, params, tab, marketplaceTabs, history);
          } else {
            handlePublishListing(currentListing.id);
          }
        })
        .catch(e => {
          // No need for extra actions
        });
    } else {
      onUpdateListing(tab, { ...updateValuesWithImages, id: currentListing.id });
    }
  };

  const panelProps = tab => {
    return {
      className: css.panel,
      errors,
      listing,
      onChange,
      panelUpdated: updatedTab === tab,
      updateInProgress,
      // newListingPublished and fetchInProgress are flags for the last wizard tab
      ready: newListingPublished,
      disabled: fetchInProgress,
    };
  };

  switch (tab) {
    case GENERAL: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewGeneral'
        : 'EditListingWizard.saveEditGeneral';

      return (
        <EditTeacherListingGeneralPanel
          {...panelProps(GENERAL)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
        />
      );
    }
    case TEACHER_AVAILABILITY: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewTeacherAvailability'
        : 'EditListingWizard.saveEditTeacherAvailability';

      return (
        <EditTeacherListingAvailabilityPanel
          {...panelProps(TEACHER_AVAILABILITY)}
          availability={availability}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
          onSubmitCustomAvailabilityPlan={values => {
            onCompleteEditListingWizardTab('updateAllSeat', values);
          }}
        />
      );
    }
    case TEACHER_LOCATION: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewTeacherLocation'
        : 'EditListingWizard.saveEditTeacherLocation';

      return (
        <EditTeacherListingLocationPanel
          {...panelProps(TEACHER_LOCATION)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
        />
      );
    }
    case TEACHER_PRICING: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewTeacherPricing'
        : 'EditListingWizard.saveEditTeacherPricing';

      return (
        <EditTeacherListingPricingPanel
          {...panelProps(TEACHER_PRICING)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
        />
      );
    }
    case TEACHER_PHOTOS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewTeacherPhotos'
        : 'EditListingWizard.saveEditTeacherPhotos';

      return (
        <EditTeacherListingPhotosPanel
          {...panelProps(TEACHER_PHOTOS)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          images={images}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values);
          }}
          onUpdateImageOrder={onUpdateImageOrder}
        />
      );
    }
    default:
      return <div>null</div>;
  }
};

EditTeacherListingWizardTab.defaultProps = {
  listing: null,
  updatedTab: null,
};

const { array, bool, func, object, oneOf, shape, string } = PropTypes;

EditTeacherListingWizardTab.propTypes = {
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: oneOf(SUPPORTED_TABS).isRequired,
  }).isRequired,
  errors: shape({
    createListingDraftError: object,
    publishListingError: object,
    updateListingError: object,
    showListingsError: object,
    uploadImageError: object,
  }).isRequired,
  fetchInProgress: bool.isRequired,
  newListingPublished: bool.isRequired,
  history: shape({
    push: func.isRequired,
    replace: func.isRequired,
  }).isRequired,
  images: array.isRequired,
  availability: object.isRequired,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: shape({
    attributes: shape({
      publicData: object,
      description: string,
      geolocation: object,
      pricing: object,
      title: string,
    }),
    images: array,
  }),

  handleCreateFlowTabScrolling: func.isRequired,
  handlePublishListing: func.isRequired,
  onUpdateListing: func.isRequired,
  onCreateListingDraft: func.isRequired,
  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onRemoveImage: func.isRequired,
  onChange: func.isRequired,
  updatedTab: string,
  updateInProgress: bool.isRequired,

  intl: intlShape.isRequired,
};

export default EditTeacherListingWizardTab;
