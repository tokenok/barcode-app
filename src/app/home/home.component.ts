// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import Tesseract from 'tesseract.js';
import JsBarcode from 'jsbarcode';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageFile: File | null = null;
  ocrText: string = '';
  upcList: string[] = [];
  productImages: { [upc: string]: string } = {};
  processing: boolean = false;
  message: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    console.log('HomeComponent initialized');
  }

  // Called when the user selects or captures an image.
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      this.processImage();
    }
  }

  // Process the image using Tesseract OCR.
  processImage() {
    if (!this.imageFile) return;
    this.processing = true;
    this.message = 'Processing image with OCR...';
    Tesseract.recognize(
      this.imageFile,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      this.ocrText = text;
      this.extractUPCs();
      this.processing = false;
    }).catch(error => {
      console.error(error);
      this.message = 'Error processing image.';
      this.processing = false;
    });
  }

  // Extract UPC codes (assumed 12-digit numbers) from the OCR text.
  extractUPCs() {
    const regex = /\b\d{12}\b/g;
    const matches = this.ocrText.match(regex);
    if (matches) {
      // Remove duplicates.
      this.upcList = Array.from(new Set(matches));
      // Generate barcode images.
      this.generateBarcodes();
      // Optionally, retrieve product info for each UPC.
      this.upcList.forEach(upc => {
        this.productService.getProductInfo(upc).subscribe(result => {
          if (result && result.items && result.items.length > 0) {
            this.productImages[upc] = result.items[0].images ? result.items[0].images[0] : '';
          }
        }, error => {
          console.error('Error fetching product info for UPC ' + upc, error);
        });
      });
    } else {
      this.message = 'No UPC codes found in the image.';
    }
  }

  // Generate barcode SVG images using JsBarcode.
  generateBarcodes() {
    // Allow time for Angular to render the SVG elements.
    setTimeout(() => {
      this.upcList.forEach((upc, index) => {
        const svgElement = document.getElementById('barcode' + index);
        if (svgElement) {
          JsBarcode(svgElement, upc, {
            format: "UPC",
            lineColor: "#000",
            width: 2,
            height: 100,
            displayValue: true
          });
        }
      });
    }, 100);
  }
}