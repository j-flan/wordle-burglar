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

  firstKnown: string = '';
  secondKnown:string = '';
  thirdKnown: string = '';
  fourthKnown:string = '';
  fifthKnown: string = '';

  knownLetters = [
    this.firstKnown,
    this.secondKnown,
    this.thirdKnown,
    this.fourthKnown,
    this.fifthKnown
  ]
  unknownLetterPositions = [
    this.first,
    this.second,
    this.third,
    this.fourth,
    this.fifth
  ]

  badLetterCache: any = []


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
    this.firstKnown = '';
    this.secondKnown = '';
    this.thirdKnown = '';
    this.fourthKnown = '';
    this.fifthKnown = '';
    this.getTop(wordList);
  }
  filterBadLetters(){
    if(this.badLetterCache.length && this.badLetterCache.length > this.badLetters.length){
      const removedLetter: any = _.difference(this.badLetterCache.split(''), this.badLetters.split(''));
      const addWords = _.filter(wordList, word=>_.includes(word, removedLetter))
      this.filteredWords = _.concat(this.filteredWords, addWords);
    }else{
      this.filteredWords = _.filter(this.filteredWords, word=>{
        let letterNotIncluded: boolean = true
          _.forEach(this.badLetters, letter=>{
            if(_.includes(word, letter)){
              letterNotIncluded = false;
            }
          })
        return letterNotIncluded
      });
    }
    this.badLetterCache = this.badLetters
    this.getTop(this.filteredWords);
  }
  filterPosition(list: any, index: number){
    if(!list)return;
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
  filterKnown(letter: any, index: number){
    if(!letter){
      this.handleRemovedIndex(index);
      return;
    }
    this.filteredWords = _.filter(this.filteredWords, word=>word[index]==letter);
    this.getTop(this.filteredWords);
  }
  reFilter(letter: any, index: number, list: any){
    return _.filter(list, word=>word[index]==letter);
  }
  getTop(allWords: any){
    const words = _.slice(allWords,0,this.LISTMAX)
    this.top.next([...words])
  }
  handleRemovedIndex(index: number){
    this.filteredWords = wordList
    _.forEach(this.knownLetters, letter=>{
      if(letter)
        this.filteredWords = this.reFilter(letter, index, this.filteredWords)
    })
    if(this.badLetters.length)
      this.filterBadLetters();
    _.forEach(this.unknownLetterPositions, (letters, index)=>{
      if(letters.length) this.filterPosition(letters, index);
    })
    this.getTop(this.filteredWords);
  }
}
