import { Component, EventEmitter, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { User } from './user';
import { Task } from './task';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
@Output() taskDeleted = new EventEmitter<void>();
title="todo";
constructor(private http:HttpClient)
  {

  }

user:User;
isLogedIn:number=0;
username:string;
password:string;
errorMsg:string="";
key:number

login()
{
  let url="http://localhost:8080/login/"+this.username+"/"+this.password;
  this.http.get(url).subscribe(
    (num:number)=>
    {
      if(num==-1){
      this.errorMsg="Username wrong";
      console.warn(this.errorMsg);
      }
      else if(num==-2){
      this.errorMsg="Pass wrong";
      console.warn(this.errorMsg);
      }                                                                            
      else 
      {
        this.key=num;
        console.warn(this.key)
        let url2="http://localhost:8080/userdata/"+this.username;
        this.http.get(url2).subscribe(
          (data:User)=>
          {
            console.warn(this.key);
            if(data==null)
            window.alert("Something is wrong");
            else
            {
              this.user=data;
              this.isLogedIn=1;
            }
          }
        );
      }
      
    }
  );
}

logout()
{
  this.isLogedIn=0;
}

getStatus(num:number)
{
  if(num==0)
  return "NotyetStarted";
  else if(num==1)
  return "Working";
  return "Done";
}
work:string;
addNewTask()
{
  let url="http://localhost:8080/addTask"+"/"+this.user.id+"/"+this.work;
  this.http.get(url).subscribe(
  (data:Task)=>{
  if(data==null)
  window.alert("Somthing is wrong");
  else
  {
    this.user.task.push(data); 
    this.work="";
  }
}

);
}

changeStatus(task:Task, newStatus:number)
{
  let url="http://localhost:8080/changeStatus"+"/"+task.id+"/"+newStatus;
  this.http.get(url).subscribe(
    (data:boolean)=>{
    if(!data)
      window.alert("Somthing is wrong");
      else{
        task.status=newStatus;
      }

    }
  );
}
deleteTaskofUser(task:Task){
  let url="http://localhost:8080/deletetask"+"/"+this.user.id+"/"+task.id;
  this.http.get(url).subscribe((data:User)=>{
      if(data !== null)
        {
          this.user.task = this.user.task.filter(t => t.id !== task.id);
          window.alert("Task Deleted Sucessfully");
        }
        else{
          window.alert("Task Not Deleted");
        }
  });
}
}
