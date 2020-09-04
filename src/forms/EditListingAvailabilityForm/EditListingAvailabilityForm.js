import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button, Modal } from '../../components';
import { EditSeatForm } from '../';
import { monthIdStringInUTC } from '../../util/dates';
import ManageAvailabilityCalendar from './ManageAvailabilityCalendar';
import ManageAvailabilityTeacherCalendar from './ManageAvailabilityTeacherCalendar';
import css from './EditListingAvailabilityForm.css';

export class EditListingAvailabilityFormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenModal: false,
      date: null,
      updateInProgress: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  ModalSetSeat = props => {
    const {
      isOpenModal,
      onClose,
      availability,
      date,
      updateInProgress,
      onSetUpdateInProgress,
    } = props;

    const calendar = availability.calendar;
    // This component is for day/night based processes. If time-based process is used,
    // you might want to deal with local dates using monthIdString instead of monthIdStringInUTC.
    const { exceptions = [] } = calendar[monthIdStringInUTC(date)] || {};

    return (
      <Modal
        id="SetSeatModal"
        // containerClassName={containerClassName}
        isOpen={isOpenModal}
        onClose={() => {
          onClose();
        }}
        onManageDisableScrolling={() => {}}
        // closeButtonMessage={closeButtonMessage}
      >
        <EditSeatForm
          isOpenModal={isOpenModal}
          date={date}
          updateInProgress={updateInProgress}
          onSubmit={values => {
            onSetUpdateInProgress(true);
            this.onDayAvailabilityChange(date, parseInt(values.seat), exceptions).then(() => {
              onSetUpdateInProgress(false);
              onClose();
            });
          }}
        />
      </Modal>
    );
  };

  toggleModal(date) {
    console.log('date in toggleModal: ', date);

    this.setState({
      isOpenModal: !this.state.isOpenModal,
      date,
    });
  }

  render() {
    const ModalSetSeat = this.ModalSetSeat;
    return (
      <div>
        <FinalForm
          {...this.props}
          toggleModal={this.toggleModal}
          render={formRenderProps => {
            const {
              className,
              rootClassName,
              disabled,
              ready,
              handleSubmit,
              //intl,
              invalid,
              pristine,
              saveActionMsg,
              updated,
              updateError,
              updateInProgress,
              availability,
              availabilityPlan,
              listingId,
              toggleModal,
            } = formRenderProps;

            const errorMessage = updateError ? (
              <p className={css.error}>
                <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
              </p>
            ) : null;

            const classes = classNames(rootClassName || css.root, className);
            const submitReady = (updated && pristine) || ready;
            const submitInProgress = updateInProgress;
            const submitDisabled = invalid || disabled || submitInProgress;

            return (
              <Form className={classes} onSubmit={handleSubmit}>
                {errorMessage}
                <div className={css.calendarWrapper}>
                  {(() => {
                    const { isTeacher } = this.props;
                    if (isTeacher) {
                      return (
                        <ManageAvailabilityTeacherCalendar
                          availability={availability}
                          availabilityPlan={availabilityPlan}
                          listingId={listingId}
                          toggleModal={toggleModal}
                        />
                      );
                    }

                    return (
                      <ManageAvailabilityCalendar
                        availability={availability}
                        availabilityPlan={availabilityPlan}
                        listingId={listingId}
                      />
                    );
                  })()}
                </div>

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
        <ModalSetSeat
          isOpenModal={this.state.isOpenModal}
          onClose={this.toggleModal}
          availability={this.props.availability}
          date={this.state.date}
          updateInProgress={this.state.updateInProgress}
          onSetUpdateInProgress={isInProgress => {
            this.setState({
              updateInProgress: isInProgress,
            });
          }}
        />
      </div>
    );
  }
}

EditListingAvailabilityFormComponent.defaultProps = {
  updateError: null,
};

EditListingAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availability: object.isRequired,
  availabilityPlan: propTypes.availabilityPlan.isRequired,
};

export default compose(injectIntl)(EditListingAvailabilityFormComponent);
