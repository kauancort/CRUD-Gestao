import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabList } from './collab-list';

describe('CollabList', () => {
  let component: CollabList;
  let fixture: ComponentFixture<CollabList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollabList],
    }).compileComponents();

    fixture = TestBed.createComponent(CollabList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
