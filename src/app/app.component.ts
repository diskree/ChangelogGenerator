import { Component, ElementRef, HostBinding, NgZone, ViewChild, Renderer2, Inject } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { take } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';

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
    private overlay: OverlayContainer,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  title = 'ChangelogGenerator';
  isDayTheme = false;
  stickerNumberControl = new FormControl(null, [Validators.min(1), Validators.max(50)]);

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('ru_changelog') ruChangelogArea!: ElementRef;
  @ViewChild('en_changelog') enChangelogArea!: ElementRef;
  @ViewChild('sticker_pack') stickerPackArea!: ElementRef;
  @ViewChild('sticker_number') stickerNumberArea!: ElementRef;
  @HostBinding('class') currentTheme = '';

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  copyToClipboard() {
    const stickerPack = this.stickerPackArea.nativeElement.value.trim();
    const lastIndex = stickerPack.lastIndexOf('/');
    const stickerPackName = lastIndex !== -1 ? stickerPack.substring(lastIndex + 1) : stickerPack;
    const data = {
      current_date: Date.now(),
      ru_changelog: this.ruChangelogArea.nativeElement.value.trim(),
      en_changelog: this.enChangelogArea.nativeElement.value.trim(),
      sticker_pack_name: stickerPackName,
      sticker_index: this.stickerNumberControl.value ? this.stickerNumberControl.value - 1 : 0
    };
    const jsonString = JSON.stringify(data, null, 2);
    this.clipboardService.copy(jsonString);
    this.openSnackBar('JSON скопирован в буфер обмена ', 'OK')
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500,
    });
  }

  openGithub() {
    window.open('https://github.com/diskree/ChangelogGenerator', '_blank');
  }

  toggleTheme() {
    this.isDayTheme = !this.isDayTheme;
    this.currentTheme = this.isDayTheme ? 'dayMode' : '';
    if (this.isDayTheme) {
      this.overlay.getContainerElement().classList.add('dayMode');
      this.updateThemeColor('#f8bbd0');
    } else {
      this.overlay.getContainerElement().classList.remove('dayMode');
      this.updateThemeColor('#fff59d');
    }
  }

  updateThemeColor(color: string): void {
    const themeColorTag = this.document.getElementById('theme-color-tag');
    this.renderer.setAttribute(themeColorTag, 'content', color);
  }

}
