import { Component } from '@angular/core';
import { BehaviorSubject, from, Subject, take } from 'rxjs';
import {wordList} from './word-list';
import * as _ from 'lodash'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  top: BehaviorSubject<any> = new BehaviorSubject([])
  badLetters: any = [];
  filteredWords: any = [];
  LISTMAX = 50;

  first: any = [];
  second: any = [];
  third: any = [];
  fourth: any = [];
  fifth: any = [];

  constructor(
    //public wordListService: WordListService
  ){
    this.filteredWords = wordList
    this.getTop(wordList)
  }
  reset(){
    this.filteredWords = wordList;
    this.badLetters = [];
    this.first = [];
    this.second = [];
    this.third = [];
    this.fourth = [];
    this.fifth = [];
    this.getTop(wordList);
  }
  filterBadLetters(){
    this.filteredWords = _.filter(this.filteredWords, word=>{
        let letterNotIncluded: boolean = true
          _.forEach(this.badLetters, letter=>{
            if(_.includes(word, letter)){
              letterNotIncluded = false;
            }
          })
        return letterNotIncluded
      });
    this.getTop(this.filteredWords);
  }
  filterPosition(list: any, index: number){
    this.filteredWords = _.filter(this.filteredWords, word=>{
        let letterNotIncluded: boolean = true
          _.forEach(list, letter=>{
            if(word[index] == letter){
              letterNotIncluded = false;
            }
          })
        return letterNotIncluded
      });
    this.getTop(this.filteredWords);
  }
  getTop(allWords: any){
    const words = _.slice(allWords,0,this.LISTMAX)
    this.top.next([...words])
  }
}
