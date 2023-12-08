import { h } from './element';
import Button from './button';
import { unbindClickoutside } from './event';
import { cssPrefix } from '../config';
import FormInput from './form_input';

export default class SearchWindow {
  constructor() {
    this.data = '{}';
    this.inputEl = new FormInput(80, 'keywords');
    this.inputEl.vchange((evt) => {
      console.log(evt);
    });
    this.result = h('div', `search-result-label`).html(
      '0/0',
    );
    this.el = h('div', `${cssPrefix}-search`).children(
      h('div', `search-input`).children(
        this.inputEl.el,
        new Button('search', 'primary').on('click', () => this.btnClick('search')),
        new Button('close', 'error').on('click', () => this.btnClick('close')),
      ),
      h('div', `search-buttons`).children(
        this.result,
        new Button('last', 'primary').on('click', () => this.btnClick('last')),
        new Button('nextValue', 'primary').on('click', () => this.btnClick('next')),
      ),
    ).hide();

    this.searchResult = [];
    this.currentIndex = 0;
  }

  btnClick(it) {
    if (it === 'last') {
      if (this.currentIndex === 0) {
        this.currentIndex = this.searchResult.length - 1;
      } else {
        this.currentIndex -= 1;
      }
      this.callBack();
    } else if (it === 'next') {
      if (this.currentIndex === this.searchResult.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex += 1;
      }
      this.callBack();
    } else if (it === 'close') {
      this.hide();
    } else if (it === 'search') {
      this.search(this.inputEl.val());
    }
  }

  search(keywords) {
    this.searchResult.length = 0;
    console.log(this.data.rows.getData());
    this.data.rows.each((ri, row) => {
      this.data.rows.eachCells(ri, (ci, cell) => {
        console.log(ci, cell);
        const text = cell.text ? cell.text : '';
        const lowerText = text.toLowerCase();
        const lowerKeywords = keywords.toLowerCase();
        console.log(lowerText, lowerKeywords);
        if (lowerText.includes(lowerKeywords)) {
          const item = {
            ri,
            ci,
          };
          this.searchResult.push(item);
        }
      });
    });
    if (this.searchResult.length > 0) {
      this.currentIndex = 0;
      this.callBack();
    }
  }

  callBack() {
    if (this.currentIndex < this.searchResult.length) {
      this.result.html(`${this.currentIndex + 1}/${this.searchResult.length}`);
      const item = this.searchResult[this.currentIndex];
      if (this.ok) {
        this.ok(item.ri, item.ci);
      }
    }
  }

  itemClick(it) {
    // console.log('it:', it);
    this.sort = it;
    const { sortAscEl, sortDescEl } = this;
    sortAscEl.checked(it === 'asc');
    sortDescEl.checked(it === 'desc');
  }

  reset() {
    console.log('reset');
    this.hide();
    this.currentIndex = 0;
    this.searchResult.length = 0;
    this.result.html(`0/0`);
    this.inputEl.val('');
  }

  show(data) {
    this.data = data;
    this.el.show();
  }

  hide() {
    this.el.hide();
    unbindClickoutside(this.el);
  }
}
