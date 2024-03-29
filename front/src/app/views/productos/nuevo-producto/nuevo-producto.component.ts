import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductosService } from '../../../Services/productos.service';
@Component({
  selector: 'app-nuevo-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.css',
})
export class NuevoProductoComponent {
  title = '';
  id!: number;

  producto: FormGroup = new FormGroup({
    Nombre: new FormControl(''),
    Precio: new FormControl(''),
    Cantidad: new FormControl(''),
    FechaIngreso: new FormControl(''),

  });
  constructor(
    private productosService: ProductosService,
    private rutas: Router,
    private parametros: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.parametros.snapshot.params['id'];
    console.log(this.id);
    if (this.id == 0 || this.id == undefined) {
      this.title = 'Nuevo Producto';
    } else {
      this.title = 'Actualizar Producto';
      this.productosService.uno(this.id).subscribe((res) => {
        console.log(res);
        this.producto.patchValue({
          Nombre: res.Nombre,
          Precio: res.Precio,
          Cantidad: res.Cantidad,
          FechaIngreso: res.FechaIngreso
        });
      });
    }
  }
  get f() {
    return this.producto.controls;
  }

  grabar() {
    Swal.fire({
      title: 'Productos',
      text: 'Esta seguro que desea guardar el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Guardar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.id == 0 || this.id == undefined) {
          this.productosService
            .insertar(this.producto.value)
            .subscribe((res) => {
              Swal.fire({
                title: 'Productos',
                text: 'Se insertó con éxito el registro',
                icon: 'success',
              });
              this.rutas.navigate(['/productos']);
              this.id = 0;
            });
        } else {
          this.productosService
            .actualizar(this.producto.value, this.id)
            .subscribe((res) => {
              Swal.fire({
                title: 'Productos',
                text: 'Se actualizó con éxito el registro',
                icon: 'success',
              });
              this.rutas.navigate(['/productos']);
              this.id = 0;
            });
        }
      } else {
        Swal.fire({
          title: 'Productos',
          text: 'El usuario canceló la acción',
          icon: 'info',
        });
      }
    });
  }
}
