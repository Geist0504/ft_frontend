import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import TextQuestion from './text_template/TextQuestion'


const placeholderQuestion ={
    prompt: '',
    answer: '',
    incorrect_answers: ['', '', '']
}

export default class LessonCreator extends Component {
    constructor(props, context) {
        super(props, context);
    
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    
        this.state = {
          index: 0,
          direction: null,
          questions: [],
          questionSubmited: false
        };
      }

      componentDidMount(){
          this.setState({questions: [{}]})
      }

      handleSubmit(data, resetForm, invalidateForm){
        //Gathers form data and builds object where values are arrays if the field names are shared b/w multiple values
        // otherwise it is 1:1 k:v

        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value)){
            data[key] = value.filter((el) => {
              return el !== undefined
            })
          } 
        }
        let questions = this.state.questions
        questions[this.state.index] = data
        
        this.setState(
            {
                questions: questions,
                end: false,
                questionSubmited: true
            }
        );
        this.props.updateQuestions(questions)
      }

      handleSelect(selectedIndex, e) {
        let index = selectedIndex;
        let addLesson = false;
        if(this.state.index + 1 === this.state.questions.length && e.direction === 'next' && this.state.questionSubmited){
            index = this.state.index + 1
            addLesson = true
        }
        this.setState({
          questions: addLesson ? this.state.questions.concat([{}]) : this.state.questions
        }, () => {
            this.setState({
                index: index,
                direction: e.direction,
                questionSubmited: (this.state.questionSubmited && index === this.state.questions.length-1) ? false : this.state.questionSubmited
            })
        });
      }

  render() {
    const { index, direction, questions, questionSubmited } = this.state;
    let nextIcon = <span className="glyphicon glyphicon-chevron-right"></span>
    //Next Icon is a + if at the end of the lesson
    if(index === questions.length-1){
        nextIcon =<span className="glyphicon glyphicon-plus"></span>
    }
    if(!questionSubmited && index === questions.length-1){
        nextIcon =null
    }

    return (
      <div>
          <Carousel
          activeIndex={index}
          direction={direction}
          onSelect={this.handleSelect}
          nextIcon ={nextIcon}
          >
            {questions.map(question => (
                <Carousel.Item key={question.prompt || 1}>
                    <TextQuestion handleSubmit={this.handleSubmit} question={question.prompt === undefined ? placeholderQuestion : question} />
                </Carousel.Item>
            ))}              
          </Carousel>
        
      </div>
    )
  }
}