exports.requestBodyBuilder = (requestBodyParams, type) => {
    //TODO: add an else case to handle type match failure
    let requestBody;
    if (type === "createQuestion"){
        requestBody = {
            query: `
              mutation{
                   createQuestion(questionInput:{author:"5c324ab59a7bb9c27c3f8eda", prompt:"${requestBodyParams.prompt}", answer:"${requestBodyParams.answer}", incorrectAnswers:["${requestBodyParams.incorrect_answers_string}"], promptLanguage:"${requestBodyParams.prompt_language}", responseLanguage:"${requestBodyParams.response_language}", difficulty:${requestBodyParams.difficulty}, type:"${requestBodyParams.type}"}){
                       _id
                       prompt
                       answer
                       incorrectAnswers
                       author{
                           username
                           _id
                       }
                   }
               }
            `
          }

    }

    if (type === 'createLesson'){
        requestBody = {
            query: `
            mutation{
                createLesson(lessonInput:{title:"${requestBodyParams.lesson.title}", author:"${requestBodyParams.lesson.authorID}", description:"I'm hungry", 
                promptLanguage:"${requestBodyParams.lesson.studentLanguage}",  answerLanguage:"${requestBodyParams.lesson.teacherLanguage}", difficulty:${requestBodyParams.lesson.difficulty}, questions:["${requestBodyParams.question_Ids.join('", "')}"]}){
                    _id
                    title
                        createdOn
                    author{
                        username
                    }
                    questions{
                        _id
                        prompt
                        answer
                        incorrectAnswers
                    }
                }
            }
            `
        }
    }
    if (type === "user"){
        requestBody = {
            query: `
            query{
                user(id:"${requestBodyParams.userID}"){
                  username
                  email
                  createdLessons{
                    title
                  }
                  spokenLanguageSkill{
                    language
                    rating
                  }
                  learningLanguageSkill{
                    language
                    rating
                  }
                }
              }
              
            `
          }

    }

    return requestBody
}