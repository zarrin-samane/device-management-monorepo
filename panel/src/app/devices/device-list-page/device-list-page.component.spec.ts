import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceListPageComponent } from './device-list-page.component';

describe('DeviceListPageComponent', () => {
  let component: DeviceListPageComponent;
  let fixture: ComponentFixture<DeviceListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
