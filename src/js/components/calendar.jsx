import React, { PureComponent } from "react";
import { PropTypes } from "prop-types";
import moment from "@lib/extendedMoment";
import CalendarHeader from "@components/calendarHeader";
export default class CalendarComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.onMonthChange = ::this.onMonthChange;
    this.onYearChange = ::this.onYearChange;
    let { date, format } = props;
    date = date || moment().format("DD/MM/YYYY");
    date = moment(date, format);
    this.state = {
      ...CalendarComponent.getStateValuesFromMomentDate(date)
    };
  }

  //Logic to generate calendar data for display
  static getWeekNumbers(monthRange) {
    let weekNumbers = [];
    let indexOf = [].indexOf;
    Array.from(monthRange.by("days")).map(function(moment) {
      let ref;
      if (
        weekNumbers.length < 6 &&
        ((ref = moment.week()), indexOf.call(weekNumbers, ref)) < 0
      ) {
        return weekNumbers.push(moment.week());
      }
    });

    return weekNumbers;
  }
  static getWeeksRange(weeks, year, month) {
    let weeksRange = [];

    for (let i = 0, len = weeks.length; i < len; i++) {
      let week = weeks[i];
      let firstWeekDay, lastWeekDay;
      if (i > 0 && week < weeks[i - 1]) {
        firstWeekDay = moment([year, month])
          .add(1, "year")
          .week(week)
          .day(0);
        lastWeekDay = moment([year, month])
          .add(1, "year")
          .week(week)
          .day(6);
      } else {
        firstWeekDay = moment([year, month])
          .week(week)
          .day(0);
        lastWeekDay = moment([year, month])
          .week(week)
          .day(6);
      }
      let weekRange = moment.range(firstWeekDay, lastWeekDay);
      weeksRange.push(weekRange);
    }
    return weeksRange;
  }
  createCalendarGridData() {
    let { month, year } = this.state;
    let startDate = moment([year, month]);
    let firstDay = moment(startDate).startOf("month");
    let endDay = moment(startDate).add(60, "d");
    let monthRange = moment.range(firstDay, endDay);
    let weeksRange = [];
    weeksRange = CalendarComponent.getWeeksRange(
      CalendarComponent.getWeekNumbers(monthRange),
      year,
      month
    );

    let weekList = [];
    weeksRange.map(function(week) {
      let daysList = [];
      Array.from(week.by("days")).map(function(day) {
        daysList.push(day);
      });
      weekList.push(daysList);
    });
    return weekList;
  }

  //React component life cycle events
  static getDerivedStateFromProps(nextProps, prevState) {
    let { date, format } = nextProps;
    const momentDate = moment(date, format);
    return {
      ...CalendarComponent.getStateValuesFromMomentDate(momentDate),
      ...prevState
    };
  }

  //Inter component communication
  onMonthChange(value) {
    const { month, year } = this.state;
    const momentDate = moment([year, month]);
    this.setState({
      ...CalendarComponent.getStateValuesFromMomentDate(
        momentDate.add(value, "M")
      )
    });
  }

  onYearChange(value) {
    const { month, year } = this.state;
    const momentDate = moment([year, month]);
    this.setState({
      ...CalendarComponent.getStateValuesFromMomentDate(
        momentDate.add(value, "year")
      )
    });
  }

  //Private component logic
  static getStateValuesFromMomentDate(momentDate) {
    let demo = {
      monthName: momentDate.format("MMM"),
      month: parseInt(momentDate.format("MM"), 10) - 1,
      year: parseInt(momentDate.format("YYYY"), 10)
    };
    return demo;
  }

  //Rendering logic
  getWeekBody(week) {
    return week.map(day => {
      return <td key={day.format("DD/MM")}>{day.format("DD")}</td>;
    });
  }
  getCalendarBody() {
    return this.createCalendarGridData().map((week, index) => {
      return <tr key={index}>{this.getWeekBody(week)}</tr>;
    });
  }
  render() {
    const { monthName, year } = this.state;
    const displayMonthName = `${monthName} ${year}`;
    return (
      <div className="calendar">
        <CalendarHeader
          name={displayMonthName}
          onMonthChange={this.onMonthChange}
          onYearChange={this.onYearChange}
        />
        <table>
          <thead>
            <tr>
              <th>SU</th>
              <th>MO</th>
              <th>TU</th>
              <th>WE</th>
              <th>TH</th>
              <th>FR</th>
              <th>SA</th>
            </tr>
          </thead>
          <tbody>{this.getCalendarBody()}</tbody>
        </table>
      </div>
    );
  }
}

CalendarComponent.propTypes = {
  date: PropTypes.string,
  format: PropTypes.string
};

CalendarComponent.defaultProps = {
  date: "",
  format: "DD.MM.YYYY"
};
