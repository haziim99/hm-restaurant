import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  public contact: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contact = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      msg: ['', [Validators.required]],
    });
  }

  submitForm() {
    if (this.contact.valid) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Ihre Nachricht wurde gesendet',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Bitte überprüfen Sie Ihre Eingaben',
        showConfirmButton: true,
      });
    }
  }
}
