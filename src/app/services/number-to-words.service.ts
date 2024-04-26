import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiUrl } from '../constants/currencyconverterconstants';

@Injectable({
  providedIn: 'root',
})
export class NumberToWordsService {

  constructor(private http: HttpClient) { }

  getAmountConvertedToWords(data : number){
    //calling backend service to convert number into words
    return this.http.get<string>(ApiUrl + data).pipe(
      map((response : any) => {
        const data = response;
        console.log("data",response);
        if(data){
          return data;
        }
      })
    )
  }
}
