/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChatWithAiComponent } from './chat-with-ai.component';

describe('ChatWithAiComponent', () => {
  let component: ChatWithAiComponent;
  let fixture: ComponentFixture<ChatWithAiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWithAiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWithAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
