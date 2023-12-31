type CalendarDate = {
  data: Date | undefined;
  date: number;
  month: number;
  year: number;
};
class DatePicker {
  monthData: string[] = [
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
  /**
   * 현재 보여지는 캘린더의 기준이 되는 Date
   */
  #calendarDate: CalendarDate = {
    data: undefined,
    date: 0,
    month: 0,
    year: 0,
  };
  datePickerEl: HTMLElement | undefined | null;
  dateInputEl: HTMLElement | undefined | null;
  calendarEl: HTMLElement | undefined | null;
  calendarMonthEl: HTMLElement | undefined | null;
  monthContentEl: HTMLElement | undefined | null;
  nextBtnEl: HTMLElement | undefined | null;
  prevBtnEl: HTMLElement | undefined | null;
  /**
   * 캘린더의 연,월이 정해질 경우 생성되는 날짜 요소들을 감싸는 요소
   */
  calendarDatesEl: HTMLElement | undefined | null;
  selectedDate: CalendarDate = {
    data: undefined, // Date 객체
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
    if (this.datePickerEl) {
      this.dateInputEl = this.datePickerEl.querySelector(
        "#date-input"
      ) as HTMLElement | null;
      this.calendarEl = this.datePickerEl.querySelector(
        "#calendar"
      ) as HTMLElement | null;
      this.calendarMonthEl = this.datePickerEl.querySelector(
        "#month"
      ) as HTMLElement | null;
      if (this.calendarMonthEl) {
        this.monthContentEl = this.calendarMonthEl.querySelector(
          "#content"
        ) as HTMLElement | null;
        this.nextBtnEl = this.calendarMonthEl.querySelector(
          "#next"
        ) as HTMLElement | null;
        this.prevBtnEl = this.calendarMonthEl.querySelector(
          "#prev"
        ) as HTMLElement | null;
      }
      this.calendarDatesEl = this.datePickerEl.querySelector(
        "#dates"
      ) as HTMLElement | null;
    }
  }

  addEvent() {
    this.dateInputEl?.addEventListener("click", this.toggleCalendar.bind(this));
    this.nextBtnEl?.addEventListener("click", this.moveToNextMonth.bind(this));
    this.prevBtnEl?.addEventListener("click", this.moveToPrevMonth.bind(this));
    this.calendarDatesEl?.addEventListener(
      "click",
      this.onClickSelectDate.bind(this)
    );
    document.addEventListener("click", this.closeCalendar.bind(this));
  }
  /**
   *  this.dateInputEl의 textContent, data-value의 값을 변경
   * @param  year
   * @param  month
   * @param  date
   */
  updateDateInput(year: number, month: number, date: number) {
    if (this.dateInputEl) {
      this.dateInputEl.textContent = `${year}/${this.formateNumber(
        month
      )}/${this.formateNumber(date)}`;

      this.dateInputEl.dataset.value = String(new Date(year, month - 1, date));
    }
  }
  /**
   * date-input에 오늘 날짜를 입력
   */
  initDateInput() {
    const { year, month, date } = this.#calendarDate;
    this.updateDateInput(year, month, date);
  }
  /**
   * this.dateInputEl 에서 보여주는 연월일을 기준으로 캘린더를 열기위해, this.dataInputEl의 data-value의 값에 따라,this.#calendarDate를 변경
   */
  changeCalendarDateByDataInput() {
    if (this.dateInputEl?.dataset.value) {
      const data = new Date(this.dateInputEl.dataset.value);
      this.#calendarDate = {
        data: data,
        year: data.getFullYear(),
        month: data.getMonth() + 1,
        date: data.getDate(),
      };
    }
  }
  /**
   * 캘린더의 변경이 있을 경우, 월,날짜,현재 날짜 표시 동작을 진행
   */
  updateCalendar() {
    this.updateMonth();
    this.updateDates();
    this.markToday();
    this.markSelectedDate();
  }
  /**
   * this.dateInputEl의 text을 기준으로 달력을 보여줌
   */
  toggleCalendar() {
    this.changeCalendarDateByDataInput();
    this.calendarEl?.classList.toggle("active");
    this.updateCalendar();
  }
  closeCalendar(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    const isCorrectTarget = !(
      target?.closest("#calendar") || target?.closest("#date-input")
    );
    if (this.calendarEl?.classList.contains("active") && isCorrectTarget) {
      this.calendarEl?.classList.remove("active");
    }
  }
  /**
   * 현재 날짜에 맞추어 month 의 content변경
   */
  updateMonth() {
    const { year, month, date } = this.#calendarDate;
    if (this.monthContentEl) {
      this.monthContentEl.textContent = `${year} ${
        this.monthData[month - 1]
      } ${date}`;
    }
  }
  /**
   * 현재 날짜에 맞추어 캘린더의 date 추가
   */
  updateDates() {
    if (this.calendarDatesEl) {
      this.calendarDatesEl.innerHTML = "";
      const { year, month } = this.#calendarDate;
      const fragment = new DocumentFragment();
      // 해당 연월에 있는 날짜 개수
      const numberOfDates = new Date(year, month, 0).getDate();
      // 날짜 개수 만큼 date 요소 추가
      for (let i = 0; i < numberOfDates; i++) {
        const dateEl = document.createElement("div");
        dateEl.classList.add("date");
        dateEl.textContent = `${i + 1}`;
        dateEl.dataset.date = `${i + 1}`;
        if (i == 0) {
          dateEl.style.gridColumnStart = `${
            new Date(year, month - 1, 1).getDay() + 1
          }`;
        }
        fragment.appendChild(dateEl);
      }
      this.calendarDatesEl.appendChild(fragment);
      this.colorWeekend();
    }
  }
  /**
   * 토요일, 일요일인 날짜에  색 지정
   */
  colorWeekend() {
    const { year, month } = this.#calendarDate;
    const firstDateDay = new Date(year, month - 1, 1).getDay();
    if (this.calendarDatesEl) {
      const saturdayEls = this.calendarDatesEl.querySelectorAll(
        `.date:nth-child(7n + ${7 - firstDateDay})`
      ) as NodeListOf<HTMLElement>;
      const sundayEls = this.calendarDatesEl.querySelectorAll(
        `.date:nth-child(7n+${8 - firstDateDay} )`
      ) as NodeListOf<HTMLElement>;
      saturdayEls.forEach((i) => (i.style.color = "blue"));
      sundayEls.forEach((i) => (i.style.color = "red"));
    }
  }
  /**
   * 오늘 날짜 표시
   */
  markToday() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const today = currentDate.getDate();
    const { year, month } = this.#calendarDate;
    //화면 표시 조건
    if (currentYear === year && currentMonth === month) {
      this.calendarDatesEl
        ?.querySelector(`[data-date="${today}"]`)
        ?.classList.add("today");
    }
  }
  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 12) {
      this.#calendarDate.year++;
      this.#calendarDate.month = 1;
    }
    this.updateCalendar();
  }
  moveToPrevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 1) {
      this.#calendarDate.year--;
      this.#calendarDate.month = 12;
    }
    this.updateCalendar();
  }

  onClickSelectDate(event: MouseEvent) {
    const eventTarget = event.target as HTMLElement | null;
    if (eventTarget?.dataset.date) {
      // class
      this.calendarDatesEl
        ?.querySelector(".selected")
        ?.classList.remove("selected");
      eventTarget.classList.add("selected");
      const date: number = Number(eventTarget.dataset.date);
      //selectedDate
      const { year, month } = this.#calendarDate;
      this.selectedDate = {
        data: new Date(year, month - 1, date),
        year: year,
        month: month,
        date: date,
      };
      //data-input
      this.updateDateInput(year, month, date);
    }
  }
  markSelectedDate() {
    if (
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        ?.querySelector(`[data-date="${this.selectedDate.date}"]`)
        ?.classList.add("selected");
    }
  }
  /**
   * 숫자를 두  글자로 변환하는 함수 (한 자리 수인 숫자의 경우 앞에 0을 붙임)
   * @param  number
   * @returns
   */
  formateNumber(number: number) {
    let data: number | string = number;
    if (data < 10) {
      data = `0${data}`;
    } else {
      data = number.toString();
    }
    return data;
  }
}

new DatePicker();
