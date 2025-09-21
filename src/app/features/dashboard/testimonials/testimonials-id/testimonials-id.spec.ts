import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsId } from './testimonials-id';

describe('TestimonialsId', () => {
  let component: TestimonialsId;
  let fixture: ComponentFixture<TestimonialsId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsId]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsId);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
