import React from "react";
import dateFns from "date-fns";
// import { es, ru,ar } from 'date-fns/locale'
class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };
  renderHeader() {    
    const dateFormat = "MMMM YYYY dddd";
//     const locales = { es, ru,ar}
// window.__localeId__ = 'es'

//     const x=format(new Date(),dateFormat, {
//      } )
// console.log("day====>",x)
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevDays}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.selectedDate, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextDays}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth+1);
      
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);

    const endDate = dateFns.endOfWeek(monthEnd);
    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day =this.state.selectedDate;
    let formattedDate = "";
    let end=new Date().setDate(new Date().getDate()+30);
    while (day <= new Date(end)) {
       for (let i =0; i <7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;

        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, selectedDate)
                ? ""
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <div className="number">
              <span>{formattedDate}</span>
           
            </div>

            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return(      <div style={{width:"100%"}}>
        <div className="">
          <div className="icon" onClick={this.prevDays}>
            chevron_left
          </div>
        </div>
   
     <div className="body">{rows}</div>
     
     <div className="" onClick={this.nextDays}>
          <div className="icon">
            chevron_right
            
            </div>
        </div>
    </div>)
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    if(this.state.currentMonth.getMonth()<new Date().getMonth()+3)

    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };
  prevMonth = () => {
    if(this.state.currentMonth.getMonth()>new Date().getMonth())

    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };
  nextDays = () => {
    this.setState({
      selectedDate: dateFns.addDays(this.state.selectedDate, 7)
    });
  };
  prevDays = () => {
    if(this.state.selectedDate.getTime()>new Date().getTime())

  {
    this.setState({
      selectedDate: dateFns.subDays(this.state.selectedDate, 7)
    });}
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

export default Calendar;
