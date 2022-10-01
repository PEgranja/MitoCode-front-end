import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { VitalSign } from 'src/app/model/vitalSign';
import { PatientService } from 'src/app/service/patient.service';
import { VitalSignService } from 'src/app/service/vital-sign.service';

@Component({
  selector: 'app-vital-sign-edit',
  templateUrl: './vital-sign-edit.component.html',
  styleUrls: ['./vital-sign-edit.component.css']
})
export class VitalSignEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  patients: Patient[];
  patientControl: FormControl = new FormControl();
  patientsFiltered$: Observable<Patient[]>

  maxDate: Date = new Date();
  dateSelected: Date;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private vitalSignService: VitalSignService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'patient' : this.patientControl,
      'dateSelected' : new FormControl(),
      'temperature': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'pulse': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'respiratoryRate': new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

    this.loadInitialData();
    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));

  }

  loadInitialData(){
    this.patientService.findAll().subscribe(data => this.patients = data);
  }

  initForm() {
    if (this.isEdit) {

      this.vitalSignService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'dateSelected' : new FormControl(data.dateSelected),
          'temperature': new FormControl(data.temperature, [Validators.required, Validators.minLength(1)]),
          'pulse': new FormControl(data.pulse, [Validators.required, Validators.minLength(1)]),
          'respiratoryRate': new FormControl(data.respiratoryRate, [Validators.required, Validators.minLength(1)])
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  filterPatients(val: any){
    if(val?.idPatient > 0){
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase()) || el.dni.includes(val)
      )
    }else{
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
      )
    }
  }

  showPatient(val: any){
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  operate() {
    if (this.form.invalid) { return; }

    let vitalSign = new VitalSign();
    vitalSign.patient = this.form.value['patient'];
    vitalSign.dateSelected = moment(this.form.value['dateSelected']).format('YYYY-MM-DDTHH:mm:ss');
    vitalSign.temperature = this.form.value['temperature'];
    vitalSign.pulse = this.form.value['pulse'];
    vitalSign.respiratoryRate = this.form.value['respiratoryRate'];

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.vitalSignService.update(vitalSign).subscribe(() => {
        this.vitalSignService.findAll().subscribe(data => {
          this.vitalSignService.setVitalSignChange(data);
          this.vitalSignService.setMessageChange('UPDATED!')
        });
      });
    } else {
      //INSERT
      //PRACTICA IDEAL
      this.vitalSignService.save(vitalSign).pipe(switchMap(()=>{
        return this.vitalSignService.findAll();
      }))
      .subscribe(data => {
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/vital-sign']);
  }

}
