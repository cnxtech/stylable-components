import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {
    getDayNames,
    getDaysInMonth,
    getMonthFromOffset,
    getMonthNames,
    getNumOfPreviousDays
} from '../../common/date-helpers';
import styles from './date-picker.st.css';
import {Day} from './day';

export interface CalendarProps {
    value: Date;
    onChange(date: Date): void;
}

const monthNames = getMonthNames();

@observer
export class Calendar extends React.Component<CalendarProps, {}> {
    @observable private date: Date = this.props.value;

    public render() {
        return (
            <div tabIndex={1} id="DATE_PICKER_DROPDOWN">
                <div className={styles.dropdownArrowWrapper}><div className={styles.dropdownArrow} /></div>
                <div className={styles.dropdown} data-automation-id="DATE_PICKER_DROPDOWN">
                    <div className={styles.header}>
                        <span
                            className={`${styles.arrowWrapper} ${styles.arrowWrapperPrev}`}
                            onMouseDown={this.goToPrevMonth}
                            data-automation-id="PREV_MONTH_BUTTON"
                        >
                            <i className={`${styles.headerArrow} ${styles.headerArrowPrev}`} />
                        </span>
                        <span className={styles.headerDate}>
                            <span
                                data-automation-id="MONTH_NAME"
                            >
                                {this.monthName}
                            </span>&nbsp;<span data-automation-id="YEAR">{this.year}</span>
                        </span>
                        <div
                            className={`${styles.arrowWrapper} ${styles.arrowWrapperNext}`}
                            onMouseDown={this.goToNextMonth}
                            data-automation-id="NEXT_MONTH_BUTTON"
                        >
                            <i className={`${styles.headerArrow} ${styles.headerArrowNext}`} />
                        </div>
                    </div>
                    <div className={styles.calendar} data-automation-id="DAY_GRID">
                        {this.dayNames}
                        {this.previousDays}
                        {this.days}
                    </div>
                </div>
            </div>
        );
    }

    private onChange = (day: number) => {
        const date = new Date(this.date.getFullYear(), this.date.getMonth(), day);
        this.props.onChange(date);
    }

    @action
    private setDate(date: Date) {
        this.date = date;
    }

    @computed
    get monthName(): string {
        return monthNames[this.date.getMonth()];
    }

    @computed
    get year(): number {
        return this.date.getFullYear();
    }

    @computed
    get days(): JSX.Element[] {
        const dayArray: JSX.Element[] = [];
        const daysInMonth = getDaysInMonth(this.date);

        for (let i = 1; i <= daysInMonth; i++) {
            dayArray.push(
                <Day
                    day={i}
                    onSelect={this.onChange}
                    dataAutomationId={'DAY_' + i}
                    key={'DAY_' + i}
                />
            );
        }

        return dayArray;
    }

    @computed
    get dayNames(): JSX.Element[] {
        return getDayNames().map((name: string, index: number) => {
            return (
                <span
                    className={`${styles.calendarItem} ${styles.dayName}`}
                    key={'DAY_NAME_' + index}
                    data-automation-id={'DAY_NAME_' + name.toUpperCase()}
                >
                    {name}
                </span>
            );
        });
    }

    @computed
    get previousDays(): JSX.Element[] {
        const previousDays: JSX.Element[] = [];
        const lastDayOfPrevMonth: number = getDaysInMonth(getMonthFromOffset(this.date, -1));
        const numberOfDaysToDisplay: number = lastDayOfPrevMonth - getNumOfPreviousDays(this.date);

        for (let i = numberOfDaysToDisplay + 1; i <= lastDayOfPrevMonth; i++) {
            previousDays.push((
                <Day
                    day={''}
                    dataAutomationId={'PREV_DAY_' + i}
                    key={'PREV_DAY_' + i}
                    partOfPrevMonth={true}
                />
            ));
        }

        return previousDays;
    }

    private goToNextMonth: React.EventHandler<React.SyntheticEvent<Element>> = event => {
        event.preventDefault();
        const nextMonth: Date = getMonthFromOffset(
            new Date(this.date.getFullYear(), this.date.getMonth(), 1),
            1
        );
        this.setDate(nextMonth);
    }

    private goToPrevMonth: React.EventHandler<React.SyntheticEvent<Element>> = event => {
        event.preventDefault();
        const previousMonth: Date = getMonthFromOffset(
            new Date(this.date.getFullYear(), this.date.getMonth(), 1),
            -1
        );
        this.setDate(previousMonth);
    }

}