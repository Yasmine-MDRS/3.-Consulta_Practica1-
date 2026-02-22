import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from "../models/producto.model";

@Injectable({ providedIn: 'root' })
export class ProductsService {  

    // ⚡ Inyectamos PLATFORM_ID para detectar si estamos en navegador
    private platformId = inject(PLATFORM_ID);

    constructor(private http: HttpClient) {}

    getAll(): Observable<Product[]> {
        return this.http.get('assets/products.xml', { responseType: 'text' }).pipe(
            map((xmlText) => this.parseProductsXml(xmlText))
        );
    }

    private parseProductsXml(xmlText: string): Product[] {
        // ⚡ Solo parseamos si estamos en navegador
        if (!isPlatformBrowser(this.platformId)) {
            return [];
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'application/xml');

        // Si el XML está mal formado
        if (doc.getElementsByTagName('parsererror').length > 0) {
            console.error('Error al parsear XML');
            return [];
        }

        const nodes = Array.from(doc.getElementsByTagName('product'));

        return nodes.map(node => ({
            id: this.getNumber(node, 'id'),
            portada: this.getText(node, 'portada'),
            nombre: this.getText(node, 'nombre'),
            autor: this.getText(node, 'autor'),
            editorial: this.getText(node, 'editorial'),
            anio: this.getNumber(node, 'anio'),
            isbn: this.getNumber(node, 'isbn'),
            categoria: this.getText(node, 'categoria'),
            descripcion: this.getText(node, 'descripcion'),
            precio: this.getNumber(node, 'precio'),
            stock: this.getNumber(node, 'stock'),
        }));
    }

    private getText(parent: Element, tag: string): string {
        return parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
    }

    private getNumber(parent: Element, tag: string): number {
        const value = this.getText(parent, tag);
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }
}