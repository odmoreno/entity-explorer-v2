class DatePicker {
    constructor(id){
        this.datepicker = $(`#${id}`).datepicker();
    }

    update (currentDate) {
        
        this.datepicker.value = currentDate
    }
}

class DateRange {
    constructor(){

    }
}
