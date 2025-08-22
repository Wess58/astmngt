import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsDetailComponent } from './assets-detail.component';

describe('AssetsDetailComponent', () => {
  let component: AssetsDetailComponent;
  let fixture: ComponentFixture<AssetsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
