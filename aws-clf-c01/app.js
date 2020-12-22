function addDarkmodeWidget() {
    const options = {
        bottom: '32px', // default: '32px'
        right: 'unset', // default: '32px'
        left: '32px', // default: 'unset'
        time: '0.5s', // default: '0.3s'
        mixColor: '#fff', // default: '#fff'
        backgroundColor: '#f8f9fa', // default: '#fff'
        buttonColorDark: '#555', // default: '#100f2c'
        buttonColorLight: '#ccc', // default: '#fff'
        saveInCookies: false, // default: true,
        //label: '🌓', // default: ''
        label: '', // default: ''
        autoMatchOsTheme: true // default: true
    }

    const darkmode = new Darkmode(options);
    darkmode.showWidget();

    //new Darkmode().showWidget();
}
window.addEventListener('load', addDarkmodeWidget);

var
    QuizCurrentQuestions = 0,
    QuizScore = [],
    QuizScoreSum = 0,
    QuizScorePercent = 0,
    // QuizApiUrl = "https://inexamlab-9bb5.restdb.io/rest/aws-clf-c-o1"
    //QuizApiUrl = "https://faizmazlan.github.io/aws-clf-c01/AWS-CLF-C01_QuestionsBank.json"
    QuizApiUrl = "AWS-CLF-C01_QuestionsBank.json"

$(document).ready(function () {
    /*
    $.ajaxPrefilter(function (options) {
        if (!options.beforeSend) {
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader('x-apikey', '5f894e3b5799e648a5a8f09a');
            }
        }
    });
    */

    $.getJSON(QuizApiUrl, function (QuizQuestions) {
        var
            QuizTitle = QuizQuestions[0]['QuizTitle'],
            QuizDescription = QuizQuestions[0]['QuizDescription'];
        
            //sessionStorage.setItem('QuizQuestionsJson', JSON.stringify(QuizQuestions));

        function htmlEncode(value) {
            return $(document.createElement('div')).text(value).html();
        }

        function setPager() {
            $("#QuizPagerSelect").val(QuizCurrentQuestions + 1);
        }

        function getExplaination() {
            $("#QuizExplainationBlock").empty();
            if (QuizQuestions[QuizCurrentQuestions].hasOwnProperty('Explaination') && QuizQuestions[QuizCurrentQuestions]['Explaination'] != "") {
                $(document.createElement('div')).addClass('col explaination').attr('id', 'QuizExplainationCol').appendTo('#QuizExplainationBlock');
                $(document.createElement('h4')).text('Explaination').appendTo('#QuizExplainationCol');
                $(document.createElement('p')).addClass('text-break').text(QuizQuestions[QuizCurrentQuestions]['Explaination']).appendTo('#QuizExplainationCol');
            }
        }

        function setQuestionImage() {
            $("#QuizImageBlock").empty();
            if (QuizQuestions[QuizCurrentQuestions].hasOwnProperty('ImageUrl') && QuizQuestions[QuizCurrentQuestions]['ImageUrl'] != "") {
                $(document.createElement('img')).addClass('question-image').attr('id', 'QuizQuestionImage').attr('src', QuizQuestions[QuizCurrentQuestions]['ImageUrl']).attr('alt', htmlEncode(QuizQuestions[QuizCurrentQuestions]['Question'])).appendTo('#QuizImageBlock');
            }
        }

        function getAnswers() {
            var Answers = QuizQuestions[QuizCurrentQuestions]['Answer'].split(" ");
            return Answers
        }

        function checkAnswer(choices) {
            var
                QuizCorrectAnswers = getAnswers(),
                QuizCorrectAnswersCount = 0;

            for (var i = 0; i < choices.length; i++) {
                $('#AnswerBlock' + choices[i].id).removeClass('btn-success');
                $('#AnswerBlock' + choices[i].id).removeClass('btn-outline-danger');
            }

            // mark checked answer
            if (!!localStorage.getItem('SelectedAnswerStore' + QuizCurrentQuestions)) {
                var SelectedAnswerStoreArray = localStorage.getItem('SelectedAnswerStore' + QuizCurrentQuestions).split(',');
                for (var SelectedAnswer of SelectedAnswerStoreArray) {
                    if (!QuizCorrectAnswers.includes(SelectedAnswer)) {
                        $('#AnswerInput' + SelectedAnswer).attr('checked', 'checked');
                        $('#AnswerBlock' + SelectedAnswer).addClass('btn-outline-danger');
                    } else {
                        $('#AnswerBlock' + SelectedAnswer).addClass('btn-success');
                        QuizCorrectAnswersCount++;
                    }
                }
            }

            // calculate score
            if (QuizCorrectAnswersCount == QuizCorrectAnswers.length) {
                QuizScore[QuizCurrentQuestions] = 1;
                // display explaination
                getExplaination();

            } else if (QuizCorrectAnswersCount < QuizCorrectAnswers.length) {
                QuizScore[QuizCurrentQuestions] = 0;
            } else {
                QuizScore[QuizCurrentQuestions] = 0;
            }
            QuizScoreSum = QuizScore.reduce(function (a, b) {
                return a + b;
            }, 0);
            QuizScorePercent = (QuizScoreSum / QuizQuestions.length) * 100
        }

        function getSelectedAnswers() {
            var SelectedAnswers = $("input[name='QuizAnswer" + QuizCurrentQuestions + "']:checked")
            if (!!SelectedAnswers) {
                var SelectedAnswersArray = []
                for (var SelectedAnswer of SelectedAnswers) {
                    SelectedAnswersArray.push(SelectedAnswer.value);
                }
                localStorage.setItem('SelectedAnswerStore' + QuizCurrentQuestions, SelectedAnswersArray.join(','));
            }
        }

        function getChoices(QuizQuestions) {
            var AnswerChoices = [{
                "id": "A",
                "text": QuizQuestions[QuizCurrentQuestions]['Choice_A']
            }, {
                "id": "B",
                "text": QuizQuestions[QuizCurrentQuestions]['Choice_B']
            }, {
                "id": "C",
                "text": QuizQuestions[QuizCurrentQuestions]['Choice_C']
            }, {
                "id": "D",
                "text": QuizQuestions[QuizCurrentQuestions]['Choice_D']
            }, {
                "id": "E",
                "text": QuizQuestions[QuizCurrentQuestions]['Choice_E']
            }];
            AnswerChoices = AnswerChoices.filter(item => item.text.length > 0);
            return AnswerChoices
        }

        function addChoices(choices) {
            var
                QuizCorrectAnswers = getAnswers(),
                CorrectAnswersCount = QuizCorrectAnswers.length

            if (typeof choices !== "undefined" && $.type(choices) == "array") {
                $('#ChoiceBlock').empty();
                if (CorrectAnswersCount > 1) {
                    for (var i = 0; i < choices.length; i++) {
                        $(document.createElement('div')).addClass('custom-control').addClass('custom-checkbox').attr('id', 'AnswerBlock' + choices[i].id).appendTo('#ChoiceBlock');
                        $(document.createElement('input')).addClass('custom-control-input').attr('name', 'QuizAnswer' + QuizCurrentQuestions).attr('type', 'checkbox').attr('id', 'AnswerInput' + choices[i].id).attr('value', choices[i].id).appendTo('#AnswerBlock' + choices[i].id);
                        $(document.createElement('label')).addClass('custom-control-label').attr('id', 'AnswerLabel' + choices[i].id).attr('for', 'AnswerInput' + choices[i].id).appendTo('#AnswerBlock' + choices[i].id);
                        $(document.createElement('b')).text('[ ' + choices[i].id + ' ]  ').appendTo('#AnswerLabel' + choices[i].id);
                        $(document.createElement('span')).text(choices[i].text).appendTo('#AnswerLabel' + choices[i].id);
                    }
                } else {
                    for (var i = 0; i < choices.length; i++) {
                        $(document.createElement('div')).addClass('custom-control').addClass('custom-radio').attr('id', 'AnswerBlock' + choices[i].id).appendTo('#ChoiceBlock');
                        $(document.createElement('input')).addClass('custom-control-input').attr('name', 'QuizAnswer' + QuizCurrentQuestions).attr('type', 'radio').attr('required', '').attr('id', 'AnswerInput' + choices[i].id).attr('value', choices[i].id).appendTo('#AnswerBlock' + choices[i].id);
                        $(document.createElement('label')).addClass('custom-control-label').attr('id', 'AnswerLabel' + choices[i].id).attr('for', 'AnswerInput' + choices[i].id).appendTo('#AnswerBlock' + choices[i].id);
                        $(document.createElement('b')).text('[ ' + choices[i].id + ' ]  ').appendTo('#AnswerLabel' + choices[i].id);
                        $(document.createElement('span')).text(choices[i].text).appendTo('#AnswerLabel' + choices[i].id);
                    }
                }

                if (!!localStorage.getItem('SelectedAnswerStore' + QuizCurrentQuestions)) {
                    var SelectedAnswerStoreArray = localStorage.getItem('SelectedAnswerStore' + QuizCurrentQuestions).split(',');
                    for (var SelectedAnswer of SelectedAnswerStoreArray) {
                        $('#AnswerInput' + SelectedAnswer).attr('checked', 'checked');
                    }
                }
            }
        }

        function setButtons(choices) {
            $(document.createElement('div')).addClass('col').attr('id', 'ButtonCol1').appendTo('#QuizButton');
            $(document.createElement('div')).addClass('col').attr('id', 'ButtonCol2').appendTo('#QuizButton');
            $(document.createElement('div')).addClass('col').attr('id', 'ButtonCol3').appendTo('#QuizButton');

            switch (QuizCurrentQuestions) {
                case QuizQuestions.length - 1:
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-secondary').attr('id', 'ButtonPrev').text('Prev').appendTo('#ButtonCol1');
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-outline-secondary').attr('id', 'ButtonCheck').text('Check').appendTo('#ButtonCol2');
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-success').attr('id', 'ButtonFinish').attr('type', 'submit').text('Finish').appendTo('#ButtonCol3');
                    break;
                case 0:
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-light').attr('id', 'ButtonPrev').text('Prev').appendTo('#ButtonCol1');
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-outline-secondary').attr('id', 'ButtonCheck').text('Check').appendTo('#ButtonCol2');
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-primary').attr('id', 'ButtonNext').attr('type', 'submit').text('Next').appendTo('#ButtonCol3');
                    $('#ButtonPrev').attr('disabled', 'disabled');
                    break;
                default:
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-secondary').attr('id', 'ButtonPrev').text('Prev').appendTo('#ButtonCol1');
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-outline-secondary').attr('id', 'ButtonCheck').text('Check').appendTo('#ButtonCol2');
                    $(document.createElement('button')).addClass('btn btn-block').addClass('btn-primary').attr('id', 'ButtonNext').attr('type', 'submit').text('Next').appendTo('#ButtonCol3');
            }

            $('#ButtonNext').on('click', function () {
                getSelectedAnswers();
                checkAnswer(getChoices(QuizQuestions));
                QuizCurrentQuestions++;
                getQuestion();
            });
            $('#ButtonPrev').on('click', function () {
                getSelectedAnswers();
                checkAnswer(getChoices(QuizQuestions));
                QuizCurrentQuestions--;
                getQuestion();
            });
            $('#ButtonCheck').on('click', function () {
                getSelectedAnswers();
                checkAnswer(getChoices(QuizQuestions));
            });
            $('#ButtonFinish').on('click', function () {
                getSelectedAnswers();
                checkAnswer(getChoices(QuizQuestions));
                getResult();
            });
        }

        function getResult() {
            $('#QuizExplanation').empty();
            $('#QuizButton').empty();
            $('#QuizQuestion').empty();
            $('#QuizPager').empty();
            $('#QuizContent').empty();
            $(document.createElement('hr')).addClass('mb-4').appendTo('#QuizContent');
            if (QuizScorePercent > 80) {
                $(document.createElement('h2')).addClass('text-center text-success').text('Congratulations!').appendTo('#QuizContent');
                $(document.createElement('h4')).addClass('text-center text-secondary').text('You scored ' + QuizScorePercent.toFixed(2) + '%').appendTo('#QuizContent');
            } else {
                $(document.createElement('h2')).addClass('text-center text-danger').text('Try Again').appendTo('#QuizContent');
                $(document.createElement('h4')).addClass('text-center text-secondary').text('You scored ' + QuizScorePercent.toFixed(2) + '%').appendTo('#QuizContent');
            }
            $(document.createElement('br')).appendTo('#QuizContent');
            $(document.createElement('div')).addClass('row').attr('id', 'QuizStartRow1').appendTo('#QuizContent');
            $(document.createElement('div')).addClass('col').attr('id', 'QuizStartCol11').appendTo('#QuizStartRow1');
            $(document.createElement('div')).addClass('col').attr('id', 'QuizStartCol12').appendTo('#QuizStartRow1');
            $(document.createElement('div')).addClass('col').attr('id', 'QuizStartCol13').appendTo('#QuizStartRow1');
            $(document.createElement('button')).addClass('btn btn-block btn-outline-secondary').attr('id', 'ButtonRevisit').text('Revisit').appendTo('#QuizStartCol12');
            $('#ButtonRevisit').on('click', function () {
                startQuiz(QuizCurrentQuestions);
            });
            $(document.createElement('button')).addClass('btn btn-block btn-primary').attr('id', 'ButtonStart').text('Start Over').appendTo('#QuizStartCol12');
            $('#ButtonStart').on('click', function () {
                localStorage.clear();
                window.location.reload();
            });
            $(document.createElement('hr')).addClass('mb-4').appendTo('#QuizContent');
        }

        function setupPager() {
            $(document.createElement('div')).addClass('row').attr('id', 'QuizPagerRow').appendTo('#QuizContent');
            $(document.createElement('div')).addClass('col-2 pager-left').attr('id', 'QuizPagerColLeft').appendTo('#QuizPagerRow');
            $(document.createElement('div')).addClass('col pager-right').attr('id', 'QuizPagerColRight').appendTo('#QuizPagerRow');

            $(document.createElement('button')).addClass('btn btn-outline-secondary btn-xs pager-left-button').attr('id', 'ButtonScore').text('Score').appendTo('#QuizPagerColLeft');

            $(document.createElement('div')).addClass('pager-right').attr('id', 'QuizPager').text('Question ').appendTo('#QuizPagerColRight');
            $(document.createElement('select')).attr('name', 'QuizPagerSelect').attr('id', 'QuizPagerSelect').appendTo('#QuizPager');
            for (i = 1; i < (QuizQuestions.length + 1); i++) {
                $("#QuizPagerSelect").append($("<option>").attr('value', i).text(i));
            }
            $(document.createElement('span')).addClass('pager-right').attr('id', 'QuizPagerText').text(' of ' + QuizQuestions.length).appendTo('#QuizPager');
            $(document.createElement('button')).addClass('btn btn-outline-secondary btn-xs pager-right-button').attr('id', 'ButtonJump').text('Go').appendTo('#QuizPager');
            $('#ButtonJump').on('click', function () {
                getSelectedAnswers();
                checkAnswer(getChoices(QuizQuestions));
                QuizCurrentQuestions = Number($("#QuizPagerSelect").val()) - 1;
                getQuestion();
            });
            $('#ButtonScore').on('click', function () {
                getSelectedAnswers();
                checkAnswer(getChoices(QuizQuestions));
                getResult();
            });
        }

        function getQuestion() {
            $('#QuizExplainationBlock').empty();
            $('#QuizButton').empty();
            setPager();
            $('#QuizQuestion').text(QuizQuestions[QuizCurrentQuestions]['Question']);
            //add image if present
            setQuestionImage();
            addChoices(getChoices(QuizQuestions));
            setButtons();
        }

        function startQuiz(CurrentQuestion) {
            $('#QuizHeader').empty();
            $('#QuizContent').empty();

            if (typeof QuizTitle !== "undefined" && $.type(QuizTitle) === "string") {
                $(document.createElement('h3')).text(QuizTitle).appendTo('#QuizHeader');
                $('#PageTitle').text(QuizTitle);
            }
            if (typeof QuizDescription !== "undefined" && $.type(QuizDescription) === "string") {
                $(document.createElement('p')).addClass('lead').text(QuizDescription).appendTo('#QuizHeader');
            }
            if (typeof CurrentQuestion !== "undefined") {
                QuizCurrentQuestions = CurrentQuestion
            }

            //add pager and questions
            if (typeof QuizQuestions !== "undefined" && $.type(QuizQuestions) === "array") {
                //set pager
                setupPager();
                setPager();

                // add line
                $(document.createElement('hr')).addClass('mb-4').appendTo('#QuizContent');

                //add first question
                $(document.createElement('p')).attr('id', 'QuizQuestion').text(QuizQuestions[0]['Question']).appendTo('#QuizContent');

                //add image block
                $(document.createElement('div')).attr('id', 'QuizImageBlock').appendTo('#QuizContent');
                setQuestionImage();

                //choices block
                $(document.createElement('div')).attr('id', 'ChoiceBlock').appendTo('#QuizContent');
                addChoices(getChoices(QuizQuestions));

                //add explaination block
                $(document.createElement('div')).addClass('row').attr('id', 'QuizExplainationBlock').appendTo('#QuizContent');

                // button blocks
                $(document.createElement('hr')).addClass('mb-4').appendTo('#QuizContent');
                $(document.createElement('div')).addClass('row').attr('id', 'QuizButton').appendTo('#QuizContent');
                setButtons();
            }
        }

        function initQuiz() {
            if (typeof QuizTitle !== "undefined" && $.type(QuizTitle) === "string") {
                $(document.createElement('h2')).text(QuizTitle).appendTo('#QuizStartBlock');
                $('#PageTitle').text(QuizTitle);
            }
            if (typeof QuizDescription !== "undefined" && $.type(QuizDescription) === "string") {
                $(document.createElement('h4')).text(QuizDescription).appendTo('#QuizStartBlock');
            }

            $(document.createElement('hr')).addClass('mb-4').appendTo('#QuizStartBlock');
            $(document.createElement('p')).text('This set contains ' + QuizQuestions.length + ' questions.').appendTo('#QuizStartBlock');
            $(document.createElement('button')).addClass('btn mr-2 btn-lg').addClass('btn-primary').attr('id', 'ButtonStart').text('Start').appendTo('#QuizStartBlock');
            $('#ButtonStart').on('click', function () {
                startQuiz();
            });
        }

        initQuiz();
    });
});
