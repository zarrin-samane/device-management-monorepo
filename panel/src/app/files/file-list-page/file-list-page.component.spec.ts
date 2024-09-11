import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileListPageComponent } from './file-list-page.component';

describe('FileListPageComponent', () => {
  let component: FileListPageComponent;
  let fixture: ComponentFixture<FileListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
