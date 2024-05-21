import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent {
  hasOrder= false
  cancel() {
    const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

swalWithBootstrapButtons.fire({
  title: 'Möchten Sie Ihre Bestellung wirklich löschen?',
  text: "Sie können dies nicht rückgängig machen!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Ja, löschen Sie es!',
  cancelButtonText: 'Nein, abbrechen!',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
    swalWithBootstrapButtons.fire(
      'Gelöscht!',
      'Ihre Bestellung wurde gelöscht.',
      'success',
      )
      this.hasOrder = true
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire(
      'Abgesagt',
      'Ihre imaginäre Datei ist sicher :)',
      'error'
    )
  }
})
  }
}
