class QueueElement<T> {
  public readonly data: T;
  public next: QueueElement<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class Queue<T> {
  private _first: QueueElement<T> | null = null;
  private _last: QueueElement<T> | null = null;
  private _length = 0;

  get length(): number {
    return this._length;
  }

  peek(): T {
    if (!this._first) {
      throw new Error();
    }
    return this._first.data;
  }

  pop(): void {
    if (!this._first) {
      throw new Error();
    }
    if (this._first === this._last) {
      this._first = null;
      this._last = null;
      this._length--;
      return;
    }
    this._first = this._first.next;
    this._length--;
  }

  push(item: T): void {
    const element = new QueueElement(item);
    if (!this._first) {
      this._first = element;
      this._last = element;
      this._length++;
      return;
    }
    this._last!.next = element;
    this._last = element;
    this._length++;
  }
}
