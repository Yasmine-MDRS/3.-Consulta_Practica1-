import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/producto.model';

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-stock.html',
  styleUrl: './admin-stock.css'
})
export class AdminStockComponent {

  productos = signal<Product[]>([]);

  filtro = '';
  mostrarFormulario = false;
  productoEditandoId: number | null = null;
  categorias = signal<string[]>([]);
  categoriaSeleccionada = '';
  categoriaNueva = '';
  nuevoProducto: Product = {
    id: 0,
    portada: '',
    nombre: '',
    autor: '',
    editorial: '',
    anio: new Date().getFullYear(),
    isbn: 0,
    categoria: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };

  constructor(
    private productsService: ProductsService,
    private router: Router)
    {      
      this.cargarProductos();
      this.cargarCategorias();
    }   


  cargarProductos() {
    this.productsService.getAll().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
      }
    });
  }
cargarCategorias() {
  this.productsService.getCategorias().subscribe({
    next: (data: string[]) => {
      this.categorias.set(data);
    },
    error: (err) => {
      console.error('Error cargando categorías:', err);
    }
  });
}

normalizarCategoria(categoria: string): string {
  return categoria
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, letra => letra.toUpperCase());
}
  estaEditando(id: number): boolean {
    return this.productoEditandoId === id;
  }

  toggleEditarGuardar(producto: Product) {
    if (!this.estaEditando(producto.id)) {
      this.productoEditandoId = producto.id;
      return;
    }

    this.productsService.actualizar(producto).subscribe({
      next: () => {
        alert('Producto actualizado');
        this.productoEditandoId = null;
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error actualizando producto:', err);
        alert('Error al actualizar producto');
      }
    });
  }

  agregarProducto() {
    const categoriaFinal =
  this.categoriaSeleccionada === 'otra'
    ? this.normalizarCategoria(this.categoriaNueva)
    : this.categoriaSeleccionada;

this.nuevoProducto.categoria = categoriaFinal;
    if (
      !this.nuevoProducto.portada.trim() ||
      !this.nuevoProducto.nombre.trim() ||
      !this.nuevoProducto.autor.trim() ||
      !this.nuevoProducto.editorial.trim() ||
      !this.nuevoProducto.categoria.trim()||
      !this.nuevoProducto.descripcion.trim() ||
      !this.nuevoProducto.anio ||
      !this.nuevoProducto.isbn ||
      !this.nuevoProducto.precio ||
      this.nuevoProducto.stock < 0
    ) {
      alert('Completa todos los campos del producto');
      return;
    }

    const productoParaCrear: Product = {
      ...this.nuevoProducto,
      anio: Number(this.nuevoProducto.anio),
      isbn: Number(this.nuevoProducto.isbn),
      precio: Number(this.nuevoProducto.precio),
      stock: Number(this.nuevoProducto.stock)
    };

    this.productsService.crear(productoParaCrear).subscribe({
      next: () => {
        alert('Producto agregado');
        this.categoriaSeleccionada = '';
        this.categoriaNueva = '';
        this.cargarCategorias();
        this.limpiarNuevoProducto();
        this.mostrarFormulario = false;
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error agregando producto:', err);
        alert('Error al agregar producto');
      }
    });
  }

  limpiarNuevoProducto() {
    this.nuevoProducto = {
      id: 0,
      portada: '',
      nombre: '',
      autor: '',
      editorial: '',
      anio: new Date().getFullYear(),
      isbn: 0,
      categoria: '',
      descripcion: '',
      precio: 0,
      stock: 0
    };
  }

  eliminarVista(id: number) {
    if (!confirm('¿Quitar producto de esta vista?')) {
      return;
    }

    this.productos.update(lista =>
      lista.filter(producto => producto.id !== id)
    );
  }

  get productosFiltrados() {
    const texto = this.filtro.toLowerCase().trim();

    return this.productos().filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.autor.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto)
    );
  }
  cerrarSesion() {

  localStorage.removeItem('usuario');
  localStorage.removeItem('token');

  this.router.navigate(['/login']);
}
}
