import { Component } from '@angular/core';
import { Question } from '../question';
import { AlertController, LoadingController } from '@ionic/angular';
import { QuizResult } from '../quizresult';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private alertCtrl: AlertController,

  private loadingCtrl: LoadingController) {
    this.questions = [  
      {
        questionText: 'Koja je ovo životinja da li je divlja?',
        answers: ['Lav','Puma','Divlja','Pitoma'],
        answerIndex1: 0,
        answerIndex2: 3,
        image:'lav.jpg'
      }, 
      {
        questionText: 'Koje su karakteristike ove životinje?',
        answers: ['Brzina', 'Pitoma', 'Spava po cijele dane', 'Skace visoko'],
        answerIndex1: 0,
        answerIndex2: 3,
        image:'leopard.jpg'
      },
      {
        questionText: 'Koja je ovo životinja i da li je otrovna?',
        answers: ['zmija','otrovnica','pitoma','ne znam'],
        answerIndex1: 0,
        answerIndex2: 1,
        image:'zmija.png'
      }
    ];
    
    this.loadFromLocalStorage();
    this.showQuestion();
    this.timer = setInterval(()=>this.countDown(), 3000);
   
  }

  questions: Question[] =  [];
  currentQuestion: Question;
  result = 'Neodgovoreno';
  lastAnswer = null;
  currentIndex = 0;
  correctAnswers = 0;
  secondsRemaining = 10;
  timer = null;
  page = 1;
  resultObj = new QuizResult();
  imaRezultata = false;
  

  checkAnswer(i: number) {
    if(this.lastAnswer != null) {
      return;
    }
    if(i == this.currentQuestion.answerIndex1){
      this.result = 'Polovično';
      this.correctAnswers++;
    } else if(i== this.currentQuestion.answerIndex2){
      this.result = 'Polovično';
      this.correctAnswers++;
    }
    else if(i==this.currentQuestion.answerIndex1&&this.currentQuestion.answerIndex2){
      this.result='Točno';
      this.correctAnswers++;
    }
     else {
      this.result = 'Netočno';
    }
    this.lastAnswer = i;
  }

  answerClass() {
    if(this.lastAnswer == null) {
      return '';
    }
    if(this.lastAnswer == this.currentQuestion.answerIndex1) {
      return 'correct';
    } else if(this.lastAnswer == this.currentQuestion.answerIndex2){
      return 'correct';
    } 
    else {
      return 'incorrect';
    }
  }

  itemColor(i: number) {
    if(i != this.lastAnswer) {
      return '';
    }
    if(i == this.currentQuestion.answerIndex1) {
      return 'warning';
    } else if(i== this.currentQuestion.answerIndex2){
      return 'warning';
    } else if(i==this.currentQuestion.answerIndex1 && this.currentQuestion.answerIndex2){
      return 'success';
    }
    else {
      return 'danger';
    }
  }

  showQuestion() {
    this.lastAnswer = null;
    this.result = 'Neodgovoreno';
    this.currentQuestion = this.questions[this.currentIndex];
    this.secondsRemaining = 30;
  }

  async next(){
    if(this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.showQuestion();      
    } else {
      clearInterval(this.timer);
      
      this.showEndScreen();
    }
  }

  countDown() {
    this.resultObj.totalTime++;
    if(this.secondsRemaining == 0) {
      
      this.next();
    } else {
      this.secondsRemaining--;
    }
  }

  checkCounterStyle() {
    if(this.secondsRemaining <= 4) {
      return 'counternear0';
    }
    return '';
  }

  showEndScreen() {
    this.page = 3;
    this.resultObj.datePlayed = new Date();
    this.resultObj.score = this.correctAnswers / this.questions.length;
    this.saveToLocalStorage();
  }

  home() {
   
    this.page = 1;
    this.currentIndex = 0;
    this.correctAnswers = 0;

  }

  start() {
    this.page = 2;
    this.showQuestion();
    this.resultObj.totalTime = 0;
    this.timer = setInterval(()=>this.countDown(), 1000);
  }

  saveToLocalStorage() {
    localStorage.setItem('quizResult', JSON.stringify(this.resultObj));
  }

  loadFromLocalStorage() {
    const storage = localStorage.getItem('quizResult');
    if(storage != null) {
      this.resultObj = JSON.parse(storage);
      this.imaRezultata = true;
    }
  }

  ionViewDidEnter() {
   this.loadFromLocalStorage(); 
  }
  
}


