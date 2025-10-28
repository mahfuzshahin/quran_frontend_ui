import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicUiElementComponent } from './basic-ui-element.component';

describe('BasicUiElementComponent', () => {
  let component: BasicUiElementComponent;
  let fixture: ComponentFixture<BasicUiElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicUiElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicUiElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
