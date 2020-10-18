/********************************
 ***********Quiz-CONTROLLER*********
 ********************************/
var quizController = (function () {
    //==============Question Constructor======
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    ///
    //Function To Make Three Main Method IN Local Storage
    //Key In all method named 'questionCollection'
    var questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    }
    //becuse first time localStorage is set as null
    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }
    var quizProgress = {
        questionIndex: 0
    }
    //******************Person Constructor******************//
    //******************Person Constructor******************//
    function Person(id, firstName, LastName, Score) {
        this.id = id;
        this.firstName = firstName;
        this.LastName = LastName;
        this.Score = Score;
    }

    //
    var currPersonData = {
        fullName: [],
        score: 0
    };

    var personLocalStorage = {
        setPersonData: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function () {
            localStorage.removeItem('personData');
        }
    };

    var adminFullName = ["Peter", "ElGassar"];

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {

        getquizProgress: quizProgress,
        //هنا استدعيت ال البروبيرتي دي علشان تقدر تعملها 
        //invoke بعدين وتتعامل معاها
        getQuestionLocalStorage: questionLocalStorage,

        ///Function To Insert
        addQuestionOnLocalStorage: function (newQuestionText, opts) {

            var optionArray, corrAnswer, questionId, newQuestion, getStoredQuests, isCheckd;

            optionArray = [];
            isCheckd = false;
            //1 get all option from opts prameter
            for (var i = 0; i < opts.length; i++) {
                //2 check if option is't empty
                if (opts[i].value !== "") {
                    optionArray.push(opts[i].value)
                }
                //3 ckeck correct answer
                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAnswer = opts[i].value;
                    isCheckd = true;
                }
            }
            //[ {id=0} {id=1}]
            //Genrate Dynamic Ids
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                //get last Element In Array,, by(length-1)  and then plus to it one
                // that new number is a new ID
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;

            } else {
                questionId = 0;
            }

            if (newQuestionText.value !== "") {

                if (newQuestionText.value.length > 10) {
                    if (optionArray.length > 1) {
                        if (isCheckd) {

                            newQuestion = new Question(questionId, newQuestionText.value, optionArray, corrAnswer);
                            //هنا انت بتجيب كل الاسئلة القديمة المحزنة مسبقا
                            getStoredQuests = questionLocalStorage.getQuestionCollection();
                            //ثم تضيف لهم السؤال الجديد
                            getStoredQuests.push(newQuestion);
                            //LocalStorage اخيرا تقوم باضافة الاسئلة الجديدة كلها  الي 
                            //Here sending Array
                            questionLocalStorage.setQuestionCollection(getStoredQuests);

                            //Clear TextBox////////////
                            newQuestionText.value = "";
                            for (var i = 0; i < opts.length; i++) {
                                opts[i].value = '';
                                opts[i].previousElementSibling.checked = false;
                            }
                            console.log(questionLocalStorage.getQuestionCollection());
                            return true;
                        } else {
                            alert("Please Ckeckd Correct Answer..");
                            return false;
                        }
                    } else {
                        alert("you must Insert at least tow options");
                        return false;
                    }
                } else {
                    alert("you must Add Question Gearter than 10 Characters");
                    return false;
                }
            } else {
                alert("Please Insert Question");
                return false;
            }
        },

        checkAnswer: function (answer) {
            //this Block Of CodE From my To Remove White Space From String
            /////
            var correctAnswerInLoca = questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer.replace(/ /g, '');
            var UserAnswer = answer.textContent.replace(/ /g, '');
            if (correctAnswerInLoca === UserAnswer) {
                currPersonData.score++;
                console.log('Correct');
                return true;
            } else {
                console.log('wrong');
                return false;
            }
        },
        isFinshed: function () {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },
        addPerson: function () {
            var newPerson, personId, personData;

            if (personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1

            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currPersonData.fullName[0], currPersonData.fullName[1], currPersonData.score);
            personData = personLocalStorage.getPersonData();
            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);

            console.log(newPerson);
        },

        ///To make currPersonData Public 
        getCurrPersonData: currPersonData,
        ///To make adminFullName Public 
        getAdminFullName: adminFullName,
        getPersonLocalStorage: personLocalStorage
    }
}());


/********************************
 ***********UI-CONTROLLER*********
 ********************************/
var UIController = (function () {

    //Private Object
    var domItems = {
        //****************Admin Panel Elements*********************
        adminPanelSection: document.querySelector(".admin-panel-container"),
        //
        quesInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        //Get All Element have this class name ".admin-option"
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionContainer: document.querySelector(".admin-options-container"),
        insertQuestionWrapper: document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionClearBtn: document.getElementById("questions-clear-btn"),
        scorListWrapper: document.querySelector(".results-list-wrapper"),
        clearResultsBtn: document.getElementById('results-clear-btn'),
        //********************* Quiz Section Element *********************
        quizSection: document.querySelector(".quiz-container"),
        //
        askedQuestionText: document.getElementById("asked-question-text"),
        quizOptionWrapper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector('progress'),
        progressParagraph: document.getElementById('progress'),
        //***************Message for Answer Result*************** */
        instansContainer: document.querySelector('.instant-answer-container'),
        instansText: document.getElementById("instant-answer-text"),
        emotionIcon: document.getElementById("emotion"),
        instAnswerDiv: document.getElementById("instant-answer-wrapper"),
        nextQuestionBtn: document.getElementById("next-question-btn"),
        //**********************landing Page Element*************
        landingPageSection: document.querySelector(".landing-page-container"),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        //*************************Final Result Section Element***************** */
        finalResultSection: document.querySelector(".final-result-container"),
        finalScoreText: document.getElementById("final-score-text")
    }

    return {
        getDomItems: domItems,
        /*
        =======================
                ///first funcion
        =======================
        */
        addInputDynamically: function () {

            var addInput = function () {
                var inputHTML, z;
                //adminOptions ليه مستخدمتش المتغير الللي اسمو 
                //علشان ده ثابت ديما بياخد القيمة الاولية ثابتة اللي هي عنصرين فقط
                z = document.querySelectorAll('.admin-option').length;

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';

                domItems.adminOptionContainer.insertAdjacentHTML("beforeend", inputHTML);
                //after genrate new textbox 
                //remove Event From Second textbox 
                domItems.adminOptionContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                //and second Event to last new one agein
                domItems.adminOptionContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

            }

            domItems.adminOptionContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        /*
        =======================
                ///Second funcion
        =======================
        */
        createQuestionList: function (getQuestion) {
            var questHTML, numberingArr;
            numberingArr = [];
            //1.clear area from All questions
            domItems.insertQuestionWrapper.innerHTML = "";

            for (var i = 0; i < getQuestion.getQuestionCollection().length; i++) {
                numberingArr.push(i + 1);

                questHTML = '<p><span>' + numberingArr[i] + '.' + getQuestion.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestion.getQuestionCollection()[i].id + '">Edit</button></p>';
                domItems.insertQuestionWrapper.insertAdjacentHTML("afterbegin", questHTML);
            }

        },
        /*
        =======================
                ///third funcion
        =======================
        */
        editQuestionList: function (event, storageQuestList, addInputsDynFn, updateQuestLlistFn) {
            //getStorageQuestList short cut var
            var getId, getStorageQuestList, foundItem, placeInArray, optionHTML;

            if ('question-'.indexOf(event.target.id)) {

                //Convert to Int Number Befor Process
                getId = parseInt(event.target.id.split('-')[1]);

                getStorageQuestList = storageQuestList.getQuestionCollection();

                for (var i = 0; i < getStorageQuestList.length; i++) {
                    if (getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];

                        placeInArray = i;
                    }
                }
                //هنا كل اللي هتعملو هتجيب الدوم المحدد بتاع السؤال وتحط فيه رأس السؤال
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionContainer.innerHTML = "";
                // هنا عملت initlaization  علشان هيجيب undefind
                optionHTML = "";
                for (var x = 0; x < foundItem.options.length; x++) {
                    //علامة الزائد هنا علشان يجمعهم علي بعض و ميعملش  override
                    //هنا انت خزنت عناصر متساوية بظبط مع اللي في option local storage
                    optionHTML += ' <div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>'
                }
                //CSS Effects
                domItems.adminOptionContainer.innerHTML = optionHTML;
                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.quesInsertBtn.style.visibility = 'hidden';
                domItems.questionClearBtn.style.pointerEvents = "none";
                //Invok function of Add new TextBox Dynamic
                addInputsDynFn();

                //++++++++++++
                //Create function to Back Again to Default View
                //++++++++++++
                var backDufaultView = function () {
                    // because var named "optionsElemenents" in glopal scop not called here 
                    //for this Reason Iam Declare "updatedOptions" Here In Local Scop Of this Function
                    var updatedOptions = document.querySelectorAll(".admin-option");
                    //clear teaxtArea
                    domItems.newQuestionText.value = '';
                    //Clear All Options & Unchecked Radio Btn 
                    for (var i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    //CSS Effects Btns
                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.quesInsertBtn.style.visibility = 'visible';
                    domItems.questionClearBtn.style.pointerEvents = "";
                    //Invok prameter function to update  update Question in the list of qustion
                    updateQuestLlistFn(storageQuestList);
                }

                //// begin of video number 13
                /////Nested function
                var updateQuestion = function () {
                    // you want to ReSelect Options because that IAm declare optionsElements var
                    //Because if admin add new option to question
                    var newOptions, optionsElemenents;

                    newOptions = [];
                    optionsElemenents = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = "";

                    for (var i = 0; i < optionsElemenents.length; i++) {
                        if (optionsElemenents[i].value !== "") {
                            newOptions.push(optionsElemenents[i].value);

                            if (optionsElemenents[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionsElemenents[i].value;
                            }

                        }
                    }
                    foundItem.options = newOptions;

                    //Validate Befor Save Updated Question
                    /////
                    if (foundItem.questionText.value !== "") {
                        if (foundItem.options.length > 1) {

                            if (foundItem.correctAnswer !== "") {
                                getStorageQuestList.splice(placeInArray, 1, foundItem);
                                storageQuestList.setQuestionCollection(getStorageQuestList);
                                //Function To retrn To Default View
                                backDufaultView();

                            } else {
                                alert("Please Ckeckd Correct Answer..OR You Ckeck Answer Without Value");
                            }

                        } else {
                            alert("You Must Insert At Least Tow Options");
                        }
                    } else {
                        alert("Please Insert Question !!!")
                    }

                };
                //Event When Click Execute "updateQuestion" this function
                domItems.questionUpdateBtn.onclick = updateQuestion;


                var deleteQuestion = function () {
                    getStorageQuestList.splice(placeInArray, 1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    backDufaultView();
                }
                //Event When Click Execute "deleteQuestion" this function

                domItems.questionDeleteBtn.onclick = deleteQuestion;
            }
        },
        /*
        =======================
            ///Fourth funcion  To Delete All Question From Question List
        =======================
        */
        clearQuestList: function (storageQuestList) {

            //first ckeck if getQuestionCollection() not null because don't get an Error in console
            if (storageQuestList.getQuestionCollection() !== null) {
                if (storageQuestList.getQuestionCollection().length > 0) {
                    var conf = confirm('Warning! You Will Lose Entire Questions List');
                    if (conf) {
                        storageQuestList.removeQuestionCollection();
                        domItems.insertQuestionWrapper.innerHTML = "";
                    }
                }
            }
        },
        /*
        =======================
            ///fifth funcion & Strat Quiz Section Of Project
        =======================
        */
        displayQuestion: function (storageQuestList, progress) {

            var newOptionHTML, charactersArr, shortCutOtionText;

            charactersArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

            if (storageQuestList.getQuestionCollection().length > 0) {
                domItems.askedQuestionText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                //cleare quizOtionWrapper Area
                domItems.quizOptionWrapper.innerHTML = "";
                for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    //Var ShortCut
                    shortCutOtionText = storageQuestList.getQuestionCollection()[progress.questionIndex].options[i];
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + charactersArr[i] + '</span> <p class = "choice-' + i + '" > ' + shortCutOtionText + ' </p></div>';

                    domItems.quizOptionWrapper.insertAdjacentHTML('beforeend', newOptionHTML);

                }

            }
        },
        /*
        =======================
           ///Six funcion 
        =======================
        */
        displayProgress: function (storageQuestList, progress) {

            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
            domItems.progressParagraph.textContent = progress.questionIndex + 1 + '/' + storageQuestList.getQuestionCollection().length;

        },
        /*
        =======================
           ///seventh funcion to make some Effects On Options After Selected Answer
        =======================
        */
        newDesign: function (answerReslut, selectedAnswer) {
            var towOption = {
                instAnswerText: ["This is a Wrong Answer", "This is a Correct Answer"],
                instansAnswerClass: ["red", "green"],
                emotionType: ["Images/Confused Face Emoji.png", "Images/Smiling Emoji with Eyes Opened.png"],
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            }
            //Genral Efficts
            domItems.quizOptionWrapper.style.cssText = "opacity:0.6; pointer-events:none";
            domItems.instansContainer.style.opacity = "1";

            if (answerReslut) {
                domItems.instansText.textContent = towOption.instAnswerText[1];
                domItems.instAnswerDiv.className = towOption.instansAnswerClass[1];
                domItems.emotionIcon.setAttribute('src', towOption.emotionType[1]);

                selectedAnswer.previousElementSibling.style.backgroundColor = towOption.optionSpanBg[1]
            } else {
                domItems.instansText.textContent = towOption.instAnswerText[0];
                domItems.emotionIcon.setAttribute('src', towOption.emotionType[0]);
                domItems.instAnswerDiv.className = towOption.instansAnswerClass[0];
                selectedAnswer.previousElementSibling.style.backgroundColor = towOption.optionSpanBg[0]
            }
        },
        /*
        ======================= 
           ///eighth funcion 
        =======================
        */
        resetDesign: function () {
            //Genral Efficts
            domItems.quizOptionWrapper.style.cssText = "";
            domItems.instansContainer.style.opacity = "0";
        },
        /*
        =======================
          ///Nineth funcion 
        =======================
        */
        getFullName: function (currPerson, storageQuestList, admin) {
            //First Validate If user Leave TextBox Empty
            if (domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== "") {
                //Second Validate User Name 
                if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {
                    debugger;
                    if (storageQuestList.getQuestionCollection().length > 0) {

                        currPerson.fullName.push(domItems.firstNameInput.value);
                        currPerson.fullName.push(domItems.lastNameInput.value);
                        domItems.landingPageSection.style.display = 'none';
                        domItems.quizSection.style.display = 'Block';
                        console.log(currPerson);
                    } else {
                        alert('Quiz Not Ready Yet Please Contact To Admin خارجة عني ')
                    }
                } else {
                    domItems.landingPageSection.style.display = 'none';
                    domItems.adminPanelSection.style.display = 'Block';
                }
            } else {
                alert("Please Enter Your FirstName and LastName");
            }

        },
        /*
        =======================
          ///Nineth funcion 
        =======================
        */
        finalResult: function (currPerson, qusetionList) {
            domItems.finalScoreText.textContent = currPerson.fullName[0] + ' ' + currPerson.fullName[1] + ' Your Final Score is ' +
                currPerson.score + '/' + qusetionList.getQuestionCollection().length;

            domItems.quizSection.style.display = 'none';
            domItems.finalResultSection.style.display = 'block'
        },
        /*
        =======================
          ///Nineth funcion 
        =======================
        */
        addResultOnPanel(personDataList) {
            var resultHTML, firstName, LastName, personScore, personId, personScore;

            if (personDataList.getPersonData().length > 0) {
                domItems.scorListWrapper.innerHTML = '';

                for (var i = 0; i < personDataList.getPersonData().length; i++) {

                    firstName = personDataList.getPersonData()[i].firstName;
                    lastName = personDataList.getPersonData()[i].LastName;
                    personId = personDataList.getPersonData()[i].id;
                    personScore = personDataList.getPersonData()[i].Score;

                    resultHTML = ' <p class="person person-' + i + '"><span class="person-1">' + firstName + ' ' + lastName +
                        ' - ' + personScore + ' Points</span><button id="delete-result-btn_' + personId + '" class="delete-result-btn">Delete</button></p>';

                    domItems.scorListWrapper.insertAdjacentHTML('beforeend', resultHTML);

                }
            }


        },
        /*
        =======================
          ///Nineth funcion 
        =======================
        */
        DeletePersonData(event, userData) {
            debugger;
            ///Var To Get All button inSide  scorListWrapper
            var getId, personArr;
            //هنا بنحتاج تخزن العناصر علشان هتمسح منها وتعمل بعد كده save
            personArr = userData.getPersonData();

            if ('delete-result-btn_'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('_')[1]);

                for (var i = 0; i < personArr.length; i++) {

                    if (personArr[i].id === getId) {
                        personArr.splice(getId, 1);
                    }

                    //Last Thing Is Overdie PersonLocalStorage
                    userData.setPersonData(personArr);

                }
            }

        },
        /*
        =======================
          ///Nineth funcion 
        =======================
        */
        clearResultsList(ResultList) {
            debugger;
            if (ResultList.getPersonData() !== null) {
                if (ResultList.getPersonData().length > 0) {
                    debugger;
                    var conf = confirm(" you are Sure You Want Delete Entier Result List ??");
                    if (conf) {
                        ResultList.removePersonData();
                        domItems.scorListWrapper.innerHTML = '';
                    }
                }
            }
        }
    };

})();


/********************************
 ***********CONTROLLER*********
 ********************************/
var controller = (function (quizCtrl, UICtrl) {

    var selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage)

    selectedDomItems.quesInsertBtn.addEventListener('click', function () {

        //selectedDomItems.adminOptions هنا انت بتستخدم المتغير الذي يحمل نفس قيمة   
        //بسبب ان هذا المتغير لا يري كل التغيرات الجديدة في الدوم
        var adminOptions = document.querySelectorAll(".admin-option");
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        //ckeck if question add successfully
        //here to add question dynamicly without reloading page
        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage)
        }
    });

    selectedDomItems.insertQuestionWrapper.addEventListener('click', function (e) {
        UICtrl.editQuestionList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputDynamically, UIController.createQuestionList);

    });

    selectedDomItems.questionClearBtn.addEventListener('click', function () {
        //getQuestionLocalStorage ده اللي بيسمحلك تتعامل مع داتابيز
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });

    //Invok DispalyQuestion Function ***********to display spacific question and options of it*******
    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getquizProgress);

    //Invok DispalyProgress Function 
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getquizProgress);

    //Add event to Quiz options Wrapper
    selectedDomItems.quizOptionWrapper.addEventListener('click', function (e) {

        var updatedOptions = selectedDomItems.quizOptionWrapper.querySelectorAll('div');

        for (var i = 0; i < updatedOptions.length; i++) {
            if (e.target.className === 'choice-' + i) {

                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

                var answerReslut = quizCtrl.checkAnswer(answer);

                //Invok newDesign Funftion
                UICtrl.newDesign(answerReslut, answer);
                if (quizCtrl.isFinshed()) {
                    selectedDomItems.nextQuestionBtn.textContent = "Finshed";
                }

                ///////////////////////start from video number 21////////////
                //////////////////////Get Next Question//////////////////////
                var nextQuestion = function (questionData, progress) {
                    if (quizCtrl.isFinshed()) {

                        //in this case Questions Is Finshed// meaning last question
                        UICtrl.finalResult(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage);
                        //invok Person function to create one
                        quizCtrl.addPerson();


                    } else {
                        UICtrl.resetDesign();
                        quizCtrl.getquizProgress.questionIndex++;
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getquizProgress);
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getquizProgress);

                    }
                }
                selectedDomItems.nextQuestionBtn.onclick = function () {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getquizProgress)
                }
            }
        }

    });

    //Start Quiz Event Listener
    selectedDomItems.startQuizBtn.addEventListener('click', function () {
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });

    //Event To Works When Press Enter
    selectedDomItems.lastNameInput.addEventListener('focus', function () {
        selectedDomItems.lastNameInput.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
        });
    });
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    selectedDomItems.scorListWrapper.addEventListener('click', function (e) {

        UICtrl.DeletePersonData(e, quizCtrl.getPersonLocalStorage);
        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    });

    //Clear Results Button
    selectedDomItems.clearResultsBtn.addEventListener('click', function () {
        UICtrl.clearResultsList(quizCtrl.getPersonLocalStorage);
    });

})(quizController, UIController);