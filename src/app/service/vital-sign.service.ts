import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VitalSign } from '../model/vitalSign';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VitalSignService extends GenericService<VitalSign>{

  private vitalSignChange = new Subject<VitalSign[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/vitalSigns`
      );
  }

  listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  //////////get set/////////////
  setVitalSignChange(list: VitalSign[]){
    this.vitalSignChange.next(list);
  }

  getVitalSignChange(){
    return this.vitalSignChange.asObservable();
  }

  setMessageChange(message: string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
