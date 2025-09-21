import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersId } from './partners-id';

describe('PartnersId', () => {
  let component: PartnersId;
  let fixture: ComponentFixture<PartnersId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnersId]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnersId);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
