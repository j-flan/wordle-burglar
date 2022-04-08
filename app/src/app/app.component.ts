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
    _.forEach(this.unknownLetterPositions, letters=>letters = []);
    _.forEach(this.knownLetters, letter=>letter='');
    this.getTop(wordList);
  }

  //heirarchy:
  //known
  //not included
  //unknownposition

  filterKnown(letter: any, index: number){
    if(!letter){
      this.knownLetters[index] = ''
      this.handleRemovedKnownIndex(index);
      return;
    }
    this.filteredWords = _.filter(this.filteredWords, word=>word[index]==letter);
    this.knownLetters[index] = letter;
    this.getTop(this.filteredWords);
  }
  handleRemovedKnownIndex(index: number){
    this.filteredWords = wordList
    _.forEach(this.knownLetters, letter=>{
      if(letter)
        this.filteredWords = this.reFilterIndex(letter, index, this.filteredWords)
    })
    if(this.badLetters.length)
      this.filterBadLetters();
    this.scanUnkown();
    this.getTop(this.filteredWords);
  }

  filterBadLetters(){
    if(this.badLetterCache.length && this.badLetterCache.length > this.badLetters.length){
      const removedLetter: any = _.difference(this.badLetterCache.split(''), this.badLetters.split(''));
      const addWords = _.filter(wordList, word=>_.includes(word, removedLetter))
      this.filteredWords = _.concat(this.filteredWords, addWords);
      this.scanUnkown();
    }else{
      const conflictLetter = _.filter(this.knownLetters, letter=>_.find(this.badLetters.split(''), badLetter=>badLetter==letter));
      if(conflictLetter.length){
        console.log('conflict: ', conflictLetter);
        this.badLetters = _.filter(this.badLetters.split(''), letter=>letter!=conflictLetter);
      }
      if(this.badLetters)
      console.log('filter bad letters: ', this.badLetters.split(''))
        this.filteredWords = _.filter(this.filteredWords, word=>{
            return _.includes(word, this.badLetters[this.badLetters.length-1]);
        });
    }
    this.badLetterCache = this.badLetters
    this.getTop(this.filteredWords);
  }

  filterPosition(list: any, index: number){
    if(!list)return;
    this.filteredWords = _.filter(this.filteredWords, word=>{
      return _.find(list, letter=>(word[index] != letter && _.includes(word, letter)));
    });
    this.getTop(this.filteredWords);
  }

  reFilterIndex(letter: any, index: number, list: any){
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
        this.filteredWords = this.reFilterIndex(letter, index, this.filteredWords)
    })
    if(this.badLetters.length)
      this.filterBadLetters();
    this.scanUnkown()
    this.getTop(this.filteredWords);
  }

  scanUnkown(){
    _.forEach(this.unknownLetterPositions, (letters, index)=>{
      if(letters.length) this.filterPosition(letters, index);
    })
  }

}
