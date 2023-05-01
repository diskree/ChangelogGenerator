import { Component, ElementRef, HostBinding, NgZone, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private _ngZone: NgZone,
    private clipboardService: ClipboardService,
    private snackBar: MatSnackBar,
    private overlay: OverlayContainer
  ) { }

  title = 'ChangelogGenerator';
  toggleControl = new FormControl(false);
  checked = false;

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('ru_changelog') ruChangelogArea!: ElementRef;
  @ViewChild('en_changelog') enChangelogArea!: ElementRef;
  @ViewChild('sticker_pack') stickerPackArea!: ElementRef;
  @ViewChild('sticker_number') stickerNumberArea!: ElementRef;
  @HostBinding('class') className = '';

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  copyToClipboard() {
    const data = {
      ru_changelog: this.ruChangelogArea.nativeElement.value,
      en_changelog: this.enChangelogArea.nativeElement.value,
      sticker_pack: this.stickerPackArea.nativeElement.value,
      sticker_number: this.stickerNumberArea.nativeElement.value,
    };
    const jsonString = JSON.stringify(data, null, 2);
    this.clipboardService.copy(jsonString);
    this.openSnackBar('JSON скопирован в буфер обмена', 'OK')
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500,
    });
  }

  toggleTheme() {
    this.checked = !this.checked;
    this.className = this.checked ? 'dayMode' : '';
    if (this.checked) {
      this.overlay.getContainerElement().classList.add('dayMode');
    } else {
      this.overlay.getContainerElement().classList.remove('dayMode');
    }
  }

  openGithub() {
    window.open('https://github.com/diskree/ChangelogGenerator', '_blank');
  }
}
