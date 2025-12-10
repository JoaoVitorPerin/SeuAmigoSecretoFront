import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-features-sistema',
  templateUrl: './features-sistema.component.html',
  styleUrls: ['./features-sistema.component.css'],
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TagModule
  ]
})
export class FeaturesSistemaComponent {
    features = [
    {
      title: "1 - Crie o grupo",
      description: "Cadastre os participantes e defina as regras do amigo secreto.",
      icon: "users",
    },
    {
      title: "2 - Configure o sorteio",
      description: "Informe a data, o valor do presente e, se quiser, restrições de quem não pode tirar quem.",
      icon: "cog",
    },
    {
      title: "3 - Faça o sorteio",
      description: "Com um clique, o sistema sorteia automaticamente todos os participantes.",
      icon: "bell",
    },
    {
      title: "4 - Envie os resultados",
      description: "Cada pessoa recebe o nome do seu amigo secreto de forma segura e confidencial.",
      icon: "share-alt",
    },
  ]
}
