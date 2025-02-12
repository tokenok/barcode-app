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

  ngOnInit(): void {}

  // Called when a user selects (or captures) an image
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      this.processImage();
    }
  }

  // Run OCR on the selected image using Tesseract.js
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

  // Extract UPC codes from the OCR text (assumes UPCs are 12-digit numbers)
  extractUPCs() {
    const regex = /\b\d{12}\b/g;
    const matches = this.ocrText.match(regex);
    if (matches) {
      // Remove duplicates, if any.
      this.upcList = Array.from(new Set(matches));
      // Generate barcode images for each UPC.
      this.generateBarcodes();
      // For each UPC, query the product API for additional info (e.g., product image)
      this.upcList.forEach(upc => {
        this.productService.getProductInfo(upc).subscribe(result => {
          // Example: using UPCItemDB's response structure.
          if (result && result.items && result.items.length > 0) {
            // If images are available, take the first one.
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

  // Generate barcode images using JsBarcode. We assume that the HTML contains an <svg> with an id for each UPC.
  generateBarcodes() {
    // Wait a moment for Angular to update the view.
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
