import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMatrixComponent } from './role-matrix.component';

describe('RoleMatrixComponent', () => {
  let component: RoleMatrixComponent;
  let fixture: ComponentFixture<RoleMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleMatrixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
