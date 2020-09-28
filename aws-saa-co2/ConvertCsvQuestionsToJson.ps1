
$CsvFile = "QuestionsBank.csv"

$Quizes = Get-Content $CsvFile | ConvertFrom-Csv
$QuizArray = @()
$QuestionArray = @()

foreach ($Quiz in $Quizes) {
    $ChoiceArray = @()
    $ChoicesName = ($Quiz | Get-Member | ?{ $_.Name -ilike "Choice_*" }).Name
    foreach ( $ChoiceName in $ChoicesName ){
        $ChoiceId = $ChoiceName.Split('_')[1] 
        $ChoiceText = ($Quiz | Select -Property $ChoiceName).$ChoiceName
        if( $ChoiceText -ne "" ){
            $ChoiceArray += [PSCustomObject]@{
                id = $ChoiceId
                text = $ChoiceText
            }
        }
    }

    if ($null -ne $Quiz.Answer){
        $QuizAnswer = $Quiz.Answer.Split(" ")
    } else {
        $QuizAnswer = $Quiz.Answer
    }
    $QuestionArray += [PSCustomObject]@{
        id = $Quiz.QuestionNum
        question = $Quiz.Question
        image = $Quiz.ImageUrl
        reference = $Quiz.Explaination
        correct = $QuizAnswer
        choices = $ChoiceArray
    }
}

$QuizArray = [PSCustomObject]@{
    QuizCode = ($Quizes | Select -Unique QuizCode).QuizCode
    QuizTitle = ($Quizes | Select -Unique QuizTitle).QuizTitle
    QuizDescription = ($Quizes | Select -Unique QuizDescription).QuizDescription
    QuizQuestions = $QuestionArray
}

$QuizArray | ConvertTo-Json -Depth 5