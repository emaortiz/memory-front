import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {
  constructor(public http: HttpClient) {}
  gethighscore() {
    return this.http.get('http://localhost:3000/scores');
  }

  addscore(score: any) {
    return this.http.post('http://localhost:3000/scores', score).subscribe(res => console.log(res));
  }

  deletescore(id : any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: {id: id}
    };
    return this.http.delete('http://localhost:3000/scores', httpOptions);
  }
}
