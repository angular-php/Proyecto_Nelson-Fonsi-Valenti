import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Ranking } from 'src/app/models/ranking.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import Swal from 'sweetalert2';
import { query } from '@angular/animations';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nickname: string;
  usuario: Usuario;
  rankingArray: Ranking[] = [];

  id: number;
  student: boolean = true;
  hideCenter: boolean = true;

  perfilForm: FormGroup;

  validation_messages = {
    fname: [
      { type: 'required', message: 'El campo nombre es obligatorio' },
      { type: 'minlength', message: 'El campo nombre debe contener como mínimo 3 carácteres' },
    ],
    lname: [
      { type: 'required', message: 'El campo apellidos es obligatorio' },
      { type: 'minlength', message: 'El campo apellidos debe contener como mínimo 3 carácteres' },
    ],
    email: [
      { type: 'required', message: 'El campo e-mail es obligatorio' },
      { type: 'minlength', message: 'El campo e-mail debe contener como mínimo 5 carácteres' },
      { type: 'email', message: 'El campo e-mail no tiene buen formato' },
    ],
    password: [
      { type: 'required', message: 'El campo contraseña es obligatorio' },
      { type: 'minlength', message: 'El campo contraseña debe contener como mínimo 6 carácteres' },
    ],
    center: [
      { type: 'required', message: 'El campo centro es obligatorio' },
      { type: 'minlength', message: 'El campo centro debe contener como mínimo 5 carácteres' },
    ],
  };


  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private profesorService: ProfesorService, private route: ActivatedRoute) {

    this.perfilForm = this.formBuilder.group({
      fname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      center: new FormControl('')
    });

  }

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.queryParamMap.get('id'));
    this.student = JSON.parse(this.route.snapshot.queryParamMap.get('student'));
    console.log(this.id + " -- " + this.student);
    this.selectUser(this.id);
    this.rankingArray.push(new Ranking('BONUS_DAW', 17));
    this.rankingArray.push(new Ranking('BONUS_DAM', 21));

    //this.usuario = new Usuario('QuimMP','Quim','Martinez Pique', 'qmartinez@useit.es', '123456', true, this.rankingArray, null, "ILERNA");
  }

  selectUser(id) {
    if(this.student == true){
      this.hideCenter = true;
      this.usuarioService.getAlumno(id).subscribe((resp => {
        console.log(resp);
        this.usuario = new Usuario(resp[0].idusu ,resp[0].nickname, resp[0].firstname, resp[0].lastname, resp[0].email, resp[0].password, this.rankingArray);
        console.log(this.usuario);
        this.nickname = resp[0].nickname;
        this.perfilForm.setValue({
          fname: this.usuario.firstname,
          lname: this.usuario.lastname,
          email: this.usuario.email,
          password: this.usuario.password,
          center: null
        });

      }), (e => {
        console.log(e);
      }));
    }else{
      this.hideCenter = false;
      this.perfilForm.controls["center"].setValidators([Validators.required,
        Validators.minLength(5)]);
      this.perfilForm.controls['center'].updateValueAndValidity();

      this.profesorService.getProfesor(id).subscribe((resp => {
        this.usuario = new Usuario(resp[0].idProf ,resp[0].nickname, resp[0].firstname, resp[0].lastname, resp[0].email, resp[0].password, this.rankingArray, null, resp[0].centro);
        console.log(this.usuario);
        this.nickname = resp[0].nickname;
        this.perfilForm.setValue({
          fname: this.usuario.firstname,
          lname: this.usuario.lastname,
          email: this.usuario.email,
          password: this.usuario.password,
          center: this.usuario.center
        });

      }), (e => {
        console.log(e);
      }));
    }

  }


  saveUser() {
    if(this.student == true) {
      this.usuario = new Usuario( this.nickname, this.perfilForm.controls.password.value, this.perfilForm.controls.fname.value, this.perfilForm.controls.lname.value, this.perfilForm.controls.email.value, null, this.rankingArray, null, this.id);
      console.log(this.usuario);
      this.usuarioService.updateAlumno(this.usuario).subscribe((resp => {
        console.log(resp);
        if(resp['resultado'] == 'OK'){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bien!',
            text: resp['mensaje'],
            showConfirmButton: false,
            timer: 1500,
          });
        }else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ups... algo ha ido mal',
            text: "Error al guardar los datos!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }), (e => {
        console.log(e);
      }));
    }else{
      this.usuario = new Usuario( this.nickname, this.perfilForm.controls.password.value, this.perfilForm.controls.fname.value, this.perfilForm.controls.lname.value, this.perfilForm.controls.email.value, this.perfilForm.controls.center.value, this.rankingArray, null, this.id);
      this.profesorService.updateProfesor(this.usuario).subscribe((resp => {
        console.log(resp);
        if(resp['resultado'] == 'OK'){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bien!',
            text: resp['mensaje'],
            showConfirmButton: false,
            timer: 1500,
          });
        }else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ups... algo ha ido mal',
            text: "Error al guardar los datos!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }), (e => {
        console.log(e);
      }));
    }

  }

  savePassword() {
    const pass = this.perfilForm.controls.password.value;
    console.log(pass);
  }

}
