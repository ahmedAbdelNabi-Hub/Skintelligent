import { API_URL } from './../../services/socketio.service';
import { SharedModule } from './../../../modules/shared/shared.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

import { DialogComponent, SignUpComponent } from './sign-up.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { of } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let httpMock: HttpTestingController;
  let toastService: NgToastService;
  let routerService: Router;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let formBuilderService: FormBuilder;

  beforeEach(async () => {
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        SharedModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [SignUpComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(NgToastService);
    routerService = TestBed.inject(Router);
    formBuilderService = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('proceedSignUp()', () => {
    it('should open dialog if all form fields are valid', () => {
      spyOn(component, 'openDialog');
      component.name?.setValue('John Doe');
      component.email?.setValue('johndsadoe@gmail.com');
      component.password?.setValue('password');
      component.confirmPassword?.setValue('password');
      component.checked?.setValue(true);
      component.proceedSignUp();
      expect(component.openDialog).toHaveBeenCalled();
    });

    it('should not open dialog if confirm password is not identical', () => {
      spyOn(component, 'openDialog');
      component.name?.setValue('John Doe');
      component.email?.setValue('john.doe@example.com');
      component.password?.setValue('password');
      component.confirmPassword?.setValue('different_password');
      component.checked?.setValue(true);
      component.proceedSignUp();
      expect(component.openDialog).not.toHaveBeenCalled();
    });

    it('should not open dialog if checkbox is not checked', () => {
      spyOn(component, 'openDialog');
      component.name?.setValue('John Doe');
      component.email?.setValue('john.doe@example.com');
      component.password?.setValue('password');
      component.confirmPassword?.setValue('password');
      component.checked?.setValue(false);
      component.proceedSignUp();
      expect(component.openDialog).not.toHaveBeenCalled();
    });

    it('should not open dialog if any form field has errors', () => {
      spyOn(component, 'openDialog');
      component.name?.setValue('J');
      component.email?.setValue('invalid_email');
      component.password?.setValue('pwd');
      component.confirmPassword?.setValue('pwd');
      component.checked?.setValue(true);
      component.proceedSignUp();
      expect(component.openDialog).not.toHaveBeenCalled();
    });
  });

  describe('openDialog()', () => {
    beforeEach(() => {
      spyOn(component, 'createTeacherAccount');
      spyOn(component, 'createStudentAccount');
    });
    it('should open dialog and create student account', fakeAsync(() => {
      const dialogRefMock = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefMock.afterClosed.and.returnValue(of('Student'));
      dialogMock.open.and.returnValue(dialogRefMock);

      component.openDialog();
      tick();

      expect(dialogMock.open).toHaveBeenCalled();
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(component.selectedOption).toEqual('Student');
      expect(component.loading).toBeTrue();
      expect(component.createStudentAccount).toHaveBeenCalled();
    }));

    it('should open dialog and create teacher account', fakeAsync(() => {
      const dialogRefMock = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefMock.afterClosed.and.returnValue(of('Teacher'));
      dialogMock.open.and.returnValue(dialogRefMock);

      component.openDialog();
      tick();

      expect(dialogMock.open).toHaveBeenCalled();
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
      expect(component.selectedOption).toEqual('Teacher');
      expect(component.loading).toBeTrue();
      expect(component.createTeacherAccount).toHaveBeenCalled();
    }));
  });

  describe('createStudentAccount()', () => {
    beforeEach(() => {
      spyOn(component.toast, 'success');
      spyOn(component.toast, 'error');
      spyOn(component.router, 'navigateByUrl');
    });

    it('should create a new student account', fakeAsync(() => {
      component.name?.setValue('ankoosh');
      component.email?.setValue('zenhom@gmail.com');
      component.password?.setValue('123fda');
      component.createStudentAccount();
      const req = httpMock.expectOne(API_URL + '/api/students/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.email?.value,
        name: component.name?.value,
        picture: 'default',
        password: component.password?.value,
        createdAt: new Date().toUTCString(),
        enrolled_courses: [],
        liked_teachers: [],
        taken_quizzes: [],
        reacts: [],
        friends: [],
        last_activity: new Date().toUTCString(),
      });
      req.flush(null);
      tick(4000);
      expect(component.loading).toBe(false);
      expect(component.toast.success).toHaveBeenCalledWith({
        detail: 'Account created successfully',
      });
      tick(1000);
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('/signin');
    }));

    it('should toast an error if account failed to be created', fakeAsync(() => {
      const mockError = new ProgressEvent('Account already exists');
      component.name?.setValue('ankoosh');
      component.email?.setValue('zenhom@gmail.com');
      component.password?.setValue('123fda');
      component.createStudentAccount();
      const req = httpMock.expectOne(API_URL + '/api/students/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.email?.value,
        name: component.name?.value,
        picture: 'default',
        password: component.password?.value,
        createdAt: new Date().toUTCString(),
        enrolled_courses: [],
        liked_teachers: [],
        taken_quizzes: [],
        reacts: [],
        friends: [],
        last_activity: new Date().toUTCString(),
      });
      req.error(mockError);
      expect(component.loading).toBe(false);
      tick(4000);
      expect(component.toast.error).toHaveBeenCalledWith({
        detail: 'Account already exists',
      });
    }));
  });

  describe('createTeacherAccount()', () => {
    beforeEach(() => {
      spyOn(component.toast, 'success');
      spyOn(component.toast, 'error');
      spyOn(component.router, 'navigateByUrl');
    });

    it('should create a new teacher account', fakeAsync(() => {
      component.name?.setValue('ankoosh');
      component.email?.setValue('zenhom@gmail.com');
      component.password?.setValue('123fda');
      component.createTeacherAccount();
      const req = httpMock.expectOne(API_URL + '/api/teachers/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: component.name?.value,
        email: component.email?.value,
        password: component.password?.value,
        title: 'Instructor',
        picture: 'default',
        courses_teaching: [],
        createdAt: new Date().toUTCString(),
        articles_published: [],
        quizzes_published: [],
        likes: 0,
        last_activity: new Date().toUTCString(),
      });
      req.flush(null);
      tick(4000);
      expect(component.loading).toBe(false);
      expect(component.toast.success).toHaveBeenCalledWith({
        detail: 'Account created successfully',
      });
      tick(1000);
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('/signin');
    }));

    it('should toast an error if account failed to be created', fakeAsync(() => {
      const mockError = new ProgressEvent('Account already exists');
      component.name?.setValue('ankoosh');
      component.email?.setValue('zenhom@gmail.com');
      component.password?.setValue('123fda');
      component.createTeacherAccount();
      const req = httpMock.expectOne(API_URL + '/api/teachers/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: component.name?.value,
        email: component.email?.value,
        password: component.password?.value,
        title: 'Instructor',
        picture: 'default',
        courses_teaching: [],
        createdAt: new Date().toUTCString(),
        articles_published: [],
        quizzes_published: [],
        likes: 0,
        last_activity: new Date().toUTCString(),
      });
      req.error(mockError);
      expect(component.loading).toBe(false);
      tick(4000);
      expect(component.toast.error).toHaveBeenCalledWith({
        detail: 'Account already exists',
      });
    }));
  });
});

describe('DialogComponent', () => {
  let component: DialogComponent
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DialogComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges()

  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit()', () => {
    it('should do nothing', () => {
      expect(true).toBe(true)
    });

  });
});
