import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, NgModel, FormControl, ValidationErrors } from '@angular/forms';
import { NumberToWordsService } from '../services/number-to-words.service';
import { MaxDollarPartAmountErrorMessage, MaxCentPartAmountErrorMessage } from '../constants/currencyconverterconstants';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-number-to-words',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './number-to-words.component.html',
  styleUrl: './number-to-words.component.css',
})
export class NumberToWordsComponent {
  maxDollarError = MaxDollarPartAmountErrorMessage;
  maxCentError = MaxCentPartAmountErrorMessage;
  convertedAmount : string | undefined;
  amount :FormControl;
  inputValue : string = '';
  inputAmount: string = '';
  validAmountFormat : boolean = true;
  
  constructor(private services : NumberToWordsService, private toastr : ToastrService) {
    // amount field is mandatory
      this.amount = new FormControl('', {
        validators: [Validators.required]
      })
  }


  onSubmit(){
    let dollarPart;
    let centPart;
    //split the amount into 2 part one is dollar part and another cent part 
    let dollarAmount = this.amount.value.split(',');
    //replaces the white spaces
    dollarPart = dollarAmount[0].replace(/\s/g, '');
    if(this.amount.value.toString().includes(',')){   
      centPart = dollarAmount[1];
      //check whether there is cent part amount after ,
      if(centPart.length == 0) {
        this.validAmountFormat = false
        return ;
      }
    }


    this.amount.markAllAsTouched();
    if (this.amount.valid) {
      var amount = dollarPart;

      if(centPart != undefined)
         amount += '.' + centPart;

      // Convert the amount to words by calling service
      this.services.getAmountConvertedToWords(amount).subscribe(
      {
        next: (response) => this.convertedAmount = response.amount,
        //if any error in services throw generic error.
        error: () => this.toastr.error('Error','Please try again after some time')
      })
    }
  }
  
  onAmountChange(){
    this.convertedAmount = undefined;
    let dollarPart;
    let centPart;
    var hasCentAmount = false;
    this.validAmountFormat = true;
    //regular expression only numbers and one comma needs to be present.
    const amountPattern = /^\d+(,\d*)?$/
    const amountWithoutSpaces = this.amount.value.replace(/\s+/g, '').toString();
    if(!amountPattern.test(amountWithoutSpaces) && this.amount.value != '')
      this.amount.setErrors({ invalidAmount: true });
    else{
      if(amountWithoutSpaces.toString().includes(',')){ 
        hasCentAmount = true;
        let dollarAmount = amountWithoutSpaces.toString().split(',');
        dollarPart = dollarAmount[0];
        centPart = dollarAmount[1];
      }
      else 
        dollarPart = amountWithoutSpaces.toString();
    
      // Insert a space after every 3 digits from the end
      let formatted = '';
      for (let i = dollarPart.length - 1; i >= 0; i--) {
        formatted = dollarPart.charAt(i) + formatted;
        if ((dollarPart.length - i) % 3 === 0 && i !== 0) {
          formatted = ' ' + formatted;
        }
      }

      if(this.amount.value.toString().includes(','))
      formatted += ',' +  centPart;

      // Update the formatted number
      this.amount.setValue(formatted);
          
      // amount should be less than 1 billion
      const maxDollarPartLength = 9;

      //cent amount cannot be greater than 99
      const maxCentPartLength = 2
      if(dollarPart.length > maxDollarPartLength)
        this.amount.setErrors({ maxLength: this.maxDollarError  });
    
      if(hasCentAmount && centPart.length > maxCentPartLength)
        this.amount.setErrors({maxLength:  this.maxCentError});

    }
  }

}