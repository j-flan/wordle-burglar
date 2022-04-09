import { Component } from '@angular/core';
import { BehaviorSubject, from, Subject, take } from 'rxjs';
import { wordList } from './word-list';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  top: BehaviorSubject<any> = new BehaviorSubject([]);
  badLetters: any = [];
  correctLetters: any = [];
  knownLetters: any = [];
  filteredWords: any = [];
  LISTMAX = 50;

  first: any = [];
  second: any = [];
  third: any = [];
  fourth: any = [];
  fifth: any = [];

  firstCorrect: string = '';
  secondCorrect: string = '';
  thirdCorrect: string = '';
  fourthCorrect: string = '';
  fifthCorrect: string = '';

  correctLetters$: Subject<any> = new Subject();
  knownLetters$: Subject<any> = new Subject();
  badLetters$: Subject<any> = new Subject();

  constructor() { //public wordListService: WordListService
    this.filteredWords = wordList;
    this.getTop();
    this.correctLetters$.subscribe({
      next: (obj) => {
        this.correctLetters[obj.index] = obj.letter;
        this.updateWords();
      },
    });
    this.knownLetters$.subscribe({
      next: (obj) => {
        this.knownLetters[obj.index] = obj.letters;
        this.updateWords();
      },
    });
  }

  //heirarchy:
  //bad
  //known
  //unknownposition

  filterCorrect(letter: any, index: number) {
    this.correctLetters$.next({ letter, index });
  }
  filterKnown(letters: any, index: number) {
    this.knownLetters$.next({ letters, index });
  }

  updateWords() {
    this.filteredWords = wordList;
    this.updateBadLetters();
    _.forEach(this.knownLetters, (letters, index) => {
      _.forEach(letters, (letter) => {
        if (_.includes(this.badLetters, letter))
          _.remove(
            this.knownLetters[index],
            (knownletter) => knownletter == letter
          );
      });
    });

    if (this.correctLetters?.length)
      _.forEach(this.correctLetters, (letter, index) => {
        if (letter)
          this.filteredWords = _.filter(
            this.filteredWords,
            (word) => word[index] == letter
          );
      });
    this.updateKnownLetters();
    this.getTop();
  }
  updateBadLetters() {
    if (this.badLetters?.length)
      _.forEach(this.badLetters, (letter) => {
        if (letter)
          this.filteredWords = _.filter(
            this.filteredWords,
            (word) => !_.includes(word, letter)
          );
      });
  }
  updateKnownLetters() {
    if (this.knownLetters?.length)
      _.forEach(this.knownLetters, (letters, index) => {
        if (letters) {
          _.forEach(letters, (letter) => {
            if (letter)
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
}
