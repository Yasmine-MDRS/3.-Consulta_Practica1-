import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from "../models/producto.model";

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Señal privada para modificar los datos
  private productosSignal = signal<CartItem[]>([]);

  // Señal pública de solo lectura para los componentes
  productos = this.productosSignal.asReadonly();

  // Total reactivo: se actualiza solo cuando cambia el carrito
  total = computed(() => {
    return this.productosSignal().reduce((acc, p) => acc + (Number(p.precio) * (p.cantidad || 1)), 0);
  });

  agregar(producto: Product | CartItem) {
    this.productosSignal.update(lista => {
      const index = lista.findIndex(p => p.id === producto.id);
      if (index !== -1) {
        const nuevaLista = [...lista];
        nuevaLista[index] = {
          ...nuevaLista[index],
          cantidad: (nuevaLista[index].cantidad || 1) + 1
        };
        return nuevaLista;
      }
      return [...lista, { ...producto, cantidad: 1 }];
    });
  }

  quitar(id: number) {
    this.productosSignal.update(lista => {
      const producto = lista.find(p => p.id === id);
      if (producto && producto.cantidad > 1) {
        return lista.map(p => 
          p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        );
      }
      return lista.filter(p => p.id !== id);
    });
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  exportarXML() {
    const productos = this.productosSignal();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;
    for (const p of productos) {
      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${this.escapeXml(p.nombre)}</nombre>\n`;
      xml += `    <precio>${p.precio}</precio>\n`;
      xml += `    <cantidad>${p.cantidad}</cantidad>\n`;
      xml += `  </producto>\n`;
    }
    xml += `  <total>${this.total()}</total>\n</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();
    URL.revokeObjectURL(url);
  }

  private escapeXml(value: string): string {
    return value.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    }[m] || m));
  }
}