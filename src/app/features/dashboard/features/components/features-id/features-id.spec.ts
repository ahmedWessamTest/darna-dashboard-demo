import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesId } from './features-id';

describe('FeaturesId', () => {
  let component: FeaturesId;
  let fixture: ComponentFixture<FeaturesId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesId]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesId);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
