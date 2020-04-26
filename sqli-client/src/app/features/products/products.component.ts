import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ProductService } from 'src/app/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  productsList$: Observable<any[]>;
  productList: any = {};
  categories: string[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productsList$ = this.productService.list();
    this.productsList$.subscribe(d=>{
      this.productList = d;
      this.categories = Object.keys(d);
    });
  }

}
