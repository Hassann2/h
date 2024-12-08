const form = document.getElementById('grade-form');
const gradesInput = document.getElementById('grades');
const resultElement = document.getElementById('result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const grades = gradesInput.value.split(',');
    const decimals = grades.map(grade => {
        const match = grade.match(/(\d+(?:\.\d+)?)(?:\s*(and\s*a\s*half))?/);
        if (match) {
            const number = parseFloat(match[1]);
            if (match[2]) {
                return number + 0.5;
            } else {
                return number;
            }
        } else {
            return parseFloat(grade);
        }
    });
    const sum = decimals.reduce((acc, grade) => acc + grade, 0);
    const average = sum / decimals.length;
    if(average < 5){
        resultElement.textContent = `The average grade is: ${average.toFixed(2)} 😭`;
        resultElement.style.color = "red";
    }else if(average < 6){
        resultElement.textContent = `The average grade is: ${average.toFixed(2)} 😔`;
        resultElement.style.color = "orange";
    }else{
        resultElement.textContent = `The average grade is: ${average.toFixed(2)} 😄`;
        resultElement.style.color = "green";
    }
});
