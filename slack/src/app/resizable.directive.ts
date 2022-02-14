import {Directive, ElementRef, OnInit, Input} from '@angular/core';

@Directive({
  selector: '[appResizable]' // Attribute selector
})

export class ResizableDirective implements OnInit {

  @Input() resizableGrabWidth = 3;
  @Input() resizableMinWidth = 281;


  dragging = false;

  constructor(private el: ElementRef) {

    function preventGlobalMouseEvents() {
      //document.body.style['pointer-events'] = 'none';
      el.nativeElement.style["border-left"] = "3px solid #2256ed";
    }

    function restoreGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'auto';
    }


    const newWidth = (wid) => {
      const newWidth = document.documentElement.clientWidth - wid
      const correctWidth = Math.max(this.resizableMinWidth, newWidth);
      el.nativeElement.style.width = (correctWidth) + "px";
    }

    const mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      newWidth(evt.clientX);
      evt.stopPropagation();
    };

    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };

    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = "col-resize";
        el.nativeElement.style["border-left"] = "#000";
      } else {
        el.nativeElement.style.cursor = "default";
        
      }
    }

    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void {
  }

  inDragRegion(evt) {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft > this.resizableGrabWidth;
  }

}
