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
            <h1>${this.product.product_name}</h1>
            <h2>${this.product.brands}</h2>

        <ion-img src="${this.product.image_url}">
        </ion-img>

        <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col>Item</ion-col>
                <ion-col>Material</ion-col>
                <ion-col>Recyling</ion-col>
              </ion-row>


            ${this.product.packagings.map(item => `

                    <ion-row class="packaging-info-row">
                      <ion-col>${item.shape.split(':')[1].replace(/-/g, ' ')}</ion-col>
                      <ion-col>${item.material ? item.material.split(':')[1].replace(/-/g, ' ') : 'Unknown'}</ion-col>
                      <ion-col>${item.recycling ? item.recycling.split(':')[1].replace(/-/g, ' ') : 'Not Available'}</ion-col>
                    </ion-row>
            
            `).join('')}
            </ion-grid>
    </ion-content>
      
    `;
  }
}

customElements.define('nav-detail', NavDetail);