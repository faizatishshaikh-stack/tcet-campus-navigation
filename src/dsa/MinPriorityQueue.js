/**
 * Binary Min-Heap Priority Queue for Dijkstra's Shortest Path Algorithm
 * 
 * Elements are objects containing:
 * { id: string, priority: number, metadata: any }
 * 
 * Implements 0-indexed binary heap with bubble-up and bubble-down in O(log V) time.
 */

export class MinPriorityQueue {
  constructor() {
    this.heap = [];
    this.operationLog = [];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  push(element) {
    this.heap.push(element);
    this._bubbleUp(this.heap.length - 1);
    this.operationLog.push({
      action: 'PUSH',
      node: element.id,
      priority: element.priority,
      heapSize: this.heap.length
    });
  }

  pop() {
    if (this.isEmpty()) return null;

    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }

    this.operationLog.push({
      action: 'POP_MIN',
      node: min.id,
      priority: min.priority,
      heapSize: this.heap.length
    });

    return min;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.heap[index].priority < this.heap[parentIdx].priority) {
        // Swap
        const temp = this.heap[index];
        this.heap[index] = this.heap[parentIdx];
        this.heap[parentIdx] = temp;
        index = parentIdx;
      } else {
        break;
      }
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < length && this.heap[leftChild].priority < this.heap[smallest].priority) {
        smallest = leftChild;
      }

      if (rightChild < length && this.heap[rightChild].priority < this.heap[smallest].priority) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        const temp = this.heap[index];
        this.heap[index] = this.heap[smallest];
        this.heap[smallest] = temp;
        index = smallest;
      } else {
        break;
      }
    }
  }

  getSnapshot() {
    return this.heap.map(item => ({ id: item.id, priority: item.priority }));
  }

  getLog() {
    return [...this.operationLog];
  }
}
