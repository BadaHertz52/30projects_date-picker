class DatePicker {
  monthData = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // date-input 의 text
  #calendarDate = {
    data: "", // Date 객체
    date: 0,
    month: 0,
    year: 0,
  };
  datePickerEl;
  dateInputEl;
  calendarEl;
  calendarMonthEl;
  monthContentEl;
  nextBtnEl;
  prevBtnEl;
  calendarDatesEl;
  selectedDate = {
    data: "", // Date 객체
    date: 0,
    month: 0, // getMonth() +1
    year: 0,
  };
  constructor() {
    this.initCalendarDate();
    this.assignElement();
    this.initDateInput();
    this.addEvent();
  }
  /**
   * this.#calendarDate 초기화
   */
  initCalendarDate() {
    const data = new Date();
    const date = data.getDate();
    const month = data.getMonth() + 1;
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  assignElement() {
    this.datePickerEl = document.getElementById("date-picker");
    this.dateInputEl = this.datePickerEl.querySelector("#date-input");
    this.calendarEl = this.datePickerEl.querySelector("#calendar");
    this.calendarMonthEl = this.datePickerEl.querySelector("#month");
    this.monthContentEl = this.calendarMonthEl.querySelector("#content");
    this.nextBtnEl = this.calendarMonthEl.querySelector("#next");
    this.prevBtnEl = this.calendarMonthEl.querySelector("#prev");
    this.calendarDatesEl = this.datePickerEl.querySelector("#dates");
  }

  addEvent() {
    this.dateInputEl.addEventListener("click", this.toggleCalendar.bind(this));
  }
  /**
   * date-input에 오늘 날짜를 입력
   */
  initDateInput() {
    const { year, month, date } = this.#calendarDate;
    this.dateInputEl.textContent = `${year}/${month}/${date}`;
  }
  /**
   * this.dateInputEl의 text을 기준으로 달력을 보여줌
   */
  toggleCalendar() {
    this.calendarEl.classList.toggle("active");
    this.updateMonth();
    this.updateDates();
  }
  /**
   * 현재 날짜에 맞추어 month 의 content변경
   */
  updateMonth() {
    const { year, month, date } = this.#calendarDate;
    this.monthContentEl.textContent = `${year} ${
      this.monthData[month - 1]
    } ${date}`;
  }
  /**
   * 현재 날짜에 맞추어 캘린더의 date 추가
   */
  updateDates() {
    this.calendarDatesEl.innerHTML = "";
    const { year, month } = this.#calendarDate;
    const fragment = new DocumentFragment();
    // 해당 연월에 있는 날짜 개수
    const numberOfDates = new Date(year, month - 1, 0).getDate();
    // 날짜 개수 만큼 date 요소 추가
    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement("div");
      dateEl.classList.add("date");
      dateEl.textContent = i + 1;
      dateEl.dataset.date = i + 1;
      fragment.appendChild(dateEl);
    }
    // 캘린더에 요일 맞추어 스타일 적용
    fragment.firstChild.style.gridColumnStart =
      new Date(year, month - 1, 1).getDay() + 1;
    this.calendarDatesEl.appendChild(fragment);
    this.colorWeekend();
  }
  /**
   * 토요일, 일요일인 날짜에  색 지정
   */
  colorWeekend() {
    const { year, month } = this.#calendarDate;
    const firstDateDay = new Date(year, month - 1, 1).getDay();
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n + ${7 - firstDateDay})`
    );
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${8 - firstDateDay} )`
    );
    saturdayEls.forEach((i) => (i.style.color = "blue"));
    sundayEls.forEach((i) => (i.style.color = "red"));
  }
}

new DatePicker();
