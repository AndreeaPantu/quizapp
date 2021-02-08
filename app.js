// Event Listeners
document.querySelector('#create').addEventListener('click', addQuiz);
document.querySelector('#cancel').addEventListener('click', cancelCreate);
document.querySelector('#submit').addEventListener('click', submitFirstFrom);
document.querySelector('#previous').addEventListener('click', goToPrevious);

// variable declaration
let html = "";
const quizzes = document.querySelector('.quizzes');
const quizChoosen = document.querySelector('.quiz-taken');
const createBtn = document.querySelector('.create-quiz');
const createForm = document.querySelector('.create-form');
const questionForm = document.querySelector('.question-form');
const backBtn = document.querySelector('#back');
const cancelBtn = document.querySelector('#cancel');
const previousBtn = document.querySelector('#previous');
const nextBtn = document.querySelector('#submit');
quizChoosen.style.display = "none";
backBtn.style.display = "none";
cancelBtn.style.display = "none";
previousBtn.style.display = "none";
questionForm.style.display = "none";

const quizzesData = [
  {
  title : "This is quiz 1",
  no_questions : 2,
  multiple_correct_answers : false,
  questions : [
    {
      question: "How to list only the running containers?",
      answers: [
        "docker list",
        "docker ps",
        "docker run",
        "docker print"
      ],
      correct_answer: "2"
    },
    {
      question: "How to check the current disk usage on Linux?",
      answers: [
        "df",
        "usage",
        "uptime",
        "free"
      ],
      correct_answer: "1"
    }]
  },
  {
  title : "This is quiz 2",
  no_questions : 1,
  multiple_correct_answers: true,
  questions : [
    {
      question: "How to list only the running containers?",
      answers: [
        "docker list",
        "docker ps",
        "docker run",
        "docker print"
      ],
      correct_answer: "2,3"
    }]
  },
  {
    title : "This is quiz 3",
    no_questions : 1,
    multiple_correct_answers: false,
    questions : [
      {
        question: "How to list only the running containers?",
        answers: [
          "docker list",
          "docker ps",
          "docker run",
          "docker print"
        ],
        correct_answer: "2"
      }]
    }
    
]

ShowQuizzes();

function ShowQuizzes() {
  quizzesData.forEach((quiz,index) => {
    html +=`
      <div class="col-6 col-md-3" id="${index + 1}">
        <h3>Quiz ${index + 1}</h3>
        <h2>${quiz.title}</h2>
        <button class="btn btn-outline-info take-quiz" id="quiz-${index + 1}">Take Quiz</button>
        </div>
        `;
    quizzes.innerHTML = html;

    // Event Listeners
    document.querySelectorAll('.take-quiz').forEach(item => {
      item.addEventListener('click', takeQuiz)
    });
    document.querySelector('#back').addEventListener('click', goBack);

  });
}

// Take quiz function
function takeQuiz(e){
  const id = e.target.id.slice(5) - 1;
  quizChoosen.style.display = "block";
  quizChoosen.id = `quiz-${id}`;
  quizzes.classList = "row text-center quizzes mt-5 hide";
  createBtn.style.display = "none";
  backBtn.style.display = "block";

  let questionnaire = "";

  quizzesData[id].questions.forEach((question,index) => {
    questionnaire += `
      <div class="quest-${index}">
        <h3>${index + 1}. ${question.question}</h3>
      `;
    const id_quiz = index;
    question.answers.map(function(answer, indexAns) {
      if(quizzesData[id].multiple_correct_answers === false) {
        questionnaire += `
        <label><input type="radio" name="answer-${id_quiz}" id="answer${index}_${indexAns + 1}" value="SA">${answer}</label>
        <br>
        `;
      } else {
        questionnaire += `
        <label><input type="checkbox" name="answer-${id_quiz}" id="answer${index}_${indexAns + 1}" value="SA">${answer}</label>
        <br>
        `;
      }
    });
    questionnaire += `
    </div>
    `;
  });
    questionnaire += `
    <button class="btn btn-dark mt-3" id="submit-test">See results</button>
    `;
    quizChoosen.innerHTML = questionnaire;

    document.querySelector('#submit-test').addEventListener('click', seeResults);
}

// Back button
function goBack(){
  quizChoosen.style.display = "none";
  quizzes.classList = "row text-center quizzes mt-5";
  createBtn.style.display = "block";
  backBtn.style.display = "none";
}

// Submitting a test
function seeResults(){
    const idQuiz = quizChoosen.id.slice(5);
    const pas = 10/quizzesData[idQuiz].no_questions;
    let grade = 0;
    let checkedArr = [];
    let allCorrect = 0;
    let dynamicCheckedArr = checkedArr;
    for(let w = 0; w < quizzesData[idQuiz].questions.length; w++) {
      for(let z=0; z< quizzesData[idQuiz].questions[0].answers.length; z++){
        if(document.querySelector(`#answer${w}_${z+1}`).checked) {
          checkedArr.push(z+1);
        }
      }
    }
    if(checkedArr.length < quizzesData[idQuiz].no_questions) {
      showAlert("Please answer all questions","alert alert-danger text-center mt-3",".quiz-taken","#isubmit-test");
    } else {
    quizzesData[idQuiz].questions.forEach((question, index) => {
        if(quizzesData[idQuiz].multiple_correct_answers === false){
          document.querySelector(`#answer${index}_${question.correct_answer}`).parentElement.style.color = "green";
          if(document.querySelector(`#answer${index}_${question.correct_answer}`).checked) {
            grade += pas;
          } else {
            for(let i=0; i< question.answers.length; i++){
              if(document.querySelector(`#answer${index}_${i+1}`).checked) {
                document.querySelector(`#answer${index}_${i+1}`).parentElement.style.color = "red";
              }
            }    
          }
        } else {
          const rightAnswerArr = question.correct_answer.split(",");
          for(let j=0; j< rightAnswerArr.length; j++){
            document.querySelector(`#answer${index}_${rightAnswerArr[j]}`).parentElement.style.color = "green";
            if(document.querySelector(`#answer${index}_${rightAnswerArr[j]}`).checked) {
              allCorrect +=1;
            }          
          }
          if(allCorrect === rightAnswerArr.length && checkedArr.length === rightAnswerArr.length){
              grade += pas;
          } else {
            for(j=0; j< rightAnswerArr.length; j++){
              for(let k = 0; k < checkedArr.length; k++) {
                if(checkedArr[k] === Number(rightAnswerArr[j])) {
                    dynamicCheckedArr.splice(k, 1);
                }    
              }
            }
            for(let y = 0; y < dynamicCheckedArr.length; y++) {
              document.querySelector(`#answer${index}_${dynamicCheckedArr[y]}`).parentElement.style.color = "red";
            }
          }
        }

        showAlert(`Your grade is ${grade}/10`,"alert alert-info text-center mt-3",".quiz-taken","#isubmit-test");
          
        // Timeout
        setTimeout(() => {
            document.querySelector("#back").click();
        }, 3000);
      });
    }
}

function submitFirstFrom() {
  let quizTitle = document.querySelector("#quiz-title").value;
  let questionsNumber = document.querySelector("#no-questions").value;
  let answersNumber = document.querySelector("#no-answers").value;
  let multipleAnswers = document.querySelector("#multiple-answer").checked;
  let singleAnswers = document.querySelector("#single-answer").checked;
  
      
  if (quizTitle !== "" && questionsNumber !== "" && answersNumber !== "" && (multipleAnswers === true || singleAnswers === true)) {
    questionForm.style.display = "block";
    createForm.classList = "container create-form mt-5 text-center hide";
    nextBtn.classList = "btn btn-dark mt-5 hide";
    cancelBtn.style.display = "none";
    previousBtn.style.display = "block";
    let quizFormHtml = `
      <h4>${quizTitle}</h4>
      <br>
    `;
    for(let i = 0; i < questionsNumber; i++) {
      quizFormHtml += `
        <label for="questions">Question${i+1} text</label>
        <input type="text" id="q${i+1}"><br>
        
      `;
      for(let j = 0; j < answersNumber; j++) {
        quizFormHtml += `
          <label for="answers">Answer ${j+1}</label>
          <input type="text" id="answer-${i+1}${j+1}"><br>
        `;
      }

      if(multipleAnswers === true) {
        quizFormHtml += `
            <label for="correct-answers">Correct Answers</label>
            <input type="text" id="correct-answer-${i+1}">
            <br>
            <br>
          `;
      } else {
        quizFormHtml += `
            <label for="correct-answers">Correct Answer</label>
            <input type="text" id="correct-answer-${i+1}">
            <br>
            <br>
        `;
      }
    }

    quizFormHtml += `
      <button class="btn btn-dark mt-3" id="add">Save Quiz</button>
    `;
    questionForm.innerHTML = quizFormHtml;

    document.querySelector('#add').addEventListener('click', newQuiz);

  } else { 
    showAlert("Please fill in all fields","alert alert-danger text-center mt-3",".create-form","#insert-alert");
  }

}

function showAlert(message, className, containerClass, buttonId) {
  clearAlert();
    
  // Create div
  const div = document.createElement('div');
  // Add classes
  div.className = className;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector(containerClass);
  // Get convert button
  const button = document.querySelector(buttonId);
  // Insert alert div
  container.insertBefore(div, button);
    
    
  // Timeout
  setTimeout(() => {
    clearAlert();
  }, 3000);
}

function clearAlert() {
  const currentAlert = document.querySelector('.alert');
    
  if(currentAlert) {
    currentAlert.remove();
  }
}

// cancel button
function cancelCreate(){
  quizChoosen.style.display = "none";
  quizzes.classList = "row text-center quizzes mt-5";
  createBtn.style.display = "block";
  cancelBtn.style.display = "none";
  createForm.classList = "container create-form mt-5 text-center hide";
  document.querySelector("#quiz-title").value = "";
  document.querySelector("#no-questions").value = null;
  document.querySelector("#no-answers").value = null;
  document.querySelector("#multiple-answer").checked = false;
  document.querySelector("#single-answer").checked = false;

}

// Previous button
function goToPrevious() {
  createForm.classList = "container create-form mt-5 text-center";
  nextBtn.classList = "btn btn-dark mt-5";
  questionForm.style.display = "none";
  cancelBtn.style.display = "block";
  previousBtn.style.display = "none";
}

//Add new quiz
function addQuiz() {
  createForm.classList = "container create-form mt-5 text-center";
  quizChoosen.style.display = "none";
  quizzes.classList = "row text-center quizzes mt-5 hide";
  createBtn.style.display = "none";
  cancelBtn.style.display = "block";
  nextBtn.classList = "btn btn-dark mt-5";
}

// New quiz
function newQuiz() {
  quizTitle = document.querySelector("#quiz-title").value;
  questionsNumber = document.querySelector("#no-questions").value;
  answersNumber = document.querySelector("#no-answers").value;
  multipleAnswers = document.querySelector("#multiple-answer").checked;
  singleAnswers = document.querySelector("#single-answer").checked;

  let countFieldInvalid = false;
  let correctAnswersInvalid = false;
  for(let i = 0; i < questionsNumber; i++){
    if(document.querySelector(`#q${i+1}`).value === "") {
      countFieldInvalid = true;
    }
    for(let j = 0; j < answersNumber; j++) {
      if(document.querySelector(`#answer-${i+1}${j+1}`).value === "") {
        countFieldInvalid = true;
      }
    }

    let re;
    if (singleAnswers) {
      re = `^[1-${answersNumber}]$`;
    } else {
      re = `^[1-${answersNumber},]{2,${answersNumber-1}}[1-${answersNumber}]$`;
    }
    var regex = new RegExp(re);
    
    console.log(regex);
    console.log(document.querySelector(`#correct-answer-${i+1}`).value);
    if(!regex.test(document.querySelector(`#correct-answer-${i+1}`).value)) {
      correctAnswersInvalid = true;
    }
  }

  if(countFieldInvalid) {
    showAlert("Please fill in all fields","alert alert-danger text-center mt-3",".question-form","#add");
  } else if(correctAnswersInvalid && multipleAnswers) {
    showAlert("Invalid correct answers! Please add the number of the correct answers separated by ','","alert alert-danger text-center mt-3",".question-form","#add");
  } else if(correctAnswersInvalid && singleAnswers) {
    showAlert("Invalid correct answer! Please add the number of the correct answer","alert alert-danger text-center mt-3",".question-form","#add");
  } else {
    let questionsToAdd = [];
    let answersToAdd;
    for (let x = 0; x < questionsNumber; x++ ) {
      let q = document.querySelector(`#q${x+1}`).value;
      let correctAnswers = document.querySelector(`#correct-answer-${x+1}`).value;
      answersToAdd = [];
      for (let y = 0; y < answersNumber; y++ ) {
        let a = document.querySelector(`#answer-${x+1}${y+1}`).value;
        answersToAdd.push(`${a}`);
      }
      questionsToAdd.push({question : `${q}`, answers : answersToAdd , correct_answer : `${correctAnswers}`});
    }
    const quizToAdd = {title : `${quizTitle}`, no_questions : questionsNumber, multiple_correct_answers : multipleAnswers, questions : questionsToAdd};
    console.log(quizToAdd)
    quizzesData.push(quizToAdd);
    
    const newDiv = document.createElement('div');
    newDiv.classList = "col-6 col-md-3";
    newDiv.id = `${quizzesData.length}`;
    const newH3 = document.createElement('h3');
    newH3.innerHTML = `Quiz ${quizzesData.length}`;
    newDiv.appendChild(newH3);
    const newH2 = document.createElement('h2');
    newH2.innerHTML = `${quizzesData[quizzesData.length - 1].title}`;
    newDiv.appendChild(newH2);
    const newBtn = document.createElement('button');
    newBtn.classList = "btn btn-outline-info take-quiz";
    newBtn.id = `quiz-${quizzesData.length}`;
    newBtn.innerHTML = "Take Quiz";
    newDiv.appendChild(newBtn);
    quizzes.appendChild(newDiv);

    document.querySelector("#quiz-title").value = "";
    document.querySelector("#no-questions").value = null;
    document.querySelector("#no-answers").value = null;
    document.querySelector("#multiple-answer").checked = false;
    document.querySelector("#single-answer").checked = false;
    
    previousBtn.style.display = "none";
    createForm.classList = "container create-form mt-5 text-center hide";
    questionForm.style.display = "none";
    quizzes.classList = "row text-center quizzes mt-5";
    createBtn.style.display = "block";
    document.querySelectorAll('.take-quiz').forEach(item => {
      item.addEventListener('click', takeQuiz)
    });
    document.querySelector('#back').addEventListener('click', goBack);
  }
}

 

