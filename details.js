class NavDetail extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `  
    
    <ion-header>
        <ion-toolbar color="light">
          <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
          </ion-buttons>
          <ion-title>${this.product.product_name}</ion-title>
        </ion-toolbar>
    </ion-header>
    
    <ion-content fullscreen class="ion-padding">
    <ion-card>
        <ion-card-header>
            <ion-card-title>${this.product.product_name}</ion-card-title>
            <ion-card-subtitle>${this.product.brands}</ion-card-subtitle>
        </ion-card-header>

        <ion-img src="${this.product.image_url}">
        </ion-img>

        <ion-card-content>
            <ion-list>
            ${this.product.packagings.map(item => `
            
                    <ion-item >
                        <ion-label>${item.shape}:</ion-label>
                        <ion-label id="label-city">${item.material}</ion-label>
                    </ion-item>
            
            `).join('')}
            </ion-list>
        </ion-card-content>
    </ion-card>
    </ion-content>
      
    `;
  }
}

customElements.define('nav-detail', NavDetail);