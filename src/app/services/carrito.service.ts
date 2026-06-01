import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from "../models/producto.model";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private productosSignal = signal<CartItem[]>([]);

  productos = this.productosSignal.asReadonly();

  //Notificaciones
  productoAgregado$ = new Subject<string>();

  // Cambios de stock (para catálogo)
  stockChange$ = new Subject<{ id: number, cambio: number }>();

  // Total reactivo
  total = computed(() => {
    return this.productosSignal()
      .reduce((acc, p) => acc + (Number(p.precio) * (p.cantidad || 1)), 0);
  });

  // AGREGAR
  agregar(producto: Product | CartItem) {
  this.productosSignal.update(lista => {
    const index = lista.findIndex(p => p.id === producto.id);

    if (index !== -1) {
      const nuevaLista = [...lista];

      nuevaLista[index] = {
        ...nuevaLista[index],
        cantidad: (nuevaLista[index].cantidad || 1) + 1
      };
      
      this.stockChange$.next({ id: producto.id, cambio: -1 });
      return nuevaLista;
    }
    this.stockChange$.next({ id: producto.id, cambio: -1 });

    return [...lista, { ...producto, cantidad: 1 }];
  });
}

  //  QUITAR (devuelve stock)
 quitar(id: number) {
  this.productosSignal.update(lista => {
    const producto = lista.find(p => p.id === id);

    if (!producto) return lista;

    this.stockChange$.next({ id, cambio: +1 });

    if (producto.cantidad > 1) {
      return lista.map(p =>
        p.id === id
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      );
    }

    return lista.filter(p => p.id !== id);
  });
}
  // VACIAR (devuelve TODO el stock)
 vaciar() {
  const lista = this.productosSignal();
for (const p of lista) {
    this.stockChange$.next({
      id: p.id,
      cambio: p.cantidad
    });
  }
  this.productosSignal.set([]);
}

  // CONFIRMAR COMPRA (NO devuelve stock)
  confirmarCompra() {
    this.productosSignal.set([]);
  }

  // XML
  exportarXML() {
  const productos = this.productosSignal();
  const fecha = new Date().toISOString();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  let subtotal = 0;
  let conceptos = '';

  for (const p of productos) {
    const cantidad = p.cantidad || 1;
    const precio = Number(p.precio);
    const importe = cantidad * precio;

    subtotal += importe;

    conceptos += `
      <cfdi:Concepto 
        ClaveProdServ="01010101"
        Cantidad="${cantidad}"
        ClaveUnidad="H87"
        Descripcion="${this.escapeXml(p.nombre || '')}"
        ValorUnitario="${precio.toFixed(2)}"
        Importe="${importe.toFixed(2)}"/>
    `;
  }

  const total = subtotal.toFixed(2);

  const nombreReceptor = this.escapeXml(usuario.nombre_completo || 'Cliente General');
  const rfcReceptor = this.escapeXml(usuario.rfc || 'XAXX010101000');
  const usoCfdi = this.escapeXml(usuario.uso_cfdi || 'G03');
  const codigoPostal = this.escapeXml(usuario.codigo_postal || '00000');
  const regimenFiscal = this.escapeXml(usuario.regimen_fiscal || '616');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
  Version="4.0"
  Fecha="${fecha}"
  SubTotal="${total}"
  Total="${total}"
  Moneda="MXN"
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4">

  <cfdi:Emisor 
    Nombre="Starlight Libreria"
    Rfc="XAXX010101000"/>

  <cfdi:Receptor 
    Nombre="${nombreReceptor}"
    Rfc="${rfcReceptor}"
    UsoCFDI="${usoCfdi}"
    DomicilioFiscalReceptor="${codigoPostal}"
    RegimenFiscalReceptor="${regimenFiscal}"/>

  <cfdi:Conceptos>
    ${conceptos}
  </cfdi:Conceptos>

</cfdi:Comprobante>
`;
  return xml;
}

  private escapeXml(value: string): string {
    return value.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    }[m] || m));
  }
}