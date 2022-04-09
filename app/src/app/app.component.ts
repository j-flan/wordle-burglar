import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { wordList } from './word-list';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  top: BehaviorSubject<any> = new BehaviorSubject([]);
  badLetters: string[] = [];
  correctLetters: string[] = [];
  knownLetters: string[] = [];
  filteredWords: string[] = [];
  LISTMAX = 50;

  first: string = '';
  second: string = '';
  third: string = '';
  fourth: string = '';
  fifth: string = '';

  firstCorrect: string = '';
  secondCorrect: string = '';
  thirdCorrect: string = '';
  fourthCorrect: string = '';
  fifthCorrect: string = '';

  constructor() {
    this.filteredWords = wordList;
    this.getTop();
  }

  //heirarchy:
  //bad
  //known
  //unknownposition

  setCorrect(letter: string, index: number) {
    this.correctLetters[index] = letter;
    this.filterWords();
  }
  setKnown(letters: string, index: number) {
    this.knownLetters[index] = letters;
    this.filterWords();
  }

  filterWords() {
    this.filteredWords = wordList;
    this.filterBadLetters();
    this.removeBadFromKnown();
    this.filterCorrectLetters();
    this.filterKnownLetters();
    this.getTop();
  }
  filterBadLetters() {
    if (this.badLetters?.length)
      _.forEach(this.badLetters, (letter) => {
        if (letter){
          if(_.find(this.correctLetters, correctLetter=>letter == correctLetter)){
            this.badLetters = _.filter(this.badLetters, badLetter=>badLetter!=letter);
          }else{
            this.filteredWords = _.filter(
              this.filteredWords,
              (word) => !_.includes(word, letter)
            );
          }
        }

      });
  }
  removeBadFromKnown() {
    let needsReset: boolean = false
    _.forEach(this.knownLetters, (letters, index) => {
      _.forEach(letters, (letter) => {
        if (_.includes(this.badLetters, letter)) {
          needsReset = true;
          const filtered = _.filter(
            this.knownLetters[index],
            (knownletter) => knownletter != letter
          );
          needsReset = true;
          this.knownLetters[index] = filtered.join('');
          this.setKnownModel(this.knownLetters[index], index);
        }
      });
    });
    if(needsReset)
      this.filterWords();
  }

  filterCorrectLetters() {
    if (this.correctLetters?.length)
      _.forEach(this.correctLetters, (letter, index) => {
        if (letter)
          this.filteredWords = _.filter(
            this.filteredWords,
            (word) => word[index] == letter
          );
      });
  }
  filterKnownLetters() {
    if (this.knownLetters?.length)
      _.forEach(this.knownLetters, (letters, index) => {
        if (letters) {
          _.forEach(letters, (letter) => {
            if (letter)
            if(_.find(this.correctLetters, correctLetter=>letter == correctLetter)){
              this.knownLetters[index] = _.filter(this.knownLetters[index], known=>known != letter).join('')
              this.setKnownModel(this.knownLetters[index], index)
            }
            else
              this.filteredWords = _.filter(
                this.filteredWords,
                (word) => word[index] != letter && _.includes(word, letter)
              );
          });
        }
      });
  }

  getTop() {
    const words = _.slice(this.filteredWords, 0, this.LISTMAX);
    this.top.next([...words]);
  }
  setKnownModel(string:string, index:number){
    index == 0
      ? (this.first = string)
      : index == 1
      ? (this.second = string)
      : index == 2
      ? (this.third = string)
      : index == 3
      ? (this.fourth = string)
      : (this.fifth = string);
  }
}
