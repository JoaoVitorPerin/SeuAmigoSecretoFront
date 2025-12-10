import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { AutenticacaoService } from '../autenticacao/autenticacao.service';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { items } from 'src/app/shared/models/items.model';
import { confirmPasswordValidator, validatorSenhaForte } from 'src/app/shared/validator/validatorForm';
import { ValidadorSenhaForteComponent } from 'src/app/shared/components/validador-senha-forte/validador-senha-forte.component';
import { isValidCPF, validarDataValida } from 'src/app/shared/ts/util';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    ValidadorSenhaForteComponent
  ]
})
export class CadastroComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastrService = inject(ToastrService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly autenticacaoService = inject(AutenticacaoService);

  formCadastro: FormGroup;
  loadingRequest = signal(false);
  erroCPF = signal<string>(null);

  validarDataValida = validarDataValida;

  opcoesGenero: items[] = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' },
    { value: 'nao_informado', label: 'Não especificado' }
  ]

  opcoesOndeConheceu: items[] = [
    { value: 'google', label: 'Google' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'site', label: 'Site' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'amigo', label: 'Indicado por Amigo' },
    { value: 'outro', label: 'Outro' }
  ]
  
  subs: Subscription[] = [];
  
  ngOnInit(): void {
    this.tokenService.clearToken()

    this.formCadastro = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, validatorSenhaForte()]],
      confirmPassword: [null, Validators.required],
      ondeConheceu: [null]
    },
    { validators: confirmPasswordValidator }
    );
  }
  
  cadastro(): void {
    if(this.loadingRequest())
      return

    this.formCadastro.markAllAsTouched()

    if(this.formCadastro.valid){
      this.loadingRequest.set(true);
      this.subs.push(
        this.autenticacaoService.cadastroUsuario(this.formCadastro.getRawValue()).subscribe({
          next: (dados) => {
            if(dados.access){
              this.tokenService.setToken(dados);
              this.loadingRequest.set(false);
            }
          }, error: () => {
            this.loadingRequest.set(false);
          }
        })
      );
    } else {
      this.loadingRequest.set(false);
      this.toastrService.mostrarToastrDanger('Preencha todos os campos obrigatórios corretamente para prosseguir');
    }
  }

  mensagemErroConfirmarSenha(){
    if(this.formCadastro.get('confirmPassword').value === null || this.formCadastro.get('confirmPassword').value === ''){
      return 'Informe a confirmação da senha!';
    }
    if(this.formCadastro.hasError('notSame', 'confirmPassword')){
      return 'A confirmação de senha não confere!';
    }
    return null;
  }

  validarCPF(){
    if(this.formCadastro.get('cpf').value === null || this.formCadastro.get('cpf').value === ''){
      this.formCadastro.get('cpf').setErrors({required: true});
      this.formCadastro.get('cpf').markAsTouched();
      this.erroCPF.set('Informe o seu CPF!');
      return;
    }
    
    if(!isValidCPF(this.formCadastro.get('cpf').value)){
      this.formCadastro.get('cpf').invalid;
      this.formCadastro.get('cpf').setErrors({cpfExistente: true});
      this.formCadastro.get('cpf').setValue(null);
      this.formCadastro.get('cpf').markAsTouched();
      this.erroCPF.set('Digite um CPF válido!');
      return;
    }

    this.erroCPF.set('Informe o seu CPF!');
    return
  }
  
  @HostListener('document:keydown.enter', ['$event'])
  onEnterPress(event: KeyboardEvent) {
    this.cadastro();
  }

  redirectLogin(): void {
    this.router.navigate(['login'])
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
