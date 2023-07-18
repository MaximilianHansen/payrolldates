var resultsDiv = document.getElementById('resultsDiv');
let datesArr;

function convertMMDDYY(input){
        let newDate = new Date(input);
        let temp = (newDate.getMonth()+1).toString().padStart(2, '0') + '/' +
        newDate.getDate().toString().padStart(2, '0') + '/' +
        (newDate.getFullYear() % 100).toString().padStart(2, '0'); 
        console.log(temp,"mmddyy") 
        return temp 
    }

function genDatesArr(lastDate){ 
    lastDate = new Date(lastDate);
    let temp = lastDate.getDate()
    console.log(lastDate,"last date")
    day1 = new Date(lastDate.setDate(temp+1));
    day2 = new Date(lastDate.setDate(temp+14));
    let datesArr = [convertMMDDYY(day1),convertMMDDYY(day2)]
    console.log(datesArr[0], datesArr[1],"new function output")
    return datesArr
}

function validateEmail(email) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
}

function validateDate(date) {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/([0-9]{2})$/;
    return regex.test(date);
}



document.getElementById("btn1").onclick = function(){
    var sendDate = document.getElementById('sendDate').value;
    var email = document.getElementById('email').value;
    var inputValue = document.getElementById('input1').value;
    resultsDiv.innerHTML = "";
    if(validateDate(sendDate) && validateDate(inputValue) && validateEmail(email)){
    datesArr = genDatesArr(inputValue)
    fetch('/api/addUser', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(
            {
                "startDate": datesArr[0],
                "endDate": datesArr[1],
                "sendDate":convertMMDDYY(sendDate),
                "email":email
            }
        )})
    .then(response => response.json()) // parse JSON from response
    .then(data => console.log(data.text))
    .catch(error => console.error('Error:', error));

    resultsDiv.insertAdjacentHTML(
        'beforeend', "<h1 class=\"text-lg mt-8\">"+"Next payroll dates are "+datesArr[0]+" to "+datesArr[1]+".<br><br> We will email you every payroll, please check spam and allow emails from info@payrolldates.com</h1>");}
        else {
            console.log("invalid entry")
            resultsDiv.insertAdjacentHTML(
                'beforeend', "<h1 class=\"text-lg text-red-600 mt-8 \">"+"Please Correct your Date or Email Formatting!"+"</h1>");
        }
}; 





