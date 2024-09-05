import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceFormDialogComponent } from './device-form-dialog.component';

describe('DeviceFormDialogComponent', () => {
  let component: DeviceFormDialogComponent;
  let fixture: ComponentFixture<DeviceFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
