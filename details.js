class NavDetail extends HTMLElement {
  connectedCallback() {

    this.innerHTML = `  
    
    <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
          </ion-buttons>
          <ion-title>${this.product.product_name}</ion-title>
        </ion-toolbar>
    </ion-header>
    
    <ion-content fullscreen class="ion-padding">
        <ion-card>
        <img style="width:100%" src="${this.product.image_url}"/>
        <ion-card-header>
          <ion-card-title>${this.product.product_name}</ion-card-title>
          <ion-card-subtitle>${this.product.brands}</ion-card-subtitle>
          <p style="color: ${this.product.ecoscore_data.adjustments.packaging.non_recyclable_and_non_biodegradable_materials === 0 ? 'green' : 'red'}">${this.product.ecoscore_data.adjustments.packaging.non_recyclable_and_non_biodegradable_materials === 0 ? 'Recyclable/Bio-degradable' : 'Non-recylable/Bio-degradable'}</p>
        </ion-card-header>
        
        <ion-card-content>

        <ion-text>Originates from: ${this.product.origins_tags.map(location => `
        <ion-item><ion-label>${location.split(':')[1].replace(/-/g, ' ')}</ion-label></ion-item>
      `).join('')} </ion-text>

          <ion-grid class="ion-padding">
                <ion-row class="header-row">
                  <ion-col>Item</ion-col>
                  <ion-col>Material</ion-col>
                  <ion-col>Recyling</ion-col>
                </ion-row>

              ${this.product.packagings.map(item => `

                      <ion-row class="packaging-info-row">
                        <ion-col>${item.shape ? item.shape.split(':')[1].replace(/-/g, ' ') : 'Not Available'}</ion-col>
                        <ion-col>${item.material ? item.material.split(':')[1].replace(/-/g, ' ') : 'Unknown'}</ion-col>
                        <ion-col>${item.recycling ? item.recycling.split(':')[1].replace(/-/g, ' ') : 'Not Available'}</ion-col>
                      </ion-row>
              
              `).join('')}
              </ion-grid>
          
          ${this.product.stores_tags ? `
            Available in:
            <ion-list>
              ${this.product.stores_tags.map(item => `
                <ion-item><ion-label>${item}</ion-label></ion-item>
              `).join('')}
            </ion-list>
          ` : ''}
          </ion-list

          </ion-card-content>
        </ion-card>
    </ion-content>

    `;
  }
}

customElements.define('nav-detail', NavDetail);