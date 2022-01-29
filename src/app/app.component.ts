import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardData } from './components/game-card/card-data.model';
import { RestartDialogComponent } from './components/restart-dialog/restart-dialog.component';
import { ScoresService } from './services/scores.services';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  cardImages = [
    'pDGNBK9A0sk',
    'fYDrhbVlV1E',
    'qoXgaF27zBc',
    'b9drVB7xIOI',
    'TQ-q5WAVHj0'
  ];

  hscore: any;
  n: any;
  t: any;
  time: any;
  totaltime = 0;
  interval: any;
  dbscore: any;
  sec = 0;
  min = 0;
  hr = 0;

  cards: CardData[] = [];

  flippedCards: CardData[] = [];

  matchedCount = 0;

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  constructor(private dialog: MatDialog, private scoreService: ScoresService) {

  }

  ngOnInit(): void {
    this.setupCards();
    this.scores();
    this.startTimer();
  }

  setupCards(): void {
    this.cards = [];
    this.cardImages.forEach((image) => {
      const cardData: CardData = {
        imageId: image,
        state: 'default'
      };

      this.cards.push({ ...cardData });
      this.cards.push({ ...cardData });

    });

    this.cards = this.shuffleArray(this.cards);
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();

    }
  }

  replaceAll(str: any, find: any, replace: any) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  checkForCardMatch(): void {
    setTimeout(async () => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];

      if (nextState === 'matched') {
        this.matchedCount++;

        if (this.matchedCount === this.cardImages.length) {

          this.time = this.hr + ' hr ' + this.min + ' min ' + this.sec + ' sec';
          this.pauseTimer();
          this.dbscore = {
            name: 'User',
            time: moment().format('yyyy-MM-DD hh:mm:ss'),
            totalTime: this.time
          };
          await this.scoreService.addscore(this.dbscore);
          const dialogRef = this.dialog.open(RestartDialogComponent, {
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe(() => {
            this.restart();
          });
        }
      }

    }, 1000);
  }

  restart(): void {
    this.matchedCount = 0;
    this.setupCards();
    this.startTimer();
    this.scores();
  }

  scores() {
    this.scoreService.gethighscore().subscribe((data: any) => {
      this.hscore = data;
    });
  }

  startTimer() {
    this.sec = 0;
    this.min = 0;
    this.hr = 0;
    this.interval = setInterval(() => {
      this.sec++;
      this.totaltime++;
      if (this.sec === 60) {
        this.min++;
        this.sec = 0;
        if (this.min === 60) {
          this.hr++;
          this.min = 0;
        }
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

}
