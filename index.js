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


