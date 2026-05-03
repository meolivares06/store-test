import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {generateMockSellsFn, mockClients, mockProducts} from 'public/mock';
import {JsonPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {ClientStoreService} from '@feat/client/services/client-store.service';
import {ProductStoreService} from '@feat/product/services/product-store.service';
import {SellStoreService} from '@feat/sell/services/sell-store.service';
import {catchError, EMPTY} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-mockdata',
  imports: [
    JsonPipe,
    Button
  ],
  templateUrl: './mockdata.component.html',
  styleUrl: './mockdata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MockdataComponent implements OnInit {
  clientService = inject(ClientStoreService);
  productService = inject(ProductStoreService);
  sellService = inject(SellStoreService);

  httpClient = inject(HttpClient);

  constructor() {
    console.log('MockdataComponent',this.clientService.list());
    console.log('MockdataComponent',this.productService.list());
    console.log('MockdataComponent',this.sellService.list());
  }
  ngOnInit(): void {
    console.log('MockdataComponent', this.sellService.list());
  }

  onLoadClients() {
    mockClients.forEach(item => {
      this.clientService.addFirebase(item).pipe(
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      ).subscribe(r => {
        console.log('ok')
      })
    });
  }

  onLoadProductos() {
    mockProducts.forEach(item => {
      this.productService.addFirebase(item).pipe(
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      ).subscribe(r => {
        console.log('ok')
      })
    });
  }

  onLoadSells() {
    const sells = generateMockSellsFn(this.clientService.list(), this.productService.list());

    sells.forEach(item => {
      this.sellService.addFirebase(item).pipe(
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      ).subscribe(r => {
        console.log('ok')
      })
    });
  }

  localError() {
    throw Error('The app component has thrown an error!');
  }

  failingRequest() {
    this.httpClient.get('https://httpstat.us/404?sleep=2000').toPromise();
  }

  successfulRequest() {
    this.httpClient.get('https://httpstat.us/200?sleep=2000').toPromise();
  }
}
