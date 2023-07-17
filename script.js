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

document.getElementById("btn1").onclick = function(){
    var sendDate = document.getElementById('sendDate').value;
    var email = document.getElementById('email').value;
    var inputValue = document.getElementById('input1').value;
    datesArr = genDatesArr(inputValue)
    fetch('http://localhost:3000/addUser', {
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
        'beforeend', "<h1 class=\"text-lg mt-8\">"+"Payroll dates are "+datesArr[0]+" to "+datesArr[1]+"</h1>");
}; 





