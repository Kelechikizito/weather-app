function getCurrentDateTime() {
    const date = new Date();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    const formattedDate = dateFormatter.format(date);
    
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    const formattedTime = timeFormatter.format(date);
    
    return `${formattedDate}. ${formattedTime}`;
}

function updateCurrentDate() {
    let todayDate = $('.today-date');
    todayDate.text(getCurrentDateTime());
}

updateCurrentDate();

setInterval(updateCurrentDate, 1000);


// WEEKLY CARDS

function getNextSevenDays() {
    const dates = [];
    const currentDate = new Date();
    
    // Iterate over the next 7 days
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + i);

        const nextDatesFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            // weekday: 'short'
        });

        const nextDayFormater = new Intl.DateTimeFormat('en-US', {weekday: 'short'});

        const formattedNextDates = nextDatesFormatter.format(nextDate);
        const formattedNextDay = nextDayFormater.format(nextDate);
        
        // Extract the year, month, and day components
        // const year = nextDate.setDate();
        // const month = nextDate.getMonth() + 1; // Month is zero-based, so we add 1
        // const day = nextDate.getDate();
        
        // Format the date as yyyy-mm-dd
        // const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        
        // Push the formatted date into the dates array
        dates.push([formattedNextDates, formattedNextDay]);
    }
    
    return dates;
}

// Call the function to get the next 7 days
const nextSevenDays = getNextSevenDays();
console.log(nextSevenDays);

const y = $('.weekly-weather-card-date').children(':last-child');
y.each(function(index) {
    const firstChild = $(this);
    
    // Change the text content based on the index or any other condition
    if (index === 0) {
        firstChild.text(nextSevenDays[0][1]);
    } else if (index === 1) {
        firstChild.text(nextSevenDays[1][1]);
    } else if (index === 2) {
        firstChild.text(nextSevenDays[2][1]);
    } else if (index === 3) {
        firstChild.text(nextSevenDays[3][1]);
    } else if (index === 4) {
        firstChild.text(nextSevenDays[4][1]);
    } else if (index === 5) {
        firstChild.text(nextSevenDays[5][1]);
    } else if (index === 6) {
        firstChild.text(nextSevenDays[6][1]);
    } 
});

const w = $('.weekly-weather-card-date').children(':first-child');

w.each(function(index) {
    const firstChild = $(this);
    
    // Change the text content based on the index or any other condition
    if (index === 0) {
        firstChild.text(nextSevenDays[0][0]);
    } else if (index === 1) {
        firstChild.text(nextSevenDays[1][0]);
    } else if (index === 2) {
        firstChild.text(nextSevenDays[2][0]);
    } else if (index === 3) {
        firstChild.text(nextSevenDays[3][0]);
    } else if (index === 4) {
        firstChild.text(nextSevenDays[4][0]);
    } else if (index === 5) {
        firstChild.text(nextSevenDays[5][0]);
    } else if (index === 6) {
        firstChild.text(nextSevenDays[6][0]);
    } 
});

