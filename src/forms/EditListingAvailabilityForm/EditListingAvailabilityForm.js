import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes, DAYS_OF_WEEK } from '../../util/types';
import { Form, Button, Modal } from '../../components';
import { EditSeatForm } from '../';
import moment from 'moment';
import { monthIdStringInUTC } from '../../util/dates';
import { ensureDayAvailabilityPlan, ensureAvailabilityException } from '../../util/data';
import { isSameDay } from 'react-dates';
import ManageAvailabilityCalendar from './ManageAvailabilityCalendar';
import ManageAvailabilityTeacherCalendar from './ManageAvailabilityTeacherCalendar';
import css from './EditListingAvailabilityForm.css';
import { TEACHER } from '../../util/listingTypes';

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

    const dateStartAndEndInUTC = date => {
      const start = moment(date)
        .utc()
        .startOf('day')
        .toDate();
      const end = moment(date)
        .utc()
        .add(1, 'days')
        .startOf('day')
        .toDate();
      return { start, end };
    };

    const makeDraftException = (exceptions, start, end, seats) => {
      const draft = ensureAvailabilityException({ attributes: { start, end, seats } });
      return { availabilityException: draft };
    };

    const findException = (exceptions, day) => {
      return exceptions.find(exception => {
        const availabilityException = ensureAvailabilityException(exception.availabilityException);
        const start = availabilityException.attributes.start;
        const dayInUTC = day.clone().utc();
        return isSameDay(moment(start).utc(), dayInUTC);
      });
    };

    const calendar = availability.calendar;
    // This component is for day/night based processes. If time-based process is used,
    // you might want to deal with local dates using monthIdString instead of monthIdStringInUTC.
    const { exceptions = [] } = calendar[monthIdStringInUTC(date)] || {};

    const onDayAvailabilityChange = async (date, seats, exceptions) => {
      const { availabilityPlan, listingId } = this.props;
      const { start, end } = dateStartAndEndInUTC(date);

      const planEntries = ensureDayAvailabilityPlan(availabilityPlan).entries;
      const seatsFromPlan = planEntries.find(
        weekDayEntry => weekDayEntry.dayOfWeek === DAYS_OF_WEEK[date.isoWeekday() - 1]
      ).seats;

      const currentException = findException(exceptions, date);
      const draftException = makeDraftException(exceptions, start, end, seatsFromPlan);
      const exception = currentException || draftException;
      const hasAvailabilityException =
        currentException && currentException.availabilityException.id;

      if (hasAvailabilityException) {
        const id = currentException.availabilityException.id;
        const isResetToPlanSeats = seatsFromPlan === seats;

        if (isResetToPlanSeats) {
          // Delete the exception, if the exception is redundant
          // (it has the same content as what user has in the plan).
          await this.props.availability.onDeleteAvailabilityException({
            id,
            currentException: exception,
            seats: seatsFromPlan,
          });
        } else {
          // If availability exception exists, delete it first and then create a new one.
          // NOTE: currently, API does not support update (only deleting and creating)
          await this.props.availability
            .onDeleteAvailabilityException({
              id,
              currentException: exception,
              seats: seatsFromPlan,
            })
            .then(r => {
              const params = { listingId, start, end, seats, currentException: exception };
              this.props.availability.onCreateAvailabilityException(params);
            });
        }
      } else {
        // If there is no existing AvailabilityExceptions, just create a new one
        const params = { listingId, start, end, seats, currentException: exception };
        await this.props.availability.onCreateAvailabilityException(params);
      }
    };

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
            onDayAvailabilityChange(date, parseInt(values.seat), exceptions).then(() => {
              onSetUpdateInProgress(false);
              onClose();
            });
          }}
        />
      </Modal>
    );
  };

  toggleModal(date) {
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
                    const { listingType } = this.props;
                    if (listingType === TEACHER) {
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
