import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { PlanosPagamentoComponent } from './planos-pagamento/planos-pagamento.component';
import { FooterComponent } from './footer/footer.component';
import { PerguntaDecisivaComponent } from './pergunta-decisiva/pergunta-decisiva.component';
import { FeaturesSistemaComponent } from './features-sistema/features-sistema.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChamadaUsuarioComponent } from './chamada-usuario/chamada-usuario.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    ChamadaUsuarioComponent,
    PlanosPagamentoComponent,
    FooterComponent,
    PerguntaDecisivaComponent,
    FeaturesSistemaComponent,
    ButtonModule,
    TagModule
  ]
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    // Verificar seção ativa ao carregar a página
    setTimeout(() => {
      this.updateActiveMenuItem();
    }, 500);
  }

  menuItems = [
    {
      id: 'inicio',
      title: 'Início',
      is_ativo: true,
    },
    // {
    //   id: 'precos',
    //   title: 'Preços',
    //   is_ativo: false,
    // },
    {
      id: 'recursos',
      title: 'Como funciona?',
      is_ativo: false,
    }
  ]

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    this.updateActiveMenuItem();
  }

  updateActiveMenuItem() {
    const scrollPosition = window.pageYOffset + 200; // Offset para ativar um pouco antes
    
    // Desativar todos os itens primeiro
    this.menuItems.forEach(item => item.is_ativo = false);
    
    // Verificar qual seção está visível
    for (let i = this.menuItems.length - 1; i >= 0; i--) {
      const element = document.getElementById(this.menuItems[i].id);
      
      if (element && element.offsetTop <= scrollPosition) {
        this.menuItems[i].is_ativo = true;
        break;
      }
    }
    
    // Se nenhuma seção for encontrada, ativar a primeira
    if (!this.menuItems.some(item => item.is_ativo)) {
      this.menuItems[0].is_ativo = true;
    }
  }

  scrollToItem(event: string) {
    const element = document.getElementById(event);

    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 130;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
