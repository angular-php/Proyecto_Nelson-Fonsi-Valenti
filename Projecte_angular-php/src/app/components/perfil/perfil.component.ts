import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Ranking } from 'src/app/models/ranking.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { query } from '@angular/animations';
import { ProfesorService } from 'src/app/services/profesor.service';
import { RankingService } from 'src/app/services/ranking.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {

  show: boolean;
  nickname: string;
  usuario: Usuario;
  ranking: Ranking;
  rankingArray: Ranking[] = [];
  ventana = "ranking";

  id: number;
  student: boolean = true;
  hideCenter: boolean = true;
  disableForm: boolean = true;
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
  verpasswdn2: boolean= true;
  //formRankingService: any;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private rankingService: RankingService,
    private profesorService: ProfesorService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.show = false;

    this.perfilForm = this.formBuilder.group({
      fname: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
      lname: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(5), Validators.email]),
      password: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(4)]),
      center: new FormControl({ value: '', disabled: true })
    });

  }

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.queryParamMap.get('id'));
    this.student = JSON.parse(this.route.snapshot.queryParamMap.get('student'));
    this.usuarioService.setMemoryUsuario(this.id, this.student);
    this.selectUser(this.id);

    if(this.student === true){
      this.usuarioService.listarRankingsAlumno(this.id).then(ranks => {
        for (let i = 0; i < ranks.length; i++) {
          this.rankingArray.push(new Ranking(ranks[i].nombreRanking, ranks[i].codigo, ranks[i].idRanking, ranks[i].idProfe, null));
        }

      })
    }else{
      this.profesorService.listarRankings(this.id).then(ranks => {
        for (let i = 0; i < ranks.length; i++) {
          this.rankingArray.push(new Ranking(ranks[i].nombreRanking, ranks[i].codigo, ranks[i].idRanking, ranks[i].idProfe, null));
        }
      })
    }

  }

  password() {
    this.show = !this.show;
  }

  selectUser(id) {
    if (this.student == true) {
      this.hideCenter = true;
      this.usuarioService.getAlumno(id).subscribe((resp => {
        console.log(resp);
        this.usuario = new Usuario(resp[0].nickname, resp[0].password, resp[0].firstname, resp[0].lastname, resp[0].email, null, this.rankingArray, null, resp[0].idusu);
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
    } else {
      this.hideCenter = false;
      this.perfilForm.controls["center"].setValidators([Validators.required,
      Validators.minLength(5)]);
      this.perfilForm.controls['center'].updateValueAndValidity();

      this.profesorService.getProfesor(id).subscribe((resp => {
        console.log(resp);
        this.usuario = new Usuario(resp[0].nickname, resp[0].password, resp[0].firstname, resp[0].lastname, resp[0].email, resp[0].centro, this.rankingArray, null, resp[0].idProf);
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
    if (this.student == true) {
      this.usuario = new Usuario(this.nickname, this.perfilForm.controls.password.value, this.perfilForm.controls.fname.value, this.perfilForm.controls.lname.value, this.perfilForm.controls.email.value, null, this.rankingArray, null, this.id);
      this.usuarioService.updateAlumno(this.usuario).subscribe((resp => {
        if (resp['resultado'] == 'OK') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bien!',
            text: resp['mensaje'],
            showConfirmButton: false,
            timer: 1500,
          }).then(function(){
            window.location.reload();
          });
        } else {
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
    } else {
      this.usuario = new Usuario(this.nickname, this.perfilForm.controls.password.value, this.perfilForm.controls.fname.value, this.perfilForm.controls.lname.value, this.perfilForm.controls.email.value, this.perfilForm.controls.center.value, this.rankingArray, null, this.id);

      this.profesorService.updateProfesor(this.usuario).subscribe((resp => {
        if (resp['resultado'] == 'OK') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bien!',
            text: resp['mensaje'],
            showConfirmButton: false,
            timer: 1500,
          }).then(function(){
            window.location.reload();
          });
        } else {
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
    this.perfilForm.get('fname').disable();
    this.perfilForm.get('lname').disable();
    this.perfilForm.get('email').disable();
    this.perfilForm.get('password').disable();
    this.perfilForm.get('center').disable();

  }

  editarInfo() {
    this.perfilForm.get('fname').enable();
    this.perfilForm.get('lname').enable();
    this.perfilForm.get('email').enable();
    this.perfilForm.get('password').enable();
    this.perfilForm.get('center').enable();
  }

  savePassword() {
    const pass = this.perfilForm.controls.password.value;
  }

  verRanking(idRank) {
    this.router.navigate(['/vista'], { queryParams: { id: idRank } });
  }

  eliminarRanking(id: number) {
    this.rankingService.eliminarRanking(id).subscribe((resp => {
      if (resp['resultado'] == 'OK') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Bien!',
          showConfirmButton: false,
          timer: 1500,
        });

        window.location.reload();
      } else if (resp['resultado'] == 'KO') {
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

  editarRanking(idRank) {
    this.router.navigate(['/modificarRanking'], { queryParams: { id: idRank } });
  }

  editarSkills(idRank) {
    this.router.navigate(['/skills'], { queryParams: { id: idRank } });
  }


  mostrarPerfil() {
    this.ventana = 'perfil';
    document.getElementById('btnPerfil').classList.add('btnActivado');
    document.getElementById('btnRanking').classList.remove('btnActivado');
  }

  mostrarRanking() {
    this.ventana = 'ranking'
    document.getElementById('btnRanking').classList.add('btnActivado');
    document.getElementById('btnPerfil').classList.remove('btnActivado');
  }

  actualizarCodigo(ranking: Ranking) {
    try {
      this.rankingService.actualizarCodigo(ranking).subscribe((value) => {
        //Alertas i redireccionamiento

        if (value['resultado'] === "OK") {
          Swal.fire({
            icon: 'success',
            title: value['mensaje'],
            text: value['codigo']
          }).then(function(){
            window.location.reload();
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo ha ido mal!'
          })
        }
      }), (e => {
        console.log(e);
      });
    } catch (error) {
      //Sweetalert
      Swal.fire({
        icon: 'error',
        title: 'Algo ha ido mal',
        text: 'Vuelve a intentarlo en un rato!'
      })
    }
  }


}
