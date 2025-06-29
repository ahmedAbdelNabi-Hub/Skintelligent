import { API_URL } from './../../services/socketio.service';
import { NgToastService } from 'ng-angular-popup';
import {
  ComponentFixtureAutoDetect,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SignInComponent } from './sign-in.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('SigninComponent', () => {
  let component: SignInComponent;
  let routerService: Router;
  let httpMock: HttpTestingController;
  let toastService: NgToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [SignInComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        NgToastService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(NgToastService);
    component = TestBed.createComponent(SignInComponent).componentInstance;
    routerService = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should intialize the value of email input field to empty string', () => {
    expect(component.email.value).toEqual('');
  });

  it('should intialize the value of password input field to empty string', () => {
    expect(component.password.value).toEqual('');
  });

  describe('signInAsStudent()', () => {
    it('should sign in successfully and navigate to student authorities', fakeAsync(() => {
      const mockResponse = { token: 'mock_token' };
      spyOn(localStorage, 'setItem');
      spyOn(toastService, 'success');
      spyOn(component, 'navigateToStudentAuthorities');

      component.email.setValue('hady@gmail.com');
      component.password.setValue('123123');
      component.signInAsStudent();

      const req = httpMock.expectOne(`${API_URL}/api/students/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.email.value,
        password: component.password.value,
      });

      req.flush(mockResponse);

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock_token');
      tick(4000);
      expect(toastService.success).toHaveBeenCalled();
      expect(component.navigateToStudentAuthorities).toHaveBeenCalled();
    }));

    it('should sign in as a teacher if sign in fails and email not found', () => {
      const mockErrorResponse = { message: 'Email not valid!' };

      spyOn(toastService, 'error');
      spyOn(component, 'signInAsTeacher');

      component.email.setValue('test@test.com');
      component.password.setValue('123123');
      component.signInAsStudent();

      const req = httpMock.expectOne(`${API_URL}/api/students/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@test.com',
        password: '123123',
      });

      req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' });

      expect(component.signInAsTeacher).toHaveBeenCalled();
      // expect(toastService.error).toHaveBeenCalled();
    });

    it('should display an error message if sign in fails as teacher and student', () => {
      const mockErrorResponse = { message: 'Password not valid!' };

      spyOn(toastService, 'error');
      spyOn(component, 'signInAsTeacher');

      component.email.setValue('marwa@test.com');
      component.password.setValue('123ds123');
      component.signInAsStudent();

      const req = httpMock.expectOne(`${API_URL}/api/students/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.email.value,
        password: component.password.value,
      });

      req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' });

      expect(toastService.error).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });
  });

  describe('signInAsTeacher()', () => {
    it('should sign in successfully and navigate to teacher authorities', fakeAsync(() => {
      const mockResponse = { token: 'mock_token' };
      spyOn(localStorage, 'setItem');
      spyOn(toastService, 'success');
      spyOn(component, 'navigateToTeacherAuthorities');

      component.email.setValue('marwa@gmail.com');
      component.password.setValue('123123');
      component.signInAsTeacher();

      const req = httpMock.expectOne(`${API_URL}/api/teachers/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.email.value,
        password: component.password.value,
      });

      req.flush(mockResponse);

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock_token');
      tick(4000);
      expect(toastService.success).toHaveBeenCalled();
      expect(component.navigateToTeacherAuthorities).toHaveBeenCalled();
    }));

    it('should display an error message if sign in fails', () => {
      const mockErrorResponse = { message: 'Invalid credentials' };
      spyOn(toastService, 'error');

      component.email.setValue('test@test.com');
      component.password.setValue('wrongpassword');
      component.signInAsTeacher();

      const req = httpMock.expectOne(`${API_URL}/api/teachers/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@test.com',
        password: 'wrongpassword',
      });

      req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' });

      expect(toastService.error).toHaveBeenCalled();
    });
  });

  describe('signInAsAdmin()', () => {
    it('should set a token and navigate him to admin authorities', () => {
      spyOn(component, 'navigateToAdminAuthorities');
      component.signInAsAdmin();
      const token = localStorage.getItem('token');
      expect(token).toBeTruthy();
      expect(component.navigateToAdminAuthorities).toHaveBeenCalled();
    });
  });

  describe('proceedSignIn()', () => {
    it('should proceed to signin process if inputs are validated', () => {
      spyOn(component, 'signInAsStudent');
      component.email.setValue('dasd@gmail.com');
      component.password.setValue('dasddsafg');
      component.proceedSignIn();
      expect(component.loading).toBeTrue();
      expect(component.signInAsStudent).toHaveBeenCalled();
    });

    it('should signin as admin if admin is logging in', () => {
      spyOn(component, 'signInAsAdmin');
      component.email.setValue('admin@gmail.com');
      component.password.setValue('admin');
      component.proceedSignIn();
      expect(component.signInAsAdmin).toHaveBeenCalled();
    });
  });

  describe('isAdmin()', () => {
    it('should return true if user has entered admin account', () => {
      component.email.setValue('admin@gmail.com');
      component.password.setValue('admin');
      expect(component.isAdmin()).toBeTrue();
    });
  });

  describe('navigateToAdminAuthorities()', () => {
    it('should navigate to admin authorities', () => {
      const navigateSpy = spyOn(routerService, 'navigateByUrl');
      component.navigateToAdminAuthorities();
      expect(navigateSpy).toHaveBeenCalledWith('/admin');
    });
  });

  describe('navigateToStudentAuthorities()', () => {
    it('should navigate to student authorities', () => {
      const navigateSpy = spyOn(routerService, 'navigateByUrl');
      component.navigateToStudentAuthorities();
      expect(navigateSpy).toHaveBeenCalledWith('/');
    });
  });

  describe('navigateToTeacherAuthorities()', () => {
    it('should navigate to teacher authorities', () => {
      const navigateSpy = spyOn(routerService, 'navigateByUrl');
      component.navigateToTeacherAuthorities();
      expect(navigateSpy).toHaveBeenCalledWith('/teacher');
    });
  });
});
