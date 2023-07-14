var day2;

function getDates(lastDate){
    console.log(lastDate)
    lastDate = new Date(lastDate);
    temp = lastDate.getDate();
    day1 = new Date(lastDate.setDate(temp+1));
    day2 = new Date(lastDate.setDate(temp+14));

    var resultsDiv = document.getElementById('resultsDiv');
    var sendDate = document.getElementById('sendDate').value;
    var email = document.getElementById('email').value;
    resultsDiv.insertAdjacentHTML('beforeend', "<h1 class=\"text-lg mt-8\">"+"Payroll dates are "+day1.getMonth()+"/"+day1.getDate()+" to "+day2.getMonth()+"/"+day2.getDate()+"</h1>");

    var dates = day1.getMonth()+"/"+day1.getDate()+day2.getMonth()+"/"+day2.getDate();
    console.log(dates);

    fetch('http://localhost:3000/email', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(
            {
                "startDate": day1.getMonth()+"/"+day1.getDate(),
                "endDate": day2.getMonth()+"/"+day2.getDate(),
                "sendDate":sendDate,
                "email":email
            }
        )})
    .then(response => response.json()) // parse JSON from response
    .then(data => console.log(data.text))
    .catch(error => console.error('Error:', error));
}




document.getElementById("btn1").onclick = function(){
    var inputValue = document.getElementById('input1').value;
    getDates(inputValue)}; 





